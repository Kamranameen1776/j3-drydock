import { subItemUpsertFormId } from '../../../../models/constants/constants';
import { SubItem } from '../../../../models/interfaces/sub-items';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { UpsertSubItemFormComponent } from '../upsert-sub-item-form/upsert-sub-item-form.component';
import { IJbDialog } from 'jibe-components';
import { getSmallPopup } from '../../../../models/constants/popup';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';

@Component({
  selector: 'jb-upsert-sub-item-popup',
  templateUrl: './upsert-sub-item-popup.component.html',
  styleUrls: ['./upsert-sub-item-popup.component.scss']
})
export class UpsertSubItemPopupComponent extends UnsubscribeComponent implements OnChanges {
  @Input() item: SubItem;

  @Input() isOpen: boolean;

  @Output() closeDialog = new EventEmitter<SubItem | null>();

  @ViewChild(UpsertSubItemFormComponent) popupForm: UpsertSubItemFormComponent;

  public isPopupValid = false;

  public readonly popupConfig: IJbDialog = { ...getSmallPopup() };

  public get isEditing() {
    return !!this.item;
  }

  public okLabel: string;

  public isSaving: boolean;

  public get formValue() {
    return this.popupForm?.formGroup.getRawValue()[subItemUpsertFormId];
  }

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      this.setPopupHeader();
      this.setPopupFooter();
    }
  }

  public onClosePopup() {
    this.closePopup();
  }

  public onOkPopup() {
    this.save();
  }

  public onIsFormValid(isValid: boolean) {
    this.isPopupValid = isValid;
  }

  private setPopupHeader() {
    this.popupConfig.dialogHeader = !this.isEditing ? 'Add Sub Item' : 'Edit Sub Item';
  }

  private setPopupFooter() {
    this.okLabel = 'Save';
  }

  private closePopup(itemToSave?: SubItem) {
    this.closeDialog.emit(itemToSave ?? null);
    this.isPopupValid = false;
  }

  private save() {
    const value = this.formValue;

    if (this.isEditing) {
      this.closePopup({ ...this.item, ...value });
    } else {
      this.closePopup({ ...value });
    }
  }
}
