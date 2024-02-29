import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormModel, JbEditorComponent, UserService } from 'jibe-components';
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

@Component({
  selector: 'jb-job-orders-form',
  templateUrl: './job-orders-form.component.html',
  styleUrls: ['./job-orders-form.component.scss'],
  providers: [JobOrdersFormService]
})
export class JobOrdersFormComponent extends UnsubscribeComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  hideSpecificationStartEndDate = false;

  @Input() vesselId: number;

  @Input() isOpen: boolean;
  @Input() jobOrderFormValue: IJobOrderFormDto;

  @Output() isChanged = new EventEmitter<boolean>();

  @ViewChild('remarksEditor')
  remarksEditor: JbEditorComponent;

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

  constructor(
    private jobOrdersFormService: JobOrdersFormService,
    private userService: UserService,
    private newTabService: NewTabService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.updateJobOrderForm = this.jobOrdersFormService.getUpdateJobOrderForm(this.hideSpecificationStartEndDate);
  }

  ngOnInit(): void {
    this.init(this.jobOrderFormValue);
    this.remarksEditorConfig = this.jobOrdersFormService.getRemarksEditorConfig();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.isChanged.next(false);
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
    this.isChanged.next(true);
    this.remarksEditorFormGroup.get('RemarksCtrl').setValue(remarks);
  }

  initUpdateJobOrderFormGroup(action: FormGroup): void {
    this.updateJobOrderFormGroup = action;
    this.updateJobOrderFormValues();
    this.updateJobOrderFormGroup?.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((v) => {
      this.isChanged.next(true);
    });
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
      this.isChanged.next(true);
    }
  }

  private init(jobOrderFormDto: IJobOrderFormDto) {
    this.selectedSpecification.Key = jobOrderFormDto.SpecificationUid;
    this.selectedSpecification.Value = jobOrderFormDto.Code;

    this.uid = jobOrderFormDto.uid;

    if (this.remarksEditor) {
      this.remarksEditor.key1 = jobOrderFormDto.SpecificationUid;
      this.remarksEditor.vesselId = this.vesselId;
    }

    this.remarksEditorFormGroup?.controls.RemarksCtrl.setValue(jobOrderFormDto.Remarks ?? '');
  }

  private updateJobOrderFormValues() {
    const group = this.updateJobOrderFormGroup?.controls.jobOrderUpdate as FormGroup;
    const controls = group?.controls;

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
