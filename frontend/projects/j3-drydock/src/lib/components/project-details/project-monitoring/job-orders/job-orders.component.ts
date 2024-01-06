import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { JobOrdersGridService } from './JobOrdersGridService';
import { eGridEvents, eGridRowActions, GridAction, GridCellData, GridComponent, GridService, IJbDialog } from 'jibe-components';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { GridInputsWithRequest } from '../../../../models/interfaces/grid-inputs';
import { JobOrdersService } from '../../../../services/project-monitoring/job-orders/JobOrdersService';
import { IJobOrderDto } from './dtos/IJobOrderDto';
import { JobOrdersGridOdataKeys } from '../../../../models/enums/JobOrdersGridOdataKeys';
import { NewTabService } from '../../../../services/new-tab-service';
import { ActivatedRoute } from '@angular/router';
import { FormGroupDirective } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { IUpdateJobOrderDto } from '../../../../services/project-monitoring/job-orders/IUpdateJobOrderDto';
import { UTCAsLocal, currentLocalAsUTC, localToUTC } from '../../../../utils/date';
import { GrowlMessageService } from '../../../../services/growl-message.service';
import { IJobOrderFormDto } from '../job-orders-form/dtos/IJobOrderFormDto';
import { IJobOrdersFormComponent } from '../job-orders-form/IJobOrdersFormComponent';
import { IJobOrderFormResultDto } from '../job-orders-form/dtos/IJobOrderFormResultDto';
import { statusProgressBarBackground } from '../../../../shared/status-css.json';

@Component({
  selector: 'jb-job-orders',
  templateUrl: './job-orders.component.html',
  styleUrls: ['./job-orders.component.scss'],
  providers: [JobOrdersGridService, FormGroupDirective]
})
export class JobOrdersComponent extends UnsubscribeComponent implements OnInit, AfterViewInit {
  @ViewChild('lastUpdatedTemplate', { static: true }) lastUpdatedTemplate: TemplateRef<unknown>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate: TemplateRef<unknown>;

  @Input() projectId: string;

  @ViewChild('jobOrdersGrid')
  jobOrdersGrid: GridComponent;

  @ViewChild('jobOrderForm')
  jobOrderForm: IJobOrdersFormComponent;

  public gridInputs: GridInputsWithRequest;

  readonly dateTimeFormat = this.jobOrdersGridService.dateTimeFormat;

  growlMessage$ = this.growlMessageService.growlMessage$;

  public updateBtnLabel = 'Update';

  public updateDialogVisible = false;

  updateJobOrderDialog: IJbDialog = { dialogHeader: 'Update Details' };

  updateJobOrderButtonDisabled = false;

  statusCSS = { statusProgressBarBackground: statusProgressBarBackground };

  constructor(
    private jobOrdersGridService: JobOrdersGridService,
    private jobOrdersService: JobOrdersService,
    private newTabService: NewTabService,
    private activatedRoute: ActivatedRoute,
    private gridService: GridService,
    private growlMessageService: GrowlMessageService
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.jobOrderForm.onValueChangesIsFormValid.pipe(takeUntil(this.unsubscribe$)).subscribe((isValid) => {
      this.updateJobOrderButtonDisabled = !isValid;
    });
  }

  ngOnInit(): void {
    this.setGridInputs();
  }

  public onGridAction({ type }: GridAction<string, string>, jobOrderDto: IJobOrderDto): void {
    if (type === eGridRowActions.Edit) {
      if (!jobOrderDto) {
        throw new Error('jobOrderDto is null');
      }

      this.jobOrdersService
        .getJobOrderBySpecification({
          SpecificationUid: jobOrderDto.SpecificationUid
        })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((jobOrder) => {
          const jobOrderForm: IJobOrderFormDto = {
            SpecificationUid: jobOrderDto.SpecificationUid,
            Progress: jobOrderDto.Progress,
            Code: jobOrderDto.Code
          };

          if (jobOrder) {
            jobOrderForm.Remarks = jobOrder.Remarks;
            jobOrderForm.Subject = jobOrder.Subject;
            jobOrderForm.Status = jobOrder.Status;
            jobOrderForm.SpecificationStartDate = UTCAsLocal(jobOrder.SpecificationStartDate).toISOString();
            jobOrderForm.SpecificationEndDate = UTCAsLocal(jobOrder.SpecificationEndDate).toISOString();
          }

          this.jobOrderForm.init(jobOrderForm);

          this.showUpdateDialog(true);
        });
    }
  }

  public showUpdateDialog(value = true) {
    this.updateDialogVisible = value;
  }

  public updateJobOrder() {
    this.updateJobOrderButtonDisabled = true;

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

      SpecificationStartDate: localToUTC(jobOrder.SpecificationStartDate),
      SpecificationEndDate: localToUTC(jobOrder.SpecificationEndDate),

      Status: jobOrder.Status,
      Subject: jobOrder.Subject,

      Remarks: jobOrder.Remarks
    };

    this.jobOrdersService
      .updateJobOrder(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.updateJobOrderButtonDisabled = false;
        this.showUpdateDialog(false);
        this.gridService.refreshGrid(eGridEvents.Table, this.jobOrdersGridService.gridName);
      });
  }

  public onCellPlainTextClick(gridCellData: GridCellData): void {
    const specificationUid = gridCellData.rowData.SpecificationUid;

    this.navigateToSpecificationDetails(specificationUid);
  }

  public onMatrixRequestChanged() {
    this.jobOrdersGrid.odata.filter.eq(JobOrdersGridOdataKeys.ProjectUid, this.projectId);
  }

  public navigateToSpecificationDetails(specificationUid: string) {
    this.newTabService.navigate(['../../specification-details', specificationUid], { relativeTo: this.activatedRoute });
  }

  private setGridInputs() {
    this.gridInputs = this.jobOrdersGridService.getGridInputs();
    this.setGridActions();
    this.setCellTemplate(this.lastUpdatedTemplate, 'LastUpdated');
    this.setCellTemplate(this.statusTemplate, 'SpecificationStatus');
  }

  private setGridActions() {
    this.gridInputs.actions.length = 0;

    this.gridInputs.actions.push({
      name: eGridRowActions.Edit,
      label: 'Update Job'
    });
  }

  private setCellTemplate(template: TemplateRef<unknown>, fieldName: string) {
    const col = this.gridInputs.columns.find((col) => col.FieldName === fieldName);
    if (!col) {
      return;
    }
    col.cellTemplate = template;
  }
}
