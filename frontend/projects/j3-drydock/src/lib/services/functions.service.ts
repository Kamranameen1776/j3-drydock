import { ApiRequestService, WebApiRequest, eApiBase, eCrud, eEntities } from 'jibe-components';
import { map } from 'rxjs/operators';
import { FunctionsFlatTreeNode, ShellFunctionTreeResponseNode } from '../models/interfaces/functions-tree-node';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FunctionsService {
  constructor(private apiRequestService: ApiRequestService) {}

  getFunctions(parentNodeUid?: string): Observable<FunctionsFlatTreeNode[]> {
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
        return res.records.map((record) => this.createFlatNode(record, parentNodeUid));
      })
    );
  }

  calculateSelectable(comp: FunctionsFlatTreeNode, components: FunctionsFlatTreeNode[]): FunctionsFlatTreeNode {
    return {
      ...comp,
      selectable: components.findIndex((child) => child.Parent_ID === comp.Child_ID) === -1
    };
  }

  public createFlatNode(
    comp: Pick<ShellFunctionTreeResponseNode, 'uid' | 'parent_function_uid' | 'name' | 'expanded'>,
    parentNodeUid = '0'
  ): FunctionsFlatTreeNode {
    return {
      Child_ID: comp.uid,
      Parent_ID: comp.parent_function_uid || parentNodeUid,
      DisplayText: comp.name,
      selectable: false,
      tag: 'function',
      icon: 'icons8-cloud-function',
      expanded: comp.expanded
    };
  }
}
