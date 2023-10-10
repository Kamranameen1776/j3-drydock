import { StandardJobResult } from './../../models/interfaces/standard-jobs';
import { Component, OnInit } from '@angular/core';
import { eGridRefreshType, eGridRowActions, GridAction, GridRowActions, GridService } from 'jibe-components';
import { GridInputsWithRequest } from '../../models/interfaces/grid-inputs';
import { StandardJobsGridService } from './StandardJobsGridService';
import { of } from 'rxjs';

@Component({
  selector: 'jb-standard-jobs-main',
  templateUrl: './standard-jobs-main.component.html',
  styleUrls: ['./standard-jobs-main.component.scss'],
  providers: [StandardJobsGridService]
})
export class StandardJobsMainComponent implements OnInit {
  public gridInputs: GridInputsWithRequest;

  constructor(
    private standardJobsGridService: StandardJobsGridService,
    private gridService: GridService
  ) {}

  public isUpsertPopupVisible = false;

  public currentRow: StandardJobResult;

  public gridRowActions: GridRowActions[] = [];

  ngOnInit(): void {
    this.setAccessRights();
    this.setGridInputs();
    this.setGridRowActions();
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
}
