/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Input, ViewChild } from '@angular/core';
import { InputWithDlgService, JbTreeComponent } from 'jibe-components';
import { FunctionsTreeNode } from '../../../models/interfaces/functions-tree-node';
import { TreeNode } from 'primeng';

@Component({
  selector: 'jb-drydock-functions-tree-select',
  templateUrl: './functions-tree-select.component.html',
  styleUrls: ['./functions-tree-select.component.scss']
})
export class FunctionsTreeSelectComponent {
  @Input() treeData: FunctionsTreeNode[] = [];
  @Input() formId!: string;
  @Input() fieldName!: string;

  @ViewChild('treeRef') treeRef: JbTreeComponent;

  constructor(private inputFunctionsTreeService: InputWithDlgService) {}

  public onSelected(e: TreeNode) {
    const data = e.data as FunctionsTreeNode;

    this.inputFunctionsTreeService.changed$.next({
      formId: this.formId,
      fieldName: this.fieldName,
      value: { ...data, jb_value_label: this.getPath(e) }
    });
  }

  private getPath(node: TreeNode) {
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
}
