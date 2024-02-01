import { Injectable } from '@angular/core';
import { IJbMenuItem, UserService, eAppLocation, eIconNames, eJMSActionTypes } from 'jibe-components';

import { UnsubscribeComponent } from '../shared/classes/unsubscribe.base';

import { AttachmentsAccessRight } from '../models/interfaces/access-rights';
import { localDateJbStringAsUTC } from '../utils/date';

@Injectable({
  providedIn: 'root'
})
export class DetailsService extends UnsubscribeComponent {
  constructor() {
    super();
  }

  isOffice(): 1 | 0 {
    return UserService.getUserDetails().AppLocation === eAppLocation.Office ? 1 : 0;
  }

  getDiscussionFeedSetting(uid: string, vesselId: number) {
    return {
      key1: uid,
      key2: String(this.isOffice()),
      key3: String(vesselId),
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

  getMenuWithHiddenMenuItem<T extends string>(menus: IJbMenuItem[], id: T) {
    return menus.filter((item) => item.id !== id);
  }

  checkValidStartEndDates(start: string, end: string) {
    let endDate: Date;
    let startDate: Date;

    if (start) {
      startDate = localDateJbStringAsUTC(start);
    }

    if (end) {
      endDate = localDateJbStringAsUTC(end);
    }

    if (endDate && startDate && endDate.getTime() < startDate.getTime()) {
      return false;
    }

    return true;
  }
}
