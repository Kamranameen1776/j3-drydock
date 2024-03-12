import { ProjectTemplatePayload, ProjectTemplatesService } from './../../../services/project-templates.service';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { getSmallPopup } from '../../../models/constants/popup';
import { FormModel, IJbDialog, JmsService, eJMSWorkflowAction } from 'jibe-components';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { finalize } from 'rxjs/operators';
import { GrowlMessageService } from '../../../services/growl-message.service';
import { cloneDeep } from 'lodash';
import * as uuid from 'uuid/v4';
import { ProjectTemplate } from '../../../models/interfaces/project-template';
import { ProjectTemplateUpsertFormService } from '../upsert-project-template-form/upsert-project-template-form.service';
import { UpsertProjectTemplateFormComponent } from '../upsert-project-template-form/upsert-project-template-form.component';
import { ProjectTemplateStandardJob } from '../project-template-standard-jobs/project-template-standard-jobs-grid.service';

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

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 1000 };

  isPopupValid = false;

  okLabel: string;

  isSaving: boolean;

  isLoadingStandardJobs = false;

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

  linkedStandardJobs: ProjectTemplateStandardJob[] = [];

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
      this.loadLinkedStandardJobs();
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

  onLinkedStandardJobsChanged(items: ProjectTemplateStandardJob[]) {
    this.linkedStandardJobs = items;
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
    this.linkedStandardJobs = [];
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
      VesselTypeId: formValue.VesselTypeId || [],
      VesselTypeSpecific: formValue.VesselTypeSpecific,
      ProjectTypeUid: formValue.ProjectTypeUid,
      StandardJobs: this.linkedStandardJobs.map((x) => x.StandardJobUid)
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

  private loadLinkedStandardJobs() {
    if (!this.isEditing) {
      this.linkedStandardJobs = [];
      return;
    }

    this.isLoadingStandardJobs = true;

    this.projectTemplatesService
      .getProjectTemplateStandardJobs(this.itemUid)
      .pipe(
        finalize(() => {
          this.isLoadingStandardJobs = false;
        })
      )
      .subscribe(
        (response) => {
          this.linkedStandardJobs = cloneDeep(response);
        },
        () => {
          this.linkedStandardJobs = [];
        }
      );
  }
}
