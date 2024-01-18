import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DisableGridFeature } from 'jibe-components';
import { CostUpdatesService } from './cost-updates.service';
import { GridInputsWithRequest } from '../../../../models/interfaces/grid-inputs';
import { NewTabService } from '../../../../services/new-tab-service';
import { ActivatedRoute } from '@angular/router';
import { SpecificationCostUpdateDto, UpdateCostsDto } from '../../../../models/dto/specification-details/ISpecificationCostUpdateDto';
import { JbCellChangeEvent } from '../../../../models/interfaces/jb-cell-change-event';

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
  }

  cellPlainTextClick({ cellType, rowData, columnDetail }) {
    if (cellType === 'hyperlink' && columnDetail.FieldName === 'code') {
      this.newTabService.navigate(['../../specification-details', rowData.specificationUid], {
        relativeTo: this.activatedRoute,
        queryParams: { pageTitle: `Specification ${rowData.code}` }
      });
    }
  }

  onCellChange(cellData: JbCellChangeEvent<SpecificationCostUpdateDto>) {
    let subItemsData;

    if (cellData.rowIndex.parent) {
      this.subItemData[cellData.rowData.subItemUid] = { uid: cellData.rowData.subItemUid, utilized: cellData.cellvalue as number };
      subItemsData = Object.values(this.subItemData);
    }

    if (subItemsData) {
      this.updatePayload = { subItems: subItemsData, specificationDetailsUid: cellData.rowIndex.parent?.data.specificationUid };
      this.updatesCostsData.emit(this.updatePayload);
    }
  }
}
