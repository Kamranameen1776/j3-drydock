import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud } from 'jibe-components';
import { CreateNewExampleProjectDto } from './dtos/CreateNewExampleProjectDto';
import { CreateNewExampleProjectResultDto } from './dtos/CreateNewExampleProjectResultDto';

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

  public async createNewExampleProject(dto: CreateNewExampleProjectDto): Promise<CreateNewExampleProjectResultDto> {
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
