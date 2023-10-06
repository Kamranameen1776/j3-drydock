import { StandardJobResult } from './../../models/interfaces/standard-jobs';
import { Component, OnInit } from '@angular/core';
import { eGridRefreshType, GridAction, GridService } from 'jibe-components';
import { GridInputsWithRequest } from '../../models/interfaces/grid-inputs';
import { StandardJobsGridService } from './StandardJobsGridService';

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

  ngOnInit(): void {
    this.gridInputs = this.standardJobsGridService.getGridInputs();
  }

  public onGridAction({ type }: GridAction<string, string>): void {
    if (type === this.gridInputs.gridButton.label) {
      this.isUpsertPopupVisible = true;
    }
  }

  public onCloseUpsertPopup(hasSaved: boolean) {
    this.isUpsertPopupVisible = false;
    this.currentRow = undefined;

    if (hasSaved) {
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridInputs.gridName);
    }
  }
}
