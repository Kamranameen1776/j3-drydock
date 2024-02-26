import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud, eEntities } from 'jibe-components';
import { eApiBaseDryDockAPI } from '../models/constants/constants';
import { localAsUTC } from '../utils/date';
import f from 'odata-filter-builder';
import { map } from 'rxjs/operators';
export interface ProjectTemplatePayload {
  ProjectTemplateUid: string;
  Subject: string;
  Description: string;
  VesselTypeSpecific: 0 | 1;
  VesselTypeId: string;
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

  delete(uid: string) {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'project-templates/delete-project-template',
      crud: eCrud.Put,
      body: {
        ProjectTemplateUid: uid
      }
    };
    return this.apiRequestService.sendApiReq(apiRequest);
  }

  getTemplate(uid: string) {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'project-templates/get-project-template',
      crud: eCrud.Get,
      params: `projectTemplateUid=${uid}`
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
        orderby: 'TemplateCode asc'
      }
    };
    return apiRequest;
  }

  getPopupGridRequest() {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'project-templates/project-templates-grid',
      crud: eCrud.Post,
      odata: {
        orderby: 'TemplateCode asc',
        filter: f().ne('NoOfSpecItems', 0)
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

  getProjectTemplateStandardJobs(projectTemplateUid: string) {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'project-templates/project-template-standard-jobs-grid',
      crud: eCrud.Post,
      odata: {
        skip: '0',
        top: '10000000',
        filter: f().eq('ProjectTemplateUid', projectTemplateUid)
      }
    };
    return this.apiRequestService.sendApiReq(request).pipe(
      map((resp) => {
        return resp?.records;
      })
    );
  }
}
