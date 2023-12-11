import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { getSmallPopup } from '../../../models/constants/popup';
import { UnsubscribeComponent } from '../../classes/unsubscribe.base';
import { IJbDialog } from 'jibe-components';
import { ReworkPopupFormComponent } from './rework-popup-form/rework-popup-form.component';
import { reworkPopupFormId } from '../../../models/constants/constants';

@Component({
  selector: 'jb-drydock-rework-popup',
  templateUrl: './rework-popup.component.html',
  styleUrls: ['./rework-popup.component.scss']
})
export class ReworkPopupComponent extends UnsubscribeComponent {
  @Input() itemNo: string;

  @Input() isOpen: boolean;

  @Output() closeDialog = new EventEmitter<boolean>();

  @ViewChild(ReworkPopupFormComponent) popupForm: ReworkPopupFormComponent;

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogHeader: 'Rework' };

  isPopupValid = false;

  okLabel = 'Save';

  isSaving: boolean;

  get formValue() {
    return this.popupForm?.formGroup.getRawValue()[reworkPopupFormId];
  }

  constructor() {
    super();
  }

  onClosePopup() {
    this.closePopup(false);
  }

  onOkPopup() {
    this.save();
  }

  onIsFormValid(isValid: boolean) {
    this.isPopupValid = isValid;
  }

  private closePopup(isSuccess: boolean) {
    this.closeDialog.emit(isSuccess);
    this.isPopupValid = false;
  }

  private save() {
    // TODO rework api call first and then close popup
    this.closePopup(true);
  }
}
