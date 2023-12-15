import { Injectable } from '@angular/core';
import { ApiRequestService, DiscussionFeedService, UserService, eAppLocation, eIconNames, eJMSActionTypes } from 'jibe-components';
import { TaskManagerService } from './task-manager.service';

import { UnsubscribeComponent } from '../shared/classes/unsubscribe.base';

import { AttachmentsAccessRight } from '../models/interfaces/access-rights';

@Injectable({
  providedIn: 'root'
})
export class DetailsService extends UnsubscribeComponent {
  constructor(
    private apiRequestService: ApiRequestService,
    private taskManagerService: TaskManagerService,
    private feedSvc: DiscussionFeedService
  ) {
    super();
  }

  isOffice(): 1 | 0 {
    return UserService.getUserDetails().AppLocation === eAppLocation.Office ? 1 : 0;
  }

  getDiscussionFeedSetting(uid: string, vesseld: number) {
    return {
      key1: uid,
      key2: String(this.isOffice()),
      key3: String(vesseld),
      uid: uid
    };
  }

  getAttachmnentActions(attachAccessRights?: AttachmentsAccessRight) {
    const actions = [];

    if (!attachAccessRights || attachAccessRights.edit) {
      actions.push({ name: eJMSActionTypes.Edit, label: 'Edit', icon: eIconNames.Edit });
    }
    if (!attachAccessRights || attachAccessRights.delete) {
      actions.push({ name: eJMSActionTypes.Delete, label: 'Delete', icon: eIconNames.Delete });
    }

    actions.push({ name: 'download', label: 'Download', icon: eIconNames.Download });

    return actions;
  }
}
