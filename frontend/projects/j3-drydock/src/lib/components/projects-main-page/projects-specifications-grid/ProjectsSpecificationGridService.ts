import { Injectable } from '@angular/core';
import { Column, Filter, FilterListSet, GridButton, eColor, eCrud, eFieldControlType, eGridCellType } from 'jibe-components';
import { ProjectsForMainPageGridDto } from './bll/dtos/ProjectsForMainPageGridDto';
import { nameOf } from '../../../utils/nameOf';
import { ProjectsService } from '../../../services/ProjectsService';
import { GridInputsWithRequest } from '../../../shared/jb-components-helpers/grid-inputs';

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
      Active_Status_Config_Filter: true,
      type: eGridCellType.Multiselect,
      DisplayText: 'Project Type',
      Active_Status: true,
      FieldName: 'ProjectTypes',
      DisplayCode: 'ProjectTypeName',
      ValueCode: 'ProjectTypeCode',
      FieldID: 0,
      default: true,
      CoupleID: 0,
      CoupleLabel: 'Project',
      gridName: this.gridName
    },
    {
      Active_Status: true,
      Active_Status_Config_Filter: true,
      ControlType: eFieldControlType.MultiSelect,
      DisplayText: 'Project Manager',
      FieldName: 'ProjectsManages',
      DisplayCode: 'FullName',
      ValueCode: 'ManagerId',
      FieldID: 0,
      default: true,
      CoupleID: 0,
      CoupleLabel: 'Project',
      gridName: this.gridName
    },
    {
      Active_Status: true,
      Active_Status_Config_Filter: true,
      ControlType: eFieldControlType.MultiSelect,
      DisplayText: 'Status',
      FieldName: 'ProjectSpecificationStatuses',
      DisplayCode: 'SpecificationStatusName',
      ValueCode: 'SpecificationStatusCode',
      FieldID: 0,
      default: true,
      CoupleID: 0,
      CoupleLabel: 'Project',
      gridName: this.gridName
    },
    {
      Active_Status: true,
      Active_Status_Config_Filter: true,
      ControlType: eFieldControlType.MultiSelect,
      DisplayText: 'Ship Yard',
      FieldName: 'ShipsYards',
      DisplayCode: 'ShipYardName',
      ValueCode: 'ShipYardId',
      FieldID: 0,
      default: true,
      CoupleID: 0,
      CoupleLabel: 'Project',
      gridName: this.gridName
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
      webApiRequest: this.projectsService.getProjectTypesRequest(),
      type: eFieldControlType.MultiSelect,
      odataKey: 'ProjectTypeCode'
    },
    ProjectsManages: {
      webApiRequest: this.projectsService.getProjectsManagersRequest(),
      type: eFieldControlType.MultiSelect,
      odataKey: 'ManagerId'
    },
    ShipsYards: {
      webApiRequest: this.projectsService.getProjectsShipsYardsRequest(),
      type: eFieldControlType.MultiSelect,
      odataKey: 'ShipYardId'
    },
    ProjectSpecificationStatuses: {
      webApiRequest: this.projectsService.getProjectsSpecificationsStatusesRequest(),
      type: eFieldControlType.MultiSelect,
      odataKey: 'SpecificationStatusCode'
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

  private LoadProjectsManagers(): string[] {
    return ['a', 'b'];
  }
}
