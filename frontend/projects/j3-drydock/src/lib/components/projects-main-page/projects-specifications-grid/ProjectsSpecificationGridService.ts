import { Injectable } from '@angular/core';
import {
  Column,
  Filter,
  FilterListSet,
  GridButton,
  GridRowActions,
  UserService,
  eGridColumnsWidth,
  eGridRowActions,
  eFieldControlType,
  FormModel,
  SystemLevelFiltersService,
  Datasource
} from 'jibe-components';
import { IProjectsForMainPageGridDto } from './dtos/IProjectsForMainPageGridDto';
import { nameOf } from '../../../utils/nameOf';
import { ProjectsService } from '../../../services/ProjectsService';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { eProjectsCreateDisplayNames, eProjectsCreateFieldNames } from '../../../models/enums/projects-create.enum';
import { eProjectsDeleteDisplayNames, eProjectsDeleteFieldNames } from '../../../models/enums/projects-delete.enum';
import { ProjectsGridOdataKeys } from '../../../models/enums/ProjectsGridOdataKeys';

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
      DisplayText: 'ProjectId',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectId),
      IsActive: true,
      IsMandatory: true,
      IsVisible: false,
      ReadOnly: true
    },
    {
      DisplayText: 'Code',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectCode),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
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
      DisplayText: 'Specifications',
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
      IsMandatory: true,
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
      width: eGridColumnsWidth.Date,
      pipe: {
        value: 'date',
        format: this.userService.getUserDetails().Date_Format.toLocaleUpperCase()
      }
    },
    {
      DisplayText: 'End date',
      FieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.EndDate),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.Date,
      pipe: {
        value: 'date',
        format: this.userService.getUserDetails().Date_Format.toLocaleUpperCase()
      }
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
    StartDate: {
      odataKey: ProjectsGridOdataKeys.StartDate,
      alterKey: 'StartDate',
      type: 'date',
      dateMethod: 'ge'
    },
    EndDate: {
      odataKey: ProjectsGridOdataKeys.EndDate,
      alterKey: 'EndDate',
      type: 'date',
      dateMethod: 'le'
    },
    Fleets: {
      webApiRequest: this.slfService.getSLFDetails(Datasource.Fleets),
      type: 'multiselect',
      listValueKey: 'FleetCode',
      odataKey: ProjectsGridOdataKeys.FleetCode
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
      default: true,
      CoupleID: 0,
      CoupleLabel: 'Project',
      gridName: this.gridName
    },
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
      FieldName: this.ProjectStatusesFilterName,
      DisplayCode: 'ProjectStatusName',
      ValueCode: 'ProjectStatusId',
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

  private searchFields: string[] = [
    nameOf<IProjectsForMainPageGridDto>((prop) => prop.Subject),
    nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectCode),
    nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectTypeName),
    nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectManager)
  ];
  private gridActions: GridRowActions[] = [
    {
      name: eGridRowActions.Delete,
      label: 'Delete'
    },
    {
      name: eGridRowActions.Edit,
      label: 'Edit'
    }
  ];

  public createProjectFormId = 'projectCreate';

  public deleteProjectFormId = 'projectDelete';

  constructor(
    private userService: UserService,
    private projectsService: ProjectsService,
    private slfService: SystemLevelFiltersService
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
      actions: this.gridActions
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
              listRequest: {
                webApiRequest: this.slfService.getSLFDetails(Datasource.Fleets),
                labelKey: 'FleetName'
              }
            },
            [eProjectsCreateFieldNames.Vessel]: {
              label: eProjectsCreateDisplayNames.Vessel,
              type: eFieldControlType.Dropdown,
              sectionID: this.createProjectFormId,
              enabled: true,
              validatorRequired: false,
              gridRowStart: 2,
              gridRowEnd: 3,
              gridColStart: 1,
              gridColEnd: 3,
              listRequest: {
                webApiRequest: this.slfService.getSLFDetails(Datasource.Vessels),
                labelKey: 'Vessel_Name',
                valueKey: 'Vessel_ID'
              }
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
                webApiRequest: this.projectsService.getAllProjectTypesRequest(),
                labelKey: 'WorklistType',
                valueKey: 'uid'
              }
            },
            [eProjectsCreateFieldNames.Subject]: {
              label: eProjectsCreateDisplayNames.Subject,
              type: eFieldControlType.Text,
              sectionID: this.createProjectFormId,
              enabled: true,
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
              validatorRequired: false,
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
              gridColEnd: 3
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
              gridColEnd: 3
            }
          }
        }
      }
    };
  }

  public getDeleteProjectForm(): FormModel {
    return {
      id: 'deleteProject',
      label: '',
      type: 'form',
      sections: {
        [this.deleteProjectFormId]: {
          type: 'grid',
          label: '',
          formID: this.deleteProjectFormId,
          gridRowStart: 1,
          gridRowEnd: 1,
          gridColStart: 1,
          gridColEnd: 1,
          fields: {
            [eProjectsDeleteFieldNames.AreYouSureYouWantToDeleteThisProject]: {
              label: eProjectsDeleteDisplayNames.AreYouSureYouWantToDeleteThisProject,
              type: eFieldControlType.String,
              sectionID: this.deleteProjectFormId,
              gridRowStart: 1,
              gridRowEnd: 1,
              gridColStart: 1,
              gridColEnd: 1
            }
          }
        }
      }
    };
  }
}
