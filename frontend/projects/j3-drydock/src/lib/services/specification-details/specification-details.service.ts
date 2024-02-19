import { Injectable } from '@angular/core';
import {
  ApiRequestService,
  ITopSectionFieldSet,
  UserRightsService,
  WebApiRequest,
  eApiBase,
  eCrud,
  eEntities,
  eFieldControlType
} from 'jibe-components';
import { Observable } from 'rxjs';
import { UpdateSpecificationDetailsDto } from '../../models/dto/specification-details/UpdateSpecificationDetailsDto';
import { eSpecificationDetailsGeneralInformationFields } from '../../models/enums/specification-details-general-information.enum';
import f from 'odata-filter-builder';
import { BaseAccessRight } from '../../models/interfaces/access-rights';
import { cloneDeep } from 'lodash';
import { SpecificationDetails, SpecificationDetailsFull } from '../../models/interfaces/specification-details';
import {
  eSpecificationDetailsPageMenuIds,
  eSpecificationDetailsPageMenuLabels,
  eSpecificationWorkflowStatusAction
} from '../../models/enums/specification-details.enum';
import { eModule } from '../../models/enums/module.enum';
import { eFunction } from '../../models/enums/function.enum';
import { ITMDetailTabFields } from 'j3-task-manager-ng';
import { eSpecificationAccessActions } from '../../models/enums/access-actions.enum';
import { eSubItemsDialog } from '../../models/enums/sub-items.enum';
import { eApiBaseDryDockAPI } from '../../models/constants/constants';
import { eProjectWorkflowStatusAction } from '../../models/enums/project-details.enum';

export interface SpecificationDetailAccessRights extends BaseAccessRight {
  generalInformation: { view: boolean };
  attachments: BaseAccessRight & { add: boolean };
  subItems: BaseAccessRight;
  requisitions: { view: boolean; edit: boolean };
  pmsJobs: { view: boolean };
  findings: { view: boolean };
}

export const DEFAULT_PROJECT_DETAILS_ACCESS_RIGHTS: SpecificationDetailAccessRights = {
  view: false,
  edit: false,
  delete: false,
  generalInformation: {
    view: false
  },
  attachments: {
    view: false,
    edit: false,
    delete: false,
    add: false
  },
  requisitions: {
    view: false,
    edit: false
  },
  subItems: {
    view: false,
    edit: false,
    delete: false
  },
  pmsJobs: {
    view: false
  },
  findings: {
    view: false
  }
};

@Injectable({
  providedIn: 'root'
})
export class SpecificationDetailsService {
  private accessRights = cloneDeep(DEFAULT_PROJECT_DETAILS_ACCESS_RIGHTS);

  constructor(
    private apiRequestService: ApiRequestService,
    private userRights: UserRightsService
  ) {}

  changeAccessRights(rights: Partial<SpecificationDetailAccessRights>) {
    const currentRights = this.accessRights;
    this.setAccessRights({ ...currentRights, ...rights });
  }

  setupAccessRights(tmDetails: SpecificationDetailsFull) {
    const isEditableStatus = this.isStatusBeforeComplete(tmDetails.task_status);
    const canView = this.hasAccess(eSpecificationAccessActions.viewSpecificationDetail);
    const canEdit = this.hasAccess(eSpecificationAccessActions.editGeneralInformation);
    const canDelete = this.hasAccess(eSpecificationAccessActions.deleteSpecificationDetail);
    const canViewAttachments = this.hasAccess(eSpecificationAccessActions.viewAttachmentsSection);
    const canEditAttachments = isEditableStatus && this.hasAccess(eSpecificationAccessActions.editAttachments);
    const canDeleteAttachments = isEditableStatus && this.hasAccess(eSpecificationAccessActions.deleteAttachments);
    const canAddAttachments = isEditableStatus && this.hasAccess(eSpecificationAccessActions.addAttachments);

    this.setAccessRights({
      view: canView,
      edit: canEdit,
      delete: canDelete,
      generalInformation: {
        view: this.hasAccess(eSpecificationAccessActions.viewGeneralInformationSection)
      },
      attachments: {
        view: canViewAttachments,
        edit: canEditAttachments,
        delete: canDeleteAttachments,
        add: canAddAttachments
      },
      requisitions: {
        view: this.hasAccess(eSpecificationAccessActions.viewRequisitionSection),
        edit: this.hasAccess(eSpecificationAccessActions.editRequisition)
      },
      subItems: {
        view: this.hasAccess(eSpecificationAccessActions.viewSubItemsSection),
        edit: this.hasAccess(eSpecificationAccessActions.editSubItems),
        delete: this.hasAccess(eSpecificationAccessActions.deleteSubItems)
      },
      pmsJobs: {
        view: this.hasAccess(eSpecificationAccessActions.viewPmsJobsTab)
      },
      findings: {
        view: this.hasAccess(eSpecificationAccessActions.viewFindingsSection)
      }
    });

    return this.accessRights;
  }

  getTopSecConfig(details: SpecificationDetailsFull): ITopSectionFieldSet {
    return {
      canEdit: this.accessRights.edit && this.isStatusBeforeComplete(details.StatusId),
      showStatus: true,
      showVessel: true,
      showJobCard: true,
      jobStatus: details.StatusId.toUpperCase(),
      jobStatusDisplayName: details.StatusName,
      typeIconClass: 'icons8-document-4',
      worklistType: details.SpecificationTypeCode,
      worklistDisplayName: details.SpecificationTypeName,
      jobCardNo: details.SpecificationCode,
      vesselName: details.VesselName,
      jobTitle: details.Subject,
      bottomFieldsConfig: [
        {
          id: 'assigneeUid',
          label: 'Assigned To',
          isRequired: false,
          isEditable: false,
          type: eFieldControlType.Dropdown,
          getFieldName: 'ProjectManagerUid',
          saveFieldName: 'ProjectManagerUid',
          controlContent: {
            id: 'assigneeUid',
            value: 'ManagerId',
            label: 'FullName',
            selectedValue: details.ProjectManagerUid,
            selectedLabel: details.ProjectManager,
            apiRequest: this.getProjectsManagersRequest()
          }
        },
        {
          id: 'Duration',
          label: 'Estimated Duration (Days)',
          type: eFieldControlType.Text,
          isRequired: false,
          isEditable: this.accessRights.edit && this.isStatusBeforeComplete(details.StatusId),
          getFieldName: 'Duration',
          saveFieldName: 'Duration',
          controlContent: {
            value: '',
            id: 'Duration',
            type: eFieldControlType.Text,
            pattern: /[0-9]/,
            disabled: false
          }
        },
        {
          id: 'StartDate',
          label: 'Start Date',
          isRequired: true,
          isEditable: this.accessRights.edit && this.isStatusBeforeComplete(details.StatusId),
          type: eFieldControlType.Date,
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
          isRequired: true,
          isEditable: this.accessRights.edit && this.isStatusBeforeComplete(details.StatusId),
          type: eFieldControlType.Date,
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
          id: 'Completion',
          label: 'Percentage Completion',
          type: eFieldControlType.Text,
          isRequired: false,
          isEditable: this.accessRights.edit && this.isStatusBeforeComplete(details.StatusId),
          getFieldName: 'Completion',
          saveFieldName: 'Completion',
          controlContent: {
            value: '',
            id: 'Completion',
            type: eFieldControlType.Text,
            pattern: /[0-9]/,
            disabled: false
          }
        }
      ]
    };
  }

  getSpecificationStepSectionsConfig(details: SpecificationDetailsFull): ITMDetailTabFields {
    return {
      [eSpecificationDetailsPageMenuIds.SpecificationDetails]: {
        id: eSpecificationDetailsPageMenuIds.SpecificationDetails,
        menuDisplayName: eSpecificationDetailsPageMenuLabels.SpecificationDetails,
        menuIcon: '',
        showDiscussion: true,
        isClosedDiscussion: true,
        activeStatus: true,
        index: 1,
        sections: [
          {
            GridRowStart: 1,
            GridRowEnd: 2,
            GridColStart: 1,
            GridColEnd: 3,
            active_status: true,
            SectionCode: eSpecificationDetailsPageMenuIds.GeneralInformation,
            SectionLabel: eSpecificationDetailsPageMenuLabels.GeneralInformation,
            IconClass: 'icons8-more-details-2',
            isAddNewButton: false
          },
          {
            GridRowStart: 2,
            GridRowEnd: 3,
            GridColStart: 1,
            GridColEnd: 3,
            active_status: true,
            SectionCode: eSpecificationDetailsPageMenuIds.SubItems,
            SectionLabel: eSpecificationDetailsPageMenuLabels.SubItems,
            isAddNewButton: true,
            buttonLabel: eSubItemsDialog.AddText
          },
          {
            GridRowStart: 3,
            GridRowEnd: 4,
            GridColStart: 1,
            GridColEnd: 3,
            active_status: true,
            SectionCode: eSpecificationDetailsPageMenuIds.PMSJobs,
            SectionLabel: eSpecificationDetailsPageMenuLabels.PMSJobs,
            isAddNewButton: true,
            buttonLabel: 'Convert to sub item'
          },
          {
            GridRowStart: 4,
            GridRowEnd: 5,
            GridColStart: 1,
            GridColEnd: 3,
            active_status: true,
            SectionCode: eSpecificationDetailsPageMenuIds.Findings,
            SectionLabel: eSpecificationDetailsPageMenuLabels.Findings,
            isAddNewButton: true,
            buttonLabel: 'Convert to sub item'
          },
          ...(this.isInExecutionPhase(details.ProjectStatusId)
            ? [
                {
                  GridRowStart: 5,
                  GridRowEnd: 6,
                  GridColStart: 1,
                  GridColEnd: 3,
                  active_status: true,
                  SectionCode: eSpecificationDetailsPageMenuIds.SpecificationUpdates,
                  SectionLabel: eSpecificationDetailsPageMenuLabels.SpecificationUpdates,
                  isAddNewButton: true,
                  buttonLabel: 'Add Update'
                }
              ]
            : [])
        ]
      }
    };
  }

  public getProjectsManagersRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/projects-managers',
      crud: eCrud.Get
    };
    return apiRequest;
  }

  public getCostUpdates(specificationUid: string) {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'specification-details/sub-items/find-sub-items',
      crud: eCrud.Post,
      body: {
        specificationDetailsUid: specificationUid,
        hideTotal: true
      },
      odata: {
        skip: '0',
        top: '10000000'
      }
    };

    return this.apiRequestService.sendApiReq(apiRequest);
  }

  getSpecificationDetails(specificationUid: string): Observable<SpecificationDetails> {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'specification-details/get-specification-details',
      crud: eCrud.Get,
      params: `uid=${specificationUid}`
    };

    return this.apiRequestService.sendApiReq(request);
  }

  /**
   * @description: Used to update Specification details on a Specification Single Page
   **/
  updateSpecification(data: UpdateSpecificationDetailsDto): Observable<string> {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'specification-details/update-specification-details',
      crud: eCrud.Put,
      body: data
    };
    return this.apiRequestService.sendApiReq(request);
  }

  public getPriorityRequest() {
    const apiRequest: WebApiRequest = {
      apiBase: eApiBase.MasterAPI,
      entity: eEntities.Library,
      action: 'get-library-data-by-code',
      params: `libraryCode=Urgencys`,
      crud: eCrud.Post,
      odata: {
        count: 'false',
        filter: f().eq('active_status', true)
      }
    };
    return apiRequest;
  }

  public getItemSourceRequest() {
    const apiRequest: WebApiRequest = {
      apiBase: eApiBase.MasterAPI,
      entity: eEntities.Library,
      action: 'get-library-data-by-code',
      params: `libraryCode=itemSource`,
      crud: eCrud.Post,
      odata: {
        count: 'false',
        filter: f().eq('active_status', true)
      }
    };
    return apiRequest;
  }

  public getLibraryDataRequest(libraryCode: string) {
    const apiRequest: WebApiRequest = {
      apiBase: eApiBase.MasterAPI,
      entity: eEntities.Library,
      action: 'get-library-data-by-code',
      params: `libraryCode=${libraryCode}`,
      crud: eCrud.Post,
      odata: {
        count: 'false',
        filter: f().eq('active_status', true)
      }
    };
    return apiRequest;
  }

  public getStandardJobsFiltersRequest(fieldName: eSpecificationDetailsGeneralInformationFields) {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'standard-jobs/get-standard-jobs-filters',
      crud: eCrud.Post,
      body: {
        key: fieldName
      }
    };
    return apiRequest;
  }

  deleteSpecification(data: { uid: string }) {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'specification-details/delete-specification-details',
      crud: eCrud.Put,
      body: data
    };
    return this.apiRequestService.sendApiReq(request);
  }

  deleteSpecificationRequisition(specificationUid: string, requisitionUid: string) {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'specification-details/delete-specification-requisition',
      crud: eCrud.Post,
      body: {
        specificationUid,
        requisitionUid
      }
    };

    return this.apiRequestService.sendApiReq(request);
  }

  createSpecificationFromStandardJob(ProjectUid: string, StandardJobUid: string[]) {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'specification-details/create-specification-from-standard-job',
      crud: eCrud.Post,
      body: {
        ProjectUid,
        StandardJobUid
      }
    };
    return this.apiRequestService.sendApiReq(request);
  }

  isInExecutionPhase(projectStatus: string) {
    return (
      !this.areStatusesSame(projectStatus, eProjectWorkflowStatusAction.Raise) &&
      !this.areStatusesSame(projectStatus, eProjectWorkflowStatusAction['In Progress'])
    );
  }

  isStatusBeforeComplete(status: string) {
    return (
      this.areStatusesSame(status, eSpecificationWorkflowStatusAction.Raise) ||
      this.areStatusesSame(status, eSpecificationWorkflowStatusAction['In Progress'])
    );
  }

  areStatusesSame(status: string, statusToCompare: string): boolean {
    return (status ?? '').toLowerCase() === statusToCompare.toLowerCase();
  }

  hasAccess(action: string, module = eModule.Project, func = eFunction.SpecificationDetails) {
    return !!this.userRights.getUserRights(module, func, action);
  }

  public validatePmsJobDeletion(pmsJobUid: string, specificationUid: string): Observable<boolean> {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'specification-details/sub-items/validate-pms-job-deletion',
      crud: eCrud.Post,
      body: {
        pmsJobUid,
        specificationUid
      }
    };

    return this.apiRequestService.sendApiReq(request);
  }

  public validateFindingDeletion(findingUid: string, specificationUid: string): Observable<boolean> {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'specification-details/sub-items/validate-finding-deletion',
      crud: eCrud.Post,
      body: {
        findingUid,
        specificationUid
      }
    };

    return this.apiRequestService.sendApiReq(request);
  }

  getSpecificationUpdatesRequest(specificationUid: string): WebApiRequest {
    return {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/job-orders/get-updates',
      crud: eCrud.Post,
      body: { uid: specificationUid }
    };
  }

  private setAccessRights(rights: SpecificationDetailAccessRights) {
    this.accessRights = rights;
  }
}
