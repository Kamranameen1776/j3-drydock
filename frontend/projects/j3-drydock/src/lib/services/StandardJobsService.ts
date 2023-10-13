import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eApiBase, eCrud, eEntities, eJMSFilterDataKeys } from 'jibe-components';
import { ODataFilterBuilder } from 'odata-filter-builder';

@Injectable({ providedIn: 'root' })
export class StandardJobsService {
  constructor(private apiRequestService: ApiRequestService) {}
  // TODO
  public getStandardJobsRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'standard-jobs/get-standard-jobs',
      crud: eCrud.Post,
      entity: 'drydock'
    };
    return apiRequest;
  }

  public getVesselTypesRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      apiBase: eApiBase.MasterAPI,
      entity: eEntities.Master,
      crud: eCrud.Get,
      action: 'datasource/getDatasource',
      params: 'dataSourceName=vessel_type',
      odata: {
        filter: ODataFilterBuilder().eq(eJMSFilterDataKeys.ActiveStatus, 1)
      }
    };
    return apiRequest;
  }
  // TODO check it ( taken form RaisedBY )
  getDoneByRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      apiBase: eApiBase.MasterAPI,
      entity: eEntities.Master,
      crud: eCrud.Get,
      action: 'datasource/getDatasource',
      params: 'dataSourceName=jms_assigner',
      odata: {
        filter: ODataFilterBuilder().eq(eJMSFilterDataKeys.ActiveStatus, 1),
        orderby: 'VALUE'
      }
    };
    return apiRequest;
  }
}
