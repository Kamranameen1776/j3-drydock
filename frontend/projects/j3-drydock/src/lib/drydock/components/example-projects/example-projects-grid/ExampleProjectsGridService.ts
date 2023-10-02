import { Injectable } from '@angular/core';
import { Column, GridButton, eColor } from 'jibe-components';
import { GridInputsWithRequest } from '../../../presentation-layer/jb-components-helpers/grid-inputs';
import { nameOf } from '../../../common/ts-helpers/nameOf';
import { GetExampleProjectsResultDto } from '../../../infrastructure-layer/api-services/example-projects/dtos/GetExampleProjectsResultDto';
import { ExampleProjectsService } from '../../../infrastructure-layer/api-services/example-projects/ExampleProjectsService';

@Injectable()
export class ExampleProjectsGridService {
  public readonly gridName: string = 'exampleProjectsGrid';

  private readonly columns: Column[] = [
    {
      DisableSort: true,
      DisplayText: 'Id',
      FieldName: nameOf<GetExampleProjectsResultDto>((prop) => prop.ExampleProjectId),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '100px'
    },
    {
      DisableSort: true,
      DisplayText: 'Name',
      FieldName: nameOf<GetExampleProjectsResultDto>((prop) => prop.ProjectName),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '100px'
    },
    {
      DisableSort: true,
      DisplayText: 'Date of creation',
      FieldName: nameOf<GetExampleProjectsResultDto>((prop) => prop.DateOfCreation),
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
