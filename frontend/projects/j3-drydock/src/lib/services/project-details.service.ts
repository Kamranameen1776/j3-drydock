import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eApiBase, eCrud, eEntities } from 'jibe-components';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { YardLink } from '../models/interfaces/project-details';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailsService {
  constructor(private apiRequestService: ApiRequestService) {}

  getLinkedYards(projectId: string): Observable<YardLink[]> {
    // const apiReq: WebApiRequest = {
    //   apiBase: eApiBase.DryDockApi,
    //   entity: eEntities.DryDock,
    //   crud: eCrud.Get,
    //   action: 'yard/list',
    //   params: `projectId=${projectId}`
    // };
    // return this.apiRequestService.sendApiReq(apiReq);
    return of([
      {
        yard: 'yard1',
        location: 'location1',
        uid: 'uid1',
        isSelected: false,
        exportedDate: '07-11-2023'
      },
      {
        yard: 'yard2',
        location: 'location2',
        uid: 'uid2',
        isSelected: false,
        exportedDate: '07-11-2023'
      },
      {
        yard: 'yard3',
        location: 'location1',
        uid: 'uid3',
        isSelected: false,
        exportedDate: '07-11-2023'
      },
      {
        yard: 'yard4',
        location: 'location2',
        uid: 'uid4',
        isSelected: false,
        exportedDate: '07-11-2023'
      },
      {
        yard: 'yard5',
        location: 'location1',
        uid: 'uid5',
        isSelected: false,
        exportedDate: '07-11-2023'
      },
      {
        yard: 'yard6',
        location: 'location2',
        uid: 'uid6',
        isSelected: false,
        exportedDate: '07-11-2023'
      },
      {
        yard: 'yard7',
        location: 'location1',
        uid: 'uid7',
        isSelected: true,
        exportedDate: '07-11-2023'
      },
      {
        yard: 'yard8',
        location: 'location2',
        uid: 'uid8',
        isSelected: false,
        exportedDate: '07-11-2023'
      }
    ]).pipe(delay(2000));
  }

  linkYardsToProject(projectId: string, uids: string[]) {
    // const apiReq: WebApiRequest = {
    //   apiBase: eApiBase.DryDockApi,
    //   entity: eEntities.DryDock,
    //   crud: eCrud.Post,
    //   action: 'yard/LinkToProject',
    //   params: `projectId=${projectId}`,
    //   body: uids
    // };
    // return this.apiRequestService.sendApiReq(apiReq);
    return of([]).pipe(delay(2000));
  }
}
