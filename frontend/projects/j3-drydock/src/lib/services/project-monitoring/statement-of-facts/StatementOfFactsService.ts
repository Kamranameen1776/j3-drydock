import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud } from 'jibe-components';
import { IDeleteStatementOfFactDto } from './IDeleteStatementOfFactDto';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StatementOfFactsService {
  constructor(private apiRequestService: ApiRequestService) {}

  getStatementOfFactsRequest(): WebApiRequest {
    const request: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      // entity: eEntities.DryDock,
      // action: eAction.GetSpecificationDetails,
      apiBase: 'dryDockAPI',
      action: 'statement-of-facts/get-statement-of-facts',
      crud: eCrud.Post,
      entity: 'drydock'
    };

    return request;
  }

  deleteStatementOfFactRequest(deleteStatementOfFact: IDeleteStatementOfFactDto): WebApiRequest {
    const request: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      // entity: eEntities.DryDock,
      // action: eAction.GetSpecificationDetails,
      apiBase: 'dryDockAPI',
      action: 'statement-of-facts/delete-statement-of-fact',
      crud: eCrud.Post,
      entity: 'drydock',
      body: deleteStatementOfFact
    };

    return request;
  }

  deleteStatementOfFact(deleteStatementOfFact: IDeleteStatementOfFactDto): Observable<void> {
    return this.apiRequestService.sendApiReq(this.deleteStatementOfFactRequest(deleteStatementOfFact));
  }
}
