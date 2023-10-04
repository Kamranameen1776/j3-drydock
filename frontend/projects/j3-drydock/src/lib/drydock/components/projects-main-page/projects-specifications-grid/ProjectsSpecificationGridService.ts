import { Injectable } from '@angular/core';
import { Column, GridButton, eColor } from 'jibe-components';
import { nameOf } from '../../../common/ts-helpers/nameOf';
import { GridInputsWithRequest } from '../../../presentation-layer/jb-components-helpers/grid-inputs';
import { ProjectsForMainPageGridDto } from './bll/dtos/ProjectsForMainPageGridDto';
import { ProjectsService } from '../../../infrastructure-layer/api-services/projects/ProjectsService';

@Injectable()
export class ProjectsSpecificationGridService {
  public readonly gridName: string = 'projectsSpecificationGrid';

  private readonly columns: Column[] = [
    {
      DisableSort: true,
      DisplayText: 'ProjectId',
      FieldName: nameOf<ProjectsForMainPageGridDto>((prop) => prop.ProjectId),
      IsActive: true,
      IsMandatory: true,
      IsVisible: false,
      ReadOnly: true
    },
    {
      DisableSort: true,
      DisplayText: 'Code',
      FieldName: nameOf<ProjectsForMainPageGridDto>((prop) => prop.Code),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '100px'
    },
    {
      DisableSort: true,
      DisplayText: 'Vessel',
      FieldName: nameOf<ProjectsForMainPageGridDto>((prop) => prop.Vessel),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '100px'
    },
    {
      DisableSort: true,
      DisplayText: 'Subject',
      FieldName: nameOf<ProjectsForMainPageGridDto>((prop) => prop.Subject),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '100px'
    },
    {
      DisableSort: true,
      DisplayText: 'Project Type',
      FieldName: nameOf<ProjectsForMainPageGridDto>((prop) => prop.ProjectType),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '100px'
    },
    {
      DisableSort: true,
      DisplayText: 'Project manager',
      FieldName: nameOf<ProjectsForMainPageGridDto>((prop) => prop.ProjectManager),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '100px'
    },
    {
      DisableSort: true,
      DisplayText: 'Specification',
      FieldName: nameOf<ProjectsForMainPageGridDto>((prop) => prop.Specification),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '100px'
    },
    {
      DisableSort: true,
      DisplayText: 'Ship Yard',
      FieldName: nameOf<ProjectsForMainPageGridDto>((prop) => prop.ShipYard),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '100px'
    },

    {
      DisableSort: true,
      DisplayText: 'State',
      FieldName: nameOf<ProjectsForMainPageGridDto>((prop) => prop.State),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '100px'
    },

    {
      DisableSort: true,
      DisplayText: 'Start date',
      FieldName: nameOf<ProjectsForMainPageGridDto>((prop) => prop.StartDate),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '100px'
    },
    {
      DisableSort: true,
      DisplayText: 'End date',
      FieldName: nameOf<ProjectsForMainPageGridDto>((prop) => prop.EndDate),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '100px'
    }
  ];

  private readonly gridButton: GridButton = {
    label: 'Create new project',
    color: { background: eColor.JbBlue, text: eColor.JbWhite },
    show: true
  };

  constructor(private projectsService: ProjectsService) {}

  public getGridInputs(): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      request: this.projectsService.getProjectsForMainPageGridRequest(),
      gridButton: this.gridButton
    };
  }
}
