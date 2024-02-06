import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GridService, IGridAction, IJbDialog, eGridRefreshType, JmsService, eJMSWorkflowAction } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { SpecificationUpdatesService } from './specification-updates.service';
import { IUpdateJobOrderDto } from '../../../services/project-monitoring/job-orders/IUpdateJobOrderDto';
import { JobOrdersService } from '../../../services/project-monitoring/job-orders/JobOrdersService';
import { GrowlMessageService } from '../../../services/growl-message.service';
import { IJobOrdersFormComponent } from '../../project-details/project-monitoring/job-orders-form/IJobOrdersFormComponent';
import { IJobOrderFormResultDto } from '../../project-details/project-monitoring/job-orders-form/dtos/IJobOrderFormResultDto';
import { currentLocalAsUTC } from '../../../utils/date';
import { finalize, takeUntil } from 'rxjs/operators';
import { IJobOrderFormDto } from '../../project-details/project-monitoring/job-orders-form/dtos/IJobOrderFormDto';
import { SpecificationDetails } from '../../../models/interfaces/specification-details';
import { JobOrder } from '../../../models/interfaces/job-orders';
import { eSpecificationUpdatesFields } from '../../../models/enums/specification-details.enum';

@Component({
  selector: 'jb-drydock-specification-updates',
  templateUrl: './specification-updates.component.html',
  styleUrls: ['./specification-updates.component.scss'],
  providers: [SpecificationUpdatesService]
})
export class SpecificationUpdatesComponent extends UnsubscribeComponent implements OnInit, AfterViewInit {
  @Input() specificationDetails: SpecificationDetails;

  @ViewChild('reportDateTemplate', { static: true }) reportDateTemplate: TemplateRef<unknown>;
  @ViewChild('jobOrderForm') jobOrderForm: IJobOrdersFormComponent;

  gridInputs: GridInputsWithRequest;

  isShowLoader = false;

  isShowDialog = false;

  isDialogOkButtonDisabled = false;

  dialogContent: IJbDialog = { dialogHeader: 'Update Job Order' };

  okBtnLabel = 'Update';

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

  // TODO fixme
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public showJobOrderForm(row?: JobOrder) {
    const jobOrderForm: IJobOrderFormDto = {
      SpecificationUid: this.specificationDetails.uid,
      Code: this.specificationDetails.SpecificationCode
    };

    this.row = row;

    if (row) {
      jobOrderForm.Remarks = row.JobOrderRemarks;
      jobOrderForm.Progress = row.Progress;
      jobOrderForm.Subject = row.JobOrderSubject;
      jobOrderForm.Status = row.JobOrderStatus;
      jobOrderForm.SpecificationStartDate = row.SpecificationStartDate;
      jobOrderForm.SpecificationEndDate = row.SpecificationEndDate;
    }

    this.jobOrderForm.init(jobOrderForm);

    this.showDialog(true);
  }

  ngOnInit(): void {
    this.setGridData();
    this.setCellTemplate(this.reportDateTemplate, eSpecificationUpdatesFields.Date);
  }

  ngAfterViewInit(): void {
    this.jobOrderForm.onValueChangesIsFormValid.pipe(takeUntil(this.unsubscribe$)).subscribe((isValid) => {
      this.isDialogOkButtonDisabled = !isValid;
    });
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
    this.showDialog(false);
    this.row = null;

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

    // TODO - temp workaround until normal event is provided by infra team: Event to upload editor images
    this.jmsService.jmsEvents.next({ type: eJMSWorkflowAction.AddClassFlag });

    this.isDialogOkButtonDisabled = true;

    this.jobOrdersService
      .updateJobOrder(data)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => {
          this.isDialogOkButtonDisabled = false;
        })
      )
      .subscribe(() => {
        this.closeDialog(true);
      });
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
