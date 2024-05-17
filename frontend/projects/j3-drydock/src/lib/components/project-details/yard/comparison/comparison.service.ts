import { cloneDeep } from 'lodash';
import { of } from 'rxjs';
import { ComparisonFunction, ComparisonFunctionTree, ComparisonYard, ComparisonYardRow } from './../../../../models/interfaces/comparison';
import { Injectable } from '@angular/core';

export const leftRowsFlatTree: ComparisonFunction[] = [
  {
    uid: '1',
    specification: 'Ship General',
    parent_uid: null,
    quantity: null,
    uom: null
  },
  {
    uid: '11',
    specification: 'Ship General child 1',
    parent_uid: '1',
    quantity: null,
    uom: null
  },
  {
    uid: '11_1',
    specification: 'Ship General child 1 child 1',
    parent_uid: '11',
    quantity: 11,
    uom: 11
  },
  {
    uid: '11_2',
    specification: 'Ship General child 1 child 2',
    parent_uid: '11',
    quantity: 22,
    uom: 22
  },
  {
    uid: '11_3',
    specification: 'Ship General child 1 child 3',
    parent_uid: '11',
    quantity: 33,
    uom: 44
  },
  {
    uid: '111',
    specification: 'Ship General child 2',
    parent_uid: '1',
    quantity: null,
    uom: null
  },
  {
    uid: '3_1',
    specification: 'Ship General 3 child 1',
    parent_uid: '3',
    quantity: null,
    uom: null
  },
  {
    uid: '2',
    specification: 'Ship General 2',
    parent_uid: null,
    quantity: null,
    uom: null
  },
  {
    uid: '3',
    specification: 'Ship General 3',
    parent_uid: null,
    quantity: null,
    uom: null
  },
  {
    uid: '2_1_1',
    specification: 'Ship General child 2 child 1',
    parent_uid: '2_1',
    quantity: null,
    uom: null
  },
  {
    uid: '111_1',
    specification: 'Ship General child 1 child 1',
    parent_uid: '111',
    quantity: 110,
    uom: 110
  },
  {
    uid: '111_2',
    specification: 'Ship General child 1 child 2',
    parent_uid: '111',
    quantity: 220,
    uom: 220
  },
  {
    uid: '2_1',
    specification: 'Ship General child 2',
    parent_uid: '2',
    quantity: null,
    uom: null
  },
  {
    uid: '2_2',
    specification: 'Ship General child 2',
    parent_uid: '2',
    quantity: null,
    uom: null
  }
];

export const stubYards: ComparisonYard[] = [
  {
    name: 'yard1',
    uid: 'GUID1'
  },
  {
    name: 'yard2',
    uid: 'GUID2'
  },
  {
    name: 'yard3',
    uid: 'GUID3'
  }
];

export const stubYardsRows: ComparisonYardRow[] = [
  {
    spec_uid: '11_3',
    yard_uid: 'GUID1',
    amount: 111,
    unit_price: 111
  },
  {
    spec_uid: '11_3',
    yard_uid: 'GUID2',
    amount: 222,
    unit_price: 222
  },
  {
    spec_uid: '111_2',
    yard_uid: 'GUID3',
    amount: 333,
    unit_price: 333
  },
  {
    spec_uid: '3',
    yard_uid: 'GUID1',
    amount: 2233,
    unit_price: 3333
  }
];

export const comparisonGridName = 'comparisonGridName';

@Injectable({ providedIn: 'root' })
export class ComparisonService {
  private readonly baseColumns = [
    // {
    //   field: 'number',
    //   header: '#',
    //   width: '100px'
    // },
    {
      field: 'specification',
      header: 'Specification',
      width: '350px'
    },
    {
      field: 'uom',
      header: 'UOM',
      width: '50px'
    },
    {
      field: 'quantity',
      header: 'Quantity',
      width: '80px'
    }
  ];

  private readonly cardColumns = [
    {
      field: `amount`,
      header: 'Amount',
      width: '100px'
    },
    {
      field: `quantity`,
      header: 'Quantity',
      width: '60px'
    },
    {
      field: `unit_price`,
      header: 'Un.Price',
      width: '60px'
    },
    {
      field: `uom`,
      header: 'UOM',
      width: '196px'
    }
  ];

  constructor() {}

  loadLeftRowsTree() {
    return of(leftRowsFlatTree);
  }

  loadYards() {
    return of(stubYards);
  }

  loadYardsRows() {
    return of(stubYardsRows);
  }

  getMappedYardsByYardsAndFunctions(yardRows, yards, sortedFunctionsTree) {
    const groupedYardRows = this.groupYardRowsByYards(yardRows, yards);
    const sortedFlatTree = this.createFlatTreeFromTree(sortedFunctionsTree);

    const result = yards.map((yard) => {
      return {
        ...yard,
        rows: sortedFlatTree.map((item) => this.createYardRow(item, yard.uid, groupedYardRows[yard.uid] || []))
      };
    });
    return result;
  }

  createSortedTreeFromArray(array: ComparisonFunction[]): ComparisonFunctionTree[] {
    const map = new Map();
    const tree: ComparisonFunctionTree[] = (cloneDeep(array) as ComparisonFunction[]).map((item, index) => {
      map.set(item.uid, index);
      return { data: { ...item }, children: [], isRoot: false };
    });
    tree.forEach((item) => {
      if (item.data.parent_uid) {
        tree[map.get(item.data.parent_uid)].children.push(item);
      }
    });
    const roots: ComparisonFunctionTree[] = tree
      .filter((item) => !item.data.parent_uid)
      .map((item) => {
        return { ...item, isRoot: true };
      });
    this.sortTreeRecursive(roots);
    return roots;
  }

  private sortTreeRecursive(tree: ComparisonFunctionTree[]) {
    tree.sort((a, b) => a.data.specification.localeCompare(b.data.specification));
    tree.forEach((aTree) => {
      if (aTree.children) {
        this.sortTreeRecursive(aTree.children);
      }
    });
  }

  private groupYardRowsByYards(yardRows, yards) {
    const yardUidsSet = new Set(yards.map((yard) => yard.uid));
    const result: { [uid: string]: ComparisonYardRow[] } = {};
    yardRows.forEach((row) => {
      if (yardUidsSet.has(row.yard_uid)) {
        result[row.yard_uid] = result[row.yard_uid] || [];
        result[row.yard_uid].push(row);
      }
    });
    return result;
  }

  private createFlatTreeFromTree(tree: ComparisonFunctionTree[]) {
    const result: ComparisonFunction[] = [];
    tree.forEach((item) => {
      result.push(item.data);
      if (item.children && item.children.length > 0) {
        result.push(...this.createFlatTreeFromTree(item.children));
      }
    });
    return result;
  }

  private createYardRow(comparisonRow: ComparisonFunction, yardUid: string, yardRows: ComparisonYardRow[]) {
    const yardRow = yardRows.find((row) => row.spec_uid === comparisonRow.uid && row.yard_uid === yardUid);
    return {
      spec_uid: comparisonRow.uid,
      yard_uid: yardUid,
      amount: yardRow?.amount || null,
      unit_price: yardRow?.unit_price || null,
      uom: yardRow?.uom || null,
      quantity: yardRow?.quantity || null
    };
  }

  getBaseColumns() {
    return [...this.baseColumns];
  }

  getCardColumns() {
    return this.cardColumns;
  }

  getExpandedRowsSet(leftRowsTree) {
    const rowsSet = new Set();
    return this.getRowsSet(rowsSet, leftRowsTree);
  }

  getGridFilters() {}
  // TODO fixme type and logic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortYardsBy(yards: any[], sortBy: string) {
    return yards;
  }

  private getRowsSet(rowsSet, leftRowsTree) {
    leftRowsTree.forEach((row) => {
      if (row.isRoot) {
        rowsSet.add(row.data.uid);
      }
      if (row.expanded) {
        rowsSet.add(row.data.uid);
        row.children?.forEach((child) => {
          rowsSet.add(child.data.uid);
        });
      }
      if (row.children) {
        this.getRowsSet(rowsSet, row.children);
      }
    });
    return rowsSet;
  }
}
