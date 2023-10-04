import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud } from 'jibe-components';

@Injectable()
export class ProjectsService {
  constructor(private apiRequestService: ApiRequestService) {}

  public getProjectsForMainPageGridRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'projects/get-projects-for-main-page',
      crud: eCrud.Post,
      entity: 'drydock'
    };
    return apiRequest;
  }
}
