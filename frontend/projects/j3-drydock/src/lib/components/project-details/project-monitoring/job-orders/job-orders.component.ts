import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { JobOrdersGridService } from './JobOrdersGridService';
import {
  eGridEvents,
  eGridRowActions,
  FormModel,
  GridAction,
  GridCellData,
  GridComponent,
  GridService,
  IJbDialog,
  JbEditorComponent,
  UserService
} from 'jibe-components';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { GridInputsWithRequest } from '../../../../models/interfaces/grid-inputs';
import { JobOrdersService } from '../../../../services/project-monitoring/job-orders/JobOrdersService';
import { IJobOrderDto } from './dtos/IJobOrderDto';
import { JobOrdersGridOdataKeys } from '../../../..//models/enums/JobOrdersGridOdataKeys';
import { NewTabService } from '../../../../services/new-tab-service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { IUpdateJobOrderDto } from 'projects/j3-drydock/src/lib/services/project-monitoring/job-orders/IUpdateJobOrderDto';
import moment from 'moment';
import { EditorConfig } from 'projects/j3-drydock/src/lib/models/interfaces/EditorConfig';

@Component({
  selector: 'jb-job-orders',
  templateUrl: './job-orders.component.html',
  styleUrls: ['./job-orders.component.scss'],
  providers: [JobOrdersGridService, FormGroupDirective]
})
export class JobOrdersComponent extends UnsubscribeComponent implements OnInit {
  @ViewChild('lastUpdatedTemplate', { static: true }) lastUpdatedTemplate: TemplateRef<unknown>;

  @Input() projectId: string;

  @ViewChild('jobOrdersGrid')
  jobOrdersGrid: GridComponent;

  @ViewChild('remarksEditor')
  remarksEditor: JbEditorComponent;

  public gridInputs: GridInputsWithRequest;

  public updateBtnLabel = 'Update';

  public updateDialogVisible = false;

  updateJobOrderDialog: IJbDialog = { dialogHeader: 'Update Details' };

  updateJobOrderForm: FormModel;

  updateJobOrderFormGroup: FormGroup;

  remarksEditorFormGroup: FormGroup = new FormGroup({
    RemarksCtrl: new FormControl('', Validators.required)
  });

  updateJobOrderButtonDisabled = false;

  remarksEditorConfig: EditorConfig;

  constructor(
    private jobOrdersGridService: JobOrdersGridService,
    private jobOrdersService: JobOrdersService,
    private newTabService: NewTabService,
    private activatedRoute: ActivatedRoute,
    private gridService: GridService,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setGridInputs();

    this.updateJobOrderForm = this.jobOrdersGridService.getUpdateJobOrderForm();

    this.remarksEditorConfig = this.jobOrdersGridService.getRemarksEditorConfig();
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

      this.updateDialogReset();

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

      this.remarksEditor.key1 = jobOrderDto.SpecificationUid;
      this.remarksEditor.vesselId = this.userService.getUserDetails().VesselId;

      this.jobOrdersService
        .getJobOrderBySpecification({
          SpecificationUid: jobOrderDto.SpecificationUid
        })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((jobOrder) => {
          if (jobOrder) {
            this.remarksEditorFormGroup.controls.RemarksCtrl.setValue(jobOrder.Remarks);
            controls.Remarks.setValue(jobOrder.Remarks);
          }

          this.showUpdateDialog(true);
        });
    }
  }

  public updateDialogReset() {
    this.updateJobOrderFormGroup.reset();
    this.remarksEditorFormGroup.reset();
  }

  public showUpdateDialog(value = true) {
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

    this.newTabService.navigate(['../../specification-details', specificationUid], { relativeTo: this.activatedRoute });
  }

  public onMatrixRequestChanged() {
    this.jobOrdersGrid.odata.filter.eq(JobOrdersGridOdataKeys.ProjectUid, this.projectId);
  }

  public remarksEditorUpdateParentCtrlValue(remarks: string) {
    const controls = (this.updateJobOrderFormGroup.controls.jobOrderUpdate as FormGroup).controls;
    controls.Remarks.setValue(remarks);
  }

  private setGridInputs() {
    this.gridInputs = this.jobOrdersGridService.getGridInputs();
    this.setGridActions();
    this.setCellTemplate(this.lastUpdatedTemplate, 'LastUpdated');
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
