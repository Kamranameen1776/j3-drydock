import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getSmallPopup } from '../../../models/constants/popup';
import { FormModel, FormValues, IJbDialog } from 'jibe-components';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { FormGroup } from '@angular/forms';
import { SpecificationSubItem } from '../../../models/interfaces/specification-sub-item';
import { SpecificationSubItemEditService } from '../specification-sub-items/specification-sub-item-edit.service';
import { GrowlMessageService } from '../../../services/growl-message.service';
import { BehaviorSubject } from 'rxjs';

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
  @Input() specificationUid: string;

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

  loading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private specificationSubItemEditService: SpecificationSubItemEditService,
    private growlService: GrowlMessageService
  ) {
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
    this.loading$.next(true);
    const value = this.formGroup.value[this.specificationSubItemEditService.formId];
    this.specificationSubItemEditService.updateSubItem(value, this.subItemDetails.uid, this.specificationUid).subscribe(
      () => {
        this.closePopup(true);
      },
      (err) => {
        this.growlService.errorHandler(err);
      },
      () => {
        this.loading$.next(false);
      }
    );
  }

  private initForm(): void {
    this.formModel = this.specificationSubItemEditService.formStructure;
    this.formValues = this.specificationSubItemEditService.getFormValues(this.subItemDetails);
  }
}
