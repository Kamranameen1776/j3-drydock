import { Injectable } from '@angular/core';
import { ApiRequestService, UserService, eAppLocation, eJMSWorkflowKeys } from 'jibe-components';
import { TaskManagerService } from './task-manager.service';
import { SaveWorklowChangeToDiscussionFeed } from '../models/interfaces/task-manager';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  constructor(
    private apiRequestService: ApiRequestService,
    private taskManagerService: TaskManagerService
  ) {}

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

  sendStatusChangeToWorkflowAndFollow(val: SaveWorklowChangeToDiscussionFeed) {
    const saveEventsObj: Record<string, unknown> = {
      module_code: val.module,
      function_code: val.function,
      key1: val.uid,
      key2: String(this.isOffice()), // or raised_location from job???
      key3: String(val.vesselId),
      details: JSON.stringify({
        wl_type: val.wlType,
        job_card_no: val.jobCardNo,
        status: null
      }),
      remark: val.remark,
      remark_type: eJMSWorkflowKeys.IsActive,
      sync_to: val.vesselId,
      action_code: val.statusName
    };

    return this.taskManagerService.saveWorkFlowAndFollow(saveEventsObj);
  }
}
