import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud, eEntities } from 'jibe-components';
import { of } from 'rxjs';
import { eApiBaseDryDockAPI } from '../models/constants/constants';

export interface ProjectTemplateCreate {
  Subject: string;
  Description: string;
  VesselTypeUid: string;
  ProjectTypeUid: string;
  StandardJobs: string[];
  CreatedAt: string;
}

export interface ProjectTemplateUpdate {
  ProjectTemplateUid: string;
  Subject: string;
  Description: string;
  VesselTypeUid: string;
  ProjectTypeUid: string;
  StandardJobs: string[];
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  upsertProjectTemplate(uid: string, value: any, isEditing: boolean, jobsUids: string[]) {
    return of(null);
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
