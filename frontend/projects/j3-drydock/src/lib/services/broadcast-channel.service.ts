import { Injectable } from '@angular/core';
import { BroadcastChannels } from '../models/enums/broadcast-channels.enum';

@Injectable({ providedIn: 'root' })
export class BroadcastChannelService {
  projectChannel = new BroadcastChannel(BroadcastChannels.ProjectsMainChannel);

  constructor() {}

  postRefreshProjectsMain(isRefresh: boolean) {
    this.projectChannel.postMessage(isRefresh);
  }
}
