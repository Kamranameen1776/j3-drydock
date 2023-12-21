import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { getSmallPopup } from '../../../models/constants/popup';
import { FormModel, IJbDialog } from 'jibe-components';
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

  @Output() closeDialog = new EventEmitter<boolean>();

  @ViewChild(SpecificationFormComponent) popupForm: SpecificationFormComponent;

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 1000, closableIcon: false, dialogHeader: 'New Spec' };

  isPopupValid = false;

  isSaving: boolean;

  get jobFormValue() {
    return this.popupForm?.formGroup.getRawValue()[this.formService.formId];
  }

  formStructure: FormModel = this.formService.formStructure;

  constructor(
    private formService: SpecificationCreateFormService,
    private specificationService: SpecificationGridService,
    private growlMessageService: GrowlMessageService
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
    if (!this.validationsChecked()) {
      return;
    }

    const value = this.jobFormValue;

    this.isSaving = true;

    this.specificationService
      .createSpecification({ ...value, ProjectUid: this.projectId, VesselUid: this.vesselUid })
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
          if (err?.status === 422) {
            this.growlMessageService.setErrorMessage(err?.error?.message);
          } else {
            this.growlMessageService.setErrorMessage('Server error occured');
          }
        }
      );
  }

  private validationsChecked(): boolean {
    if (!this.isPopupValid) {
      this.growlMessageService.setErrorMessage('Please fill the required fields');
      return false;
    }
    return true;
  }
}
