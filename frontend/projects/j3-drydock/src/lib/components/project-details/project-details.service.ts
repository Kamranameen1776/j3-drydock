import { cloneDeep } from 'lodash';
import { Injectable } from '@angular/core';
import { ITopSectionFieldSet, JbButtonType, UserRightsService } from 'jibe-components';
import { Observable, of } from 'rxjs';
import { ProjectsService } from '../../services/ProjectsService';
import { ProjectDetails, ProjectDetailsFull } from '../../models/interfaces/project-details';

import {
  eProjectDetailsSideMenuId,
  eProjectDetailsSideMenuLabel,
  eProjectWorkflowStatusAction
} from '../../models/enums/project-details.enum';
import { ITMDetailTabFields } from 'j3-task-manager-ng';
import { AttachmentsAccessRight, BaseAccessRight } from '../../models/interfaces/access-rights';
import { eModule } from '../../models/enums/module.enum';
import { eFunction } from '../../models/enums/function.enum';
import { eProjectsDetailsAccessActions, eProjectsAccessActions } from '../../models/enums/access-actions.enum';
import { currentLocalAsUTC, localDateJbStringAsUTC } from '../../utils/date';
import { ProjectEdit } from '../../models/interfaces/projects';
import { saveAs } from 'file-saver';
import { concatMap } from 'rxjs/operators';

export interface ProjectDetailsAccessRights extends BaseAccessRight {
  attachments: AttachmentsAccessRight;
  specificationDetails: {
    view: boolean;
  };
}

export const DEFAULT_PROJECT_DETAILS_ACCESS_RIGHTS: ProjectDetailsAccessRights = {
  view: false,
  edit: false,
  delete: false,
  attachments: {
    view: false,
    edit: false,
    delete: false,
    add: false
  },
  specificationDetails: {
    view: false
  }
};

@Injectable()
export class ProjectDetailsService {
  private accessRights = cloneDeep(DEFAULT_PROJECT_DETAILS_ACCESS_RIGHTS);

  constructor(
    private projectsService: ProjectsService,
    private userRights: UserRightsService
  ) {}

  changeAccessRights(rights: Partial<ProjectDetailsAccessRights>) {
    const currentRights = this.accessRights;
    this.setAccessRights({ ...currentRights, ...rights });
  }

  setupAccessRights(tmDetails: ProjectDetailsFull) {
    // TODO maybe handle status if there is some logic for access rights depending on status?
    const isEditableStatus = this.isStatusBeforeComplete(tmDetails.task_status);

    const canView = this.hasAccess(eProjectsAccessActions.viewDetail) || this.hasAccess(eProjectsAccessActions.viewDetailVessel);
    const canEdit =
      this.hasAccess(eProjectsDetailsAccessActions.editHeader) || this.hasAccess(eProjectsDetailsAccessActions.editHeaderVessel);
    const canDelete = this.hasAccess(eProjectsAccessActions.deleteProject);
    const canViewAttachments =
      this.hasAccess(eProjectsDetailsAccessActions.viewAttachments) || this.hasAccess(eProjectsDetailsAccessActions.viewAttachmentsVessel);
    const canEditAttachments =
      isEditableStatus &&
      (this.hasAccess(eProjectsDetailsAccessActions.editAttachments) ||
        this.hasAccess(eProjectsDetailsAccessActions.editAttachmentsVessel));
    const canDeleteAttachments =
      isEditableStatus &&
      (this.hasAccess(eProjectsDetailsAccessActions.deleteAttachments) ||
        this.hasAccess(eProjectsDetailsAccessActions.deleteAttachmentsVessel));
    const canAddAttachments =
      isEditableStatus &&
      (this.hasAccess(eProjectsDetailsAccessActions.addAttachments) || this.hasAccess(eProjectsDetailsAccessActions.addAttachmentsVessel));

    this.setAccessRights({
      view: canView,
      edit: canEdit,
      delete: canDelete,
      attachments: {
        view: canViewAttachments,
        edit: canEditAttachments,
        delete: canDeleteAttachments,
        add: canAddAttachments
      },
      specificationDetails: {
        view: this.hasAccess(eProjectsAccessActions.viewTechSpec)
      }
    });

    return this.accessRights;
  }

  getTopDetailsData(projectId: string): Observable<ProjectDetails> {
    return this.projectsService.getProject(projectId);
  }

  getTopSecConfig(details: ProjectDetailsFull): ITopSectionFieldSet {
    return {
      canEdit: this.accessRights.edit && this.isStatusBeforeComplete(details.ProjectStatusId),
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
      // readOnlyTitle: true,
      bottomFieldsConfig: [
        {
          id: 'ProjectManager',
          label: 'Project Manager',
          isRequired: true,
          isEditable: this.accessRights.edit && this.isStatusBeforeComplete(details.ProjectStatusId),
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
          isEditable: this.accessRights.edit && this.isStatusBeforeComplete(details.ProjectStatusId),
          type: 'date',
          getFieldName: 'StartDate',
          saveFieldName: 'StartDate',
          formatDate: true,
          controlContent: {
            id: 'StartDate',
            type: 'date',
            placeholder: 'Select',
            calendarWithInputIcon: true,
            calendarMax: details.EndDate
          }
        },
        {
          id: 'EndDate',
          label: 'End Date',
          isRequired: false,
          isEditable: this.accessRights.edit && this.isStatusBeforeComplete(details.ProjectStatusId),
          type: 'date',
          getFieldName: 'EndDate',
          saveFieldName: 'EndDate',
          formatDate: true,
          controlContent: {
            id: 'EndDate',
            type: 'date',
            placeholder: 'Select',
            calendarWithInputIcon: true,
            calendarMin: details.StartDate
          }
        },
        {
          id: 'ShipYard',
          label: 'Yard Name',
          isRequired: false,
          isEditable: this.accessRights.edit,
          type: 'dropdown',
          getFieldName: 'ShipYardId',
          saveFieldName: 'ShipYardId',
          controlContent: {
            id: 'ShipYard',
            value: 'ShipYardId',
            label: 'ShipYardName',
            selectedLabel: details.ShipYard,
            selectedValue: details.ShipYardId,
            apiRequest: this.projectsService.getProjectsShipsYardsRequest()
          }
        }
      ]
    };
  }

  getSectionsConfig(): ITMDetailTabFields {
    return {
      // [eProjectDetailsSideMenuId.General]: {
      //   id: eProjectDetailsSideMenuId.General,
      //   menuDisplayName: eProjectDetailsSideMenuLabel.General,
      //   menuIcon: '',
      //   showDiscussion: true,
      //   isClosedDiscussion: true,
      //   activeStatus: true,
      //   index: 1,
      //   sections: [
      //     {
      //       GridRowStart: 1,
      //       GridRowEnd: 2,
      //       GridColStart: 1,
      //       GridColEnd: 3,
      //       active_status: true,
      //       SectionCode: 'tasks',
      //       SectionLabel: 'Tasks',
      //       isAddNewButton: false
      //     }
      //   ]
      // },
      [eProjectDetailsSideMenuId.Specifications]: {
        id: eProjectDetailsSideMenuId.Specifications,
        menuDisplayName: eProjectDetailsSideMenuLabel.Specifications,
        menuIcon: '',
        showDiscussion: true,
        isClosedDiscussion: true,
        activeStatus: true,
        index: 2,
        sections: [
          ...(this.accessRights.specificationDetails.view
            ? [
                {
                  GridRowStart: 1,
                  GridRowEnd: 2,
                  GridColStart: 1,
                  GridColEnd: 3,
                  active_status: true,
                  SectionCode: eProjectDetailsSideMenuId.TechnicalSpecification,
                  SectionLabel: eProjectDetailsSideMenuLabel.TechnicalSpecification,
                  IconClass: 'icons8-more-details-2',
                  isAddNewButton: false
                }
              ]
            : []),
          {
            GridRowStart: 2,
            GridRowEnd: 3,
            GridColStart: 1,
            GridColEnd: 3,
            active_status: this.accessRights.attachments.view,
            SectionCode: eProjectDetailsSideMenuId.Attachments,
            SectionLabel: eProjectDetailsSideMenuLabel.Attachments,
            isAddNewButton: this.accessRights.attachments.add,
            buttonLabel: 'Add New',
            addNewButtonType: JbButtonType.NoButton
          }
        ]
      },
      [eProjectDetailsSideMenuId.YardSelection]: {
        id: eProjectDetailsSideMenuId.YardSelection,
        menuDisplayName: eProjectDetailsSideMenuLabel.YardSelection,
        menuIcon: '',
        showDiscussion: true,
        isClosedDiscussion: true,
        activeStatus: true,
        index: 3,
        sections: [
          {
            GridRowStart: 1,
            GridRowEnd: 2,
            GridColStart: 1,
            GridColEnd: 3,
            active_status: true,
            SectionCode: eProjectDetailsSideMenuId.RFQ,
            SectionLabel: eProjectDetailsSideMenuLabel.RFQ,
            IconClass: 'icons8-more-details-2',
            isAddNewButton: true,
            buttonLabel: 'Link Yard',
            addNewButtonType: JbButtonType.NoButton
          },
          {
            GridRowStart: 2,
            GridRowEnd: 3,
            GridColStart: 1,
            GridColEnd: 3,
            active_status: true,
            SectionCode: eProjectDetailsSideMenuId.Comparison,
            SectionLabel: eProjectDetailsSideMenuLabel.Comparison,
            isAddNewButton: false
          }
        ]
      },
      [eProjectDetailsSideMenuId.ProjectMonitoring]: {
        id: eProjectDetailsSideMenuId.ProjectMonitoring,
        menuDisplayName: eProjectDetailsSideMenuLabel.ProjectMonitoring,
        menuIcon: '',
        showDiscussion: true,
        isClosedDiscussion: true,
        activeStatus: true,
        index: 4,
        sections: [
          {
            GridRowStart: 1,
            GridRowEnd: 2,
            GridColStart: 1,
            GridColEnd: 3,
            active_status: true,
            SectionCode: eProjectDetailsSideMenuId.GanttChart,
            SectionLabel: eProjectDetailsSideMenuLabel.GanttChart,
            IconClass: 'icons8-more-details-2',
            isAddNewButton: false
          },
          {
            GridRowStart: 2,
            GridRowEnd: 3,
            GridColStart: 1,
            GridColEnd: 3,
            active_status: true,
            SectionCode: eProjectDetailsSideMenuId.CostUpdates,
            SectionLabel: eProjectDetailsSideMenuLabel.CostUpdates,
            IconClass: 'icons8-more-details-2',
            isAddNewButton: false
          },
          {
            GridRowStart: 3,
            GridRowEnd: 4,
            GridColStart: 1,
            GridColEnd: 3,
            active_status: true,
            SectionCode: eProjectDetailsSideMenuId.StatementOfFacts,
            SectionLabel: eProjectDetailsSideMenuLabel.StatementOfFacts,
            IconClass: 'icons8-more-details-2',
            isAddNewButton: true,
            buttonLabel: 'Add Fact',
            addNewButtonType: JbButtonType.NoButton
          }
        ]
      },
      [eProjectDetailsSideMenuId.Reporting]: {
        id: eProjectDetailsSideMenuId.Reporting,
        menuDisplayName: eProjectDetailsSideMenuLabel.Reporting,
        menuIcon: '',
        showDiscussion: true,
        isClosedDiscussion: true,
        activeStatus: true,
        index: 5,
        sections: [
          {
            GridRowStart: 1,
            GridRowEnd: 2,
            GridColStart: 1,
            GridColEnd: 3,
            active_status: true,
            SectionCode: eProjectDetailsSideMenuId.DailyReports,
            SectionLabel: eProjectDetailsSideMenuLabel.DailyReports,
            IconClass: 'icons8-more-details-2',
            buttonLabel: 'Add New',
            isAddNewButton: true
          }
        ]
      }
    };
  }

  save(projectId: string, formData) {
    const data: ProjectEdit = {
      ProjectUid: projectId,
      Subject: formData.Job_Short_Description,
      ProjectManagerUid: formData.ProjectManagerUid,
      EndDate: localDateJbStringAsUTC(formData.EndDate),
      StartDate: localDateJbStringAsUTC(formData.StartDate),
      ShipYardId: formData.ShipYardId,
      LastUpdated: currentLocalAsUTC()
    };

    return this.projectsService.updateProject(data);
  }

  saveCostUpdates(payload) {
    return this.projectsService.updateCosts(payload);
  }

  isStatusBeforeComplete(status: string) {
    return (
      this.areStatusesSame(status, eProjectWorkflowStatusAction.Raise) ||
      this.areStatusesSame(status, eProjectWorkflowStatusAction['In Progress'])
    );
  }

  areStatusesSame(status: string, statusToCompare: string): boolean {
    return status.toLowerCase() === statusToCompare.toLowerCase();
  }

  hasAccess(action: string, module = eModule.Project, func = eFunction.DryDock) {
    return !!this.userRights.getUserRights(module, func, action);
  }

  exportExcel(projectId: string, yardId: string, fileName: string) {
    return this.projectsService.exportExcel(projectId, yardId).pipe(
      concatMap((data) => {
        saveAs(data, fileName);
        return of(data);
      })
    );
  }

  private setAccessRights(rights: ProjectDetailsAccessRights) {
    this.accessRights = rights;
  }
}
