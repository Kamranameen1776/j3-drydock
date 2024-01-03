import { Injectable } from '@angular/core';
import { ApiRequestService, Datasource, WebApiRequest, eApiBase, eCrud, eDropdownLabels, eEntities, eFilterStatus } from 'jibe-components';
import f from 'odata-filter-builder';

@Injectable({
  providedIn: 'root'
})
export class FleetService {
  constructor(private apiReqService: ApiRequestService) {}

  getFleets(isEditable?: boolean) {
    const fleetReq: WebApiRequest = {
      crud: eCrud.Get,
      entity: eEntities.Master,
      apiBase: eApiBase.MasterAPI,
      params: `dataSourceName=${Datasource.Fleets}&isslfapplied=true&isslfsession=true&isEditable=${isEditable}`,
      action: 'datasource/getDatasource',
      odata: {
        filter: f().eq('Active_Status', eFilterStatus.ActiveStatus),
        orderby: eDropdownLabels.FleetLabel
      }
    };
    return this.apiReqService.sendApiReq(fleetReq);
  }
}
