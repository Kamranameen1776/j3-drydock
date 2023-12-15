import { Component, Input, OnInit } from '@angular/core';
import { SpecificationDetailsSubItemsGridService } from '../../../services/specification-details/specification-details-sub-item.service';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { eGridRefreshType, eGridRowActions, GridService } from 'jibe-components';
import { GridAction } from 'jibe-components/lib/grid/models/grid-action.model';
import { SpecificationSubItem } from '../../../models/interfaces/specification-sub-item';
import { SpecificationDetails } from '../../../models/interfaces/specification-details';
import { getSmallPopup } from '../../../models/constants/popup';
import { SpecificationSubItemEditService } from './specification-sub-item-edit.service';
import { GrowlMessageService } from '../../../services/growl-message.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'jb-specification-sub-items',
  templateUrl: './specification-sub-items.component.html',
  styleUrls: ['./specification-sub-items.component.scss']
})
export class SpecificationSubItemsComponent implements OnInit {
  @Input() specificationDetailsInfo: SpecificationDetails;
  gridData: GridInputsWithRequest;

  selectedSubItem: SpecificationSubItem;
  selectedDeleteSubItem: SpecificationSubItem;

  deleteSubItemPopupConfig = {
    ...getSmallPopup(),
    dialogHeader: 'Delete Sub Item'
  };

  private deleteLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private subItemsGridService: SpecificationDetailsSubItemsGridService,
    private gridService: GridService,
    private specificationSubItemService: SpecificationSubItemEditService,
    private growlService: GrowlMessageService
  ) {}

  ngOnInit(): void {
    this.gridData = this.getData();
  }

  actionHandler(action: GridAction<eGridRowActions, SpecificationSubItem>): void {
    switch (action.type) {
      case eGridRowActions.Edit:
        this.selectedSubItem = action.payload;
        break;
      case eGridRowActions.Delete:
        this.selectedDeleteSubItem = action.payload;
        break;
      default:
        break;
    }
  }

  closeEditDialog(isSaved: boolean) {
    if (isSaved) {
      this.gridData = this.getData();
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridData.gridName);
    }

    this.selectedSubItem = null;
  }

  cancelDelete() {
    this.selectedDeleteSubItem = null;
  }

  confirmDelete() {
    this.deleteLoading$.next(true);
    this.specificationSubItemService.deleteSubItem(this.selectedDeleteSubItem.uid, this.specificationDetailsInfo.uid).subscribe(
      () => {
        this.gridData = this.getData();
        this.gridService.refreshGrid(eGridRefreshType.Table, this.gridData.gridName);
        this.selectedDeleteSubItem = null;
        this.deleteLoading$.next(false);
      },
      (err) => {
        this.growlService.errorHandler(err);
        this.selectedDeleteSubItem = null;
        this.deleteLoading$.next(false);
      }
    );
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
