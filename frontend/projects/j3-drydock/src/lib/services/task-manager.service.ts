/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eApiBase, eCrud, eEntities } from 'jibe-components';
import { Observable } from 'rxjs';
import { Workflow } from '../models/interfaces/task-manager';

@Injectable({
  providedIn: 'root'
})
export class TaskManagerService {
  constructor(private apiReqService: ApiRequestService) {}

  getWorkflow(uid: string, workFlowType?: string, vesselId?: number): Observable<any> {
    const body: Record<string, unknown> = {
      task_manager_uid: uid,
      odata: {}
    };
    if (workFlowType) {
      body.wl_type = [workFlowType];
    }
    if (vesselId != null) {
      body.vesselId = vesselId;
    }
    return this.apiReqService.sendApiReq({
      apiBase: eApiBase.J3TaskManagerAPI,
      entity: eEntities.TaskManager,
      crud: eCrud.Post,
      action: 'get-task-manager-by-uid',
      body
    });
  }

  // TODO maybe don't need this
  getWorkflowData(uid: string, workFlowType: string): Observable<any> {
    return this.apiReqService.sendApiReq({
      apiBase: eApiBase.J3TaskManagerAPI,
      entity: eEntities.TaskManager,
      crud: eCrud.Post,
      action: 'get-tm-child-jobs',
      body: {
        NCUid: null,
        jobUid: uid,
        wlType: workFlowType,
        odata: {}
      }
    });
  }

  transitionToNextWorkflowStatus(obj): Observable<any> {
    const updateWorkflow: WebApiRequest = {
      apiBase: eApiBase.J3TaskManagerAPI,
      entity: eEntities.TaskManager,
      action: 'task-manager-workflow/update-task-manager-wf-action',
      crud: eCrud.Post,
      body: obj
    };
    return this.apiReqService.sendApiReq(updateWorkflow);
  }

  getNextTaskManagerState(params: string): Observable<any> {
    const getTechApiReq: WebApiRequest = {
      apiBase: eApiBase.J3TaskManagerAPI,
      entity: eEntities.TaskManager,
      crud: eCrud.Get,
      action: 'task-manager-workflow/get-task-manager-next-workflow-configuration',
      params
    };
    return this.apiReqService.sendApiReq(getTechApiReq);
  }

  saveTaskManagerJob(taskManagerDetails): Observable<any> {
    const saveWorkflow: WebApiRequest = {
      apiBase: eApiBase.J3TaskManagerAPI,
      entity: eEntities.TaskManager,
      action: 'save-task-manager-jobs',
      crud: eCrud.Post,
      body: taskManagerDetails
    };
    return this.apiReqService.sendApiReq(saveWorkflow);
  }

  saveWorkFlowAndFollow(data) {
    const saveWorkFlowAndFollowData: WebApiRequest = {
      apiBase: eApiBase.MasterAPI,
      entity: eEntities.Master,
      crud: eCrud.Post,
      action: 'jb-event/saveWorkFlowEvents',
      body: data
    };
    return this.apiReqService.sendApiReq(saveWorkFlowAndFollowData);
  }

  getAllWorkflowStatuses(taskType: string): Observable<Workflow[]> {
    const saveWorkFlowAndFollowData: WebApiRequest = {
      apiBase: eApiBase.J3TaskManagerAPI,
      entity: eEntities.TaskManager,
      crud: eCrud.Get,
      action: 'task-manager-workflow/get-tm-all-wf-config-details-by-task-type',
      params: `taskType=${taskType}`
    };
    return this.apiReqService.sendApiReq(saveWorkFlowAndFollowData);
  }

  reSyncWorkflow(task_manager_uid: string, wl_type: string) {
    const saveWorkflow: WebApiRequest = {
      apiBase: eApiBase.J3TaskManagerAPI,
      entity: eEntities.TaskManager,
      action: 'task-manager-sync',
      crud: eCrud.Post,
      body: { task_manager_uid, wl_type }
    };
    return this.apiReqService.sendApiReq(saveWorkflow);
  }
}
