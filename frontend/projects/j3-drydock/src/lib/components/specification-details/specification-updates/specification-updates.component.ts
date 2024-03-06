import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GridService, IGridAction, IJbDialog, eGridRefreshType, JmsService, eJMSWorkflowAction } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { SpecificationUpdatesService } from './specification-updates.service';
import { IUpdateJobOrderDto } from '../../../services/project-monitoring/job-orders/IUpdateJobOrderDto';
import { JobOrdersService } from '../../../services/project-monitoring/job-orders/JobOrdersService';
import { GrowlMessageService } from '../../../services/growl-message.service';
import { currentLocalAsUTC } from '../../../utils/date';
import { finalize, takeUntil } from 'rxjs/operators';
import { SpecificationDetails } from '../../../models/interfaces/specification-details';
import { JobOrder } from '../../../models/interfaces/job-orders';
import { eSpecificationUpdatesFields } from '../../../models/enums/specification-details.enum';
import { IJobOrderFormDto } from '../../../shared/components/job-orders-form/dtos/IJobOrderFormDto';
import { IJobOrderFormResultDto } from '../../../shared/components/job-orders-form/dtos/IJobOrderFormResultDto';
import { JobOrdersFormComponent } from '../../../shared/components/job-orders-form/job-orders-form.component';

@Component({
  selector: 'jb-drydock-specification-updates',
  templateUrl: './specification-updates.component.html',
  styleUrls: ['./specification-updates.component.scss'],
  providers: [SpecificationUpdatesService]
})
export class SpecificationUpdatesComponent extends UnsubscribeComponent implements OnInit {
  @Input() specificationDetails: SpecificationDetails;

  @ViewChild('reportDateTemplate', { static: true }) reportDateTemplate: TemplateRef<unknown>;
  @ViewChild('jobOrderForm') jobOrderForm: JobOrdersFormComponent;

  gridInputs: GridInputsWithRequest;

  isShowDialog = false;

  dialogContent: IJbDialog = { dialogHeader: 'Update Job Order' };

  okBtnLabel = 'Update';

  jobOrderFormValue: IJobOrderFormDto = {} as IJobOrderFormDto;

  isJobOrdersChanged = false;

  isSaving = false;

  get isDialogOkButtonDisabled() {
    return this.isSaving || !this.isJobOrdersChanged;
  }

  private row: JobOrder;

  readonly dateTimeFormat = this.specificationUpdatesService.dateTimeFormat;

  constructor(
    private gridService: GridService,
    private specificationUpdatesService: SpecificationUpdatesService,
    private jobOrdersService: JobOrdersService,
    private growlMessageService: GrowlMessageService,
    private jmsService: JmsService
  ) {
    super();
  }

  public showJobOrderForm(row?: JobOrder) {
    this.jobOrderFormValue = {};
    this.jobOrderFormValue.SpecificationUid = this.specificationDetails.uid;
    this.jobOrderFormValue.Code = this.specificationDetails.SpecificationCode;

    this.row = row;

    if (row) {
      this.jobOrderFormValue.Remarks = row.JobOrderRemarks;
      this.jobOrderFormValue.Progress = row.Progress;
      this.jobOrderFormValue.Subject = row.JobOrderSubject;
      this.jobOrderFormValue.Status = row.JobOrderStatus;
      this.jobOrderFormValue.SpecificationStartDate = row.SpecificationStartDate;
      this.jobOrderFormValue.SpecificationEndDate = row.SpecificationEndDate;
    }

    this.showDialog(true);
  }

  ngOnInit(): void {
    this.setGridData();
    this.setCellTemplate(this.reportDateTemplate, eSpecificationUpdatesFields.Date);
  }

  onGridAction({ type, payload }: IGridAction) {
    switch (type) {
      case 'Edit Job Update':
        this.showJobOrderForm(payload);
        break;
      default:
        return;
    }
  }

  closeDialog(hasSaved?: boolean) {
    this.row = null;
    this.jobOrderFormValue = {};
    this.showDialog(false);

    if (hasSaved) {
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridInputs.gridName);
    }
  }

  updateJobOrder() {
    const result = this.jobOrderForm.save();

    if (result instanceof Error) {
      this.growlMessageService.setErrorMessage(result.message);
      return;
    }

    const jobOrder = result as IJobOrderFormResultDto;

    const data: IUpdateJobOrderDto = {
      SpecificationUid: jobOrder.SpecificationUid,
      LastUpdated: currentLocalAsUTC(),
      Progress: jobOrder.Progress,

      SpecificationStartDate: jobOrder.SpecificationStartDate,
      SpecificationEndDate: jobOrder.SpecificationEndDate,

      Status: jobOrder.Status,
      Subject: jobOrder.Subject,

      Remarks: jobOrder.Remarks
    };

    if (this.row) {
      data.uid = this.row.uid;
    }

    if (jobOrder.UpdatesChanges?.length) {
      data.UpdatesChanges = jobOrder.UpdatesChanges.map((subItem) => {
        return {
          ...subItem,
          discount: subItem.discount / 100
        };
      });
    }

    // TODO - temp workaround until normal event is provided by infra team: Event to upload editor images
    this.jmsService.jmsEvents.next({ type: eJMSWorkflowAction.AddClassFlag });

    this.isSaving = true;

    this.jobOrdersService
      .updateJobOrder(data)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe(() => {
        this.closeDialog(true);
      });
  }

  jobOrdersChanged(value: boolean) {
    this.isJobOrdersChanged = value;
  }

  private showDialog(value: boolean) {
    this.isShowDialog = value;
  }

  private setGridData() {
    this.gridInputs = this.specificationUpdatesService.getGridInputs(this.specificationDetails.uid);
  }

  private setCellTemplate(template: TemplateRef<unknown>, fieldName: string) {
    const col = this.gridInputs.columns.find((col) => col.FieldName === fieldName);
    if (!col) {
      return;
    }
    col.cellTemplate = template;
  }
}
