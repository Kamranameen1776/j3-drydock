import { Injectable } from '@angular/core';
import { ApiRequestService, ITopSectionFieldSet, TopFieldConfig, WebApiRequest, eCrud } from 'jibe-components';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectsService } from '../ProjectsService';

export interface TopFieldsData {
  topFieldsConfig: ITopSectionFieldSet;
  detailedData: Record<string, unknown>;
  canEdit: boolean;
}

@Injectable()
export class SpecificationTopDetailsService {
  bottomFieldsConfig: TopFieldConfig[] = [
    {
      id: 'ProjectManager',
      label: 'Project Manager',
      isRequired: false,
      isEditable: true,
      type: 'dropdown',
      getFieldName: 'ProjectManager',
      saveFieldName: 'ProjectManager',
      controlContent: {
        id: 'ProjectManager',
        apiRequest: this.projectsService.getProjectsManagersRequest()
      }
    },
    {
      id: 'StartDate',
      label: 'Start date',
      isRequired: false,
      isEditable: true,
      type: 'date',
      getFieldName: 'StartDate',
      saveFieldName: 'StartDate',
      formatDate: true,
      controlContent: {
        id: 'StartDate',
        type: 'date',
        placeholder: 'Select',
        calendarWithInputIcon: true
      }
    },
    {
      id: 'EndDate',
      label: 'Due date',
      isRequired: false,
      isEditable: true,
      type: 'date',
      getFieldName: 'EndDate',
      saveFieldName: 'EndDate',
      formatDate: true,
      controlContent: {
        id: 'EndDate',
        type: 'date',
        placeholder: 'Select',
        calendarWithInputIcon: true
      }
    },
    {
      id: 'ShipYard',
      label: 'Yard Name',
      isRequired: false,
      isEditable: true,
      type: 'dropdown',
      getFieldName: 'ShipYard',
      saveFieldName: 'ShipYardTemp',
      controlContent: {
        id: 'ShipYard',
        apiRequest: this.projectsService.getProjectsShipsYardsRequest()
      }
    }
  ];

  constructor(
    private apiService: ApiRequestService,
    private projectsService: ProjectsService
  ) {}

  detailedData = {
    StartDate: new Date(),
    EndDate: new Date(),
    ProjectManager: 'Alexander Crisan',
    ShipYard: 'Cochin Shipyard Limited'
  };

  canEdit = true;

  getTopDetailsData(projectId: string): Observable<TopFieldsData> {
    const apiReq: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      crud: eCrud.Get,
      action: 'projects/get-project',
      params: `uid=${projectId}`
    };

    return this.apiService.sendApiReq(apiReq).pipe(
      map((response) => {
        return {
          topFieldsConfig: {
            showStatus: true,
            showVessel: true,
            showJobCard: true,
            jobStatus: 'raise',
            statusClass: 'status-9',
            jobStatusDisplayName: response.ProjectStatusName,
            typeIconClass: 'icons8-document-4',
            worklistType: 'drydock',
            worklistDisplayName: 'Dry dock',
            jobCardNo: response.ProjectCode,
            vesselName: response.VesselName,
            jobTitle: response.Subject,
            bottomFieldsConfig: this.bottomFieldsConfig
          },
          detailedData: response,
          canEdit: this.canEdit
        };
      })
    );
  }

  save(projectId: string, data) {
    const apiReq: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      crud: eCrud.Post,
      action: 'projects/update-project',
      body: {
        ...data,
        uid: projectId
      }
    };

    return this.apiService.sendApiReq(apiReq);
  }
}
