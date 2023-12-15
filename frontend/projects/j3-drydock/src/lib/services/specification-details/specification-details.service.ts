import { Injectable } from '@angular/core';
import {
  ApiRequestService,
  ITopSectionFieldSet,
  JbButtonType,
  UserRightsService,
  WebApiRequest,
  eApiBase,
  eCrud,
  eEntities
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
export interface SpecificationDetailAccessRights extends BaseAccessRight {
  attachments: BaseAccessRight & { add: boolean };
}

export const DEFAULT_PROJECT_DETAILS_ACCESS_RIGHTS: SpecificationDetailAccessRights = {
  view: false,
  edit: false,
  delete: false,
  attachments: {
    view: false,
    edit: false,
    delete: false,
    add: false
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
    const canView = this.hasAccess('View');
    const canEdit = this.hasAccess('Edit');
    const canDelete = this.hasAccess('Delete');
    const canViewAttachments = isEditableStatus && this.hasAccess('view_attachment');
    const canEditAttachments = isEditableStatus && this.hasAccess('edit_attachment');
    const canDeleteAttachments = isEditableStatus && this.hasAccess('delete_attachment');
    const canAddAttachments = isEditableStatus && this.hasAccess('add_attachment');

    this.setAccessRights({
      view: canView,
      edit: canEdit,
      delete: canDelete,
      attachments: {
        view: canViewAttachments,
        edit: canEditAttachments,
        delete: canDeleteAttachments,
        add: canAddAttachments
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
          type: 'dropdown',
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
        }
      ]
    };
  }

  getSpecificationStepSectionsConfig(): ITMDetailTabFields {
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
            isAddNewButton: false
          },
          {
            GridRowStart: 3,
            GridRowEnd: 4,
            GridColStart: 1,
            GridColEnd: 3,
            active_status: true,
            SectionCode: eSpecificationDetailsPageMenuIds.Requisitions,
            SectionLabel: eSpecificationDetailsPageMenuLabels.Requisitions,
            isAddNewButton: true,
            buttonLabel: 'Link Requisitions',
            addNewButtonType: JbButtonType.NoButton
          }
        ]
      }
    };
  }

  public getProjectsManagersRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'projects/projects-managers',
      crud: eCrud.Get,
      entity: 'drydock'
    };
    return apiRequest;
  }

  getSpecificationDetails(specificationUid: string): Observable<SpecificationDetails> {
    const request: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      // entity: eEntities.DryDock,
      // action: eAction.GetSpecificationDetails,
      apiBase: 'dryDockAPI',
      entity: 'drydock',
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
      apiBase: 'dryDockAPI',
      entity: 'drydock',
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
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'standard-jobs/get-standard-jobs-filters',
      crud: eCrud.Post,
      entity: 'drydock',
      body: {
        key: fieldName
      }
    };
    return apiRequest;
  }

  deleteSpecification(data: { uid: string }) {
    const request: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      action: 'specification-details/delete-specification-details',
      crud: eCrud.Put,
      body: data
    };
    return this.apiRequestService.sendApiReq(request);
  }

  deleteSpecificationRequisition(specificationUid: string, requisitionUid: string) {
    const request: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
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
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      action: 'specification-details/create-specification-from-standard-job',
      crud: eCrud.Post,
      body: {
        ProjectUid,
        StandardJobUid
      }
    };
    return this.apiRequestService.sendApiReq(request);
  }

  isStatusBeforeComplete(status: string) {
    return (
      this.areStatusesSame(status, eSpecificationWorkflowStatusAction.Raise) ||
      this.areStatusesSame(status, eSpecificationWorkflowStatusAction['In Progress'])
    );
  }

  areStatusesSame(status: string, statusToCompare: string): boolean {
    return status.toLowerCase() === statusToCompare.toLowerCase();
  }

  hasAccess(action: string, module = eModule.Project, func = eFunction.SpecificationDetails) {
    return true || !!this.userRights.getUserRights(module, func, action);
  }

  private setAccessRights(rights: SpecificationDetailAccessRights) {
    this.accessRights = rights;
  }
}
