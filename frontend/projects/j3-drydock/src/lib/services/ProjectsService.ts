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

  public getProjectTypesRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'projects/project-types',
      crud: eCrud.Get,
      entity: 'drydock'
    };
    return apiRequest;
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

  public getProjectsShipsYardsRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'projects/projects-ships-yards',
      crud: eCrud.Get,
      entity: 'drydock'
    };
    return apiRequest;
  }

  public getProjectStatusesRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'projects/projects-statuses',
      crud: eCrud.Get,
      entity: 'drydock'
    };
    return apiRequest;
  }
}
