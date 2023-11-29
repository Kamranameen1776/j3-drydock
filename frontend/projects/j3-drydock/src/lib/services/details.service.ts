import { Injectable } from '@angular/core';
import { ApiRequestService, UserService, eAppLocation } from 'jibe-components';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  constructor(private apiRequestService: ApiRequestService) {}

  isOffice(): 1 | 0 {
    return UserService.getUserDetails().AppLocation === eAppLocation.Office ? 1 : 0;
  }

  getDiscussionFeedSetting(uid: string) {
    return {
      key1: uid,
      key2: String(this.isOffice()),
      key3: '0',
      uid: uid
    };
  }
}
