import { Component, Input, OnInit } from '@angular/core';
import { SpecificationDetailsSubItemsGridService } from '../../../services/specification-details/specification-details-sub-item.service';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { eGridRefreshType, eGridRowActions, GridService } from 'jibe-components';
import { GridAction } from 'jibe-components/lib/grid/models/grid-action.model';
import { SpecificationSubItem } from '../../../models/interfaces/specification-sub-item';
import { SpecificationDetails } from '../../../models/interfaces/specification-details';

@Component({
  selector: 'jb-specification-sub-items',
  templateUrl: './specification-sub-items.component.html',
  styleUrls: ['./specification-sub-items.component.scss']
})
export class SpecificationSubItemsComponent implements OnInit {
  @Input() specificationDetailsInfo: SpecificationDetails;
  gridData: GridInputsWithRequest;

  selectedSubItem: SpecificationSubItem;

  constructor(
    private subItemsGridService: SpecificationDetailsSubItemsGridService,
    private gridService: GridService
  ) {}

  ngOnInit(): void {
    this.gridData = this.getData();
  }

  actionHandler(action: GridAction<eGridRowActions, SpecificationSubItem>): void {
    switch (action.type) {
      case eGridRowActions.Edit:
        this.selectedSubItem = action.payload;
        break;
      default:
        break;
    }
  }

  closeDialog(isSaved: boolean) {
    if (isSaved) {
      this.gridData = this.getData();
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridData.gridName);
    }

    this.selectedSubItem = null;
  }

  private getData() {
    return this.subItemsGridService.getGridData(this.specificationDetailsInfo?.uid);
  }
}
