import { Injectable } from '@angular/core';
import { ITopSectionFieldSet } from 'jibe-components';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectsService } from '../../../services/ProjectsService';
import { ProjectDetails, ProjectTopHeaderDetails } from '../../../models/interfaces/project-details';
import { getISOStringFromDateString } from '../../../utils/to-iso-string';
import { eProjectWorklowStatusAction } from '../../../models/enums/project-details.enum';

export interface TopFieldsData<T> {
  topFieldsConfig: ITopSectionFieldSet;
  detailedData: T;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectTopDetailsService {
  constructor(private projectsService: ProjectsService) {}

  getTopDetailsData(projectId: string): Observable<TopFieldsData<ProjectDetails>> {
    return this.projectsService.getProject(projectId).pipe(
      map((response: ProjectDetails) => {
        return {
          topFieldsConfig: this.getTopSecConfig(response),
          detailedData: response
        };
      })
    );
  }

  getTopSecConfig(details: ProjectDetails | ProjectTopHeaderDetails): ITopSectionFieldSet {
    return {
      showStatus: true,
      showVessel: true,
      showJobCard: true,
      jobStatus: details.ProjectStatusId.toUpperCase(),
      jobStatusDisplayName: details.ProjectStatusName,
      typeIconClass: 'icons8-document-4',
      worklistType: details.ProjectTypeCode,
      worklistDisplayName: details.ProjectTypeName,
      jobCardNo: details.ProjectCode,
      vesselName: details.VesselName,
      jobTitle: details.Subject,
      bottomFieldsConfig: [
        {
          id: 'ProjectManager',
          label: 'Project Manager',
          isRequired: false,
          isEditable: this.isStatusBeforeComplete(details.ProjectStatusId),
          type: 'dropdown',
          getFieldName: 'ProjectManagerUid',
          saveFieldName: 'ProjectManagerUid',
          controlContent: {
            id: 'ProjectManager',
            value: 'ManagerId',
            label: 'FullName',
            selectedValue: details.ProjectManagerUid,
            selectedLabel: details.ProjectManager,
            apiRequest: this.projectsService.getProjectsManagersRequest()
          }
        },
        {
          id: 'StartDate',
          label: 'Start Date',
          isRequired: false,
          isEditable: this.isStatusBeforeComplete(details.ProjectStatusId),
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
          label: 'End Date',
          isRequired: false,
          isEditable: this.isStatusBeforeComplete(details.ProjectStatusId),
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
          isEditable: false,
          type: 'dropdown',
          getFieldName: 'ShipYard',
          saveFieldName: 'ShipYardTemp',
          controlContent: {
            id: 'ShipYard',
            value: 'ShipYardId',
            label: 'ShipYardName',
            selectedLabel: '',
            selectedValue: details.ShipYard,
            apiRequest: this.projectsService.getProjectsShipsYardsRequest()
          }
        }
      ]
    };
  }

  save(projectId: string, formData) {
    const data = {
      Subject: formData.Job_Short_Description,
      ProjectManagerUid: formData.ProjectManager,
      EndDate: getISOStringFromDateString(formData.EndDate),
      StartDate: getISOStringFromDateString(formData.StartDate)
    };

    return this.projectsService.updateProject({
      ...data,
      uid: projectId
    } as any);
  }

  getStatusForWorkflowActionsJbComponent(status: string) {
    return `${status}_::_`;
  }

  getStatusFromWorkflowActionsJbComponent(status: string) {
    return status.replace('_::_', '');
  }

  isStatusBeforeComplete(status: string) {
    return status === eProjectWorklowStatusAction.Raise || status === eProjectWorklowStatusAction['In Progress'];
  }
}
