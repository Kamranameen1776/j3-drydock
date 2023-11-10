import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eApiBase, eCrud, eEntities } from 'jibe-components';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { YardLink, YardToLink } from '../models/interfaces/project-details';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailsService {
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
    return of([
      {
        yard: 'yard1',
        yardUid: 'yardUid1',
        location: 'location1',
        uid: 'uid1',
        isSelected: false,
        exportedDate: '07-11-2023'
      },
      {
        yard: 'yard2',
        yardUid: 'yardUid2',
        location: 'location2',
        uid: 'uid2',
        isSelected: false,
        exportedDate: '07-11-2023'
      },
      {
        yard: 'yard3',
        yardUid: 'yardUid3',
        location: 'location1',
        uid: 'uid3',
        isSelected: false,
        exportedDate: '07-11-2023'
      },
      {
        yard: 'yard4',
        yardUid: 'yardUid4',
        location: 'location2',
        uid: 'uid4',
        isSelected: false,
        exportedDate: '07-11-2023'
      }
    ]).pipe(delay(2000));
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
    return of([
      {
        yard: 'yard1',
        yardUid: 'yardUid1',
        location: 'location1'
      },
      {
        yard: 'yard2',
        yardUid: 'yardUid2',
        location: 'location2'
      },
      {
        yard: 'yard3',
        yardUid: 'yardUid3',
        location: 'location1'
      },
      {
        yard: 'yard4',
        yardUid: 'yardUid4',
        location: 'location2'
      },
      {
        yard: 'yard5',
        yardUid: 'yardUid5',
        location: 'location1'
      },
      {
        yard: 'yard6',
        yardUid: 'yardUid6',
        location: 'location2'
      },
      {
        yard: 'yard7',
        yardUid: 'yardUid7',
        location: 'location1'
      },
      {
        yard: 'yard8',
        yardUid: 'yardUid8',
        location: 'location2'
      }
    ]);
  }

  linkYardsToProject(projectId: string, uids: string[]) {
    // const apiReq: WebApiRequest = {
    //   apiBase: 'dryDockAPI',
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
