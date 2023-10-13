/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Input, Optional } from '@angular/core';
import { CentralizedDataService, JmsTechApiService } from 'jibe-components';
import { FunctionsTreeNode } from '../../../models/interfaces/functions-tree-node';

@Component({
  selector: 'jb-drydock-functions-tree-select',
  templateUrl: './functions-tree-select.component.html',
  styleUrls: ['./functions-tree-select.component.scss']
})
export class FunctionsTreeSelectComponent {
  @Input() treeData: FunctionsTreeNode[] = [];

  // TODO wait for j-component version with 'inputWithDlg' type in form field
  constructor(
    private techApiSvc: JmsTechApiService // @Optional() private inputFunctionsTreeService: InputWithDlgService
  ) {}

  public onGetSelected({ data }: { data: FunctionsTreeNode }) {
    if (data.machinery_uid && data.Child_ID) {
      this.getEquipmentLocationPath(data);
    }
  }

  private getEquipmentLocationPath(node: FunctionsTreeNode) {
    this.techApiSvc.getJobLinkedEquipmentLocationPath(node.machinery_uid, node.Child_ID).subscribe((res) => {
      const value: FunctionsTreeNode = { ...node, jb_value_label: res.functionPath };
      // TODO wait for j-component version with 'inputWithDlg' type in form field
      // this.inputFunctionsTreeService?.selected$.next(value);
    });
  }
}
