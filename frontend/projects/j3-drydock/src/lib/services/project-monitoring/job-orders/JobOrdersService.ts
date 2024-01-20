import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud, eEntities } from 'jibe-components';
import { Observable } from 'rxjs';
import { IUpdateJobOrderDto } from './IUpdateJobOrderDto';
import { KeyValuePair } from '../../../utils/KeyValuePair';
import { GetJobOrderBySpecificationDto } from './GetJobOrderBySpecificationDto';
import { JobOrderDto } from './JobOrderDto';
import { IUpdateJobOrderDurationDto } from './IUpdateJobOrderDurationDto';
import { eApiBaseDryDockAPI } from '../../../models/constants/constants';
@Injectable({
  providedIn: 'root'
})
export class JobOrdersService {
  constructor(private apiRequestService: ApiRequestService) {}

  getJobOrdersRequest(): WebApiRequest {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/job-orders/get-job-orders',
      crud: eCrud.Post
    };

    return request;
  }

  getJobOrdersUpdatesRequest(): WebApiRequest {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/job-orders/get-updates',
      crud: eCrud.Post
    };

    return request;
  }

  getJobOrderBySpecificationRequest(getJobOrderBySpecificationDto: GetJobOrderBySpecificationDto): WebApiRequest {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/job-orders/get-job-order-by-specification',
      crud: eCrud.Post,
      body: getJobOrderBySpecificationDto
    };

    return request;
  }

  getJobOrderBySpecification(getJobOrderBySpecificationDto: GetJobOrderBySpecificationDto): Observable<JobOrderDto> {
    return this.apiRequestService.sendApiReq(this.getJobOrderBySpecificationRequest(getJobOrderBySpecificationDto));
  }

  getJobOrderStatusesRequest(): WebApiRequest {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/job-orders/get-job-order-statuses',
      crud: eCrud.Get
    };

    return request;
  }

  getJobOrderStatuses(): Observable<KeyValuePair<string, string>[]> {
    return this.apiRequestService.sendApiReq(this.getJobOrderStatusesRequest());
  }

  updateJobOrderRequest(updateStatementOfFact: IUpdateJobOrderDto): WebApiRequest {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/job-orders/update-job-order',
      crud: eCrud.Post,
      body: updateStatementOfFact
    };

    return request;
  }

  updateJobOrder(updateJobOrder: IUpdateJobOrderDto): Observable<void> {
    return this.apiRequestService.sendApiReq(this.updateJobOrderRequest(updateJobOrder));
  }

  updateJobOrderDurationRequest(updateJobOrderDurationDto: IUpdateJobOrderDurationDto): WebApiRequest {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/job-orders/update-job-order-duration',
      crud: eCrud.Post,
      body: updateJobOrderDurationDto
    };

    return request;
  }

  updateJobOrderDuration(updateJobOrderDurationDto: IUpdateJobOrderDurationDto): Observable<void> {
    return this.apiRequestService.sendApiReq(this.updateJobOrderDurationRequest(updateJobOrderDurationDto));
  }
}
