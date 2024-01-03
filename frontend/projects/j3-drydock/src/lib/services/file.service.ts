import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiRequestService, WebapiService, eEntities } from 'jibe-components';

@Injectable({
  providedIn: 'root'
})
export class FileService extends WebapiService {
  constructor(apiReqService: ApiRequestService, http: HttpClient) {
    super(apiReqService.jb_Env, http, eEntities.DryDock);
  }
}
