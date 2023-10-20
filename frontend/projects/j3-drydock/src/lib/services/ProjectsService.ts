import { Injectable } from '@angular/core';
import { ApiRequestService, eCrud, WebApiRequest } from 'jibe-components';
import { Observable } from "rxjs";
import { ProjectCreate } from "../models/interfaces/projects";

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
      action: 'dictionaries/project-types',
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

  public getFleetsRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      apiBase: 'dryDockAPI',
      action: 'dictionaries/fleets',
      crud: eCrud.Get,
      entity: 'drydock'
    }

    return apiRequest;
  }

  public getVesselsRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      apiBase: 'dryDockAPI',
      action: 'dictionaries/vessels',
      crud: eCrud.Get,
      entity: 'drydock'
    }

    return apiRequest;
  }

  public createProject(data: ProjectCreate): Observable<any> {
    const apiRequest: WebApiRequest = {
      apiBase: 'dryDockAPI',
      action: 'projects/create-project',
      crud: eCrud.Post,
      entity: 'drydock',
      body: data,
    }

    return this.apiRequestService.sendApiReq(apiRequest);
  }
}
