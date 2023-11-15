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
      action: 'projects/project-yards/get-project-yards',
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

  linkYardsToProject(projectUid: string, yardsUids: string[]) {
    const apiReq: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: eEntities.DryDock,
      crud: eCrud.Post,
      action: 'projects/project-yards/create-project-yards',
      body: {
        projectUid,
        yardsUids
      }
    };
    return this.apiRequestService.sendApiReq(apiReq);
  }

  removeYardLink(uid: string): Observable<YardToLink[]> {
    const apiReq: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: eEntities.DryDock,
      crud: eCrud.Put,
      action: 'projects/project-yards/delete-project-yards',
      body: { uid }
    };
    return this.apiRequestService.sendApiReq(apiReq);
  }

  updateYardLink(yard: YardLink) {
    const apiReq: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: eEntities.DryDock,
      crud: eCrud.Put,
      action: 'projects/project-yards/update-project-yards',
      body: {
        uid: yard.uid,
        lastExportedDate: yard.lastExportedDate,
        isSelected: yard.isSelected
      }
    };
    return this.apiRequestService.sendApiReq(apiReq);
  }
}
