import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { eGridEvents, eGridRowActions, FormModel, GridAction, GridComponent, GridService, IJbDialog } from 'jibe-components';
import { IStatementOfFactDto } from './dtos/IStatementOfFactDto';
import { StatementOfFactsGridService } from './StatementOfFactsGridService';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { GridInputsWithRequest } from '../../../../models/interfaces/grid-inputs';
import { getSmallPopup } from '../../../../models/constants/popup';
import { StatementOfFactsService } from '../../../../services/project-monitoring/statement-of-facts/StatementOfFactsService';
import { StatementOfFactsGridOdataKeys } from '../../../../models/enums/StatementOfFactsGridOdataKeys';
import { IDeleteStatementOfFactDto } from '../../../../services/project-monitoring/statement-of-facts/IDeleteStatementOfFactDto';
import { ICreateStatementOfFactDto } from '../../../../services/project-monitoring/statement-of-facts/ICreateStatementOfFactDto';
import { IUpdateStatementOfFactDto } from '../../../../services/project-monitoring/statement-of-facts/IUpdateStatementOfFactDto';
import { UTCAsLocal, getDateFromJbString, localAsUTC } from '../../../../utils/date';

@Component({
  selector: 'jb-statement-of-facts',
  templateUrl: './statement-of-facts.component.html',
  styleUrls: ['./statement-of-facts.component.scss'],
  providers: [StatementOfFactsGridService]
})
export class StatementOfFactsComponent extends UnsubscribeComponent implements OnInit {
  @Input() projectId: string;

  @ViewChild('dateAndTimeTemplate', { static: true }) dateAndTimeTemplate: TemplateRef<unknown>;

  @ViewChild('statementOfFactsGrid') statementOfFactsGrid: GridComponent;

  public gridInputs: GridInputsWithRequest;

  public deleteBtnLabel = 'Delete';

  public createBtnLabel = 'Create';

  public updateBtnLabel = 'Update';

  public deleteDialogVisible = false;

  public createDialogVisible = false;

  public updateDialogVisible = false;

  deleteStatementOfFactDialog: IJbDialog = { ...getSmallPopup(), dialogHeader: 'Delete Statement of Fact' };

  createStatementOfFactDialog: IJbDialog = { ...getSmallPopup(), dialogHeader: 'Add Fact' };

  updateStatementOfFactDialog: IJbDialog = { ...getSmallPopup(), dialogHeader: 'Update Fact' };

  deleteStatementOfFactForm: FormModel;

  createStatementOfFactForm: FormModel;

  updateStatementOfFactForm: FormModel;

  deleteStatementOfFactFormGroup: FormGroup;

  createStatementOfFactFormGroup: FormGroup;

  updateStatementOfFactFormGroup: FormGroup;

  deleteStatementOfFactButtonDisabled = false;

  createStatementOfFactButtonDisabled = false;

  updateStatementOfFactButtonDisabled = false;

  readonly dateTimeFormat = this.statementOfFactsGridService.dateTimeFormat;

  constructor(
    private statementOfFactsGridService: StatementOfFactsGridService,
    private statementOfFactsService: StatementOfFactsService,
    private gridService: GridService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setGridInputs();

    this.deleteStatementOfFactForm = this.statementOfFactsGridService.getDeleteStatementOfFactForm();

    this.createStatementOfFactForm = this.statementOfFactsGridService.getCreateStatementOfFactForm();

    this.updateStatementOfFactForm = this.statementOfFactsGridService.getUpdateStatementOfFactForm();
  }

  public onGridAction({ type }: GridAction<string, string>, statementOfFact: IStatementOfFactDto): void {
    if (type === eGridRowActions.Delete) {
      if (!statementOfFact) {
        throw new Error('StatementOfFact is null');
      }

      this.showDeleteDialog();
      this.deleteStatementOfFactFormGroup.value.StatementOfFact = statementOfFact;
    } else if (type === eGridRowActions.Edit) {
      if (!statementOfFact) {
        throw new Error('StatementOfFact is null');
      }

      this.showUpdateDialog();

      const controls = (this.updateStatementOfFactFormGroup.controls.statementOfFactUpdate as FormGroup).controls;

      const dateString = UTCAsLocal(statementOfFact.DateAndTime);

      controls.Fact.setValue(statementOfFact.Fact);
      controls.DateTime.setValue(dateString);
      controls.StatementOfFactUid.setValue(statementOfFact.StatementOfFactsUid);
    } else if (type === this.gridInputs.gridButton.label) {
      this.showCreateDialog();
    }
  }

  public showCreateDialog(value = true) {
    this.createStatementOfFactFormGroup.reset();
    this.createDialogVisible = value;
  }

  public showUpdateDialog(value = true) {
    this.updateStatementOfFactFormGroup.reset();
    this.updateDialogVisible = value;
  }

  public showDeleteDialog(value = true) {
    this.deleteStatementOfFactFormGroup.reset();
    this.deleteDialogVisible = value;
  }

  public onMatrixRequestChanged() {
    this.statementOfFactsGrid.odata.filter.eq(StatementOfFactsGridOdataKeys.ProjectUid, this.projectId);
  }

  public initDeleteStatementOfFactFormGroup(action: FormGroup): void {
    this.deleteStatementOfFactFormGroup = action;
  }

  public initCreateStatementOfFactFormGroup(action: FormGroup): void {
    this.createStatementOfFactFormGroup = action;

    this.createStatementOfFactFormGroup.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.createStatementOfFactButtonDisabled = !this.createStatementOfFactFormGroup.valid;
    });
  }

  public initUpdateStatementOfFactFormGroup(action: FormGroup): void {
    this.updateStatementOfFactFormGroup = action;

    this.updateStatementOfFactFormGroup.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.updateStatementOfFactButtonDisabled = !this.updateStatementOfFactFormGroup.valid;
    });
  }

  public deleteStatementOfFact() {
    this.deleteStatementOfFactButtonDisabled = true;

    const data: IDeleteStatementOfFactDto = {
      StatementOfFactUid: this.deleteStatementOfFactFormGroup.value.StatementOfFact.StatementOfFactsUid
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

  public createStatementOfFact() {
    this.createStatementOfFactButtonDisabled = true;

    const dateTimeString = this.createStatementOfFactFormGroup.value.statementOfFactCreate.DateTime;

    const dateTime = localAsUTC(getDateFromJbString(dateTimeString, this.dateTimeFormat));

    const data: ICreateStatementOfFactDto = {
      ProjectUid: this.projectId,
      Fact: this.createStatementOfFactFormGroup.value.statementOfFactCreate.Fact,
      DateTime: dateTime
    };

    this.statementOfFactsService
      .createStatementOfFact(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.createStatementOfFactButtonDisabled = false;
        this.showCreateDialog(false);
        this.gridService.refreshGrid(eGridEvents.Table, this.statementOfFactsGridService.gridName);
      });
  }

  public updateStatementOfFact() {
    this.updateStatementOfFactButtonDisabled = true;

    const dateTimeString = this.updateStatementOfFactFormGroup.value.statementOfFactUpdate.DateTime;

    const dateTime = localAsUTC(getDateFromJbString(dateTimeString, this.dateTimeFormat));

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
      label: 'Edit'
    });

    this.gridInputs.actions.push({
      name: eGridRowActions.Delete,
      label: 'Delete'
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
