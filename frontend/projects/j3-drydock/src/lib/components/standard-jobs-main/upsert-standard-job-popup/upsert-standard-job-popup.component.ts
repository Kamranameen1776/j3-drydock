import { StandardJobResult } from '../../../models/interfaces/standard-jobs';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { getSmallPopup } from '../../../models/constants/popup';
import { FormModel, IJbAttachment, IJbDialog, eAttachmentButtonTypes } from 'jibe-components';
import { UpsertStandardJobFormComponent } from '../upsert-standard-job-form/upsert-standard-job-form.component';
import { StandardJobUpsertFormService } from '../upsert-standard-job-form/standard-job-upsert-form.service';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { StandardJobsService } from '../../../services/standard-jobs.service';
import { finalize } from 'rxjs/operators';
import { GrowlMessageService } from '../../../services/growl-message.service';
import { SubItem } from '../../../models/interfaces/sub-items';
import { forkJoin, of } from 'rxjs';
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
  attachmentConfig: IJbAttachment = { Module_Code: 'j3_drydock', Function_Code: 'standard_job' };

  attachmentButton = {
    buttonLabel: 'Add New',
    buttonType: eAttachmentButtonTypes.NoButton
  };

  formStructure: FormModel = this.popupFormService.formStructure;

  showLoader = false;

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
      this.initChangedSubItems();
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
    this.okLabel = 'Save & Close';
  }

  private closePopup(isSaved = false) {
    this.closeDialog.emit(isSaved);
    this.isPopupValid = false;
    this.changedSubItems = [];
  }

  private save() {
    if (!this.isValidationsPassed()) {
      return;
    }

    this.showLoader = true;
    const value = this.jobFormValue;

    this.isSaving = true;

    const updateSubitemsRequest$ = this.item?.uid
      ? this.standardJobsService.updateJobSubItems(this.item.uid, this.changedSubItems)
      : of(null);

    forkJoin([this.standardJobsService.upsertStandardJob(this.item?.uid, value), updateSubitemsRequest$])
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe(
        () => {
          this.growlMessageService.setSuccessMessage('Standard Job saved successfully.');
          this.showLoader = false;
          this.closePopup(true);
        },
        // eslint-disable-next-line rxjs/no-implicit-any-catch
        (err) => {
          this.growlMessageService.errorHandler(err);
        }
      );
  }

  private initChangedSubItems() {
    const subItems = this.item?.subItems ?? [];
    this.changedSubItems = cloneDeep(subItems);
  }

  private isValidationsPassed(): boolean {
    if (!this.isPopupValid) {
      this.growlMessageService.setErrorMessage('Please fill the required fields');
      return false;
    }
    return true;
  }
}
