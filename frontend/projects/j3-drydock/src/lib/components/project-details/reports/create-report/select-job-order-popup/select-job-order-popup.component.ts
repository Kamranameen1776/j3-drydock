import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IJobOrderDto } from '../../../project-monitoring/job-orders/dtos/IJobOrderDto';
import { IJbDialog } from 'jibe-components';
import { getSmallPopup } from '../../../../../models/constants/popup';
import { IDailyReportsResultDto } from '../../dto/IDailyReportsResultDto';
import { JobOrdersUpdatesDto } from '../../dto/JobOrdersUpdatesDto';
import { CreateDailyReportsDto } from '../../dto/CreateDailyReportsDto';
import { GrowlMessageService } from '../../../../../services/growl-message.service';
import { DailyReportsGridService } from '../../reports.service';
import { finalize } from 'rxjs/operators';

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
  @Output() selectedJobOrders = new EventEmitter<IJobOrderDto[]>();

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 800, dialogHeader: 'Job Orders' };

  okLabel = 'Add';

  isSaving: boolean;

  private jobOrdersToLink: IJobOrderDto[];

  private linkedjobOrderIds: string[];

  constructor(
    private growlMessageService: GrowlMessageService,
    private reportsService: DailyReportsGridService
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method, @typescript-eslint/no-empty-function
  ngOnInit(): void {}

  onSelectedChanged(event: IJobOrderDto[]) {
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
