import { Injectable } from '@angular/core';
import { FunctionsTreeNode, FunctionTreeResponseNode } from '../models/interfaces/functions-tree-node';

@Injectable({
  providedIn: 'root'
})
export class ShellFunctionsTreeService {
  public createFlatTree(comps: FunctionTreeResponseNode[]) {
    const tree: FunctionsTreeNode[] = [];

    comps.forEach((comp) => {
      const node: FunctionsTreeNode = this.createNode(comp);
      tree.push(node);
    });
    return tree;
  }

  private createNode(comp: FunctionTreeResponseNode): FunctionsTreeNode {
    return {
      Child_ID: comp.uid,
      Parent_ID: comp.parent_function_uid || 0,
      DisplayText: comp.name,
      selectable: false,
      icon: 'icons8-cloud-function'
    };
  }
}
