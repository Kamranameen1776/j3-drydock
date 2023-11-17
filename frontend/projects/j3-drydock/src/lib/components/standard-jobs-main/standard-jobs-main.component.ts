import { eStandardJobsMainFields } from '../../models/enums/standard-jobs-main.enum';
import { StandardJobResult } from '../../models/interfaces/standard-jobs';
import { Component, OnInit } from '@angular/core';
import { eGridRefreshType, eGridRowActions, GridAction, GridRowActions, GridService } from 'jibe-components';
import { GridInputsWithRequest } from '../../models/interfaces/grid-inputs';
import { StandardJobsGridService } from './standard-jobs-grid.service';
import { FunctionsFlatTreeNode } from '../../models/interfaces/functions-tree-node';
import { StandardJobUpsertFormService } from './upsert-standard-job-form/standard-job-upsert-form.service';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { takeUntil } from 'rxjs/operators';
import { getSmallPopup } from '../../models/constants/popup';
import { StandardJobsService } from '../../services/standard-jobs.service';
import { GrowlMessageService } from '../../services/growl-message.service';
import { Title } from '@angular/platform-browser';
import { eStandardJobsAccessActions } from '../../models/enums/access-actions.enum';

@Component({
  selector: 'jb-standard-jobs-main',
  templateUrl: './standard-jobs-main.component.html',
  styleUrls: ['./standard-jobs-main.component.scss'],
  providers: [StandardJobsGridService, GrowlMessageService]
})
export class StandardJobsMainComponent extends UnsubscribeComponent implements OnInit {
  gridInputs: GridInputsWithRequest;

  isUpsertPopupVisible = false;

  isConfirmDeleteVisible = false;

  currentRow: StandardJobResult;

  gridRowActions: GridRowActions[] = [];

  confirmationPopUp = {
    ...getSmallPopup(),
    dialogHeader: 'Delete Standard Job'
  };

  growlMessage$ = this.growlMessageService.growlMessage$;

  eStandardJobsMainFields = eStandardJobsMainFields;

  eStandardJobsAccessActions = eStandardJobsAccessActions;

  canView = false;

  private canViewDetails = false;

  private canCreateJob = false;

  private canEditJob = false;

  private canDeleteJob = false;

  constructor(
    private standardJobsGridService: StandardJobsGridService,
    private standardJobsService: StandardJobsService,
    private upsertFormService: StandardJobUpsertFormService,
    private gridService: GridService,
    private growlMessageService: GrowlMessageService,
    private title: Title
  ) {
    super();
  }

  ngOnInit(): void {
    this.setAccessRights();
    this.setGridInputs();
    this.setGridRowActions();
    this.setPageTitle();
    this.loadFunctionsTree();
  }

  onGridAction({ type, payload }: GridAction<string, unknown>): void {
    switch (type) {
      case eGridRowActions.Edit:
        this.editRow(<StandardJobResult>payload);
        break;

      case this.gridInputs.gridButton.label:
        this.createNewRow();
        break;

      case eGridRowActions.Delete:
        this.deleteRow(<StandardJobResult>payload);
        break;

      default:
        break;
    }
  }

  onConfirmDeleteOk() {
    this.deleteStandardJob();
  }

  onConfirmDeleteCancel() {
    this.isConfirmDeleteVisible = false;
  }

  onCloseUpsertPopup(hasSaved: boolean) {
    this.isUpsertPopupVisible = false;
    this.currentRow = undefined;

    if (hasSaved) {
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridInputs.gridName);
    }
  }

  private createNewRow() {
    this.isUpsertPopupVisible = true;
  }

  private editRow(row: StandardJobResult) {
    this.currentRow = row;
    this.isUpsertPopupVisible = true;
  }

  private deleteRow(row: StandardJobResult) {
    this.isConfirmDeleteVisible = true;
    this.currentRow = row;
  }

  private setGridRowActions(): void {
    this.gridRowActions.length = 0;
    this.gridRowActions.push({ name: eGridRowActions.DoubleClick });

    if (this.canEditJob) {
      this.gridRowActions.push({
        name: eGridRowActions.Edit
      });
    }

    if (this.canDeleteJob) {
      this.gridRowActions.push({
        name: eGridRowActions.Delete
      });
    }
  }

  private setGridInputs() {
    this.gridInputs = this.standardJobsGridService.getGridInputs();
    this.gridInputs.gridButton.show = this.canCreateJob;
  }

  private setAccessRights() {
    this.canView = this.standardJobsService.hasAccess(eStandardJobsAccessActions.viewGrid);
    this.canViewDetails = this.standardJobsService.hasAccess(eStandardJobsAccessActions.viewDetail);

    this.canCreateJob = this.standardJobsService.hasAccess(eStandardJobsAccessActions.createJob);
    this.canEditJob = this.standardJobsService.hasAccess(eStandardJobsAccessActions.editJob);
    this.canDeleteJob = this.standardJobsService.hasAccess(eStandardJobsAccessActions.deleteJob);
  }

  private loadFunctionsTree() {
    this.standardJobsService
      .getStandardJobFunctions()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((flatTree) => {
        this.setFunctionsFlatTree(flatTree);
      });
  }

  private setFunctionsFlatTree(flatTree: FunctionsFlatTreeNode[]) {
    this.upsertFormService.functionsFlatTree$.next(flatTree);
  }

  private deleteStandardJob() {
    this.standardJobsService.deleteStandardJob(this.currentRow.uid).subscribe(() => {
      this.isConfirmDeleteVisible = false;
      this.currentRow = undefined;
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridInputs.gridName);
    });
  }

  private setPageTitle() {
    this.title.setTitle('Standard Jobs');
  }
}
