import { Injectable } from '@angular/core';
import {
  ApiRequestService,
  DiscussionFeedService,
  IJbMenuItem,
  UserService,
  eAppLocation,
  eIconNames,
  eJMSActionTypes
} from 'jibe-components';
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

  getAttachmentActions(attachAccessRights?: AttachmentsAccessRight) {
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

  getMenuById<T extends string>(menus: IJbMenuItem[], id: T) {
    return menus.find((item) => item.id === id);
  }

  hideSubMenuItem<T extends string>(parentMenu: IJbMenuItem, id: T) {
    parentMenu.items = (parentMenu.items as IJbMenuItem[]).filter((item) => item.id !== id);
  }
}
