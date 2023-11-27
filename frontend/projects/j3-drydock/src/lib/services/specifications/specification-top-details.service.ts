import { Injectable } from '@angular/core';
import { ITopSectionFieldSet } from 'jibe-components';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectsService } from '../ProjectsService';
import { ProjectDetails } from '../../models/interfaces/project-details';
import { getISOStringFromDateString } from '../../utils/to-iso-string';

export interface TopFieldsData<T> {
  topFieldsConfig: ITopSectionFieldSet;
  detailedData: T;
  canEdit: boolean;
}

@Injectable()
export class SpecificationTopDetailsService {
  constructor(private projectsService: ProjectsService) {}

  detailedData = {
    StartDate: new Date(),
    EndDate: new Date(),
    ProjectManager: 'Alexander Crisan',
    ShipYard: 'Cochin Shipyard Limited'
  };

  canEdit = true;

  getTopDetailsData(projectId: string): Observable<TopFieldsData<ProjectDetails>> {
    return this.projectsService.getProject(projectId).pipe(
      map((response) => {
        return {
          topFieldsConfig: {
            showStatus: true,
            showVessel: true,
            showJobCard: true,
            jobStatus: 'raise',
            jobStatusDisplayName: response.ProjectStatusName,
            typeIconClass: 'icons8-document-4',
            worklistType: response.ProjectTypeCode,
            worklistDisplayName: response.ProjectTypeName,
            jobCardNo: response.ProjectCode,
            vesselName: response.VesselName,
            jobTitle: response.Subject,
            bottomFieldsConfig: [
              {
                id: 'ProjectManager',
                label: 'Project Manager',
                isRequired: false,
                isEditable: true,
                type: 'dropdown',
                getFieldName: 'ProjectManagerUid',
                saveFieldName: 'ProjectManagerUid',
                controlContent: {
                  id: 'ProjectManager',
                  value: 'ManagerId',
                  label: 'FullName',
                  selectedValue: response.ProjectManagerUid,
                  selectedLabel: response.ProjectManager,
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
                  value: 'ShipYardId',
                  label: 'ShipYardName',
                  selectedLabel: response.ShipYard,
                  selectedValue: response.ShipYard,
                  apiRequest: this.projectsService.getProjectsShipsYardsRequest()
                }
              }
            ]
          },
          detailedData: response,
          canEdit: this.canEdit
        };
      })
    );
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
}
