/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ShellFunctionTreeResponseNode {
  uid: string;
  name: string;
  description: string;
  parentFunction: string;
  level: number;
  display_order: number;
  active_status: string;
  parent_function_uid: string;
  utilized: string;
}

export interface FunctionsFlatTreeNode {
  Child_ID: string;
  Parent_ID: string | number;
  DisplayText: string;
  selectable: boolean;
  icon?: string;
  tag?: string;

  jb_value_label?: string;
}

export interface FunctionsTreeNode extends FunctionsFlatTreeNode {
  children: FunctionsTreeNode[];
  parent: FunctionsTreeNode;
  label: string;
}
