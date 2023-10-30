import { Injectable } from '@angular/core';
import { FunctionsFlatTreeNode, FunctionsTreeNode } from '../models/interfaces/functions-tree-node';
import { TreeNode } from 'primeng';

@Injectable({
  providedIn: 'root'
})
export class FunctionsTreeService {
  public createTree(comps: FunctionsFlatTreeNode[]) {
    const nodeMap = new Map<string | number, TreeNode>();

    comps.forEach((node) => {
      nodeMap.set(node.Child_ID, this.createTreeNode(node));
    });

    const tree = [];

    comps.forEach((node) => {
      const treeNode = nodeMap.get(node.Child_ID);
      const parentGuid = node.Parent_ID;

      if (!parentGuid) {
        tree.push(treeNode);
      } else {
        const parent = nodeMap.get(parentGuid);
        if (parent) {
          treeNode.parent = parent;
          parent.children.push(treeNode);
        }
      }
    });

    return tree;
  }

  public getPath(node: TreeNode | FunctionsTreeNode) {
    const path = [];

    if (!node.label) {
      return '';
    }

    path.unshift(node.label);

    if (node.parent) {
      const subPath = this.getPath(node.parent);
      if (subPath) {
        path.unshift(subPath);
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
