import { Injectable } from '@angular/core';
import {
  Column,
  Filter,
  FilterListSet,
  GridRowActions,
  WebApiRequest,
  eColor,
  eCrud,
  eGridRowActions,
  eIconNames
} from 'jibe-components';
import { GridInputsWithRequest } from '../../models/interfaces/grid-inputs';

export enum SpecificationStatus {
  RAISED = 'Raised',
  APPROVED = 'Approved',
  COMPLETED = 'Completed',
  REJECTED = 'Rejected'
}

@Injectable()
export class SpecificationDetailsSubItemsGridService {
  constructor() {}

  public getApiRequest(specificationUid): WebApiRequest {
    return {
      // apiBase: eApiBase.DryDockApi,
      apiBase: 'dryDockAPI',
      action: 'specification-details/sub-items/find-sub-items',
      crud: eCrud.Post,
      entity: 'drydock',
      body: {
        specificationDetailsUid: specificationUid
      },
    };
  }

  getGridData(): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      actions: this.gridRowActions,
      filters: this.filters,
      filtersLists: this.filtersLists
    };
  }

  public readonly gridName: string = 'specificationSubItemGrid';

  private readonly columns: Column[] = [
    {
      DisableSort: true,
      DisplayText: 'Item No',
      FieldName: 'item_number',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '70px'
    },
    {
      DisableSort: true,
      DisplayText: 'Subject',
      FieldName: 'subject',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '324px'
    },
    {
      DisableSort: true,
      DisplayText: 'Unit',
      FieldName: 'kind',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '83px'
    },
    {
      DisableSort: true,
      DisplayText: 'Quantity',
      FieldName: 'db_done_by',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '84px'
    },
    {
      DisableSort: true,
      DisplayText: 'Unit Price',
      FieldName: 'inspection',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '130px'
    },
    {
      DisableSort: true,
      DisplayText: 'Discount %',
      FieldName: 'status',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '182px'
    },
    {
      DisableSort: true,
      DisplayText: 'Cost',
      FieldName: 'status',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '182px'
    }
  ];

  private gridRowActions: GridRowActions[] = [
    {
      name: eGridRowActions.Edit,
      label: eGridRowActions.Edit,
      color: eColor.JbBlack,
      icon: eIconNames.Edit
    }
  ];

  private readonly filters: Filter[] = [];

  private filtersLists: FilterListSet = {};

}
