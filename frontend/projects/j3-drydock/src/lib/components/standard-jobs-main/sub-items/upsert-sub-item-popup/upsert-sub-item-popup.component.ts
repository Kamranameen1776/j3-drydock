import { subItemUpsertFormId } from './../../../../models/constants/constants';
import { SubItem } from './../../../../models/interfaces/sub-items';
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
  @Output() closeDialog = new EventEmitter<boolean>();

  @ViewChild(UpsertSubItemFormComponent) popupForm: UpsertSubItemFormComponent;

  public isPopupValid = false;

  public readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 1000, closableIcon: false };

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

  onClosePopup() {
    this.closePopup();
  }

  onOkPopup() {
    this.save();
  }

  onIsFormValid(isValid: boolean) {
    this.isPopupValid = isValid;
  }

  private setPopupHeader() {
    this.popupConfig.dialogHeader = !this.isEditing ? 'Add Sub Item' : 'Update Sub Item';
  }

  private setPopupFooter() {
    this.okLabel = this.isEditing ? 'Update' : 'Save';
  }

  private closePopup(isSaved = false) {
    this.closeDialog.emit(isSaved);
    this.isPopupValid = false;
  }

  private save() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const value = this.formValue;

    // TODO here can be addded validation messages for the form that appear in growl

    this.isSaving = true;

    // this.projectsLibraryService.upsertProjectRecord(this.item?.uid, value).pipe(
    //   finalize(() => {
    //     this.isSaving = false;
    //   })
    // ).subscribe(res => {
    //   this.closePopup(true);
    // }, err => {
    //   if (err?.status === 422) {
    //     this.growlMessageService.setValidationErrorMessage(err.error);
    //   } else {
    //     this.growlMessageService.setValidationErrorMessage('Server error occured');
    //   }
    // });
  }
}
