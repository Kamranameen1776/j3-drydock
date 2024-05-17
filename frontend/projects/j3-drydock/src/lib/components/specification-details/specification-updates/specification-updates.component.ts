import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { eGridRefreshType, eJMSWorkflowAction, GridService, IGridAction, IJbDialog, JmsService } from 'jibe-components';
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
import { JobOrderDto } from '../../../services/project-monitoring/job-orders/JobOrderDto';

@Component({
  selector: 'jb-drydock-specification-updates',
  templateUrl: './specification-updates.component.html',
  styleUrls: ['./specification-updates.component.scss'],
  providers: [SpecificationUpdatesService]
})
export class SpecificationUpdatesComponent extends UnsubscribeComponent implements OnInit, OnChanges {
  @Input() specificationDetails: SpecificationDetails;
  @Input() isEditable = true;

  @Output() jobOrderUpdate = new EventEmitter();

  @ViewChild('reportDateTemplate', { static: true }) reportDateTemplate: TemplateRef<unknown>;
  @ViewChild('jobOrderForm') jobOrderForm: JobOrdersFormComponent;

  gridInputs: GridInputsWithRequest;

  isShowDialog = false;

  dialogContent: IJbDialog = { dialogHeader: 'Update Job Order', dialogWidth: 1000 };

  okBtnLabel = 'Update';

  jobOrderFormValue: IJobOrderFormDto = {} as IJobOrderFormDto;

  isJobOrdersChanged = false;

  isSaving = false;

  public jobOrders: JobOrderDto[] = [];
  public selectedRow: Pick<JobOrderDto, 'JobOrderUid'>;

  readonly dateTimeFormat = this.specificationUpdatesService.dateTimeFormat;

  private row: JobOrder;

  constructor(
    private gridService: GridService,
    private specificationUpdatesService: SpecificationUpdatesService,
    private jobOrdersService: JobOrdersService,
    private growlMessageService: GrowlMessageService,
    private jmsService: JmsService
  ) {
    super();
  }

  get isDialogOkButtonDisabled() {
    return this.isSaving || !this.isJobOrdersChanged;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isEditable) {
      this.setGridData();
    }
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
      this.jobOrderUpdate.emit();
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
      .subscribe(
        () => {
          this.closeDialog(true);
        },
        (err) => {
          if (err?.status === 422 && err?.error?.message) {
            this.growlMessageService.setErrorMessage(err.error.message);
          } else {
            this.growlMessageService.setErrorMessage('Server error occurred');
          }
        }
      );
  }

  jobOrdersChanged(value: boolean) {
    this.isJobOrdersChanged = value;
  }

  public showJobOrderForm(row?: JobOrder) {
    this.jobOrdersService
      .getAllJobOrdersBySpecificationUid({
        specificationUid: this.specificationDetails.uid
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((jobOrders) => {
        this.jobOrders = jobOrders.map((jobOrder) => {
          return {
            ...jobOrder,
            Code: this.specificationDetails.SpecificationCode
          };
        });

        this.row = row;

        if (row) {
          this.selectedRow = {
            JobOrderUid: row.uid
          };
        } else {
          this.selectedRow = null;
        }

        this.showDialog(true);
      });
  }

  private showDialog(value: boolean) {
    this.isShowDialog = value;
  }

  private setGridData() {
    this.gridInputs = this.specificationUpdatesService.getGridInputs(this.specificationDetails.uid);
    if (!this.isEditable) {
      this.gridInputs.actions = [];
    }
  }

  private setCellTemplate(template: TemplateRef<unknown>, fieldName: string) {
    const col = this.gridInputs.columns.find((col) => col.FieldName === fieldName);
    if (!col) {
      return;
    }
    col.cellTemplate = template;
  }
}
