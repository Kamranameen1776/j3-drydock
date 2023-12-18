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
import { JobOrdersGridOdataKeys } from '../../../../models/enums/JobOrdersGridOdataKeys';
import { NewTabService } from '../../../../services/new-tab-service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { IUpdateJobOrderDto } from '../../../../services/project-monitoring/job-orders/IUpdateJobOrderDto';
import { EditorConfig } from '../../../../models/interfaces/EditorConfig';
import { UTCAsLocal, currentLocalAsUTC, localDateJbStringAsUTC } from '../../../../utils/date';
import { KeyValuePair } from '../../../../utils/KeyValuePair';
import { GrowlMessageService } from '../../../../services/growl-message.service';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';

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

  tools: ToolbarModule = {
    items: [
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      'FontName',
      'FontSize',
      'FontColor',
      // 'BackgroundColor',
      // 'LowerCase',
      // 'UpperCase',
      'Formats',
      'Alignments',
      // 'OrderedList',
      // 'UnorderedList',
      // 'Outdent',
      // 'Indent',
      // 'CreateLink',
      'Image',
      'ClearFormat',
      // 'Print',
      // 'SourceCode',
      'FullScreen'
      // 'Undo',
      // 'Redo'
    ]
  };

  readonly dateTimeFormat = this.jobOrdersGridService.dateTimeFormat;

  growlMessage$ = this.growlMessageService.growlMessage$;

  public updateBtnLabel = 'Update';

  public updateDialogVisible = false;

  selectedSpecification: KeyValuePair<string, string> = { Key: '', Value: '' };

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
    private userService: UserService,
    private growlMessageService: GrowlMessageService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setGridInputs();

    this.updateJobOrderForm = this.jobOrdersGridService.getUpdateJobOrderForm();

    this.remarksEditorConfig = this.jobOrdersGridService.getRemarksEditorConfig();
  }

  public onGridAction({ type }: GridAction<string, string>, jobOrderDto: IJobOrderDto): void {
    if (type === eGridRowActions.Edit) {
      if (!jobOrderDto) {
        throw new Error('jobOrderDto is null');
      }

      this.updateDialogReset();

      const controls = (this.updateJobOrderFormGroup.controls.jobOrderUpdate as FormGroup).controls;

      controls.SpecificationUid.setValue(jobOrderDto.SpecificationUid);
      controls.Progress.setValue(jobOrderDto.Progress);

      this.selectedSpecification.Key = jobOrderDto.SpecificationUid;
      this.selectedSpecification.Value = jobOrderDto.Code;

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
            controls.Subject.setValue(jobOrder.Subject);
            controls.Status.setValue(jobOrder.Status);
            controls.JobOrderUid.setValue(jobOrder.JobOrderUid);

            const specificationStartDate = UTCAsLocal(jobOrder.SpecificationStartDate);
            const specificationEndDate = UTCAsLocal(jobOrder.SpecificationEndDate);

            controls.SpecificationStartDate.setValue(specificationStartDate);
            controls.SpecificationEndDate.setValue(specificationEndDate);
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

    const startDate: Date = localDateJbStringAsUTC(jobOrder.SpecificationStartDate, this.jobOrdersGridService.dateTimeFormat);
    const endDate: Date = localDateJbStringAsUTC(jobOrder.SpecificationEndDate, this.jobOrdersGridService.dateTimeFormat);

    if (startDate.getTime() >= endDate.getTime()) {
      this.growlMessageService.setErrorMessage('Start date cannot be greater or equal End date');
      return;
    }

    const data: IUpdateJobOrderDto = {
      SpecificationUid: jobOrder.SpecificationUid,
      LastUpdated: currentLocalAsUTC(),
      Progress: jobOrder.Progress,

      SpecificationStartDate: startDate,
      SpecificationEndDate: endDate,

      Status: jobOrder.Status,
      Subject: jobOrder.Subject,

      Remarks: jobOrder.Remarks ?? ''
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

  public remarksEditorUpdateParentCtrlValue(remarks: string) {
    const controls = (this.updateJobOrderFormGroup.controls.jobOrderUpdate as FormGroup).controls;
    controls.Remarks.setValue(remarks);
  }

  public navigateToSpecificationDetails(specificationUid: string) {
    this.newTabService.navigate(['../../specification-details', specificationUid], { relativeTo: this.activatedRoute });
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
