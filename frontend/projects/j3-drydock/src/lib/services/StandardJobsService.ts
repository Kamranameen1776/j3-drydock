import { Injectable } from '@angular/core';
import { ApiRequestService, WebApiRequest, eApiBase, eCrud, eEntities, eJMSFilterDataKeys } from 'jibe-components';
import { ODataFilterBuilder } from 'odata-filter-builder';
import { eStandardJobsMainFields } from '../models/enums/standard-jobs-main.enum';
import { FunctionsFlatTreeNode, ShellFunctionTreeResponseNode } from '../models/interfaces/functions-tree-node';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class StandardJobsService {
  constructor(private apiRequestService: ApiRequestService) {}
  // TODO
  public getStandardJobsRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'standard-jobs/get-standard-jobs',
      crud: eCrud.Post,
      entity: 'drydock'
    };
    return apiRequest;
  }

  public deleteStandardJob(uid: string) {
    const apiReq: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      crud: eCrud.Post,
      action: 'standard-jobs/delete-standard-jobs',
      body: {
        uid
      }
    };
    return this.apiRequestService.sendApiReq(apiReq);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public upsertStandardJob(uid: string, formValue: any) {
    const body = this.getUpsertStandardJobBody(uid, formValue);
    const action = uid ? 'standard-jobs/update-standard-jobs' : 'standard-jobs/create-standard-jobs';
    const apiReq: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      crud: eCrud.Post,
      action: action,
      body: body
    };
    return this.apiRequestService.sendApiReq(apiReq);
  }

  public getStandardJobsFiltersRequest(fieldName: eStandardJobsMainFields) {
    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'standard-jobs/get-standard-jobs-filters',
      crud: eCrud.Post,
      entity: 'drydock',
      body: {
        key: fieldName
      }
    };
    return apiRequest;
  }

  public getVesselTypesRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      apiBase: eApiBase.MasterAPI,
      entity: eEntities.Master,
      crud: eCrud.Get,
      action: 'datasource/getDatasource',
      params: 'dataSourceName=vessel_type',
      odata: {
        filter: ODataFilterBuilder().eq(eJMSFilterDataKeys.ActiveStatus, 1)
      }
    };
    return apiRequest;
  }

  public getJobSubItems(jobUid: string) {
    const apiRequest: WebApiRequest = {
      apiBase: 'dryDockAPI',
      action: 'standard-jobs/get-sub-items',
      crud: eCrud.Get,
      entity: 'drydock',
      params: `job_uid=${jobUid}`
    };
    return this.apiRequestService.sendApiReq(apiRequest);
  }

  public getStandardJobFunctions() {
    const apiRequest: WebApiRequest = {
      apiBase: eApiBase.TechnicalAPI,
      entity: eEntities.PMS,
      crud: eCrud.Post,
      action: 'lib/functions/get-all-pms-function',
      odata: {
        skip: '0',
        top: '10000000'
      }
    };

    return this.apiRequestService.sendApiReq(apiRequest).pipe(
      map((res) => {
        if (!res.records) {
          return [];
        }
        return res.records.map((record) => this.createFlatNode(record));
      })
    );
  }

  public getVesselSpevificList() {
    return [
      {
        label: 'Yes',
        value: 1
      },
      {
        label: 'No',
        value: 0
      }
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getUpsertStandardJobBody(uid: string, formValue: any) {
    return {
      ...formValue,
      [eStandardJobsMainFields.UID]: uid || '',
      [eStandardJobsMainFields.Function]: formValue.function.jb_value_label || '',
      subItems: []
    };
  }

  private createFlatNode(comp: ShellFunctionTreeResponseNode): FunctionsFlatTreeNode {
    return {
      Child_ID: comp.uid,
      Parent_ID: comp.parent_function_uid || 0,
      DisplayText: comp.name,
      selectable: false,
      icon: 'icons8-cloud-function'
    };
  }
}
