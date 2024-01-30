import { Component, Input, OnInit, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { DisableGridFeature } from 'jibe-components';
import { CostUpdatesService } from './cost-updates.service';
import { GridInputsWithRequest } from '../../../../models/interfaces/grid-inputs';
import { NewTabService } from '../../../../services/new-tab-service';
import { ActivatedRoute } from '@angular/router';
import { SpecificationSubItemCostUpdate, UpdateCostsDto } from '../../../../models/dto/specification-details/ISpecificationCostUpdateDto';
import { nameOf } from '../../../../utils/nameOf';

type subItemDataType = { [key: string]: { uid: string; utilized: number } };

@Component({
  selector: 'jb-cost-updates',
  templateUrl: './cost-updates.component.html',
  styleUrls: ['./cost-updates.component.scss'],
  providers: [CostUpdatesService]
})
export class CostUpdatesComponent implements OnInit {
  @Input() projectId: string;

  @Output() updatesCostsData = new EventEmitter<UpdateCostsDto>();
  @ViewChild('utilizedTemplate', { static: true }) utilizedTemplate: TemplateRef<unknown>;

  gridInputs: GridInputsWithRequest;

  disableFeature: DisableGridFeature = {
    header: false,
    export: false,
    matrix: true,
    sideMenu: false
  };

  subItemData: subItemDataType = {};
  updatePayload: UpdateCostsDto;

  constructor(
    private costUpdatesService: CostUpdatesService,
    private newTabService: NewTabService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.gridInputs = this.costUpdatesService.getGridInputs(this.projectId);

    const col = this.gridInputs.columns.find(
      (col) => col.FieldName === nameOf<SpecificationSubItemCostUpdate>((prop) => prop.utilizedCost)
    );

    if (col) {
      col.cellTemplate = this.utilizedTemplate;
    }
  }

  cellPlainTextClick({ cellType, rowData, columnDetail }) {
    if (cellType === 'hyperlink' && columnDetail.FieldName === 'code') {
      const pageTitle = `Specification ${rowData.code}`;
      this.newTabService.navigate(
        ['../../specification-details', rowData.specificationUid],
        {
          relativeTo: this.activatedRoute,
          queryParams: { pageTitle }
        },
        pageTitle
      );
    }
  }

  onCellChange(cellData: SpecificationSubItemCostUpdate) {
    this.subItemData[cellData.subItemUid] = { uid: cellData.subItemUid, utilized: cellData.utilizedCost };
    const subItemsData = Object.values(this.subItemData);
    this.updatePayload = { subItems: subItemsData, specificationDetailsUid: cellData.specificationUid };
    this.updatesCostsData.emit(this.updatePayload);
  }
}
