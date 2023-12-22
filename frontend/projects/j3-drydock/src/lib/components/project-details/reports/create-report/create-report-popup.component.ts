import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IJbDialog } from 'jibe-components';
import { getSmallPopup } from '../../../../models/constants/popup';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { GrowlMessageService } from '../../../../services/growl-message.service';

@Component({
  selector: 'jb-drydock-create-report-popup',
  templateUrl: './create-report-popup.component.html',
  styleUrls: ['./create-report-popup.component.scss']
})
export class CreateReportPopupComponent extends UnsubscribeComponent implements OnInit {
  @Input() isOpen: boolean;

  @Output() closeDialog = new EventEmitter<boolean>();

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 800, dialogHeader: 'Daily Report' };

  saveLabel = 'Save';

  isSaving: boolean;

  reportName: string;

  constructor(
    private growlMessageService: GrowlMessageService,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  onClosePopup() {
    this.closePopup();
  }

  submit() {
    this.save();
  }

  private closePopup(isSaved = false) {
    this.closeDialog.emit(isSaved);
  }

  private save() {
    this.isSaving = true;

    this.isSaving = false;
  }
}
