import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud } from 'jibe-components';
import { CreateExampleProject, CreateExampleProjectResult } from '../models/interfaces/example-projects';

@Injectable()
export class ExampleProjectsService {
  constructor(private apiRequestService: ApiRequestService) {}

  public getExampleProjectsRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'example-projects',
      crud: eCrud.Post,
      entity: 'drydock'
    };
    return apiRequest;
  }

  public async createNewExampleProject(dto: CreateExampleProject): Promise<CreateExampleProjectResult> {
    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'example-projects',
      crud: eCrud.Put,
      entity: 'drydock',
      body: dto
    };
    return await this.apiRequestService.sendApiReq(apiRequest).toPromise();
  }
}
