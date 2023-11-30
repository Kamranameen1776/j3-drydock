import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { eGridRowActions, FormModel, GridAction, GridComponent, IJbDialog } from 'jibe-components';
import { IStatementOfFactDto } from './dtos/IStatementOfFactDto';
import { StatementOfFactsGridService } from './StatementOfFactsGridService';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeComponent } from 'projects/j3-drydock/src/lib/shared/classes/unsubscribe.base';
import { GridInputsWithRequest } from 'projects/j3-drydock/src/lib/models/interfaces/grid-inputs';
import { getSmallPopup } from 'projects/j3-drydock/src/lib/models/constants/popup';
import { StatementOfFactsService } from 'projects/j3-drydock/src/lib/services/project-monitoring/statement-of-facts/StatementOfFactsService';
import { StatementOfFactsGridOdataKeys } from 'projects/j3-drydock/src/lib/models/enums/StatementOfFactsGridOdataKeys';
import { IDeleteStatementOfFactDto } from 'projects/j3-drydock/src/lib/services/project-monitoring/statement-of-facts/IDeleteStatementOfFactDto';

@Component({
  selector: 'jb-statement-of-facts',
  templateUrl: './statement-of-facts.component.html',
  styleUrls: ['./statement-of-facts.component.scss'],
  providers: [StatementOfFactsGridService]
})
export class StatementOfFactsComponent extends UnsubscribeComponent implements OnInit {
  @Input() projectId: string;

  @ViewChild('statementOfFactsGrid')
  statementOfFactsGrid: GridComponent;

  public gridInputs: GridInputsWithRequest;

  public deleteBtnLabel = 'Delete';

  public deleteDialogVisible = false;

  deleteStatementOfFactDialog: IJbDialog = { ...getSmallPopup(), dialogHeader: 'Delete Statement of Fact' };

  deleteStatementOfFactForm: FormModel;

  deleteStatementOfFactFormGroup: FormGroup;

  deleteStatementOfFactButtonDisabled = false;

  constructor(
    private statementOfFactsGridService: StatementOfFactsGridService,
    private statementOfFactsService: StatementOfFactsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setGridInputs();

    this.deleteStatementOfFactForm = this.statementOfFactsGridService.getDeleteStatementOfFactForm();
  }

  public onGridAction({ type }: GridAction<string, string>, statementOfFact: IStatementOfFactDto): void {
    if (type === eGridRowActions.Delete) {
      this.showDeleteDialog();
      this.deleteStatementOfFactFormGroup.value.StatementOfFact = statementOfFact;
    } else if (type === eGridRowActions.Edit) {
      if (!statementOfFact) {
        throw new Error('StatementOfFact is null');
      }
    } else if (type === this.gridInputs.gridButton.label) {
      this.showCreateNewDialog();
    }
  }

  public showCreateNewDialog() {
    // TODO: implement
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

    this.deleteStatementOfFactFormGroup.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.deleteStatementOfFactButtonDisabled = this.deleteStatementOfFactFormGroup.valid;
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
        this.statementOfFactsGrid.fetchMatrixData();
      });
  }

  private setGridInputs() {
    this.gridInputs = this.statementOfFactsGridService.getGridInputs();
    this.setGridActions();
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
}
