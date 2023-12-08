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

  updateJobOrderDialog: IJbDialog = { dialogHeader: 'Update Fact' };

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

      controls.JobOrderUid.setValue(jobOrderDto.JobOrderUid);
      controls.SpecificationUid.setValue(jobOrderDto.SpecificationUid);
      controls.Progress.setValue(jobOrderDto.Progress);
      controls.Status.setValue(jobOrderDto.Status);
      controls.Subject.setValue(jobOrderDto.Subject);
      controls.SpecificationEndDate.setValue(jobOrderDto.SpecificationEndDate);
      controls.SpecificationStartDate.setValue(jobOrderDto.SpecificationStartDate);
      controls.Code.setValue(jobOrderDto.Code);
    } else if (type === this.gridInputs.gridButton.label) {
      // TODO: implement
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

    const data: IUpdateJobOrderDto = {
      SpecificationUid: this.updateJobOrderFormGroup.value.jobOrderUpdate.SpecificationUid,
      LastUpdated: new Date(),
      Progress: this.updateJobOrderFormGroup.value.jobOrderUpdate.Progress,
      SpecificationEndDate: this.updateJobOrderFormGroup.value.jobOrderUpdate.SpecificationEndDate,
      SpecificationStartDate: this.updateJobOrderFormGroup.value.jobOrderUpdate.SpecificationStartDate,
      Status: this.updateJobOrderFormGroup.value.jobOrderUpdate.Status,
      Subject: this.updateJobOrderFormGroup.value.jobOrderUpdate.Subject
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
