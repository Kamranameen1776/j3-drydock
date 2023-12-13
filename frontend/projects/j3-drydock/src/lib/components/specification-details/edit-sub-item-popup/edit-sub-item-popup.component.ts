import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getSmallPopup } from '../../../models/constants/popup';
import { FormModel, FormValues, IJbDialog } from 'jibe-components';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { FormGroup } from '@angular/forms';
import { SpecificationSubItem } from '../../../models/interfaces/specification-sub-item';
import { SpecificationSubItemEditFormService } from '../specification-sub-items/specification-sub-item-edit-form.service';

@Component({
  selector: 'jb-edit-sub-item-popup',
  templateUrl: './edit-sub-item-popup.component.html',
  styleUrls: ['./edit-sub-item-popup.component.scss']
})
export class EditSubItemPopupComponent extends UnsubscribeComponent implements OnInit {
  @Input() isOpen: boolean;
  @Input() projectId: string;
  @Input() vesselUid: string;
  @Input() subItemDetails: SpecificationSubItem;

  @Output() closeDialog = new EventEmitter<boolean>();

  readonly popupConfig: IJbDialog = {
    ...getSmallPopup(),
    dialogWidth: 1000,
    closableIcon: false,
    dialogHeader: 'Edit Sub Item'
  };

  formId = 'editSubItemForm';
  formGroup: FormGroup;
  formModel: FormModel;
  formValues: FormValues;

  isSaving: boolean;

  constructor(private specificationSubItemEditFormService: SpecificationSubItemEditFormService) {
    super();
  }

  ngOnInit() {
    this.initForm();
  }

  cancel() {
    this.closePopup();
  }

  submitForm() {
    this.save();
  }

  dispatchForm(event: FormGroup): void {
    this.formGroup = event;
  }

  private closePopup(isSaved = false) {
    this.closeDialog.emit(isSaved);
  }

  private save() {
    this.closePopup(true);
  }

  private initForm(): void {
    this.formModel = this.specificationSubItemEditFormService.formStructure;
    this.formValues = this.specificationSubItemEditFormService.getFormValues(this.subItemDetails);
  }
}
