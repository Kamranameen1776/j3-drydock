import { Component, OnInit } from '@angular/core';
import { GridAction } from 'jibe-components';
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

  constructor(private standardJobsGridService: StandardJobsGridService) {}

  public isCreatePopupVisible = false;

  ngOnInit(): void {
    this.gridInputs = this.standardJobsGridService.getGridInputs();
  }

  public onGridAction({ type }: GridAction<string, string>): void {
    if (type === this.gridInputs.gridButton.label) {
      this.isCreatePopupVisible = true;
    }
  }
}
