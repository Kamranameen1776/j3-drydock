import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IJbDialog } from 'jibe-components';
import { getSmallPopup } from '../../../../../models/constants/popup';
import { JobOrdersUpdatesDto } from '../../dto/JobOrdersUpdatesDto';
import { DailyReportsGridService } from '../../reports.service';
@Component({
  selector: 'jb-select-job-order-popup',
  templateUrl: './select-job-order-popup.component.html',
  styleUrls: ['./select-job-order-popup.component.scss'],
  providers: [DailyReportsGridService]
})
export class SelectJobOrderPopupComponent {
  @Input() isOpen: boolean;
  @Input() projectId: string;

  @Output() closeDialog = new EventEmitter<JobOrdersUpdatesDto[]>();

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 800, dialogHeader: 'Add Updates' };

  okLabel = 'Add';

  jobOrdersToLink: JobOrdersUpdatesDto[];

  constructor() {}

  onSelectedChanged(event: JobOrdersUpdatesDto[]) {
    this.jobOrdersToLink = event;
  }

  onClosePopup() {
    this.closeDialog.emit();
  }

  onOkPopup() {
    this.closeDialog.emit(this.jobOrdersToLink);
  }
}
