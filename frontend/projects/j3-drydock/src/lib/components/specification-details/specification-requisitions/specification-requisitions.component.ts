import { Component, Input, OnInit } from '@angular/core';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import {
  Column,
  eCrud,
  eEntities,
  eFieldControlType,
  eGridRefreshType,
  eGridRowActions,
  eLayoutWidgetSize,
  GridRowActions,
  GridService,
  JbButtonType,
  SearchField,
  ShowSettings,
  WebApiRequest
} from 'jibe-components';

import { GridAction } from 'jibe-components/lib/grid/models/grid-action.model';
import { SpecificationRequisition } from '../../../models/interfaces/specification-requisition';
import { SpecificationDetailsService } from '../../../services/specification-details/specification-details.service';
import {
  SpecificationRequisitionsDisplayTexts,
  SpecificationRequisitionsFieldNames
} from '../../../models/enums/specification-requisitions.enum';
import { eSpecificationAccessActions } from '../../../models/enums/access-actions.enum';
import { eApiBaseDryDockAPI } from '../../../models/constants/constants';

@Component({
  selector: 'jb-specification-requisitions',
  templateUrl: './specification-requisitions.component.html',
  styleUrls: ['./specification-requisitions.component.scss']
})
export class SpecificationRequisitionsComponent extends UnsubscribeComponent implements OnInit {
  @Input() specificationUid: string;

  gridData: GridInputsWithRequest;
  readonly eLayoutWidgetSize = eLayoutWidgetSize;
  readonly JbButtonType = JbButtonType;

  private columns: Column[] = [
    {
      DisplayText: SpecificationRequisitionsDisplayTexts.Number,
      FieldName: SpecificationRequisitionsFieldNames.Number,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    },
    {
      DisplayText: SpecificationRequisitionsDisplayTexts.Subject,
      FieldName: SpecificationRequisitionsFieldNames.Subject,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    },
    {
      DisplayText: SpecificationRequisitionsDisplayTexts.Priority,
      FieldName: SpecificationRequisitionsFieldNames.Priority,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    },
    {
      DisplayText: SpecificationRequisitionsDisplayTexts.Supplier,
      FieldName: SpecificationRequisitionsFieldNames.Supplier,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    },
    {
      DisplayText: SpecificationRequisitionsDisplayTexts.PoDate,
      FieldName: SpecificationRequisitionsFieldNames.PoDate,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      FieldType: eFieldControlType.Date,
      ControlType: eFieldControlType.Date
    },
    {
      DisplayText: SpecificationRequisitionsDisplayTexts.DeliveryDate,
      FieldName: SpecificationRequisitionsFieldNames.DeliveryDate,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      FieldType: eFieldControlType.Date,
      ControlType: eFieldControlType.Date
    },
    {
      DisplayText: SpecificationRequisitionsDisplayTexts.Port,
      FieldName: SpecificationRequisitionsFieldNames.Port,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    },
    {
      DisplayText: SpecificationRequisitionsDisplayTexts.Amount,
      FieldName: SpecificationRequisitionsFieldNames.Amount,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      FieldType: eFieldControlType.Number,
      Precision: '1.2-2'
    },
    {
      DisplayText: SpecificationRequisitionsDisplayTexts.Status,
      FieldName: SpecificationRequisitionsFieldNames.Status,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    }
  ];

  private searchFields: SearchField[] = [
    {
      field: SpecificationRequisitionsFieldNames.Number,
      pattern: 'contains'
    },
    {
      field: SpecificationRequisitionsFieldNames.Subject,
      pattern: 'contains'
    }
  ];

  private showSettings: ShowSettings = {
    showButton: true,
    showAdditionalFilters: false,
    showThreeDotsMenu: false,
    showSearchBox: true,
    showFilterChips: false
  };

  constructor(
    private specificationDetailsService: SpecificationDetailsService,
    private gridService: GridService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.setGridData();
  }

  setGridData() {
    this.gridData = {
      gridName: `specification-requisitions-${this.specificationUid}`,
      columns: this.columns,
      request: this.getApiRequest(),
      searchFields: this.searchFields,
      advancedSettings: [],
      showSettings: this.showSettings,
      actions: []
    };

    this.gridData.actions = this.getGridRowActions();
  }

  onGridAction(event: GridAction<eGridRowActions, SpecificationRequisition>) {
    // eslint-disable-next-line default-case
    switch (event.type) {
      case eGridRowActions.Delete:
        this.deleteSpecificationRequisition(event.payload);
        break;
      default:
        break;
    }
  }

  private getGridRowActions() {
    const actions: GridRowActions[] = [];

    if (this.specificationDetailsService.hasAccess(eSpecificationAccessActions.editRequisition)) {
      actions.push({
        name: eGridRowActions.Delete,
        gridName: this.gridData.gridName
      });
    }

    return actions;
  }

  private getApiRequest(): WebApiRequest {
    return {
      entity: eEntities.DryDock,
      apiBase: eApiBaseDryDockAPI,
      action: 'specification-details/get-specification-requisitions',
      crud: eCrud.Post,
      body: { uid: this.specificationUid }
    };
  }

  private deleteSpecificationRequisition(specificationRequisition: SpecificationRequisition) {
    this.specificationDetailsService.deleteSpecificationRequisition(this.specificationUid, specificationRequisition.uid).subscribe(() => {
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridData.gridName);
    });
  }
}
