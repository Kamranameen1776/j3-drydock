import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GridService, IJbDialog, IJbTextBox } from 'jibe-components';
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
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'jb-drydock-create-report-popup',
  templateUrl: './create-report-popup.component.html',
  styleUrls: ['./create-report-popup.component.scss']
})
export class CreateReportPopupComponent extends UnsubscribeComponent implements OnInit, AfterViewInit {
  @ViewChild('selectJobOrderForm')
  selectJobOrderForm: IJobOrdersFormComponent;

  @Input() isNew: boolean;
  @Input() isOpen: boolean;
  @Input() reportUid: string;
  @Input() projectId: string;

  @Output() closeDialog = new EventEmitter<boolean>();

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 1000, dialogHeader: 'Daily Report' };

  saveLabel = 'Save';
  jobOrderUpdatesToLink: JobOrdersUpdatesDto[] = [];
  jobOrdersToLink: IJobOrderDto[];
  reportInfo: IDailyReportsResultDto;
  isSaving: boolean;
  jobOrderPopupVisible: boolean;
  reportName: string;
  showLoader = false;

  createReportForm = new FormGroup({
    reportName: new FormControl('')
  });

  reportNameText: IJbTextBox = {
    maxLength: 200,
    minLength: 1,
    id: 'reportName',
    pValidateOnly: false,
    style: '',
    type: 'text',
    placeholder: 'Report name',
    required: true
  };

  singleSelectedUpdate: JobOrdersUpdatesDto;
  jobOrderForm: IJobOrderFormDto;

  constructor(
    private growlMessageService: GrowlMessageService,
    private reportsService: DailyReportsGridService,
    private gridService: GridService,
    private jobOrdersService: JobOrdersService
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.isNew) {
      this.getDailyReport(true);
    } else {
      this.reportName = '';
    }
  }

  ngAfterViewInit(): void {
    this.selectJobOrderForm.onValueChangesIsForm.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      const jobOrder = res.value.jobOrderUpdate;
      this.singleSelectedUpdate.progress = jobOrder.Progress;
      this.singleSelectedUpdate.status = jobOrder.Status;
      this.singleSelectedUpdate.subject = jobOrder.Subject;
    });

    this.selectJobOrderForm.onRemarkValueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.singleSelectedUpdate.remark = res;
    });
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

  onSelectedUpdates(event: JobOrdersUpdatesDto[]) {
    const selectedUpdates = [...event];
    this.jobOrderUpdatesToLink.push(...selectedUpdates);
    this.onUpdateSelection(selectedUpdates[0]);
  }

  getDailyReport(initialize = false) {
    this.reportsService
      .getOneDailyReport(this.reportUid)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((reportInfo) => {
        this.reportInfo = reportInfo;
        this.createReportForm.controls.reportName.setValue(this.reportInfo.reportName);
        this.jobOrderUpdatesToLink = this.reportInfo.jobOrdersUpdate.map((jobOrder) => {
          return {
            subject: jobOrder.subject,
            remark: jobOrder.remark,
            specificationUid: jobOrder.specificationUid,
            specificationCode: jobOrder.specificationCode,
            status: jobOrder.status,
            progress: jobOrder.progress,
            lastUpdated: jobOrder.lastUpdated,
            specificationSubject: jobOrder.specificationSubject,
            updatedBy: jobOrder.updatedBy
          };
        });

        initialize ? this.onUpdateSelection(this.jobOrderUpdatesToLink[0]) : null;
      }),
      // eslint-disable-next-line rxjs/no-implicit-any-catch
      (err) => {
        if (err?.status === 422 && err?.error?.message) {
          this.growlMessageService.setErrorMessage(err.error.message);
        } else {
          this.growlMessageService.setErrorMessage('Server error occurred');
        }
      };
  }

  onUpdateSelection(event: JobOrdersUpdatesDto) {
    this.singleSelectedUpdate = event;

    const specificationUid = event.specificationUid;
    this.jobOrdersService
      .getJobOrderBySpecification({
        SpecificationUid: specificationUid
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((jobOrder) => {
        this.jobOrderForm = {
          SpecificationUid: specificationUid
        };

        if (jobOrder) {
          this.jobOrderForm.Remarks = this.singleSelectedUpdate.remark;
          this.jobOrderForm.Subject = this.singleSelectedUpdate.subject;
          this.jobOrderForm.Status = jobOrder.Status;
          this.jobOrderForm.SpecificationStartDate = jobOrder.SpecificationStartDate;
          this.jobOrderForm.SpecificationEndDate = jobOrder.SpecificationEndDate;
          this.jobOrderForm.Progress = jobOrder.Progress;
        }

        this.selectJobOrderForm.init(this.jobOrderForm);
      }),
      // eslint-disable-next-line rxjs/no-implicit-any-catch
      (err) => {
        if (err?.status === 422 && err?.error?.message) {
          this.growlMessageService.setErrorMessage(err.error.message);
        } else {
          this.growlMessageService.setErrorMessage('Server error occurred');
        }
      };
  }

  private save() {
    if (this.createReportForm.invalid) {
      this.growlMessageService.setErrorMessage('Report name is required');
      return;
    }

    if (!this.jobOrderUpdatesToLink || !this.jobOrderUpdatesToLink.length) {
      this.growlMessageService.setErrorMessage('Updates are required');
      return;
    }

    this.isSaving = true;
    this.showLoader = true;
    this.reportName = this.createReportForm.controls.reportName.value;

    let createPayload: CreateDailyReportsDto;
    let updatePayload: UpdateDailyReportsDto;

    this.isNew
      ? (createPayload = {
          ProjectUid: this.projectId,
          ReportName: this.reportName,
          ReportDate: new Date(),
          JobOrdersUpdate: this.jobOrderUpdatesToLink
        })
      : (updatePayload = {
          DailyReportUid: this.reportUid,
          ProjectUid: this.projectId,
          ReportName: this.reportName,
          JobOrdersUpdate: this.jobOrderUpdatesToLink
        });

    this.isNew
      ? this.reportsService
          .createDailyReport(createPayload)
          .pipe(
            finalize(() => {
              this.isSaving = false;
            })
          )
          .subscribe(
            () => {
              this.growlMessageService.setSuccessMessage('Daily report created successfully');
              this.showLoader = false;
              this.closePopup(true);
            },
            // eslint-disable-next-line rxjs/no-implicit-any-catch
            (err) => {
              if (err?.status === 422 && err?.error?.message) {
                this.growlMessageService.setErrorMessage(err.error.message);
              } else {
                this.growlMessageService.setErrorMessage('Server error occurred');
              }
              this.showLoader = false;
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
              this.showLoader = false;
              this.closePopup(true);
            },
            // eslint-disable-next-line rxjs/no-implicit-any-catch
            (err) => {
              if (err?.status === 422 && err?.error?.message) {
                this.growlMessageService.setErrorMessage(err.error.message);
              } else {
                this.growlMessageService.setErrorMessage('Server error occurred');
              }
              this.showLoader = false;
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
