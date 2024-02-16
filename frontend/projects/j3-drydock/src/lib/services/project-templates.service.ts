import { Injectable } from '@angular/core';
import { ApiRequestService, UserService, WebApiRequest, eCrud, eEntities } from 'jibe-components';
import { eApiBaseDryDockAPI } from '../models/constants/constants';
import { localAsUTC } from '../utils/date';
import f from 'odata-filter-builder';
export interface ProjectTemplatePayload {
  ProjectTemplateUid: string;
  Subject: string;
  Description: string;
  VesselTypeUid: string;
  ProjectTypeUid: string;
  StandardJobs: string[];
}

export interface ProjectTemplateCreate extends ProjectTemplatePayload {
  CreatedAt: string;
}

export interface ProjectTemplateUpdate extends ProjectTemplatePayload {
  LastUpdated: string;
}


@Injectable({
  providedIn: 'root'
})
export class ProjectTemplatesService {
  constructor(private apiRequestService: ApiRequestService) {}
  // TODO why need DeletedBy?
  delete(uid: string) {
    const userDetails = UserService.getUserDetails();
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'project-templates/delete-project-template',
      crud: eCrud.Put,
      body: {
        ProjectTemplateUid: uid,
        DeletedBy: userDetails?.UserID
      }
    };
    return this.apiRequestService.sendApiReq(apiRequest);
  }

  upsertProjectTemplate(payload: ProjectTemplatePayload, isEditing: boolean) {
    const nowIsoDate = localAsUTC(new Date());
    if (isEditing) {
      return this.update({ ...payload, LastUpdated: nowIsoDate });
    }
    return this.create({ ...payload, CreatedAt: nowIsoDate });
  }

  create(projectTemplate: ProjectTemplateCreate) {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'project-templates/create-project-template',
      crud: eCrud.Post,
      body: {
        ...projectTemplate
      }
    };
    return this.apiRequestService.sendApiReq(apiRequest);
  }

  update(projectTemplate: ProjectTemplateUpdate) {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'project-templates/update-project-template',
      crud: eCrud.Put,
      body: {
        ...projectTemplate
      }
    };
    return this.apiRequestService.sendApiReq(apiRequest);
  }

  getGridRequest() {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'project-templates/project-templates-grid',
      crud: eCrud.Post,
      odata: {
        orderby: 'TemplateCode asc',
        filter: f().eq('NoOfSpecItems', 0)
      }
    };
    return apiRequest;
  }

  createSpecificationFromProjectTemplate(ProjectUid: string, ProjectTemplateUid: string) {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'specification-details/create-specification-from-project-template',
      crud: eCrud.Post,
      body: {
        ProjectUid,
        ProjectTemplateUid
      }
    };
    return this.apiRequestService.sendApiReq(request);
  }
}
