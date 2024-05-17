import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormModel, JbEditorComponent } from 'jibe-components';
import { ToolbarModule } from 'primeng';

import { JobOrdersFormService } from './JobOrdersFormService';
import { IJobOrderFormDto } from './dtos/IJobOrderFormDto';
import { ActivatedRoute } from '@angular/router';
import { IJobOrderFormResultDto } from './dtos/IJobOrderFormResultDto';
import { UnsubscribeComponent } from '../../classes/unsubscribe.base';
import { takeUntil } from 'rxjs/operators';
import { EditorConfig } from '../../../models/interfaces/EditorConfig';
import { KeyValuePair } from '../../../utils/KeyValuePair';
import { NewTabService } from '../../../services/new-tab-service';
import { UTCAsLocal, localDateJbStringAsUTC } from '../../../utils/date';
import { CostUpdatesTabComponent } from '../cost-updates-tab/cost-updates-tab.component';
import { JobOrderDto } from '../../../services/project-monitoring/job-orders/JobOrderDto';
import { ICard, ICardStatus } from '../item-card/item-card.component';

@Component({
  selector: 'jb-job-orders-form',
  templateUrl: './job-orders-form.component.html',
  styleUrls: ['./job-orders-form.component.scss'],
  providers: [JobOrdersFormService]
})
export class JobOrdersFormComponent extends UnsubscribeComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() hideSpecificationStartEndDate = false;
  @Input() vesselId: number;
  @Input() isOpen: boolean;
  @Input() jobOrders: JobOrderDto[];
  @Input() disableForm = false;
  @Input() emptyForm = false;
  @Input() selectedRow: Pick<JobOrderDto, 'JobOrderUid'>;

  jobOrderFormValue: IJobOrderFormDto;

  @Output() isChangedAndValid = new EventEmitter<boolean>();

  @ViewChild('remarksEditor') remarksEditor: JbEditorComponent;

  @ViewChild('updatesTab') updatesTab: CostUpdatesTabComponent;

  updateJobOrderForm: FormModel;
  updateJobOrderFormGroup: FormGroup;
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
  remarksEditorFormGroup: FormGroup = new FormGroup({
    RemarksCtrl: new FormControl('', Validators.required)
  });
  remarksEditorConfig: EditorConfig;
  selectedSpecification: KeyValuePair<string, string> = { Key: '', Value: '' };
  uid: string;
  jobOrderHistoryList: ICard<JobOrderDto>[];

  constructor(
    private jobOrdersFormService: JobOrdersFormService,
    private newTabService: NewTabService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  private get jobOrderUpdateFormGroup() {
    return this.updateJobOrderFormGroup?.controls.jobOrderUpdate as FormGroup;
  }

  ngAfterViewInit(): void {
    this.updateJobOrderForm = this.jobOrdersFormService.getUpdateJobOrderForm(this.hideSpecificationStartEndDate);
  }

  ngOnInit(): void {
    this.init(this.jobOrders[0]);
    this.remarksEditorConfig = this.jobOrdersFormService.getRemarksEditorConfig();
    this.setJobOrderHistory();
    this.selectRow(this.selectedRow);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.isChangedAndValid.next(false);
  }

  public save(): IJobOrderFormResultDto | Error {
    const jobOrder = this.updateJobOrderFormGroup?.value.jobOrderUpdate;
    let startDate: Date;
    let endDate: Date;

    if (!this.updateJobOrderFormGroup?.valid) {
      return new Error('Please fill the required fields');
    }

    if (!this.hideSpecificationStartEndDate) {
      startDate = localDateJbStringAsUTC(jobOrder.SpecificationStartDate, this.jobOrdersFormService.dateTimeFormat);
      endDate = localDateJbStringAsUTC(jobOrder.SpecificationEndDate, this.jobOrdersFormService.dateTimeFormat);

      if (startDate.getTime() >= endDate.getTime()) {
        return new Error('Start date cannot be greater or equal End date');
      }
    }

    const result: IJobOrderFormResultDto = {
      SpecificationUid: jobOrder.SpecificationUid,
      Progress: jobOrder.Progress,

      SpecificationStartDate: startDate,
      SpecificationEndDate: endDate,

      Status: jobOrder.Status,
      Subject: jobOrder.Subject,

      Remarks: this.remarksEditorFormGroup.controls.RemarksCtrl.value ?? '',

      UpdatesChanges: []
    };

    const updatesChangesMap = this.updatesTab?.changedRowsMap;
    if (updatesChangesMap?.size) {
      updatesChangesMap.forEach((value) => {
        result.UpdatesChanges.push(value);
      });
    }

    return result;
  }

  remarksEditorUpdateParentCtrlValue(remarks: string) {
    this.isChangedAndValid.next(this.updateJobOrderFormGroup.valid);
    this.remarksEditorFormGroup.get('RemarksCtrl').setValue(remarks);
  }

  initUpdateJobOrderFormGroup(action: FormGroup): void {
    this.updateJobOrderFormGroup = action;
    this.updateJobOrderFormValues();
    this.updateJobOrderFormGroup?.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.isChangedAndValid.next(this.updateJobOrderFormGroup.valid);
    });

    if (this.disableForm) {
      this.jobOrderUpdateFormGroup?.disable();
      this.remarksEditorFormGroup.disable();
    }
  }

  navigateToSpecificationDetails(specification: KeyValuePair<string, string>) {
    const tab_title = `Specification ${specification.Value}`;
    this.newTabService.navigate(
      ['../../specification-details', specification.Key],
      {
        relativeTo: this.activatedRoute,
        queryParams: { tab_title }
      },
      tab_title
    );
  }

  onCostUpdatesChanged(value: boolean) {
    if (value) {
      this.isChangedAndValid.next(this.updateJobOrderFormGroup?.valid);
    }
  }

  onHistorySelected(event: ICard<JobOrderDto>) {
    this.clearJobOrderHistorySelection();
    event.selected = true;
    this.init(event.data);
  }

  private setJobOrderHistory(): void {
    this.jobOrderHistoryList = this.jobOrders.map((jobOrder) => {
      let status: ICardStatus;

      switch (jobOrder.Status) {
        case 'Completed':
          status = ICardStatus.Completed;
          break;
        case 'Cancelled':
          status = ICardStatus.Cancelled;
          break;
        default:
          status = ICardStatus.InProgress;
          break;
      }

      return {
        title: jobOrder.CreatedBy,
        description: status,
        date: new Date(jobOrder.SpecificationStartDate),
        status: status,
        data: jobOrder,
        selected: false
      };
    });
  }

  private clearJobOrderHistorySelection() {
    this.jobOrderHistoryList.forEach((item) => {
      item.selected = false;
    });
  }

  private init(jobOrder: JobOrderDto) {
    this.jobOrderFormValue = {};
    this.jobOrderFormValue.SpecificationUid = jobOrder.SpecificationUid;
    this.jobOrderFormValue.Code = jobOrder.Code;

    this.selectedSpecification.Key = this.jobOrderFormValue.SpecificationUid;
    this.selectedSpecification.Value = this.jobOrderFormValue.Code;

    if (this.remarksEditor) {
      this.remarksEditor.key1 = this.jobOrderFormValue.SpecificationUid;
      this.remarksEditor.vesselId = this.vesselId;
    }

    if (this.emptyForm) {
      return;
    }

    if (jobOrder) {
      this.jobOrderFormValue.Remarks = jobOrder.Remarks;
      this.jobOrderFormValue.Progress = jobOrder.Progress;
      this.jobOrderFormValue.Subject = jobOrder.Subject;
      this.jobOrderFormValue.Status = jobOrder.Status;
      this.jobOrderFormValue.SpecificationStartDate = jobOrder.SpecificationStartDate;
      this.jobOrderFormValue.SpecificationEndDate = jobOrder.SpecificationEndDate;
    }

    this.updateJobOrderFormValues();

    this.uid = this.jobOrderFormValue.uid;

    this.remarksEditorFormGroup?.controls.RemarksCtrl.setValue(this.jobOrderFormValue.Remarks ?? '');
  }

  private selectRow(selectedRow?: Pick<JobOrderDto, 'JobOrderUid'>) {
    this.clearJobOrderHistorySelection();
    if (selectedRow) {
      const row = this.jobOrderHistoryList.find((jobOrder) => jobOrder.data.JobOrderUid === selectedRow.JobOrderUid);
      row.selected = true;
    } else {
      this.jobOrderHistoryList[0].selected = true;
    }
  }

  private updateJobOrderFormValues() {
    const controls = this.jobOrderUpdateFormGroup?.controls;

    controls?.SpecificationUid.setValue(this.jobOrderFormValue.SpecificationUid);
    controls?.Progress.setValue(this.jobOrderFormValue.Progress);
    controls?.Subject.setValue(this.jobOrderFormValue.Subject);
    controls?.Status.setValue(this.jobOrderFormValue.Status);

    if (!this.hideSpecificationStartEndDate) {
      controls?.SpecificationStartDate.setValue(UTCAsLocal(this.jobOrderFormValue.SpecificationStartDate));
      controls?.SpecificationEndDate.setValue(UTCAsLocal(this.jobOrderFormValue.SpecificationEndDate));
    }
  }
}
