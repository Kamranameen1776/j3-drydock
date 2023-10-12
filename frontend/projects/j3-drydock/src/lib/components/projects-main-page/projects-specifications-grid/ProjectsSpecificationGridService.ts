import { Injectable } from '@angular/core';
import { Column, Filter, FilterListSet, GridButton, UserService, eColor, eGridColumnsWidth } from 'jibe-components';
import { IProjectsForMainPageGridDto } from './bll/dtos/IProjectsForMainPageGridDto';
import { nameOf } from '../../../utils/nameOf';
import { ProjectsService } from '../../../services/ProjectsService';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';

@Injectable()
export class ProjectsSpecificationGridService {
  // TODO: get from the backend service
  public readonly minDate: Date = new Date('2010-01-01');
  public readonly maxDate: Date = new Date('2100-01-01');

  public readonly gridName: string = 'projectsSpecificationGrid';

  public readonly dateFormat = this.userService.getUserDetails().Date_Format;

  initDate: Date = new Date();

  private readonly columns: Column[] = [
    {
      DisableSort: true,
      DisplayText: 'ProjectId',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectId),
      IsActive: true,
      IsMandatory: true,
      IsVisible: false,
      ReadOnly: true
    },
    {
      DisableSort: false,
      DisplayText: 'Code',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectCode),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisableSort: true,
      DisplayText: 'Vessel',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.Vessel),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisableSort: false,
      DisplayText: 'Subject',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.Subject),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.LongDescription
    },
    {
      DisableSort: true,
      DisplayText: 'Project Type',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectTypeName),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisableSort: true,
      DisplayText: 'Project manager',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectManager),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisableSort: true,
      DisplayText: 'Specification',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.Specification),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisableSort: true,
      DisplayText: 'Ship Yard',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.ShipYard),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },

    {
      DisableSort: true,
      DisplayText: 'Status',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectStatus),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },

    {
      DisableSort: true,
      DisplayText: 'State',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectState),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },

    {
      DisableSort: false,
      DisplayText: 'Start date',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.StartDate),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.Date
    },
    {
      DisableSort: false,
      DisplayText: 'End date',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.EndDate),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.Date
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
      DisplayText: 'Project Manager',
      FieldName: 'ProjectsManages',
      DisplayCode: 'FullName',
      ValueCode: 'ManagerId',
      FieldID: 1,
      default: true,
      CoupleID: 0,
      CoupleLabel: 'Project',
      gridName: this.gridName
    },
    {
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayText: 'Status',
      FieldName: 'ProjectStatuses',
      DisplayCode: 'ProjectStatusName',
      ValueCode: 'ProjectStatusCode',
      FieldID: 2,
      default: true,
      CoupleID: 0,
      CoupleLabel: 'Project',
      gridName: this.gridName
    },
    {
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayText: 'Ship Yard',
      FieldName: 'ShipsYards',
      DisplayCode: 'ShipYardName',
      ValueCode: 'ShipYardId',
      FieldID: 3,
      default: true,
      CoupleID: 0,
      CoupleLabel: 'Project',
      gridName: this.gridName
    },
    {
      Active_Status: true,
      Active_Status_Config_Filter: true,
      Created_By: null,
      DataType: null,
      DisplayText: 'Start Date',
      FieldName: 'StartDate',
      FieldID: 4,
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
      Created_By: null,
      DataType: null,
      DisplayText: 'End Date',
      FieldName: 'EndDate',
      FieldID: 5,
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
      type: 'multiselect',
      listValueKey: 'ProjectTypeCode',
      odataKey: 'ProjectTypeCode'
    },
    ProjectsManages: {
      webApiRequest: this.projectsService.getProjectsManagersRequest(),
      type: 'multiselect',
      listValueKey: 'ManagerId',
      odataKey: 'ProjectManagerUid'
    },
    ShipsYards: {
      webApiRequest: this.projectsService.getProjectsShipsYardsRequest(),
      type: 'multiselect',
      listValueKey: 'ShipYardId',
      odataKey: 'ShipYardId'
    },
    ProjectStatuses: {
      webApiRequest: this.projectsService.getProjectStatusesRequest(),
      type: 'multiselect',
      odataKey: 'StatusId',
      listValueKey: 'StatusCode'
    },
    StartDate: {
      odataKey: 'StartDate',
      alterKey: 'StartDate',
      type: 'date',
      dateMethod: 'ge'
    },
    EndDate: {
      odataKey: 'EndDate',
      alterKey: 'EndDate',
      type: 'date',
      dateMethod: 'le'
    }
  };

  private searchFields: string[] = [nameOf<IProjectsForMainPageGridDto>((prop) => prop.Subject)];

  constructor(
    private userService: UserService,
    private projectsService: ProjectsService
  ) {}

  public getGridInputs(): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      filters: this.filters,
      filtersLists: this.filterListsSet,
      searchFields: this.searchFields,
      request: this.projectsService.getProjectsForMainPageGridRequest(),
      gridButton: this.gridButton
    };
  }
}
