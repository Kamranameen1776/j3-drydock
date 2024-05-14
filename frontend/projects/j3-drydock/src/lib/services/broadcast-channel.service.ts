import { Injectable } from '@angular/core';
import { BroadcastChannels } from '../models/enums/broadcast-channels.enum';
import { GridService } from 'jibe-components';

@Injectable({ providedIn: 'root' })
export class BroadcastChannelService {
  projectChannel = new BroadcastChannel(BroadcastChannels.ProjectsMainChannel);

  constructor(private gridService: GridService) {}

  postRefreshProjectsMain(isRefresh: boolean) {
    this.projectChannel.postMessage(isRefresh);
  }
}
