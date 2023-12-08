import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud } from 'jibe-components';
import { IGetBySpecificationDto } from './IGetBySpecificationDto';
import { Observable } from 'rxjs';
import { IGetBySpecificationResponseDto } from './IGetBySpecificationResponseDto';
import { IUpdateJobOrderDto } from './IUpdateJobOrderDto';
import { KeyValuePair } from '../../../utils/KeyValuePair';
@Injectable({
  providedIn: 'root'
})
export class JobOrdersService {
  constructor(private apiRequestService: ApiRequestService) {}

  getJobOrdersRequest(): WebApiRequest {
    const request: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      // entity: eEntities.DryDock,
      // action: eAction.GetSpecificationDetails,
      apiBase: 'dryDockAPI',
      action: 'projects/job-orders/get-job-orders',
      crud: eCrud.Post,
      entity: 'drydock'
    };

    return request;
  }

  getJobOrderStatusesRequest(): WebApiRequest {
    const request: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      // entity: eEntities.DryDock,
      // action: eAction.GetSpecificationDetails,
      apiBase: 'dryDockAPI',
      action: 'projects/job-orders/get-job-order-by-specification',
      crud: eCrud.Get,
      entity: 'drydock'
    };

    return request;
  }

  getJobOrderStatuses(): Observable<KeyValuePair<string, string>[]> {
    return this.apiRequestService.sendApiReq(this.getJobOrderStatusesRequest());
  }

  updateJobOrderRequest(updateStatementOfFact: IUpdateJobOrderDto): WebApiRequest {
    const request: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      // entity: eEntities.DryDock,
      // action: eAction.GetSpecificationDetails,
      apiBase: 'dryDockAPI',
      action: 'projects/job-orders/update-job-order',
      crud: eCrud.Post,
      entity: 'drydock',
      body: updateStatementOfFact
    };

    return request;
  }

  updateJobOrder(updateJobOrder: IUpdateJobOrderDto): Observable<void> {
    return this.apiRequestService.sendApiReq(this.updateJobOrderRequest(updateJobOrder));
  }
}
