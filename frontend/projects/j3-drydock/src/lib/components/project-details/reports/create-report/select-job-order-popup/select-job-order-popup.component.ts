import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class SelectJobOrderPopupComponent implements OnInit {
  @Input() isOpen: boolean;
  @Input() projectId: string;

  @Output() closeDialog = new EventEmitter<boolean>();
  @Output() selectedJobOrders = new EventEmitter<JobOrdersUpdatesDto[]>();

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 800, dialogHeader: 'Updates' };

  okLabel = 'Add';

  isSaving: boolean;

  private jobOrdersToLink: JobOrdersUpdatesDto[];

  constructor() {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method, @typescript-eslint/no-empty-function
  ngOnInit(): void {}

  onSelectedChanged(event: JobOrdersUpdatesDto[]) {
    this.jobOrdersToLink = event;
  }

  onClosePopup() {
    this.closePopup();
  }

  onOkPopup() {
    this.selectedJobOrders.emit(this.jobOrdersToLink);
    this.closePopup(true);
  }

  private closePopup(isSaved = false) {
    this.isOpen = false;
    this.closeDialog.emit(isSaved);
  }
}
