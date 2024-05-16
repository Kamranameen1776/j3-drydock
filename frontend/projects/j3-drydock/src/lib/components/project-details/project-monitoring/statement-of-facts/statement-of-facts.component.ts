import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { eGridEvents, eGridRowActions, FormModel, FormValues, GridAction, GridComponent, GridService, IJbDialog } from 'jibe-components';
import { IStatementOfFactDto } from './dtos/IStatementOfFactDto';
import { StatementOfFactsGridService } from './StatementOfFactsGridService';
import { FormGroup } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs/operators';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { GridInputsWithRequest } from '../../../../models/interfaces/grid-inputs';
import { getSmallPopup } from '../../../../models/constants/popup';
import { StatementOfFactsService } from '../../../../services/project-monitoring/statement-of-facts/StatementOfFactsService';
import { StatementOfFactsGridOdataKeys } from '../../../../models/enums/StatementOfFactsGridOdataKeys';
import { IDeleteStatementOfFactDto } from '../../../../services/project-monitoring/statement-of-facts/IDeleteStatementOfFactDto';
import { ICreateStatementOfFactDto } from '../../../../services/project-monitoring/statement-of-facts/ICreateStatementOfFactDto';
import { IUpdateStatementOfFactDto } from '../../../../services/project-monitoring/statement-of-facts/IUpdateStatementOfFactDto';
import { UTCAsLocal, localAsUTCFromJbString } from '../../../../utils/date';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jb-statement-of-facts',
  templateUrl: './statement-of-facts.component.html',
  styleUrls: ['./statement-of-facts.component.scss'],
  providers: [StatementOfFactsGridService]
})
export class StatementOfFactsComponent extends UnsubscribeComponent implements OnInit, OnDestroy {
  @Input() projectId: string;

  @ViewChild('dateAndTimeTemplate', { static: true }) dateAndTimeTemplate: TemplateRef<unknown>;

  @ViewChild('statementOfFactsGrid') statementOfFactsGrid: GridComponent;

  gridInputs: GridInputsWithRequest;

  readonly deleteBtnLabel = 'Delete';

  readonly createBtnLabel = 'Create';

  readonly updateBtnLabel = 'Update';

  readonly dateTimeFormat = this.statementOfFactsGridService.dateTimeFormat;

  deleteDialogVisible = false;

  createDialogVisible = false;

  updateDialogVisible = false;

  deleteStatementOfFactDialog: IJbDialog = { ...getSmallPopup(), dialogHeader: 'Delete Statement of Fact' };

  createStatementOfFactDialog: IJbDialog = { ...getSmallPopup(), dialogHeader: 'Add Fact' };

  updateStatementOfFactDialog: IJbDialog = { ...getSmallPopup(), dialogHeader: 'Update Fact' };

  createStatementOfFactForm: FormModel;

  updateStatementOfFactForm: FormModel;

  updateStatementOfFactFormValues: FormValues;

  createFactFormGroup: FormGroup;

  updateStatementOfFactFormGroup: FormGroup;

  deleteStatementOfFactButtonDisabled = false;

  isCreatingFact = false;

  updateStatementOfFactButtonDisabled = false;

  currentStatementOfFact: IStatementOfFactDto;

  private updateFormChangesSub: Subscription;

  constructor(
    private statementOfFactsGridService: StatementOfFactsGridService,
    private statementOfFactsService: StatementOfFactsService,
    private gridService: GridService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setGridInputs();

    this.createStatementOfFactForm = this.statementOfFactsGridService.getCreateStatementOfFactForm();

    this.updateStatementOfFactForm = this.statementOfFactsGridService.getUpdateStatementOfFactForm();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.updateFormChangesSub?.unsubscribe();
  }

  onGridAction({ type }: GridAction<string, string>, statementOfFact: IStatementOfFactDto): void {
    if (type === eGridRowActions.Delete) {
      if (!statementOfFact) {
        throw new Error('StatementOfFact is null');
      }

      this.showDeleteDialog();
      this.currentStatementOfFact = statementOfFact;
    } else if (type === eGridRowActions.Edit) {
      if (!statementOfFact) {
        throw new Error('StatementOfFact is null');
      }

      this.updateStatementOfFactFormValues = {
        keyID: this.statementOfFactsGridService.updateStatementOfFactFormId,
        values: {
          [this.statementOfFactsGridService.updateStatementOfFactFormId]: {
            Fact: statementOfFact.Fact,
            DateTime: UTCAsLocal(statementOfFact.DateAndTime),
            StatementOfFactUid: statementOfFact.StatementOfFactsUid
          }
        }
      };

      this.showUpdateDialog();
    }
  }
  // public shows that it is used from parent of this component
  public showCreateDialog(value = true) {
    this.createDialogVisible = value;
  }

  showUpdateDialog(value = true) {
    this.updateDialogVisible = value;
  }

  showDeleteDialog(value = true) {
    this.deleteDialogVisible = value;
    if (value === false) {
      this.currentStatementOfFact = null;
    }
  }

  onMatrixRequestChanged() {
    this.statementOfFactsGrid.odata.filter.eq(StatementOfFactsGridOdataKeys.ProjectUid, this.projectId);
  }

  initCreateFactFormGroup(action: FormGroup): void {
    this.createFactFormGroup = action;
  }

  initUpdateStatementOfFactFormGroup(action: FormGroup): void {
    this.updateStatementOfFactFormGroup = action;

    this.updateFormChangesSub?.unsubscribe();

    this.updateFormChangesSub = this.updateStatementOfFactFormGroup.valueChanges.subscribe(() => {
      this.updateStatementOfFactButtonDisabled = !this.updateStatementOfFactFormGroup.valid;
    });
  }

  deleteStatementOfFact() {
    this.deleteStatementOfFactButtonDisabled = true;

    const data: IDeleteStatementOfFactDto = {
      StatementOfFactUid: this.currentStatementOfFact?.StatementOfFactsUid
    };

    this.statementOfFactsService
      .deleteStatementOfFact(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.deleteStatementOfFactButtonDisabled = false;
        this.showDeleteDialog(false);
        this.gridService.refreshGrid(eGridEvents.Table, this.statementOfFactsGridService.gridName);
      });
  }

  createStatementOfFact() {
    this.isCreatingFact = true;

    const dateTimeString = this.createFactFormGroup.value.statementOfFactCreate.DateTime;

    const dateTime = localAsUTCFromJbString(dateTimeString, this.dateTimeFormat);

    const data: ICreateStatementOfFactDto = {
      ProjectUid: this.projectId,
      Fact: this.createFactFormGroup.value.statementOfFactCreate.Fact,
      DateTime: dateTime
    };

    this.statementOfFactsService
      .createStatementOfFact(data)
      .pipe(
        finalize(() => {
          this.isCreatingFact = false;
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.showCreateDialog(false);
        this.gridService.refreshGrid(eGridEvents.Table, this.statementOfFactsGridService.gridName);
      });
  }

  updateStatementOfFact() {
    this.updateStatementOfFactButtonDisabled = true;

    const dateTimeString = this.updateStatementOfFactFormGroup.value.statementOfFactUpdate.DateTime;

    const dateTime = localAsUTCFromJbString(dateTimeString, this.dateTimeFormat);

    const data: IUpdateStatementOfFactDto = {
      StatementOfFactUid: this.updateStatementOfFactFormGroup.value.statementOfFactUpdate.StatementOfFactUid,
      Fact: this.updateStatementOfFactFormGroup.value.statementOfFactUpdate.Fact,
      DateTime: dateTime
    };

    this.statementOfFactsService
      .updateStatementOfFact(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.updateStatementOfFactButtonDisabled = false;
        this.showUpdateDialog(false);
        this.gridService.refreshGrid(eGridEvents.Table, this.statementOfFactsGridService.gridName);
      });
  }

  private setGridInputs() {
    this.gridInputs = this.statementOfFactsGridService.getGridInputs();
    this.setGridActions();
    this.setCellTemplate(this.dateAndTimeTemplate, 'DateAndTime');
  }

  private setGridActions() {
    this.gridInputs.actions.length = 0;

    this.gridInputs.actions.push({
      name: eGridRowActions.Edit,
      label: 'Edit',
      icon: 'icons8-edit'
    });

    this.gridInputs.actions.push({
      name: eGridRowActions.Delete,
      label: 'Delete',
      icon: 'icons8-delete'
    });
  }

  private setCellTemplate(template: TemplateRef<unknown>, fieldName: string) {
    const col = this.gridInputs.columns.find((col) => col.FieldName === fieldName);
    if (!col) {
      return;
    }
    col.cellTemplate = template;
  }
}
