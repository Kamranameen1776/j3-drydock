import { Injectable } from '@angular/core';
import { GridRowActions, UserService, eGridColumnsWidth } from 'jibe-components';
import { GridInputsWithData } from '../../../models/interfaces/grid-inputs';
import { SpecificationSubItem } from '../../../models/interfaces/specification-sub-item';

export enum eCostUpdatesTabFields {
  ItemNumber = 'number',
  Subject = 'subject',
  Unit = 'unitType',
  Quantity = 'quantity',
  UnitPrice = 'unitPrice',
  DiscountPercents = 'discount',
  EstimatesCost = 'estimatedCost',
  ActualCost = 'cost'
}

export enum eCostUpdatesTabLabels {
  ItemNumber = 'Item Number',
  Subject = 'Subject',
  Unit = 'Unit',
  Quantity = 'Quantity',
  UnitPrice = 'Unit Price',
  DiscountPercents = 'Discount (%)',
  EstimatesCost = 'Estimates Cost',
  ActualCost = 'Actual Cost'
}

@Injectable()
export class CostUpdatesTabService {
  readonly gridName: string = 'costUpdatesTabGrid';

  private readonly gridActions: GridRowActions[] = [{ name: 'Edit Job Update', icon: 'icons8-edit' }];

  constructor(private userService: UserService) {}

  getGridInputs(): GridInputsWithData<SpecificationSubItem> {
    return {
      columns: [
        {
          DisplayText: eCostUpdatesTabLabels.ItemNumber,
          FieldName: eCostUpdatesTabFields.ItemNumber,
          IsActive: true,
          IsMandatory: true,
          IsVisible: true,
          width: eGridColumnsWidth.LongDescription
        },
        {
          DisplayText: eCostUpdatesTabLabels.Subject,
          FieldName: eCostUpdatesTabFields.Subject,
          IsActive: true,
          IsMandatory: true,
          IsVisible: true,
          width: '200px'
        },
        {
          DisplayText: eCostUpdatesTabLabels.Unit,
          FieldName: eCostUpdatesTabFields.Unit,
          IsActive: true,
          IsMandatory: true,
          IsVisible: true,
          width: eGridColumnsWidth.ShortDescription
        },
        {
          DisplayText: eCostUpdatesTabLabels.Quantity,
          FieldName: eCostUpdatesTabFields.Quantity,
          IsActive: true,
          IsMandatory: true,
          IsVisible: true,
          width: eGridColumnsWidth.LongDescription
        },
        {
          DisplayText: eCostUpdatesTabLabels.UnitPrice,
          FieldName: eCostUpdatesTabFields.UnitPrice,
          IsActive: true,
          IsMandatory: true,
          IsVisible: true,
          width: eGridColumnsWidth.LongDescription
        },
        {
          DisplayText: eCostUpdatesTabLabels.DiscountPercents,
          FieldName: eCostUpdatesTabFields.DiscountPercents,
          IsActive: true,
          IsMandatory: true,
          IsVisible: true,
          width: eGridColumnsWidth.LongDescription
        },
        {
          DisplayText: eCostUpdatesTabLabels.EstimatesCost,
          FieldName: eCostUpdatesTabFields.EstimatesCost,
          IsActive: true,
          IsMandatory: true,
          IsVisible: true,
          width: eGridColumnsWidth.LongDescription
        },
        {
          DisplayText: eCostUpdatesTabLabels.ActualCost,
          FieldName: eCostUpdatesTabFields.ActualCost,
          IsActive: true,
          IsMandatory: true,
          IsVisible: true,
          width: eGridColumnsWidth.LongDescription
        }
      ],
      gridName: this.gridName,
      actions: this.gridActions,
      data: [],
      sortField: eCostUpdatesTabFields.ItemNumber,
      sortOrder: -1
    };
  }
}
