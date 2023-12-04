import { Component, Input, Output, EventEmitter } from '@angular/core';
import { getSmallPopup } from '../../../models/constants/popup';

@Component({
  selector: 'jb-drydock-simple-confirmation-popup',
  templateUrl: './simple-confirmation-popup.component.html'
})
export class SimpleConfirmationPopupComponent {
  @Input() set config(val) {
    if (!val) {
      return;
    }
    this.popupConfig = { ...this.popupConfig, ...val };
  }

  @Input() isOpen = false;

  @Input() okLabel = 'Confirm';

  @Output() confirmed = new EventEmitter<boolean>();

  popupConfig = getSmallPopup();

  constructor() {}

  onClosePopup(isConfirmed = false) {
    this.confirmed.emit(isConfirmed);
  }
}
