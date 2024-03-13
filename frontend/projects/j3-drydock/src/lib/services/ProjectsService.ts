/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ApiRequestService, eCrud, eEntities, UserRightsService, WebApiRequest } from 'jibe-components';
import { Observable } from 'rxjs';
import { ProjectCreate, ProjectEdit } from '../models/interfaces/projects';
import { IGroupProjectStatusesDto } from './dtos/IGroupProjectStatusesDto';
import { IProjectStatusDto } from './dtos/IProjectStatusDto';
import { eModule } from '../models/enums/module.enum';
import { eFunction } from '../models/enums/function.enum';
import { eProjectsAccessActions } from '../models/enums/access-actions.enum';
import { FileService } from './file.service';
import { UpdateCostsDto } from '../models/dto/specification-details/ISpecificationCostUpdateDto';
import { eApiBaseDryDockAPI } from '../models/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  constructor(
    private apiRequestService: ApiRequestService,
    private api: FileService,
    private userRights: UserRightsService
  ) {}

  public getProjectsForMainPageGridRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/get-projects-for-main-page',
      crud: eCrud.Post
    };
    return apiRequest;
  }

  public getProjectTypesRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/project-types',
      crud: eCrud.Get
    };
    return apiRequest;
  }

  public getProjectsManagersRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/projects-managers',
      crud: eCrud.Get
    };
    return apiRequest;
  }

  public getProjectsManagersDictionariesRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'dictionaries/managers',
      crud: eCrud.Get
    };
    return apiRequest;
  }

  public getProjectsShipsYardsRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/projects-ships-yards',
      crud: eCrud.Get
    };
    return apiRequest;
  }

  public getProjectStatusesRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/projects-statuses',
      crud: eCrud.Get
    };
    return apiRequest;
  }

  public getProjectStatuses(): Observable<IProjectStatusDto[]> {
    const apiRequest = this.getProjectStatusesRequest();

    return this.apiRequestService.sendApiReq(apiRequest);
  }

  public getFleetsRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'dictionaries/fleets',
      crud: eCrud.Get
    };

    return apiRequest;
  }

  public createProject(data: ProjectCreate): Observable<any> {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/create-project',
      crud: eCrud.Post,
      body: data
    };

    return this.apiRequestService.sendApiReq(apiRequest);
  }

  public updateProject(data: ProjectEdit): Observable<any> {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/update-project',
      crud: eCrud.Put,
      body: data
    };

    return this.apiRequestService.sendApiReq(apiRequest);
  }

  public updateCosts(data: UpdateCostsDto): Observable<any> {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'specification-details/sub-items/update-sub-item-utilized',
      crud: eCrud.Put,
      body: data
    };

    return this.apiRequestService.sendApiReq(apiRequest);
  }

  public getProject(projectId: string) {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      crud: eCrud.Get,
      action: 'projects/get-project',
      params: `uid=${projectId}`
    };

    return this.apiRequestService.sendApiReq(apiRequest);
  }

  public deleteProject(projectUid: string): Observable<any> {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/delete-project',
      crud: eCrud.Post,
      body: {
        ProjectId: projectUid
      }
    };

    return this.apiRequestService.sendApiReq(apiRequest);
  }

  public groupProjectStatusesLabels(): Observable<{ [key: string]: IGroupProjectStatusesDto }> {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/group-project-statuses-async',
      crud: eCrud.Get
    };

    return this.apiRequestService.sendApiReq(apiRequest);
  }

  public groupProjectStatusesCounts(): Observable<{ [key: string]: IGroupProjectStatusesDto }> {
    const apiRequest: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/group-project-statuses',
      crud: eCrud.Get
    };

    return this.apiRequestService.sendApiReq(apiRequest);
  }

  public hasAccess(action: eProjectsAccessActions, func = eFunction.DryDock): boolean {
    return !!this.userRights.getUserRights(eModule.Project, func, action);
  }

  exportExcel(projectId: string, yardId: string): Observable<Blob> {
    return this.api.getFile('yards/download-yard-invoice', `ProjectUid=${projectId}&YardUid=${yardId}`, null, null, eApiBaseDryDockAPI);
  }

  public importFile(file: File, projectId: string): Observable<object> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ProjectUid', projectId);
    return this.api.postFile(formData, 'yards/upload-yard-invoice', null, 'dryDockAPI');
  }
}
