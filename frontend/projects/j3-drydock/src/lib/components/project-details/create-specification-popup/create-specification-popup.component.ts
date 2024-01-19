import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { getSmallPopup } from '../../../models/constants/popup';
import { FormModel, IJbDialog, JmsService, eJMSWorkflowAction } from 'jibe-components';
import { SpecificationFormComponent } from '../specification-form/specification-form.component';
import { SpecificationCreateFormService } from '../specification-form/specification-create-form-service';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { finalize } from 'rxjs/operators';
import { GrowlMessageService } from '../../../services/growl-message.service';
import { SpecificationGridService } from '../../../services/project/specification.service';

@Component({
  selector: 'jb-create-specification-popup',
  templateUrl: './create-specification-popup.component.html',
  styleUrls: ['./create-specification-popup.component.scss']
})
export class CreateSpecificationPopupComponent extends UnsubscribeComponent {
  @Input() isOpen: boolean;
  @Input() projectId: string;
  @Input() vesselUid: string;
  @Input() vesselId: string;

  @Output() closeDialog = new EventEmitter<boolean>();

  @ViewChild(SpecificationFormComponent) popupForm: SpecificationFormComponent;

  readonly popupConfig: IJbDialog = {
    ...getSmallPopup(),
    dialogWidth: 1000,
    closableIcon: false,
    dialogHeader: 'New Technical Specification'
  };

  isPopupValid = false;

  isSaving: boolean;

  formStructure: FormModel = this.formService.formStructure;

  constructor(
    private formService: SpecificationCreateFormService,
    private specificationService: SpecificationGridService,
    private growlMessageService: GrowlMessageService,
    private jmsService: JmsService
  ) {
    super();
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

  private closePopup(isSaved = false) {
    this.closeDialog.emit(isSaved);
    this.isPopupValid = false;
    this.popupForm?.formGroup.reset();
  }

  private save() {
    if (!this.isValidationsPassed()) {
      return;
    }
    // Event to upload editor images
    this.jmsService.jmsEvents.next({ type: eJMSWorkflowAction.AddClassFlag });

    const rawValue = this.popupForm?.formGroup.getRawValue();

    const value = rawValue[this.formService.formId];
    const editors = rawValue[this.formService.editors];

    this.isSaving = true;

    this.specificationService
      .createSpecification({ ...value, Description: editors.description, ProjectUid: this.projectId, VesselUid: this.vesselUid })
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe(
        () => {
          this.growlMessageService.setSuccessMessage('Specification has been successfully created');
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
}
