import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud } from 'jibe-components';
@Injectable({
  providedIn: 'root'
})
export class StatementOfFactsService {
  constructor(private apiRequestService: ApiRequestService) {}

  getStatementOfFactsRequest(projectUid: string): WebApiRequest {
    const request: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      // entity: eEntities.DryDock,
      // action: eAction.GetSpecificationDetails,
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      action: 'project-monitoring/statement-of-facts/get-statement-of-facts',
      crud: eCrud.Get,
      params: `uid=${projectUid}`
    };

    return request;
  }
}
