import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud } from 'jibe-components';

@Injectable({ providedIn: 'root' })
export class StandardJobsService {
  constructor(private apiRequestService: ApiRequestService) {}
  // TODO
  public getStandardJobsRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'standard-jobs',
      crud: eCrud.Post,
      entity: 'drydock'
    };
    return apiRequest;
  }
}
