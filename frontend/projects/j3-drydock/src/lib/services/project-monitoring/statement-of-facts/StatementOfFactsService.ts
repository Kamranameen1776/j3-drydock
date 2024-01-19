import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud, eEntities } from 'jibe-components';
import { IDeleteStatementOfFactDto } from './IDeleteStatementOfFactDto';
import { Observable } from 'rxjs';
import { ICreateStatementOfFactDto } from './ICreateStatementOfFactDto';
import { IUpdateStatementOfFactDto } from './IUpdateStatementOfFactDto';
import { eApiBaseDryDockAPI } from '../../../models/constants/constants';
@Injectable({
  providedIn: 'root'
})
export class StatementOfFactsService {
  constructor(private apiRequestService: ApiRequestService) {}

  getStatementOfFactsRequest(): WebApiRequest {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'statement-of-facts/get-statement-of-facts',
      crud: eCrud.Post
    };

    return request;
  }

  deleteStatementOfFactRequest(deleteStatementOfFact: IDeleteStatementOfFactDto): WebApiRequest {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'statement-of-facts/delete-statement-of-fact',
      crud: eCrud.Post,
      body: deleteStatementOfFact
    };

    return request;
  }

  deleteStatementOfFact(deleteStatementOfFact: IDeleteStatementOfFactDto): Observable<void> {
    return this.apiRequestService.sendApiReq(this.deleteStatementOfFactRequest(deleteStatementOfFact));
  }

  createStatementOfFactRequest(createStatementOfFact: ICreateStatementOfFactDto): WebApiRequest {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'statement-of-facts/create-statement-of-fact',
      crud: eCrud.Post,
      body: createStatementOfFact
    };

    return request;
  }

  createStatementOfFact(createStatementOfFact: ICreateStatementOfFactDto): Observable<void> {
    return this.apiRequestService.sendApiReq(this.createStatementOfFactRequest(createStatementOfFact));
  }

  updateStatementOfFactRequest(updateStatementOfFact: IUpdateStatementOfFactDto): WebApiRequest {
    const request: WebApiRequest = {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'statement-of-facts/update-statement-of-fact',
      crud: eCrud.Put,
      body: updateStatementOfFact
    };

    return request;
  }

  updateStatementOfFact(updateStatementOfFact: IUpdateStatementOfFactDto): Observable<void> {
    return this.apiRequestService.sendApiReq(this.updateStatementOfFactRequest(updateStatementOfFact));
  }
}
