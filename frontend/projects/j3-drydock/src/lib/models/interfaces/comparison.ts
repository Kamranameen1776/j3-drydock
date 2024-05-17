import { TreeNode } from "primeng";

// TODO fixme all
export interface ComparisonYard {
  name: string;
  uid: string;
  portName?: string;
  totalCost?: number;
  generalCost?: number;
  yardCost?: number;
  ownerCost?: number;
  yardStay?: number;
  stayInDock?: number;
  stayInBerth?: number;
  rating?: number;
  rows?: ComparisonYardRow[];
}

export interface ComparisonFunction {
  uid: string;
  specification: string;
  parent_uid: string;
  quantity: number;
  uom: number;
  number?: string;
}

export interface ComparisonFunctionTree extends TreeNode {
  children: ComparisonFunctionTree[];
  isRoot: boolean;
}

export interface ComparisonYardRow {
  spec_uid: string;
  yard_uid: string;
  amount: number;
  unit_price: number;
  uom?: number;
  quantity?: number;
}