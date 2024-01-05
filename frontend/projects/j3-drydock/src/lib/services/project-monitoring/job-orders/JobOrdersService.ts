import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud } from 'jibe-components';
import { Observable } from 'rxjs';
import { IUpdateJobOrderDto } from './IUpdateJobOrderDto';
import { KeyValuePair } from '../../../utils/KeyValuePair';
import { GetJobOrderBySpecificationDto } from './GetJobOrderBySpecificationDto';
import { JobOrderDto } from './JobOrderDto';
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

  getAllJobOrdersRequest(): WebApiRequest {
    const request: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      // entity: eEntities.DryDock,
      // action: eAction.GetSpecificationDetails,
      apiBase: 'dryDockAPI',
      action: 'projects/job-orders/get-all-job-orders',
      crud: eCrud.Post,
      entity: 'drydock'
    };

    return request;
  }

  getJobOrdersUpdatesRequest(): WebApiRequest {
    const request: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      // entity: eEntities.DryDock,
      // action: eAction.GetSpecificationDetails,
      apiBase: 'dryDockAPI',
      action: 'projects/job-orders/get-updates',
      crud: eCrud.Post,
      entity: 'drydock'
    };

    return request;
  }

  getJobOrderBySpecificationRequest(getJobOrderBySpecificationDto: GetJobOrderBySpecificationDto): WebApiRequest {
    const request: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      // entity: eEntities.DryDock,
      // action: eAction.GetSpecificationDetails,
      apiBase: 'dryDockAPI',
      action: 'projects/job-orders/get-job-order-by-specification',
      crud: eCrud.Post,
      entity: 'drydock',
      body: getJobOrderBySpecificationDto
    };

    return request;
  }

  getJobOrderBySpecification(getJobOrderBySpecificationDto: GetJobOrderBySpecificationDto): Observable<JobOrderDto> {
    return this.apiRequestService.sendApiReq(this.getJobOrderBySpecificationRequest(getJobOrderBySpecificationDto));
  }

  getJobOrderStatusesRequest(): WebApiRequest {
    const request: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      // entity: eEntities.DryDock,
      // action: eAction.GetSpecificationDetails,
      apiBase: 'dryDockAPI',
      action: 'projects/job-orders/get-job-order-statuses',
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
