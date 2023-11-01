/* eslint-disable no-console */
import { eStandardJobsMainFields } from '../../models/enums/standard-jobs-main.enum';
import { StandardJobResult } from '../../models/interfaces/standard-jobs';
import { Component, OnInit } from '@angular/core';
import {
  CentralizedDataService,
  eGridRefreshType,
  eGridRowActions,
  GridAction,
  GridRowActions,
  GridService,
  JmsTechApiService
} from 'jibe-components';
import { GridInputsWithRequest } from '../../models/interfaces/grid-inputs';
import { StandardJobsGridService } from './StandardJobsGridService';
import { FunctionsFlatTreeNode } from '../../models/interfaces/functions-tree-node';
import { StandardJobUpsertFormService } from './upsert-standard-job-form/StandardJobUpsertFormService';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { takeUntil } from 'rxjs/operators';
import { getSmallPopup } from '../../models/constants/popup';
import { StandardJobsService } from '../../services/StandardJobsService';
import { GrowlMessageService } from '../../services/GrowlMessageService';
import { FunctionsTreeService } from '../../services/FunctionsTreeService';

@Component({
  selector: 'jb-standard-jobs-main',
  templateUrl: './standard-jobs-main.component.html',
  styleUrls: ['./standard-jobs-main.component.scss'],
  providers: [StandardJobsGridService, GrowlMessageService]
})
export class StandardJobsMainComponent extends UnsubscribeComponent implements OnInit {
  public gridInputs: GridInputsWithRequest;

  public isUpsertPopupVisible = false;

  public isConfirmDeleteVisible = false;

  public currentRow: StandardJobResult;

  public gridRowActions: GridRowActions[] = [];

  public confirmationPopUp = {
    ...getSmallPopup(),
    dialogHeader: 'Delete Standard Job'
  };

  public growlMessage$ = this.growlMessageService.growlMessage$;

  public eStandardJobsMainFields = eStandardJobsMainFields;

  constructor(
    private standardJobsGridService: StandardJobsGridService,
    private standardJobsService: StandardJobsService,
    private upsertFormService: StandardJobUpsertFormService,
    private gridService: GridService,
    private cds: CentralizedDataService,
    private techApiSvc: JmsTechApiService,
    private growlMessageService: GrowlMessageService,
    private treeService: FunctionsTreeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setAccessRights();
    this.setGridInputs();
    this.setGridRowActions();
    this.loadFunctionsTree();
  }

  public onGridAction({ type, payload }: GridAction<string, unknown>): void {
    switch (type) {
      case eGridRowActions.DoubleClick:
      case eGridRowActions.Edit:
        this.editRow(<StandardJobResult>payload);
        break;

      case this.gridInputs.gridButton.label:
        this.isUpsertPopupVisible = true;
        break;

      case eGridRowActions.Delete:
        this.deleteRow(<StandardJobResult>payload);
        break;

      default:
        break;
    }
  }

  public onConfirmDeleteOk() {
    this.deleteStandardJob();
  }

  public onConfirmDeleteCancel() {
    this.isConfirmDeleteVisible = false;
  }

  public onCloseUpsertPopup(hasSaved: boolean) {
    this.isUpsertPopupVisible = false;
    this.currentRow = undefined;

    if (hasSaved) {
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridInputs.gridName);
    }
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

    // TODO Access rigths
    this.gridRowActions.push({
      name: eGridRowActions.Edit
    });

    // TODO Access rigths
    this.gridRowActions.push({
      name: eGridRowActions.Delete
    });
  }

  private setGridInputs() {
    this.gridInputs = this.standardJobsGridService.getGridInputs();
  }

  private setAccessRights() {
    //TODO
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
}
