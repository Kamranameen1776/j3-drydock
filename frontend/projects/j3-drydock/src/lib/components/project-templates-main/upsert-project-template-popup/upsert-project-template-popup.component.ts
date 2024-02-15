import { ProjectTemplatePayload, ProjectTemplatesService } from './../../../services/project-templates.service';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { getSmallPopup } from '../../../models/constants/popup';
import { FormModel, IJbDialog, JmsService, eJMSWorkflowAction } from 'jibe-components';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { finalize } from 'rxjs/operators';
import { GrowlMessageService } from '../../../services/growl-message.service';
import { SubItem } from '../../../models/interfaces/sub-items';
import { cloneDeep } from 'lodash';
import * as uuid from 'uuid/v4';
import { ProjectTemplate } from '../../../models/interfaces/project-template';
import { ProjectTemplateUpsertFormService } from '../upsert-project-template-form/upsert-project-template-form.service';
import { UpsertProjectTemplateFormComponent } from '../upsert-project-template-form/upsert-project-template-form.component';

@Component({
  selector: 'jb-upsert-project-template-popup',
  templateUrl: './upsert-project-template-popup.component.html',
  styleUrls: ['./upsert-project-template-popup.component.scss']
})
export class UpsertProjectTemplatePopupComponent extends UnsubscribeComponent implements OnChanges {
  @Input() item: ProjectTemplate;

  @Input() isOpen: boolean;

  @Output() closeDialog = new EventEmitter<boolean>();

  @ViewChild(UpsertProjectTemplateFormComponent) popupForm: UpsertProjectTemplateFormComponent;

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 1000, closableIcon: false };

  isPopupValid = false;

  okLabel: string;

  isSaving: boolean;

  isLoadingStandardJobs: boolean;

  get isEditing() {
    return !!this.item;
  }

  get jobFormValue() {
    return this.popupForm?.formGroup.getRawValue();
  }

  private get itemUid() {
    return this.item?.ProjectTemplateUid || this.newItemUid;
  }

  formStructure: FormModel = this.popupFormService.formStructure;

  newItemUid: string;
  // TODO - fixme type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private changedStandardJobs: any[] = [];

  constructor(
    private projectTemplatesService: ProjectTemplatesService,
    private growlMessageService: GrowlMessageService,
    private popupFormService: ProjectTemplateUpsertFormService,
    private jmsService: JmsService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isOpen && this.isOpen) {
      this.setNewItemUid();
      this.setPopupHeader();
      this.setPopupFooter();
      this.initChangedStandardJobs();
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
    this.changedStandardJobs = subItems;
  }

  private setPopupHeader() {
    this.popupConfig.dialogHeader = this.isEditing ? 'Edit Project Template' : 'Create Project Template';
  }

  private setPopupFooter() {
    this.okLabel = 'Save';
  }

  private closePopup(isSaved = false) {
    this.closeDialog.emit(isSaved);
    this.isPopupValid = false;
    this.changedStandardJobs = [];
    this.newItemUid = null;
  }

  private save() {
    if (!this.isValidationsPassed()) {
      return;
    }
    // TODO - temp workaround until normal event is provided by infra team: Event to upload editor images
    this.jmsService.jmsEvents.next({ type: eJMSWorkflowAction.AddClassFlag });

    const value = this.jobFormValue;
    const formValue = value[this.popupFormService.formId];

    this.isSaving = true;

    const payload: ProjectTemplatePayload = {
      ProjectTemplateUid: this.itemUid,
      Subject: formValue.Subject,
      Description: value.editors.description,
      VesselTypeUid: formValue.VesselTypeUid,
      ProjectTypeUid: formValue.ProjectTypeUid,
      StandardJobs: this.changedStandardJobs.map((x) => x.StandardJobUid)
    };

    this.projectTemplatesService
      .upsertProjectTemplate(payload, this.isEditing)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe(
        () => {
          this.growlMessageService.setSuccessMessage('Project Template saved successfully.');
          this.closePopup(true);
        },
        // eslint-disable-next-line rxjs/no-implicit-any-catch
        (err) => {
          this.growlMessageService.errorHandler(err);
        }
      );
  }

  private initChangedStandardJobs() {
    // TODO standardJobs must be loaded from the server
    const standardJobs = [];
    this.changedStandardJobs = cloneDeep(standardJobs);
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
