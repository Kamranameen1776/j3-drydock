import { Injectable } from '@angular/core';
import { ApiRequestService, AuthenticationService, WebApiRequest } from 'jibe-components';
import { Observable } from 'rxjs';

export interface AuthDetails {
  [key: string]: any;
  UserID: string;
}

export interface LoginResult {
  authtoken: string;
  authDetails: AuthDetails;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private apiRequestService: ApiRequestService,
    private authenticationService: AuthenticationService
  ) {}

  login(data: any): Observable<LoginResult> {
    const authenUser: WebApiRequest = {
      crud: 'post',
      apiBase: 'infraAPI',
      entity: 'infra',
      action: 'auth/login',
      body: data
    };
    return this.apiRequestService.sendApiReq(authenUser);
  }

  getUserRights(): Observable<{ Right_Code: string }[]> {
    const webApiRequest = this.authenticationService.getUserRights();
    return this.apiRequestService.sendApiReq(webApiRequest);
  }
}
