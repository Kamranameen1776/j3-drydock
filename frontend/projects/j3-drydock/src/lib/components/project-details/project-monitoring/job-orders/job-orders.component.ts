import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { JobOrdersGridService } from './JobOrdersGridService';
import { eGridEvents, eGridRowActions, FormModel, GridAction, GridCellData, GridComponent, GridService, IJbDialog } from 'jibe-components';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { GridInputsWithRequest } from '../../../../models/interfaces/grid-inputs';
import { JobOrdersService } from '../../../../services/project-monitoring/job-orders/JobOrdersService';
import { IJobOrderDto } from './dtos/IJobOrderDto';
import { JobOrdersGridOdataKeys } from '../../../..//models/enums/JobOrdersGridOdataKeys';
import { NewTabService } from '../../../../services/new-tab-service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { IUpdateJobOrderDto } from 'projects/j3-drydock/src/lib/services/project-monitoring/job-orders/IUpdateJobOrderDto';
import moment from 'moment';

@Component({
  selector: 'jb-job-orders',
  templateUrl: './job-orders.component.html',
  styleUrls: ['./job-orders.component.scss'],
  providers: [JobOrdersGridService]
})
export class JobOrdersComponent extends UnsubscribeComponent implements OnInit {
  @Input() projectId: string;

  @ViewChild('jobOrdersGrid')
  jobOrdersGrid: GridComponent;

  public gridInputs: GridInputsWithRequest;

  public updateBtnLabel = 'Update';

  public updateDialogVisible = false;

  updateJobOrderDialog: IJbDialog = { dialogHeader: 'Update Details' };

  updateJobOrderForm: FormModel;

  updateJobOrderFormGroup: FormGroup;

  updateJobOrderButtonDisabled = false;

  constructor(
    private jobOrdersGridService: JobOrdersGridService,
    private jobOrdersService: JobOrdersService,
    private newTabService: NewTabService,
    private activatedRoute: ActivatedRoute,
    private gridService: GridService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setGridInputs();

    this.updateJobOrderForm = this.jobOrdersGridService.getUpdateJobOrderForm();
  }

  public onGridAction({ type }: GridAction<string, string>, jobOrderDto: IJobOrderDto): void {
    if (type === eGridRowActions.Delete) {
      if (!jobOrderDto) {
        throw new Error('IJobOrderDto is null');
      }
      // TODO: implement
    } else if (type === eGridRowActions.Edit) {
      if (!jobOrderDto) {
        throw new Error('IJobOrderDto is null');
      }

      if (!jobOrderDto) {
        throw new Error('jobOrderDto is null');
      }

      this.showUpdateDialog();

      const controls = (this.updateJobOrderFormGroup.controls.jobOrderUpdate as FormGroup).controls;

      const specificationStartDate = jobOrderDto.SpecificationStartDate
        ? moment(jobOrderDto.SpecificationStartDate).format(this.jobOrdersGridService.dateTimeFormat)
        : null;
      const specificationEndDate = jobOrderDto.SpecificationEndDate
        ? moment(jobOrderDto.SpecificationEndDate).format(this.jobOrdersGridService.dateTimeFormat)
        : null;

      controls.JobOrderUid.setValue(jobOrderDto.JobOrderUid);
      controls.SpecificationUid.setValue(jobOrderDto.SpecificationUid);
      controls.Progress.setValue(jobOrderDto.Progress);
      controls.Status.setValue(jobOrderDto.Status);
      controls.Subject.setValue(jobOrderDto.Subject);
      controls.SpecificationStartDate.setValue(specificationStartDate);
      controls.SpecificationEndDate.setValue(specificationEndDate);
      controls.Code.setValue(jobOrderDto.Code);
    }
  }

  public showUpdateDialog(value = true) {
    this.updateJobOrderFormGroup.reset();
    this.updateDialogVisible = value;
  }

  public initUpdateJobOrderFormGroup(action: FormGroup): void {
    this.updateJobOrderFormGroup = action;

    this.updateJobOrderFormGroup.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.updateJobOrderButtonDisabled = !this.updateJobOrderFormGroup.valid;
    });
  }

  public updateJobOrder() {
    this.updateJobOrderButtonDisabled = true;

    const jobOrder = this.updateJobOrderFormGroup.value.jobOrderUpdate;

    const zone = new Date().getTimezoneOffset();

    const startDate = moment(jobOrder.SpecificationStartDate, this.jobOrdersGridService.dateTimeFormat).add(-zone, 'minutes').toDate();
    const endDate = moment(jobOrder.SpecificationEndDate, this.jobOrdersGridService.dateTimeFormat).add(-zone, 'minutes').toDate();
    
    const data: IUpdateJobOrderDto = {
      SpecificationUid: jobOrder.SpecificationUid,
      LastUpdated: moment().add(-zone, 'minutes').toDate(),
      Progress: jobOrder.Progress,

      SpecificationStartDate: startDate,
      SpecificationEndDate: endDate,

      Status: jobOrder.Status,
      Subject: jobOrder.Subject
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

    this.newTabService.navigate(['../../specification-details', specificationUid], { relativeTo: this.activatedRoute });
  }

  public onMatrixRequestChanged() {
    this.jobOrdersGrid.odata.filter.eq(JobOrdersGridOdataKeys.ProjectUid, this.projectId);
  }

  private setGridInputs() {
    this.gridInputs = this.jobOrdersGridService.getGridInputs();
    this.setGridActions();
  }

  private setGridActions() {
    this.gridInputs.actions.length = 0;

    this.gridInputs.actions.push({
      name: eGridRowActions.Edit,
      label: 'Update Job'
    });
  }
}
