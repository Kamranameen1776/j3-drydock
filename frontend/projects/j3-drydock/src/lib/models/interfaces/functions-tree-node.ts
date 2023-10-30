/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FunctionTreeResponseNode {
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

export interface FunctionsTreeNode {
  Child_ID: string;
  Parent_ID: string | number;
  DisplayText: string;
  selectable: boolean;
  icon?: string;

  jb_value_label?: string;
}
