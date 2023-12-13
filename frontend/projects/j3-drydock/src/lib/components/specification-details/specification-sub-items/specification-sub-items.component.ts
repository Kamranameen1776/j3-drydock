import { Component, Input, OnInit } from '@angular/core';
import { GetSpecificationDetailsDto } from '../../../models/dto/specification-details/GetSpecificationDetailsDto';
import { SpecificationDetailsSubItemsGridService } from '../../../services/specification-details/specification-details-sub-item.service';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { eGridRowActions } from 'jibe-components';
import { GridAction } from 'jibe-components/lib/grid/models/grid-action.model';
import { SpecificationSubItem } from '../../../models/interfaces/specification-sub-item';

@Component({
  selector: 'jb-specification-sub-items',
  templateUrl: './specification-sub-items.component.html',
  styleUrls: ['./specification-sub-items.component.scss']
})
export class SpecificationSubItemsComponent implements OnInit {
  @Input() specificationDetailsInfo: GetSpecificationDetailsDto;
  gridData: GridInputsWithRequest;

  selectedSubItem: SpecificationSubItem;

  constructor(private subItemsGridService: SpecificationDetailsSubItemsGridService) {}

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

  private getData() {
    return this.subItemsGridService.getGridData(this.specificationDetailsInfo?.uid);
  }

  closeDialog(isSaved: boolean) {
    if (isSaved) {
      this.gridData = this.getData();
    }
    this.selectedSubItem = null;
  }
}
