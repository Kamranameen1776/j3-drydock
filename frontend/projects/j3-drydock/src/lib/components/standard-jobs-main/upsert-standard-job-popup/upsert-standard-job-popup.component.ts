import { StandardJobResult } from '../../../models/interfaces/standard-jobs';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { getSmallPopup } from '../../../models/constants/popup';
import { FormModel, IJbAttachment, IJbDialog, eAttachmentButtonTypes } from 'jibe-components';
import { UpsertStandardJobFormComponent } from '../upsert-standard-job-form/upsert-standard-job-form.component';
import { StandardJobUpsertFormService } from '../upsert-standard-job-form/StandardJobUpsertFormService';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { StandardJobsService } from '../../../services/standard-jobs.service';
import { finalize } from 'rxjs/operators';
import { GrowlMessageService } from '../../../services/growl-message.service';
import { SubItem } from '../../../models/interfaces/sub-items';
import { forkJoin } from 'rxjs';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'jb-upsert-standard-job-popup',
  templateUrl: './upsert-standard-job-popup.component.html',
  styleUrls: ['./upsert-standard-job-popup.component.scss']
})
export class UpsertStandardJobPopupComponent extends UnsubscribeComponent implements OnChanges {
  @Input() item: StandardJobResult;

  @Input() isOpen: boolean;

  @Output() closeDialog = new EventEmitter<boolean>();

  @ViewChild(UpsertStandardJobFormComponent) popupForm: UpsertStandardJobFormComponent;

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 1000, closableIcon: false };

  isPopupValid = false;

  okLabel: string;

  isSaving: boolean;

  get isEditing() {
    return !!this.item;
  }

  get jobFormValue() {
    return this.popupForm?.formGroup.getRawValue()[this.formService.formId];
  }
  // TODO fixme to relevant values and use them from eModuleCode and eFunctionCode from jibe-components
  attachmentConfig: IJbAttachment = { Module_Code: 'j3_drydock', Function_Code: 'standard_jobs' };

  attachmentButton = {
    buttonLabel: 'Add New',
    buttonType: eAttachmentButtonTypes.NoButton
  };

  formStructure: FormModel = this.popupFormService.formStructure;

  private changedSubItems: SubItem[] = [];

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
      this.setAttachmentConfig();
      this.initChangedSubIems();
    }
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

  onSubItemsChanged(subItems: SubItem[]) {
    this.changedSubItems = subItems;
  }

  // TODO fixme to relevant values and use them from eModuleCode and eFunctionCode from jibe-components
  private setAttachmentConfig() {
    this.attachmentConfig = {
      Module_Code: 'project',
      Function_Code: 'standard_job',
      Key1: this.item?.uid
    };
  }

  private setPopupHeader() {
    this.popupConfig.dialogHeader = !this.isEditing ? 'Create New Standard Job' : 'Edit Standard Job';
  }

  private setPopupFooter() {
    this.okLabel = 'Save';
  }

  private closePopup(isSaved = false) {
    this.closeDialog.emit(isSaved);
    this.isPopupValid = false;
    this.changedSubItems = [];
  }

  private save() {
    const value = this.jobFormValue;

    // TODO here can be addded validation messages for the form that appear in growl

    this.isSaving = true;

    forkJoin([
      this.standardJobsService.upsertStandardJob(this.item?.uid, value),
      this.standardJobsService.updateJobSubItems(this.item?.uid, this.changedSubItems)
    ])
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

  private initChangedSubIems() {
    const subItems = this.item?.subItems ?? [];
    this.changedSubItems = cloneDeep(subItems);
  }
}
