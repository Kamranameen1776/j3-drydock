import { Injectable } from '@angular/core';
import { FunctionsTreeNode, FunctionTreeResponseNode } from '../models/interfaces/functions-tree-node';

@Injectable({
  providedIn: 'root'
})
export class ShellFunctionsTreeService {
  public createFlatTree(comps: FunctionTreeResponseNode[]) {
    const tree: FunctionsTreeNode[] = [];

    comps.forEach((comp) => {
      let node: FunctionsTreeNode;
      if (comp.level === 1) {
        node = this.createRootNode(comp);
      } else {
        node = this.createNode(comp);
      }
      tree.push(node);
    });
    return tree;
  }

  private createRootNode(comp: FunctionTreeResponseNode): FunctionsTreeNode {
    return {
      path: comp.name,
      Child_ID: comp.uid,
      Parent_ID: 0,
      DisplayText: comp.name,
      selectable: false,
      icon: 'icons8-cloud-function'
    };
  }

  private createNode(comp: FunctionTreeResponseNode): FunctionsTreeNode {
    return {
      path: `${comp.name}`,
      Child_ID: comp.uid,
      Parent_ID: comp.parent_function_uid,
      DisplayText: comp.name,
      selectable: false,
      icon: 'icons8-cloud-function'
    };
  }
}
