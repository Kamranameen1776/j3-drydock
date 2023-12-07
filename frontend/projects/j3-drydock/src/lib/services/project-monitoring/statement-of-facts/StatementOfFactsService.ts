import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud } from 'jibe-components';
import { IDeleteStatementOfFactDto } from './IDeleteStatementOfFactDto';
import { Observable } from 'rxjs';
import { ICreateStatementOfFactDto } from './ICreateStatementOfFactDto';
import { IUpdateStatementOfFactDto } from './IUpdateStatementOfFactDto';
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

  createStatementOfFactRequest(createStatementOfFact: ICreateStatementOfFactDto): WebApiRequest {
    const request: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      // entity: eEntities.DryDock,
      // action: eAction.GetSpecificationDetails,
      apiBase: 'dryDockAPI',
      action: 'statement-of-facts/create-statement-of-fact',
      crud: eCrud.Post,
      entity: 'drydock',
      body: createStatementOfFact
    };

    return request;
  }

  createStatementOfFact(createStatementOfFact: ICreateStatementOfFactDto): Observable<void> {
    return this.apiRequestService.sendApiReq(this.createStatementOfFactRequest(createStatementOfFact));
  }

  updateStatementOfFactRequest(updateStatementOfFact: IUpdateStatementOfFactDto): WebApiRequest {
    const request: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      // entity: eEntities.DryDock,
      // action: eAction.GetSpecificationDetails,
      apiBase: 'dryDockAPI',
      action: 'statement-of-facts/update-statement-of-fact',
      crud: eCrud.Put,
      entity: 'drydock',
      body: updateStatementOfFact
    };

    return request;
  }

  updateStatementOfFact(updateStatementOfFact: IUpdateStatementOfFactDto): Observable<void> {
    return this.apiRequestService.sendApiReq(this.updateStatementOfFactRequest(updateStatementOfFact));
  }
}
