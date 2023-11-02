import { Injectable } from '@angular/core';
import { Column, GridButton, eColor } from 'jibe-components';
import { nameOf } from '../../../utils/nameOf';
import { ExampleProjectsService } from '../../../services/ExampleProjectsService';
import { ExampleProjectResult } from '../../../models/interfaces/example-projects';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';

@Injectable()
export class ExampleProjectsGridService {
  public readonly gridName: string = 'exampleProjectsGrid';

  private readonly columns: Column[] = [
    {
      DisableSort: true,
      DisplayText: 'Id',
      FieldName: nameOf<ExampleProjectResult>((prop) => prop.ExampleProjectId),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '100px'
    },
    {
      DisableSort: true,
      DisplayText: 'Name',
      FieldName: nameOf<ExampleProjectResult>((prop) => prop.ProjectName),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '100px'
    },
    {
      DisableSort: true,
      DisplayText: 'Date of creation',
      FieldName: nameOf<ExampleProjectResult>((prop) => prop.DateOfCreation),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '100px'
    }
  ];

  private readonly gridButton: GridButton = {
    label: 'Create new example project',
    color: { background: eColor.JbBlue, text: eColor.JbWhite },
    show: true
  };

  constructor(private exampleProjectsService: ExampleProjectsService) {}

  public getGridInputs(): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      request: this.exampleProjectsService.getExampleProjectsRequest(),
      gridButton: this.gridButton
    };
  }
}
