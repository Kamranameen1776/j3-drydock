import { Injectable } from '@angular/core';
import { Column, WebApiRequest, eCrud, eFieldControlType, eGridCellType, eGridColumnsWidth } from 'jibe-components';
import { GridInputsWithRequest } from '../../../../models/interfaces/grid-inputs';
import {
  SpecificationCostUpdate,
  SpecificationSubItemCostUpdate
} from '../../../../models/dto/specification-details/ISpecificationCostUpdateDto';
import { nameOf } from '../../../../utils/nameOf';
import { eSortOrder } from '../../../../models/enums/sorting.enum';
@Injectable()
export class CostUpdatesService {
  gridName = 'costUpdatesGrid';

  constructor() {}

  private readonly columns: Column[] = [
    {
      DisplayText: 'Specification',
      FieldName: nameOf<SpecificationCostUpdate>((prop) => prop.code),
      IsActive: false,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      hyperlink: true
    },
    {
      DisplayText: 'Sub Item',
      DisableSort: true,
      FieldName: nameOf<SpecificationSubItemCostUpdate>((prop) => prop.subItemSubject),
      IsActive: false,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    },
    {
      DisplayText: 'Status',
      DisableSort: true,
      FieldName: nameOf<SpecificationCostUpdate>((prop) => prop.status),
      IsActive: false,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    },
    {
      DisplayText: 'Estimated Costs (Yard / Owner)',
      DisableSort: true,
      FieldName: nameOf<SpecificationCostUpdate>((prop) => prop.estimatedCost),
      IsActive: false,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    },
    {
      DisplayText: 'Utilized',
      DisableSort: true,
      FieldName: nameOf<SpecificationSubItemCostUpdate>((prop) => prop.utilizedCost),
      FieldType: eGridCellType.Number,
      ControlType: eFieldControlType.Number,
      Editable: true,
      IsActive: true,
      IsVisible: true,
      IsMandatory: false,
      KeyFilter: 'pnum',
      Precision: '1.2-2'
    },
    {
      DisplayText: 'Variance',
      DisableSort: true,
      FieldName: nameOf<SpecificationSubItemCostUpdate>((prop) => prop.variance),
      IsActive: false,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    }
  ];

  public getGridInputs(projectId: string): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      request: this.getCostUpdatesAPIRequest(projectId),
      sortField: nameOf<SpecificationCostUpdate>((prop) => prop.code),
      sortOrder: eSortOrder.Ascending
    };
  }

  public getCostUpdatesAPIRequest(projectId: string): WebApiRequest {
    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'specification-details/get-specification-cost-updates',
      crud: eCrud.Post,
      entity: 'drydock',
      body: {
        projectUid: projectId
      },
      odata: {
        orderby: 'code asc'
      }
    };

    return apiRequest;
  }
}
