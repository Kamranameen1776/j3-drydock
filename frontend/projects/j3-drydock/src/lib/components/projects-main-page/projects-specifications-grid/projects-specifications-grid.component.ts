import { Component, OnInit } from '@angular/core';
import { ProjectsSpecificationGridService } from './ProjectsSpecificationGridService';
import { GridAction } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';

@Component({
  selector: 'jb-projects-specifications-grid',
  templateUrl: './projects-specifications-grid.component.html',
  styleUrls: ['./projects-specifications-grid.component.scss'],
  providers: [ProjectsSpecificationGridService]
})
export class ProjectsSpecificationsGridComponent implements OnInit {
  public gridInputs: GridInputsWithRequest;

  //#region ViewModel

  public isCreateExampleProjectPopupVisible = false;

  //#endregion ViewModel

  constructor(private exampleProjectsGridService: ProjectsSpecificationGridService) {}

  ngOnInit(): void {
    this.gridInputs = this.exampleProjectsGridService.getGridInputs();
  }

  //#region Commands

  public onGridAction({ type }: GridAction<string, string>): void {
    if (type === this.gridInputs.gridButton.label) {
    }
  }

  //#endregion Commands
}
