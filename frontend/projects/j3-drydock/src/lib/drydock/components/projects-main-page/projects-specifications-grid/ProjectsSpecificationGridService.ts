import { Injectable } from '@angular/core';
import { Column, Filter, FilterListSet, GridButton, eColor, eFieldControlType, eGridCellType } from 'jibe-components';
import { nameOf } from '../../../common/ts-helpers/nameOf';
import { GridInputsWithRequest } from '../../../presentation-layer/jb-components-helpers/grid-inputs';
import { ProjectsForMainPageGridDto } from './bll/dtos/ProjectsForMainPageGridDto';
import { ProjectsService } from '../../../infrastructure-layer/api-services/projects/ProjectsService';
import { of } from 'rxjs';

@Injectable()
export class ProjectsSpecificationGridService {
  // TODO: get from the backend service
  public readonly minDate: Date = new Date('2010-01-01');
  public readonly maxDate: Date = new Date('2100-01-01');

  public readonly gridName: string = 'projectsSpecificationGrid';

  initDate: Date = new Date();

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

  public filters: Filter[] = [
    {
      Active_Status: true,
      Active_Status_Config_Filter: true,
      ControlType: eFieldControlType.MultiSelect,
      Created_By: null,
      DataType: null,
      DisplayText: 'Project Type',
      FieldName: 'ProjectTypes',
      FieldID: 0,
      default: true,
      selectedValues: null,
      CoupleID: 0,
      CoupleLabel: 'Project',
      gridName: this.gridName,
      list: of(this.LoadProjectTypes())
    },
    {
      Active_Status: true,
      Active_Status_Config_Filter: true,
      ControlType: eFieldControlType.MultiSelect,
      Created_By: null,
      DataType: null,
      DisplayText: 'Project Manager',
      FieldName: 'ProjectsManages',
      FieldID: 0,
      default: true,
      selectedValues: null,
      CoupleID: 0,
      CoupleLabel: 'Project',
      gridName: this.gridName,
      list: of(this.LoadProjectsManagers())
    },
    {
      Active_Status: true,
      Active_Status_Config_Filter: true,
      ControlType: eFieldControlType.Date,
      Created_By: null,
      DataType: null,
      DisplayText: 'Start Date',
      FieldName: 'StartDate',
      FieldID: 1,
      default: true,
      selectedValues: new Date(this.initDate.getFullYear(), this.initDate.getMonth(), 1),
      minDate: this.minDate,
      maxDate: this.maxDate,
      CoupleID: 1,
      CoupleLabel: 'Project Date',
      gridName: this.gridName
    },
    {
      Active_Status: true,
      Active_Status_Config_Filter: true,
      ControlType: eFieldControlType.Date,
      Created_By: null,
      DataType: null,
      DisplayText: 'End Date',
      FieldName: 'EndDate',
      FieldID: 2,
      default: true,
      selectedValues: new Date(this.initDate.getFullYear(), this.initDate.getMonth() + 1, 0),
      minDate: this.minDate,
      maxDate: this.maxDate,
      CoupleID: 1,
      CoupleLabel: 'Project Date',
      gridName: this.gridName
    }
  ];

  private filterListsSet: FilterListSet = {
    ProjectTypes: {
      type: eFieldControlType.MultiSelect,
      odataKey: 'ProjectTypes'
    },
    ProjectsManages: {
      type: eFieldControlType.MultiSelect,
      odataKey: 'ProjectsManages'
    },
    StartDate: {
      type: eFieldControlType.Date,
      odataKey: 'StartDate',
      dateMethod: 'ge'
    },
    EndDate: {
      type: eFieldControlType.Date,
      odataKey: 'EndDate',
      dateMethod: 'le'
    }
  };

  constructor(private projectsService: ProjectsService) {}

  public getGridInputs(): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      filters: this.filters,
      filtersLists: this.filterListsSet,
      request: this.projectsService.getProjectsForMainPageGridRequest(),
      gridButton: this.gridButton
    };
  }

  private LoadProjectTypes(): string[] {
    return ['Dry Dock', 'b'];
  }

  private LoadProjectsManagers(): string[] {
    return ['a', 'b'];
  }
}
