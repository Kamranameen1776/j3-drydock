import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GridService, IJbDialog } from 'jibe-components';
import { getSmallPopup } from '../../../../models/constants/popup';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { GrowlMessageService } from '../../../../services/growl-message.service';
import { IDailyReportsResultDto } from '../dto/IDailyReportsResultDto';
import { DailyReportsGridService } from '../reports.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { JobOrdersUpdatesDto } from '../dto/JobOrdersUpdatesDto';
import { CreateDailyReportsDto } from '../dto/CreateDailyReportsDto';
import { IJobOrderDto } from '../../project-monitoring/job-orders/dtos/IJobOrderDto';
import { UpdateDailyReportsDto } from '../dto/UpdateDailyReportsDto';
import { JobOrdersService } from '../../../../services/project-monitoring/job-orders/JobOrdersService';
import { IJobOrderFormDto } from '../../project-monitoring/job-orders-form/dtos/IJobOrderFormDto';
import { IJobOrdersFormComponent } from '../../project-monitoring/job-orders-form/IJobOrdersFormComponent';
@Component({
  selector: 'jb-drydock-create-report-popup',
  templateUrl: './create-report-popup.component.html',
  styleUrls: ['./create-report-popup.component.scss']
})
export class CreateReportPopupComponent extends UnsubscribeComponent implements OnInit {
  @ViewChild('selectJobOrderForm')
  selectJobOrderForm: IJobOrdersFormComponent;

  @Input() isNew: boolean;
  @Input() isOpen: boolean;
  @Input() reportUid: string;
  @Input() projectId: string;

  @Output() closeDialog = new EventEmitter<boolean>();

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 1000, dialogHeader: 'Daily Report' };

  saveLabel = 'Save';
  private jobOrderUpdatesToLink: JobOrdersUpdatesDto[];
  jobOrdersToLink: IJobOrderDto[];
  reportInfo: IDailyReportsResultDto;
  isSaving: boolean;
  jobOrderPopupVisible: boolean;
  reportName: string;

  constructor(
    private growlMessageService: GrowlMessageService,
    private reportsService: DailyReportsGridService,
    private gridService: GridService,
    private jobOrdersService: JobOrdersService
  ) {
    super();
  }

  ngOnInit(): void {
    !this.isNew ? this.getDailyReport() : (this.reportName = '');
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

  onSelectedUpdates(event: IJobOrderDto[]) {
    this.jobOrdersToLink = event;
    this.jobOrderUpdatesToLink = event.map((jobOrder) => {
      return {
        Name: jobOrder.Code,
        Remark: jobOrder.SpecificationSubject
      };
    });
  }

  getDailyReport() {
    this.reportsService
      .getOneDailyReport(this.reportUid)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((reportInfo) => {
        this.reportInfo = reportInfo;
        this.reportName = this.reportInfo.reportName;
      });
  }

  onSelectedUpdate(event: string) {
    const specificationUid = event;
    this.jobOrdersService
      .getJobOrderBySpecification({
        SpecificationUid: specificationUid
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((jobOrder) => {
        const jobOrderForm: IJobOrderFormDto = {
          SpecificationUid: specificationUid
        };

        if (jobOrder) {
          jobOrderForm.Remarks = jobOrder.Remarks;
          jobOrderForm.Subject = jobOrder.Subject;
          jobOrderForm.Status = jobOrder.Status;
          jobOrderForm.SpecificationStartDate = jobOrder.SpecificationStartDate;
          jobOrderForm.SpecificationEndDate = jobOrder.SpecificationEndDate;
        }

        this.selectJobOrderForm.init(jobOrderForm);
      });
  }

  private save() {
    this.isSaving = true;
    if (!this.jobOrderUpdatesToLink || !this.jobOrderUpdatesToLink.length) {
      return;
    }

    let cratePayload: CreateDailyReportsDto;
    let updatePayload: UpdateDailyReportsDto;

    this.isNew
      ? (cratePayload = {
          ProjectUid: this.projectId,
          ReportName: this.reportName,
          ReportDate: new Date(),
          JobOrdersUpdate: this.jobOrderUpdatesToLink
        })
      : (updatePayload = {
          ReportName: this.reportName,
          JobOrdersUpdate: this.jobOrderUpdatesToLink
        });

    this.isNew
      ? this.reportsService
          .createDailyReport(cratePayload)
          .pipe(
            finalize(() => {
              this.isSaving = false;
            })
          )
          .subscribe(
            () => {
              this.growlMessageService.setSuccessMessage('Daily report created successfully');
              // this.closePopup(true);m
            },
            // eslint-disable-next-line rxjs/no-implicit-any-catch
            (err) => {
              if (err?.status === 422 && err?.error?.message) {
                this.growlMessageService.setErrorMessage(err.error.message);
              } else {
                this.growlMessageService.setErrorMessage('Server error occurred');
              }
            }
          )
      : this.reportsService
          .updateDailyReport(updatePayload)
          .pipe(
            finalize(() => {
              this.isSaving = false;
            })
          )
          .subscribe(
            () => {
              this.growlMessageService.setSuccessMessage('Daily report updated successfully');
              // this.closePopup(true);m
            },
            // eslint-disable-next-line rxjs/no-implicit-any-catch
            (err) => {
              if (err?.status === 422 && err?.error?.message) {
                this.growlMessageService.setErrorMessage(err.error.message);
              } else {
                this.growlMessageService.setErrorMessage('Server error occurred');
              }
            }
          );
  }

  openJobOrderDialog(event: boolean) {
    this.jobOrderPopupVisible = event;
  }

  onCloseJobOrderPopup(event: boolean) {
    this.jobOrderPopupVisible = event;
  }
}
