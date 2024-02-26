import { Injectable } from '@angular/core';
import { eProjectTemplatesFields, eProjectTemplatesLabels } from '../../../models/enums/project-templates.enum';
import { Column, Filter, FilterListSet, UserRightsService, eFieldControlType } from 'jibe-components';
import { StandardJobsService } from '../../../services/standard-jobs.service';
import { ProjectsService } from '../../../services/ProjectsService';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { eModule } from '../../../models/enums/module.enum';
import { eFunction } from '../../../models/enums/function.enum';
import { ProjectTemplatesService } from '../../../services/project-templates.service';

@Injectable({
  providedIn: 'root'
})
export class CreateProjectFromTemplateGridService {
  readonly gridName: string = 'createProjectFromTemplateGrid';

  private readonly columns: Column[] = [
    {
      DisplayText: eProjectTemplatesLabels.Code,
      FieldName: eProjectTemplatesFields.Code,
      hyperlink: true,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      width: '100px'
    },
    {
      DisplayText: eProjectTemplatesLabels.Subject,
      FieldName: eProjectTemplatesFields.Subject,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisplayText: eProjectTemplatesLabels.ProjectType,
      FieldName: eProjectTemplatesFields.ProjectType,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisplayText: eProjectTemplatesLabels.VesselType,
      FieldName: eProjectTemplatesFields.VesselType,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisplayText: eProjectTemplatesLabels.NoOfSpecItems,
      FieldName: eProjectTemplatesFields.NoOfSpecItems,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisplayText: eProjectTemplatesLabels.LastUpdated,
      FieldName: eProjectTemplatesFields.LastUpdated,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    }
  ];

  // TODO check and fix
  private gridFilters: Filter[] = [
    {
      DisplayText: eProjectTemplatesLabels.VesselType,
      FieldName: eProjectTemplatesFields.VesselType,
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayCode: 'VesselTypes',
      ValueCode: 'VesselTypes',
      FieldID: 1,
      gridName: this.gridName,
      default: true,
      sendFilterAs: 'gridFilters'
    },
    {
      DisplayText: eProjectTemplatesLabels.ProjectType,
      FieldName: eProjectTemplatesFields.ProjectType,
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayCode: 'ProjectTypeName',
      ValueCode: 'ProjectTypeUId',
      FieldID: 2,
      gridName: this.gridName,
      default: true
    }
  ];
  // TODO check and fix
  private gridFilterLists: FilterListSet = {
    [eProjectTemplatesFields.VesselType]: {
      webApiRequest: this.standardJobsService.getVesselTypesRequest(),
      type: eFieldControlType.MultiSelect,
      odataKey: eProjectTemplatesFields.VesselTypeId,
      listValueKey: 'ID'
    },
    [eProjectTemplatesFields.ProjectType]: {
      webApiRequest: this.projectsService.getProjectTypesRequest(),
      type: eFieldControlType.MultiSelect,
      odataKey: eProjectTemplatesFields.ProjectTypeUid,
      listValueKey: 'ProjectTypeUId'
    }
  };

  constructor(
    private standardJobsService: StandardJobsService,
    private projectsService: ProjectsService,
    private projectTemplatesService: ProjectTemplatesService,
    private userRights: UserRightsService
  ) {}

  getGridInputs(): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      request: this.projectTemplatesService.getPopupGridRequest(),
      filters: this.gridFilters,
      filtersLists: this.gridFilterLists,
      searchFields: [eProjectTemplatesFields.Code, eProjectTemplatesFields.Subject]
    };
  }
  // TODO fix to correct keys once US for access rights is done
  hasAccess(action: string) {
    return !!this.userRights.getUserRights(eModule.Project, eFunction.ProjectTemplates, action);
  }
}
