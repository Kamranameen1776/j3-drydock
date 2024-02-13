import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud, eEntities } from 'jibe-components';
import { of } from 'rxjs';
import { eApiBaseDryDockAPI } from '../models/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ProjectTemplatesService {
  constructor(private apiRequestService: ApiRequestService) {}
  // TODO add implementation
  delete(uid: string) {
    return of(null);
  }

  getGridRequest() {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'project-templates/project-templates-grid',
      crud: eCrud.Post
    };
    return apiRequest;
  }
}
