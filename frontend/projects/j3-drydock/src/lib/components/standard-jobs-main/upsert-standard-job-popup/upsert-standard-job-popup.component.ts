import { StandardJobResult } from './../../../models/interfaces/standard-jobs';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { getSmallPopup } from '../../../models/constants/popup';
import { FormModel, IJbAttachment, IJbDialog, eAttachmentButtonTypes } from 'jibe-components';
import { UpsertStandardJobFormComponent } from '../upsert-standard-job-form/upsert-standard-job-form.component';
import { StandardJobUpsertFormService } from '../upsert-standard-job-form/StandardJobUpsertFormService';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { StandardJobsService } from '../../../services/StandardJobsService';
import { finalize } from 'rxjs/operators';
import { GrowlMessageService } from '../../../services/GrowlMessageService';

@Component({
  selector: 'jb-upsert-standard-job-popup',
  templateUrl: './upsert-standard-job-popup.component.html',
  styleUrls: ['./upsert-standard-job-popup.component.scss']
})
export class UpsertStandardJobPopupComponent extends UnsubscribeComponent implements OnChanges, OnInit {
  @Input() item: StandardJobResult;
  @Input() isOpen: boolean;
  @Output() closeDialog = new EventEmitter<boolean>();

  @ViewChild(UpsertStandardJobFormComponent) popupForm: UpsertStandardJobFormComponent;

  public readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 1000, closableIcon: false };

  public isPopupValid = false;

  public okLabel: string;

  public isSaving: boolean;

  public get isEditing() {
    return !!this.item;
  }

  public get jobFormValue() {
    return this.popupForm?.formGroup.getRawValue()[this.formService.formId];
  }
  // TODO fixme to relevant values and use them from eModuleCode and eFunctionCode from jibe-components
  public attachmentConfig: IJbAttachment = { Module_Code: 'j3_drydock', Function_Code: 'standard_jobs' };

  public attachmentButton = {
    buttonLabel: 'Add New',
    buttonType: eAttachmentButtonTypes.NoButton
  };

  public formStructure: FormModel = this.popupFormService.formStructure;

  constructor(
    private formService: StandardJobUpsertFormService,
    private standardJobsService: StandardJobsService,
    private growlMessageService: GrowlMessageService,
    private popupFormService: StandardJobUpsertFormService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      this.setPopupHeader();
      this.setPopupFooter();
    }
  }

  ngOnInit(): void {
    this.setAttachmentConfig();
  }

  onClosePopup() {
    this.closePopup();
  }

  onOkPopup() {
    this.save();
  }

  onIsFormValid(isValid: boolean) {
    this.isPopupValid = isValid;
  }

  // TODO fixme to relevant values and use them from eModuleCode and eFunctionCode from jibe-components
  private setAttachmentConfig() {
    this.attachmentConfig = {
      Module_Code: 'j3_drydock',
      Function_Code: 'standard_jobs',
      Key1: this.item.uid
    };
  }

  private setPopupHeader() {
    this.popupConfig.dialogHeader = !this.isEditing ? 'Create New Standard Job' : 'Update Standard Job';
  }

  private setPopupFooter() {
    this.okLabel = this.isEditing ? 'Update' : 'Create';
  }

  private closePopup(isSaved = false) {
    this.closeDialog.emit(isSaved);
    this.isPopupValid = false;
  }

  private save() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const value = this.jobFormValue;

    // TODO here can be addded validation messages for the form that appear in growl

    this.isSaving = true;

    this.standardJobsService
      .upsertStandardJob(this.item?.uid, value)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe(
        () => {
          this.closePopup(true);
        },
        (err) => {
          if (err?.status === 422) {
            this.growlMessageService.setErrorMessage(err.error);
          } else {
            this.growlMessageService.setErrorMessage('Server error occured');
          }
        }
      );
  }
}
