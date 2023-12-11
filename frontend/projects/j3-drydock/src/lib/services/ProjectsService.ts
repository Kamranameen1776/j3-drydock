/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ApiRequestService, eCrud, UserRightsService, WebApiRequest } from 'jibe-components';
import { Observable } from 'rxjs';
import { ProjectCreate, ProjectEdit } from '../models/interfaces/projects';
import { IGroupProjectStatusesDto } from './dtos/IGroupProjectStatusesDto';
import { IProjectStatusDto } from './dtos/IProjectStatusDto';
import { eModule } from '../models/enums/module.enum';
import { eFunction } from '../models/enums/function.enum';
import { eProjectsAccessActions } from '../models/enums/access-actions.enum';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  constructor(
    private apiRequestService: ApiRequestService,
    private userRights: UserRightsService
  ) {}

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

  public getProjectsManagersDictionariesRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'dictionaries/managers',
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

  public getProjectStatuses(): Observable<IProjectStatusDto> {
    const apiRequest = this.getProjectStatusesRequest();

    return this.apiRequestService.sendApiReq(apiRequest);
  }

  public getFleetsRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      apiBase: 'dryDockAPI',
      action: 'dictionaries/fleets',
      crud: eCrud.Get,
      entity: 'drydock'
    };

    return apiRequest;
  }

  public createProject(data: ProjectCreate): Observable<any> {
    const apiRequest: WebApiRequest = {
      apiBase: 'dryDockAPI',
      action: 'projects/create-project',
      crud: eCrud.Post,
      entity: 'drydock',
      body: data
    };

    return this.apiRequestService.sendApiReq(apiRequest);
  }

  public updateProject(data: ProjectEdit): Observable<any> {
    const apiRequest: WebApiRequest = {
      apiBase: 'dryDockAPI',
      action: 'projects/update-project',
      crud: eCrud.Put,
      entity: 'drydock',
      body: data
    };

    return this.apiRequestService.sendApiReq(apiRequest);
  }

  public getProject(projectId: string) {
    const apiRequest: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      crud: eCrud.Get,
      action: 'projects/get-project',
      params: `uid=${projectId}`
    };

    return this.apiRequestService.sendApiReq(apiRequest);
  }

  public deleteProject(projectUid: string): Observable<any> {
    const apiRequest: WebApiRequest = {
      apiBase: 'dryDockAPI',
      action: 'projects/delete-project',
      crud: eCrud.Post,
      entity: 'drydock',
      body: {
        ProjectId: projectUid
      }
    };

    return this.apiRequestService.sendApiReq(apiRequest);
  }

  public groupProjectStatuses(): Observable<IGroupProjectStatusesDto[]> {
    const apiRequest: WebApiRequest = {
      apiBase: 'dryDockAPI',
      action: 'projects/group-project-statuses',
      crud: eCrud.Get,
      entity: 'drydock'
    };

    return this.apiRequestService.sendApiReq(apiRequest);
  }

  public hasAccess(action: eProjectsAccessActions, func = eFunction.DryDock): boolean {
    return !!this.userRights.getUserRights(eModule.Project, func, action);
  }
}
