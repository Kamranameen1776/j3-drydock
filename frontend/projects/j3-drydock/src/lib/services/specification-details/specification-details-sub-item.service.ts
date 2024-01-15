import { Injectable } from '@angular/core';
import { Column, Filter, FilterListSet, GridRowActions, WebApiRequest, eColor, eCrud, eGridRowActions, eIconNames } from 'jibe-components';
import { GridInputsWithRequest } from '../../models/interfaces/grid-inputs';
import {
  eSpecificationDetailsSubItemsFields,
  eSpecificationDetailsSubItemsLabels
} from '../../models/enums/specification-details-sub-items.enum';
import { SpecificationDetailsService } from './specification-details.service';
import { eSpecificationAccessActions } from '../../models/enums/access-actions.enum';

@Injectable()
export class SpecificationDetailsSubItemsGridService {
  constructor(private specificationDetailService: SpecificationDetailsService) {}

  public readonly gridName: string = 'specificationSubItemGrid';
  private readonly columns: Column[] = [
    {
      DisplayText: eSpecificationDetailsSubItemsLabels.Number,
      FieldName: eSpecificationDetailsSubItemsFields.Number,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '70px'
    },
    {
      DisplayText: eSpecificationDetailsSubItemsLabels.Subject,
      FieldName: eSpecificationDetailsSubItemsFields.Subject,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '324px'
    },
    {
      DisplayText: eSpecificationDetailsSubItemsLabels.Unit,
      FieldName: eSpecificationDetailsSubItemsFields.Unit,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '83px'
    },
    {
      DisplayText: eSpecificationDetailsSubItemsLabels.Quantity,
      FieldName: eSpecificationDetailsSubItemsFields.Quantity,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '84px'
    },
    {
      DisplayText: eSpecificationDetailsSubItemsLabels.UnitPrice,
      FieldName: eSpecificationDetailsSubItemsFields.UnitPrice,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '130px'
    },
    {
      DisplayText: eSpecificationDetailsSubItemsLabels.Discount,
      FieldName: eSpecificationDetailsSubItemsFields.Discount,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '182px'
    },
    {
      DisplayText: eSpecificationDetailsSubItemsLabels.Cost,
      FieldName: eSpecificationDetailsSubItemsFields.Cost,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '182px'
    }
  ];

  private getGridRowActions(): GridRowActions[] {
    const res = [];

    if (this.specificationDetailService.hasAccess(eSpecificationAccessActions.editSubItems)) {
      res.push({
        name: eGridRowActions.Edit,
        label: eGridRowActions.Edit,
        color: eColor.JbBlack,
        icon: eIconNames.Edit,
        fieldName: 'hideActions',
        condition: true,
        actionTrueValue: false,
        actionFalseValue: true
      });
    }
    if (this.specificationDetailService.hasAccess(eSpecificationAccessActions.deleteSubItems)) {
      res.push({
        name: eGridRowActions.Delete,
        label: eGridRowActions.Delete,
        color: eColor.JbBlack,
        icon: eIconNames.Delete,
        fieldName: 'hideActions',
        condition: true,
        actionTrueValue: false,
        actionFalseValue: true
      });
    }

    return res;
  }

  private readonly filters: Filter[] = [];
  private filtersLists: FilterListSet = {};

  public getApiRequest(specificationUid): WebApiRequest {
    return {
      // apiBase: eApiBase.DryDockApi,
      apiBase: 'dryDockAPI',
      action: 'specification-details/sub-items/find-sub-items',
      crud: eCrud.Post,
      entity: 'drydock',
      body: {
        specificationDetailsUid: specificationUid
      }
    };
  }

  getGridData(specificationUid): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      actions: this.getGridRowActions(),
      filters: this.filters,
      filtersLists: this.filtersLists,
      request: this.getApiRequest(specificationUid),
      searchFields: [
        {
          field: eSpecificationDetailsSubItemsFields.Subject,
          pattern: 'contains'
        }
      ]
    };
  }
}
