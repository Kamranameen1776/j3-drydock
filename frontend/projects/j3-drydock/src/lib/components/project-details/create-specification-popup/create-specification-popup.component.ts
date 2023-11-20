import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { getSmallPopup } from '../../../models/constants/popup';
import { FormModel, IJbDialog } from 'jibe-components';
import { SpecificationFormComponent } from '../specification-form/specification-form.component';
import { SpecificationCreateFormService } from '../specification-form/specification-create-form-service';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { finalize } from 'rxjs/operators';
import { GrowlMessageService } from '../../../services/growl-message.service';
import { SpecificationGridService } from '../../../services/specifications/specification.service';

@Component({
  selector: 'jb-create-specification-popup',
  templateUrl: './create-specification-popup.component.html',
  styleUrls: ['./create-specification-popup.component.scss']
})
export class CreateSpecificationPopupComponent extends UnsubscribeComponent {
  @Input() isOpen: boolean;

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
  }

  private save() {
    const value = this.jobFormValue;

    this.isSaving = true;

    this.specificationService
      .createSpecification(value)
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
