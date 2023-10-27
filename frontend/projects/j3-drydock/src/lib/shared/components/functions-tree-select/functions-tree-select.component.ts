/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Input } from '@angular/core';
import { InputWithDlgService } from 'jibe-components';
import { FunctionsTreeNode } from '../../../models/interfaces/functions-tree-node';

@Component({
  selector: 'jb-drydock-functions-tree-select',
  templateUrl: './functions-tree-select.component.html',
  styleUrls: ['./functions-tree-select.component.scss']
})
export class FunctionsTreeSelectComponent {
  @Input() treeData: FunctionsTreeNode[] = [];
  @Input() formId!: string;
  @Input() fieldName!: string;

  constructor(private inputFunctionsTreeService: InputWithDlgService) {}

  public onGetSelected({ data, ...rest }: { data: FunctionsTreeNode }) {
    // TODO find patch by parent
    this.inputFunctionsTreeService?.changed$.next({
      formId: this.formId,
      fieldName: this.fieldName,
      value: { ...data, jb_value_label: data.DisplayText }
    });
  }
}
