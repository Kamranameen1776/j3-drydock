import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormModel, JbEditorComponent, UserService } from 'jibe-components';
import { ToolbarModule } from 'primeng';
import { EditorConfig } from '../../../../models/interfaces/EditorConfig';
import { JobOrdersFormService } from './JobOrdersFormService';
import { IJobOrderFormDto } from './dtos/IJobOrderFormDto';
import { KeyValuePair } from '../../../../utils/KeyValuePair';
import { NewTabService } from '../../../../services/new-tab-service';
import { ActivatedRoute } from '@angular/router';
import { IJobOrdersFormComponent } from './IJobOrdersFormComponent';
import { IJobOrderFormResultDto } from './dtos/IJobOrderFormResultDto';
import { UTCAsLocal, localDateJbStringAsUTC } from '../../../../utils/date';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jb-job-orders-form',
  templateUrl: './job-orders-form.component.html',
  styleUrls: ['./job-orders-form.component.scss'],
  providers: [JobOrdersFormService]
})
export class JobOrdersFormComponent extends UnsubscribeComponent implements OnInit, IJobOrdersFormComponent {
  @Input()
  specificationUid: string;

  @ViewChild('remarksEditor')
  remarksEditor: JbEditorComponent;

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

  constructor(
    private jobOrdersFormService: JobOrdersFormService,
    private userService: UserService,
    private newTabService: NewTabService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.updateJobOrderForm = this.jobOrdersFormService.getUpdateJobOrderForm();

    this.remarksEditorConfig = this.jobOrdersFormService.getRemarksEditorConfig();
  }

  public init(jobOrderFormDto: IJobOrderFormDto) {
    this.reset();

    const controls = (this.updateJobOrderFormGroup.controls.jobOrderUpdate as FormGroup).controls;

    controls.SpecificationUid.setValue(jobOrderFormDto.SpecificationUid);
    controls.Progress.setValue(jobOrderFormDto.Progress);

    this.selectedSpecification.Key = jobOrderFormDto.SpecificationUid;
    this.selectedSpecification.Value = jobOrderFormDto.Code;

    this.remarksEditor.key1 = jobOrderFormDto.SpecificationUid;
    this.remarksEditor.vesselId = this.userService.getUserDetails().VesselId;

    this.remarksEditorFormGroup.controls.RemarksCtrl.setValue(jobOrderFormDto.Remarks);
    controls.Subject.setValue(jobOrderFormDto.Subject);
    controls.Status.setValue(jobOrderFormDto.Status);

    controls.SpecificationStartDate.setValue(UTCAsLocal(jobOrderFormDto.SpecificationStartDate));
    controls.SpecificationEndDate.setValue(UTCAsLocal(jobOrderFormDto.SpecificationEndDate));
  }

  save(): IJobOrderFormResultDto | Error {
    const jobOrder = this.updateJobOrderFormGroup.value.jobOrderUpdate;

    const startDate: Date = localDateJbStringAsUTC(jobOrder.SpecificationStartDate, this.jobOrdersFormService.dateTimeFormat);
    const endDate: Date = localDateJbStringAsUTC(jobOrder.SpecificationEndDate, this.jobOrdersFormService.dateTimeFormat);

    if (startDate.getTime() >= endDate.getTime()) {
      return new Error('Start date cannot be greater or equal End date');
    }

    const result: IJobOrderFormResultDto = {
      SpecificationUid: jobOrder.SpecificationUid,
      Progress: jobOrder.Progress,

      SpecificationStartDate: startDate,
      SpecificationEndDate: endDate,

      Status: jobOrder.Status,
      Subject: jobOrder.Subject,

      Remarks: this.remarksEditorFormGroup.controls.RemarksCtrl.value ?? ''
    };

    return result;
  }

  public onValueChangesIsFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  public remarksEditorUpdateParentCtrlValue(remarks: string) {
    const controls = (this.updateJobOrderFormGroup.controls.jobOrderUpdate as FormGroup).controls;
    controls.Remarks.setValue(remarks);
  }

  public initUpdateJobOrderFormGroup(action: FormGroup): void {
    this.updateJobOrderFormGroup = action;

    this.updateJobOrderFormGroup.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.onValueChangesIsFormValid.next(this.updateJobOrderFormGroup.valid);
      return this.updateJobOrderFormGroup.valid;
    });
  }

  public navigateToSpecificationDetails(specificationUid: string) {
    this.newTabService.navigate(['../../specification-details', specificationUid], { relativeTo: this.activatedRoute });
  }

  private reset() {
    this.updateJobOrderFormGroup.reset();
    this.remarksEditorFormGroup.reset();
  }
}
