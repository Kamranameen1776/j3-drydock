/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO fixme any to known types
export interface FunctionsTreeNode {
  Parent_ID: string;
  Child_ID: string;
  machinery_uid: string | null;
  uid: string;

  DisplayText: string;
  active_status: boolean;
  Vessel_ID: any;
  deleted: any;
  tag: string;
  isParentComponent: number;
  row_num: string;
  critical_status: number;
  icon: string;

  jb_value_label?: string;
  selectable?: boolean;
}
