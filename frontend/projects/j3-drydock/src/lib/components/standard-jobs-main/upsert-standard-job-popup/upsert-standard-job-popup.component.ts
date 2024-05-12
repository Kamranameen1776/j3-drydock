import { StandardJobResult } from '../../../models/interfaces/standard-jobs';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { getSmallPopup } from '../../../models/constants/popup';
import { FormModel, IJbAttachment, IJbDialog, eAttachmentButtonTypes, JmsService, eJMSWorkflowAction } from 'jibe-components';
import { UpsertStandardJobFormComponent } from '../upsert-standard-job-form/upsert-standard-job-form.component';
import { StandardJobUpsertFormService } from '../upsert-standard-job-form/standard-job-upsert-form.service';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { StandardJobsService } from '../../../services/standard-jobs.service';
import { finalize } from 'rxjs/operators';
import { GrowlMessageService } from '../../../services/growl-message.service';
import { SubItem } from '../../../models/interfaces/sub-items';
import { forkJoin } from 'rxjs';
import { cloneDeep } from 'lodash';
import { eModule } from '../../../models/enums/module.enum';
import { eFunction } from '../../../models/enums/function.enum';
import * as uuid from 'uuid/v4';

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

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 1000, dialogHeight: 620 };

  isPopupValid = false;

  okLabel: string;

  isSaving: boolean;

  get isEditing() {
    return !!this.item;
  }

  get jobFormValue() {
    return this.popupForm?.formGroup.getRawValue();
  }

  get functionUid() {
    return this.popupForm?.formGroup.getRawValue()[this.formService.formId]?.function?.Child_ID;
  }

  private get itemUid() {
    return this.item?.uid || this.newItemUid;
  }

  attachmentConfig: IJbAttachment;

  attachmentButton = {
    buttonLabel: 'Add New',
    buttonType: eAttachmentButtonTypes.NoButton
  };

  formStructure: FormModel = this.popupFormService.formStructure;

  newItemUid: string;

  private changedSubItems: SubItem[] = [];

  constructor(
    private formService: StandardJobUpsertFormService,
    private standardJobsService: StandardJobsService,
    private growlMessageService: GrowlMessageService,
    private popupFormService: StandardJobUpsertFormService,
    private jmsService: JmsService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isOpen && this.isOpen) {
      this.setNewItemUid();
      this.setPopupHeader();
      this.setPopupFooter();
      this.setAttachmentConfig();
      this.initChangedSubItems();
    }
  }

  onClosePopup() {
    if (this.isSaving) {
      return;
    }
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

  private setAttachmentConfig() {
    this.attachmentConfig = {
      Module_Code: eModule.Project,
      Function_Code: eFunction.StandardJob,
      Key1: this.itemUid
    };
  }

  private setPopupHeader() {
    this.popupConfig.dialogHeader = this.isEditing ? 'Edit Standard Job' : 'Create New Standard Job';
  }

  private setPopupFooter() {
    this.okLabel = 'Save & Close';
  }

  private closePopup(isSaved = false) {
    this.closeDialog.emit(isSaved);
    this.isPopupValid = false;
    this.changedSubItems = [];
    this.newItemUid = null;
  }

  private save() {
    if (!this.isValidationsPassed()) {
      return;
    }
    // TODO - temp workaround until normal event is provided by infra team: Event to upload editor images
    this.jmsService.jmsEvents.next({ type: eJMSWorkflowAction.AddClassFlag });

    const value = this.jobFormValue;

    this.isSaving = true;

    const updateSubitemsRequest$ = this.standardJobsService.updateJobSubItems(this.itemUid, this.changedSubItems);

    forkJoin([this.standardJobsService.upsertStandardJob(this.itemUid, value, this.isEditing), updateSubitemsRequest$])
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe(
        () => {
          this.growlMessageService.setSuccessMessage('Standard Job saved successfully.');
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

  private setNewItemUid() {
    if (!this.item) {
      this.newItemUid = uuid();
    }
  }
}
