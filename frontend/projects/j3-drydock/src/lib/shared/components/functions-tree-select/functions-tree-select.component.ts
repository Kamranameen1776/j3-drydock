import { Component, Input, ViewChild } from '@angular/core';
import { InputWithDlgService, JbTreeComponent } from 'jibe-components';
import { FunctionsFlatTreeNode } from '../../../models/interfaces/functions-tree-node';
import { TreeNode } from 'primeng';
import { FunctionsTreeService } from '../../../services/FunctionsTreeService';

@Component({
  selector: 'jb-drydock-functions-tree-select',
  templateUrl: './functions-tree-select.component.html',
  styleUrls: ['./functions-tree-select.component.scss']
})
export class FunctionsTreeSelectComponent {
  @Input() treeData: FunctionsFlatTreeNode[] = [];
  @Input() formId!: string;
  @Input() fieldName!: string;

  @ViewChild('treeRef') treeRef: JbTreeComponent;

  constructor(
    private inputFunctionsTreeService: InputWithDlgService,
    private functionsTreeService: FunctionsTreeService
  ) {}

  public onSelected(e: TreeNode) {
    const data = e.data as FunctionsFlatTreeNode;

    this.inputFunctionsTreeService.changed$.next({
      formId: this.formId,
      fieldName: this.fieldName,
      value: { ...data, jb_value_label: this.functionsTreeService.getPath(e) }
    });
  }
}
