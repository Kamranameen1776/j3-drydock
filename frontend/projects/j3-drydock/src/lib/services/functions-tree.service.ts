import { Injectable } from '@angular/core';
import { FunctionsFlatTreeNode, FunctionsTreeNode } from '../models/interfaces/functions-tree-node';
import { TreeNode } from 'primeng';

@Injectable({
  providedIn: 'root'
})
export class FunctionsTreeService {
  public createTreeAndNodesMap(comps: FunctionsFlatTreeNode[]) {
    const nodesMap = new Map<string | number, FunctionsTreeNode>();

    comps.forEach((node) => {
      nodesMap.set(node.Child_ID, this.createTreeNode(node));
    });

    const tree = [];

    comps.forEach((node) => {
      const treeNode = nodesMap.get(node.Child_ID);
      const parentGuid = node.Parent_ID;

      if (!parentGuid) {
        tree.push(treeNode);
      } else {
        const parent = nodesMap.get(parentGuid);
        if (parent) {
          treeNode.parent = parent;
          parent.children.push(treeNode);
        }
      }
    });

    return { tree, nodesMap };
  }

  public getPath(node: TreeNode | FunctionsTreeNode) {
    const path = [];

    if (!node.label) {
      return '';
    }

    path.unshift(node.label);

    if (node.parent) {
      const parentPath = this.getPath(node.parent);
      if (parentPath) {
        path.unshift(parentPath);
      }
    }

    return path.join(' > ');
  }

  private createTreeNode(comp: FunctionsFlatTreeNode): FunctionsTreeNode {
    return {
      ...comp,
      children: [],
      parent: null,
      label: comp.DisplayText
    };
  }
}
