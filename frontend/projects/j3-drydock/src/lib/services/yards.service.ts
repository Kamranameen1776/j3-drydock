import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eCrud, eEntities } from 'jibe-components';
import { Observable } from 'rxjs';
import { YardLink, YardToLink } from '../models/interfaces/project-details';

@Injectable({
  providedIn: 'root'
})
export class YardsService {
  constructor(private apiRequestService: ApiRequestService) {}

  getLinkedYards(projectUid: string): Observable<YardLink[]> {
    const apiReq: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: eEntities.DryDock,
      crud: eCrud.Get,
      action: 'yard-projects/get-yard-projects',
      params: `uid=${projectUid}`
    };
    return this.apiRequestService.sendApiReq(apiReq);
  }

  getYardsToLink(projectId: string): Observable<YardToLink[]> {
    const apiReq: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: eEntities.DryDock,
      crud: eCrud.Get,
      action: 'yards/get-yards',
      params: `uid=${projectId}`
    };
    return this.apiRequestService.sendApiReq(apiReq);
  }

  linkYardsToProject(projectUid: string, yardUid: string[]) {
    const apiReq: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: eEntities.DryDock,
      crud: eCrud.Post,
      action: 'yard-projects/create-yard-projects',
      body: {
        projectUid,
        yardUid
      }
    };
    return this.apiRequestService.sendApiReq(apiReq);
  }

  removeYardLink(uid: string): Observable<YardToLink[]> {
    const apiReq: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: eEntities.DryDock,
      crud: eCrud.Put,
      action: 'yard-projects/delete-yard-projects',
      params: `uid=${uid}`
    };
    return this.apiRequestService.sendApiReq(apiReq);
  }

  updateYardLink(yard: YardLink) {
    const apiReq: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: eEntities.DryDock,
      crud: eCrud.Put,
      action: 'yard-projects/update-yard-projects',
      body: {
        uid: yard.uid,
        yardUid: yard.yardUid,
        lastExportedDate: yard.lastExportedDate,
        isSelected: yard.isSelected
      }
    };
    return this.apiRequestService.sendApiReq(apiReq);
  }
}
