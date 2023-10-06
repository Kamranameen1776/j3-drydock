import { Component, OnInit } from '@angular/core';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { ExampleProjectsGridService } from './ExampleProjectsGridService';
import { GridAction } from 'jibe-components';
import { CreateExampleCloseResultDto } from './create-example-project-popup/dtos/CreateExampleCloseResultDto';

@Component({
  selector: 'jb-example-projects-grid',
  templateUrl: './example-projects-grid.component.html',
  styleUrls: ['./example-projects-grid.component.scss'],
  providers: [ExampleProjectsGridService]
})
export class ExampleProjectsGridComponent implements OnInit {
  public gridInputs: GridInputsWithRequest;

  //#region ViewModel

  public isCreateExampleProjectPopupVisible = false;

  //#endregion ViewModel

  constructor(private exampleProjectsGridService: ExampleProjectsGridService) {}

  ngOnInit(): void {
    this.gridInputs = this.exampleProjectsGridService.getGridInputs();
  }

  //#region Commands

  public onGridAction({ type }: GridAction<string, string>): void {
    if (type === this.gridInputs.gridButton.label) {
      this.isCreateExampleProjectPopupVisible = true;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCloseCreateExampleProject(dto: CreateExampleCloseResultDto): void {
    this.isCreateExampleProjectPopupVisible = false;
    // todo: refresh grid
  }

  //#endregion Commands
}
