import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud, eEntities } from 'jibe-components';
import { Observable } from 'rxjs';
import { IUpdateJobOrderDto } from './IUpdateJobOrderDto';
import { KeyValuePair } from '../../../utils/KeyValuePair';
import { GetJobOrderByUidDto } from './GetJobOrderByUidDto';
import { JobOrderDto } from './JobOrderDto';
import { IUpdateJobOrderDurationDto } from './IUpdateJobOrderDurationDto';
import { eApiBaseDryDockAPI } from '../../../models/constants/constants';
import ODataFilterBuilder from 'odata-filter-builder';
import moment from 'moment';

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
    const startOfDay = moment().utcOffset(0, true).startOf('day').toISOString();
    const endOfDay = moment().utcOffset(0, true).endOf('day').toISOString();
    const filter = ODataFilterBuilder('and');
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/job-orders/get-updates',
      crud: eCrud.Post,
      odata: {
        filter: filter.ge('CreatedAt', startOfDay).le('CreatedAt', endOfDay)
      }
    };

    return request;
  }

  getJobOrderBySpecificationUidRequest(getJobOrderBySpecificationDto: GetJobOrderByUidDto): WebApiRequest {
    return {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/job-orders/get-job-order-by-specification-uid',
      crud: eCrud.Post,
      body: getJobOrderBySpecificationDto
    };
  }

  getAllJobOrdersBySpecificationUidRequest(getJobOrderBySpecificationDto: GetJobOrderByUidDto): WebApiRequest {
    return {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'projects/job-orders/get-all-job-orders-by-specification-uid',
      crud: eCrud.Post,
      body: getJobOrderBySpecificationDto
    };
  }

  getJobOrderBySpecificationUid(getJobOrderByUidDto: GetJobOrderByUidDto): Observable<JobOrderDto> {
    return this.apiRequestService.sendApiReq(this.getJobOrderBySpecificationUidRequest(getJobOrderByUidDto));
  }

  getAllJobOrdersBySpecificationUid(getJobOrderByUidDto: GetJobOrderByUidDto): Observable<JobOrderDto[]> {
    return this.apiRequestService.sendApiReq(this.getAllJobOrdersBySpecificationUidRequest(getJobOrderByUidDto));
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
