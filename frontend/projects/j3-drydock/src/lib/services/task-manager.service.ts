/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eApiBase, eCrud, eEntities } from 'jibe-components';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskManagerService {
  constructor(private apiReqService: ApiRequestService) {}

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
}
