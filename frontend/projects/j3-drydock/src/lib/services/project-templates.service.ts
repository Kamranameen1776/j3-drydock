import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud, eEntities } from 'jibe-components';
import { of } from 'rxjs';
import { eApiBaseDryDockAPI } from '../models/constants/constants';
import { localAsUTC } from '../utils/date';

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
  // TODO add implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(uid: string) {
    return of(null);
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
}
