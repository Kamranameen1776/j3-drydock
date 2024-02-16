import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud, eEntities } from 'jibe-components';
import { of } from 'rxjs';
import { eApiBaseDryDockAPI } from '../models/constants/constants';
import f from 'odata-filter-builder';

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

  getGridRequest() {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'project-templates/project-templates-grid',
      crud: eCrud.Post,
      odata: {
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
