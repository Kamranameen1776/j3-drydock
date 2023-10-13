import { StandardJobResult } from './../../models/interfaces/standard-jobs';
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
import { of } from 'rxjs';
import { FunctionsTreeNode } from '../../models/interfaces/functions-tree-node';
import { StandardJobUpsertFormService } from './StandardJobUpsertFormService';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jb-standard-jobs-main',
  templateUrl: './standard-jobs-main.component.html',
  styleUrls: ['./standard-jobs-main.component.scss'],
  providers: [StandardJobsGridService]
})
export class StandardJobsMainComponent extends UnsubscribeComponent implements OnInit {
  public gridInputs: GridInputsWithRequest;

  constructor(
    private standardJobsGridService: StandardJobsGridService,
    private upsertFormService: StandardJobUpsertFormService,
    private gridService: GridService,
    private cds: CentralizedDataService,
    private techApiSvc: JmsTechApiService
  ) {
    super();
  }

  public isUpsertPopupVisible = false;

  public currentRow: StandardJobResult;

  public gridRowActions: GridRowActions[] = [];

  ngOnInit(): void {
    this.setAccessRights();
    this.setGridInputs();
    this.setGridRowActions();
    this.loadFunctionsTree();
  }

  public onGridAction({ type, payload }: GridAction<string, unknown>): void {
    switch (type) {
      case this.gridInputs.gridButton.label:
        this.isUpsertPopupVisible = true;
        break;
      case eGridRowActions.Edit:
        this.isUpsertPopupVisible = true;
        this.currentRow = <StandardJobResult>payload;
        break;
      case eGridRowActions.Delete:
        this.delete(<StandardJobResult>payload);
        break;
      default:
        break;
    }
  }

  public onCloseUpsertPopup(hasSaved: boolean) {
    this.isUpsertPopupVisible = false;
    this.currentRow = undefined;

    if (hasSaved) {
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridInputs.gridName);
    }
  }

  private setGridRowActions(): void {
    this.gridRowActions.length = 0;

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

  private delete(record: StandardJobResult) {
    // TODO, check status if inActive - return
    of(record).subscribe(() => {
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridInputs.gridName);
    });
  }

  private loadFunctionsTree() {
    // TODO fixme to generic request with no vessel_uid
    const vesselUid = this.cds.userDetails?.vessel_uid ?? '3EEF2E1B-2533-45C7-82C7-C13D6AA79559';
    if (vesselUid) {
      this.techApiSvc
        .getComponentFunctionTreeData(vesselUid)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res) => {
          this.setFunctionsTree(<FunctionsTreeNode[]>res.records);
        });
    }
  }

  private setFunctionsTree(records: FunctionsTreeNode[]) {
    this.upsertFormService.functionsTree$.next(
      records.map((rec) => {
        return { ...rec, selectable: rec.isParentComponent === 3 };
      })
    );
  }
}
