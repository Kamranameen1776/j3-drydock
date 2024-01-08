import { Injectable } from '@angular/core';
import {
  Column,
  Filter,
  FilterListSet,
  GridButton,
  GridRowActions,
  UserService,
  eGridColumnsWidth,
  eFieldControlType,
  FormModel,
  SystemLevelFiltersService,
  Datasource,
  VesselService
} from 'jibe-components';
import { IProjectsForMainPageGridDto } from './dtos/IProjectsForMainPageGridDto';
import { nameOf } from '../../../utils/nameOf';
import { ProjectsService } from '../../../services/ProjectsService';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { eProjectsCreateDisplayNames, eProjectsCreateFieldNames } from '../../../models/enums/projects-create.enum';
import { ProjectsGridOdataKeys } from '../../../models/enums/ProjectsGridOdataKeys';
import { eSortOrder } from '../../../models/enums/sorting.enum';

@Injectable()
export class ProjectsSpecificationGridService {
  // TODO: get from the backend service
  public readonly minDate: Date = new Date('2010-01-01');
  public readonly maxDate: Date = new Date('2100-01-01');

  public readonly gridName: string = 'projectsSpecificationGrid';

  public readonly ProjectStatusesFilterName = 'ProjectStatuses';

  public readonly dateFormat = this.userService.getUserDetails().Date_Format;

  initDate: Date = new Date();

  private readonly columns: Column[] = [
    {
      DisplayText: 'Code',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectCode),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '123px'
    },
    {
      DisplayText: 'Vessel',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.VesselName),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisplayText: 'Subject',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.Subject),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.LongDescription
    },
    {
      DisplayText: 'Project Type',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectTypeName),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisplayText: 'Project Manager',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectManager),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisableSort: true,
      DisplayText: 'Specifications (Open/Total)',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.Specification),
      IsActive: true,
      IsMandatory: false,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisableSort: true,
      DisplayText: 'Ship Yard',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.ShipYard),
      IsActive: true,
      IsMandatory: false,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },

    {
      DisplayText: 'Status',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectStatusName),
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
      IsMandatory: false,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },

    {
      DisplayText: 'Start date',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.StartDate),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.Date
    },
    {
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
    show: true
  };

  private filterListsSet: FilterListSet = {
    ProjectTypes: {
      webApiRequest: this.projectsService.getProjectTypesRequest(),
      type: 'multiselect',
      listValueKey: 'ProjectTypeCode',
      odataKey: ProjectsGridOdataKeys.ProjectTypeCode
    },
    ProjectsManages: {
      webApiRequest: this.projectsService.getProjectsManagersRequest(),
      type: 'multiselect',
      listValueKey: 'ManagerId',
      odataKey: ProjectsGridOdataKeys.ProjectManagerUid
    },
    ShipsYards: {
      webApiRequest: this.projectsService.getProjectsShipsYardsRequest(),
      type: 'multiselect',
      listValueKey: 'ShipYardId',
      odataKey: ProjectsGridOdataKeys.ShipYardId
    },
    ProjectStatuses: {
      data: () => this.projectsService.getProjectStatuses(),
      type: 'multiselect',
      odataKey: ProjectsGridOdataKeys.ProjectStatusId,
      listValueKey: 'ProjectStatusId'
    },
    FromStartDate: {
      type: eFieldControlType.Date,
      odataKey: ProjectsGridOdataKeys.StartDate,
      dateMethod: 'ge'
    },
    ToStartDate: {
      type: eFieldControlType.Date,
      odataKey: ProjectsGridOdataKeys.StartDate,
      dateMethod: 'le'
    },
    FromEndDate: {
      type: eFieldControlType.Date,
      odataKey: ProjectsGridOdataKeys.EndDate,
      dateMethod: 'ge'
    },
    ToEndDate: {
      type: eFieldControlType.Date,
      odataKey: ProjectsGridOdataKeys.EndDate,
      dateMethod: 'le'
    },
    Fleets: {
      webApiRequest: this.slfService.getSLFDetails(Datasource.Fleets),
      type: 'multiselect',
      listValueKey: 'FleetCode',
      odataKey: ProjectsGridOdataKeys.FleetCode
    },
    VesselName: {
      data: (arg) => this.vesselService.getVesselsByFleet(arg),
      type: eFieldControlType.MultiSelect,
      odataKey: 'VesselId',
      listValueKey: 'Vessel_ID',
      dependentFilterConfig: {
        dependentParent: ['Fleets']
      }
    }
  };

  public filters: Filter[] = [
    {
      Active_Status_Config_Filter: true,
      DisplayText: 'Fleet',
      Active_Status: true,
      FieldName: 'Fleets',
      DisplayCode: 'FleetName',
      ValueCode: 'FleetCode',
      FieldID: 0,
      default: false,
      CoupleLabel: 'Project',
      gridName: this.gridName
    },
    {
      Active_Status_Config_Filter: true,
      DisplayText: 'Vessel',
      Active_Status: true,
      FieldName: 'VesselName',
      DisplayCode: 'Vessel_Name',
      ValueCode: 'Vessel_ID',
      FieldID: 1,
      default: false,
      gridName: this.gridName
    },
    {
      Active_Status_Config_Filter: true,
      DisplayText: 'Project Type',
      Active_Status: true,
      FieldName: 'ProjectTypes',
      DisplayCode: 'ProjectTypeName',
      ValueCode: 'ProjectTypeCode',
      FieldID: 2,
      default: true,
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
      FieldID: 3,
      default: true,
      CoupleLabel: 'Project',
      gridName: this.gridName
    },
    {
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayText: 'Status',
      FieldName: this.ProjectStatusesFilterName,
      DisplayCode: 'ProjectStatusName',
      ValueCode: 'ProjectStatusId',
      FieldID: 4,
      default: true,
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
      FieldID: 5,
      default: true,
      CoupleLabel: 'Project',
      gridName: this.gridName
    },
    {
      Active_Status: true,
      Active_Status_Config_Filter: true,
      FieldType: 'date',
      ControlType: eFieldControlType.Date,
      DataType: 'datetime',
      Details: 'FromStartDate',
      DisplayText: 'Start Date',
      FieldID: 6,
      FieldName: 'FromStartDate',
      CoupleID: 1,
      CoupleLabel: 'Start Date',
      default: false,
      gridName: this.gridName,
      addTimeLimit: true
    },
    {
      Active_Status: true,
      Active_Status_Config_Filter: true,
      FieldType: 'date',
      ControlType: eFieldControlType.Date,
      DataType: 'datetime',
      Details: 'ToStartDate',
      DisplayText: 'Start Date',
      FieldID: 7,
      FieldName: 'ToStartDate',
      CoupleID: 1,
      CoupleLabel: 'Start Date',
      default: false,
      gridName: this.gridName,
      addTimeLimit: true
    },
    {
      Active_Status: true,
      Active_Status_Config_Filter: true,
      FieldType: 'date',
      ControlType: eFieldControlType.Date,
      DataType: 'datetime',
      Details: 'FromEndDate',
      DisplayText: 'End Date',
      FieldID: 8,
      FieldName: 'FromEndDate',
      CoupleID: 2,
      CoupleLabel: 'End Date',
      default: true,
      gridName: this.gridName,
      addTimeLimit: true
    },
    {
      Active_Status: true,
      Active_Status_Config_Filter: true,
      FieldType: 'date',
      ControlType: eFieldControlType.Date,
      DataType: 'datetime',
      Details: 'ToEndDate',
      DisplayText: 'End Date',
      FieldID: 9,
      FieldName: 'ToEndDate',
      CoupleID: 2,
      CoupleLabel: 'End Date',
      default: true,
      gridName: this.gridName,
      addTimeLimit: true
    }
  ];

  private searchFields: string[] = [
    nameOf<IProjectsForMainPageGridDto>((prop) => prop.Subject),
    nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectCode),
    nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectManager)
  ];
  private gridActions: GridRowActions[] = [];

  public createProjectFormId = 'projectCreate';

  public deleteProjectFormId = 'projectDelete';

  constructor(
    private userService: UserService,
    private projectsService: ProjectsService,
    private slfService: SystemLevelFiltersService,
    private vesselService: VesselService
  ) {}

  public getGridInputs(): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      filters: this.filters,
      filtersLists: this.filterListsSet,
      searchFields: this.searchFields,
      request: this.projectsService.getProjectsForMainPageGridRequest(),
      gridButton: this.gridButton,
      actions: this.gridActions,
      sortField: nameOf<IProjectsForMainPageGridDto>((prop) => prop.StartDate),
      sortOrder: eSortOrder.Descending
    };
  }

  public getCreateProjectForm(): FormModel {
    return {
      id: 'createNewProject',
      label: '',
      type: 'form',
      sections: {
        [this.createProjectFormId]: {
          type: 'grid',
          label: '',
          formID: this.createProjectFormId,
          gridRowStart: 1,
          gridRowEnd: 14,
          gridColStart: 1,
          gridColEnd: 1,
          fields: {
            [eProjectsCreateFieldNames.Fleet]: {
              label: eProjectsCreateDisplayNames.Fleet,
              type: eFieldControlType.Dropdown,
              sectionID: this.createProjectFormId,
              enabled: true,
              validatorRequired: false,
              gridRowStart: 1,
              gridRowEnd: 2,
              gridColStart: 1,
              gridColEnd: 3,
              list: []
            },
            [eProjectsCreateFieldNames.Vessel]: {
              label: eProjectsCreateDisplayNames.Vessel,
              type: eFieldControlType.Dropdown,
              sectionID: this.createProjectFormId,
              enabled: true,
              validatorRequired: true,
              gridRowStart: 2,
              gridRowEnd: 3,
              gridColStart: 1,
              gridColEnd: 3,
              list: []
            },
            [eProjectsCreateFieldNames.ProjectType]: {
              label: eProjectsCreateDisplayNames.ProjectType,
              type: eFieldControlType.Dropdown,
              sectionID: this.createProjectFormId,
              enabled: true,
              validatorRequired: true,
              gridRowStart: 3,
              gridRowEnd: 4,
              gridColStart: 1,
              gridColEnd: 3,
              listRequest: {
                webApiRequest: this.projectsService.getProjectTypesRequest(),
                labelKey: 'ProjectTypeName',
                valueKey: 'ProjectTypeUId'
              }
            },
            [eProjectsCreateFieldNames.Subject]: {
              label: eProjectsCreateDisplayNames.Subject,
              type: eFieldControlType.Text,
              sectionID: this.createProjectFormId,
              enabled: true,
              minLength: 1,
              maxLength: 200,
              validatorRequired: true,
              gridRowStart: 4,
              gridRowEnd: 5,
              gridColStart: 1,
              gridColEnd: 3
            },
            [eProjectsCreateFieldNames.ProjectManager]: {
              label: eProjectsCreateDisplayNames.ProjectManager,
              type: eFieldControlType.Dropdown,
              sectionID: this.createProjectFormId,
              enabled: true,
              gridRowStart: 5,
              gridRowEnd: 6,
              gridColStart: 1,
              gridColEnd: 3,
              listRequest: {
                webApiRequest: this.projectsService.getProjectsManagersDictionariesRequest(),
                labelKey: 'FullName',
                valueKey: 'uid'
              }
            },
            [eProjectsCreateFieldNames.StartDate]: {
              label: eProjectsCreateDisplayNames.StartDate,
              type: eFieldControlType.Date,
              sectionID: this.createProjectFormId,
              enabled: true,
              validatorRequired: true,
              gridRowStart: 6,
              gridRowEnd: 7,
              gridColStart: 1,
              gridColEnd: 3,
              calendarMin: this.minDate
            },
            [eProjectsCreateFieldNames.EndDate]: {
              label: eProjectsCreateDisplayNames.EndDate,
              type: eFieldControlType.Date,
              sectionID: this.createProjectFormId,
              enabled: true,
              validatorRequired: true,
              gridRowStart: 7,
              gridRowEnd: 8,
              gridColStart: 1,
              gridColEnd: 3,
              calendarMax: this.maxDate
            }
          }
        }
      }
    };
  }
}
