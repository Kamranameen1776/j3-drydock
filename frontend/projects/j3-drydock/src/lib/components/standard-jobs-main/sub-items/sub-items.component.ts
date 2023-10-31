/* eslint-disable no-console */
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { SubItem } from '../../../models/interfaces/sub-items';
import { GridAction, GridRowActions, eGridRowActions } from 'jibe-components';
import { GridInputsWithData } from '../../../models/interfaces/grid-inputs';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { SubItemsGridService } from './SubItemsGridService';
import { StandardJobsService } from '../../../services/StandardJobsService';
import { getSmallPopup } from '../../../models/constants/popup';
import { StandardJobResult } from '../../../models/interfaces/standard-jobs';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'jb-drydock-sub-items',
  templateUrl: './sub-items.component.html',
  styleUrls: ['./sub-items.component.scss'],
  providers: [SubItemsGridService]
})
export class SubItemsComponent extends UnsubscribeComponent implements OnChanges, OnInit {
  @Input() job: StandardJobResult;

  @Input() functionUid: string;

  @Output() updated = new EventEmitter<SubItem[]>();

  public gridInputs: GridInputsWithData<SubItem>;

  public isUpsertPopupVisible = false;

  public currentRow: SubItem;

  public gridRowActions: GridRowActions[] = [];

  public subItems: SubItem[];

  public confirmationPopUp = {
    ...getSmallPopup(),
    dialogHeader: 'Delete Sub Item'
  };

  public isConfirmDeleteVisible = false;

  constructor(
    private subItemsGridService: SubItemsGridService,
    private standardJobsService: StandardJobsService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.functionUid) {
      this.setGridButton();
    }
  }

  ngOnInit(): void {
    this.setGridInputs();
    this.setGridRowActions();
    this.initSubItems();
  }

  public onGridAction({ type, payload }: GridAction<string, unknown>): void {
    switch (type) {
      case this.gridInputs.gridButton.label:
        this.isUpsertPopupVisible = true;
        break;
      case eGridRowActions.Edit:
        this.editRow(<SubItem>payload);
        break;
      case eGridRowActions.Delete:
        this.deleteRow(<SubItem>payload);
        break;
      default:
        break;
    }
  }

  public onCloseUpsertPopup(itemToSave: SubItem | null) {
    this.isUpsertPopupVisible = false;
    this.currentRow = undefined;

    if (itemToSave) {
      itemToSave.uid ? this.edit(itemToSave) : this.add(itemToSave);
    }
  }

  public onConfirmDeleteOk() {
    this.delete(this.currentRow);
  }

  public onConfirmDeleteCancel() {
    this.isConfirmDeleteVisible = false;
  }

  private editRow(row: SubItem) {
    this.currentRow = row;
    this.isUpsertPopupVisible = true;
  }

  private deleteRow(row: SubItem) {
    this.currentRow = row;
    this.isConfirmDeleteVisible = true;
  }

  private delete(record: SubItem) {
    // eslint-disable-next-line eqeqeq
    const idx = this.subItems.findIndex((item) => item == record);
    if (idx > -1) {
      this.subItems = [...this.subItems];
      this.subItems.splice(idx, 1);
    }
    this.updateSubItems();
  }

  private add(record: SubItem) {
    this.subItems.push(record);
    this.updateSubItems();
  }

  private edit(record: SubItem) {
    const idx = this.subItems.findIndex((item) => item.uid === record.uid);
    if (idx > -1) {
      this.subItems[idx] = record;
      this.updateSubItems();
    }
  }

  private setGridRowActions(): void {
    this.gridRowActions.length = 0;

    this.gridRowActions.push({
      name: eGridRowActions.Edit
    });

    this.gridRowActions.push({
      name: eGridRowActions.Delete
    });
  }

  private setGridInputs() {
    this.gridInputs = this.subItemsGridService.getGridInputs();
    this.setGridButton();
  }

  private initSubItems() {
    const subItems = this.job?.subItems ?? [];
    this.subItems = cloneDeep(subItems);
  }

  private setGridButton() {
    if (!this.gridInputs) {
      return;
    }

    this.gridInputs.gridButton = {
      ...this.gridInputs.gridButton,
      disabled: !this.functionUid
    };
  }

  private updateSubItems() {
    // TODO
    this.standardJobsService.updateJobSubItems(this.job.uid, this.subItems).subscribe((res) => {
      console.log(res);
    });
  }
}
