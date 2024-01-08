import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getSmallPopup } from '../../../models/constants/popup';
import { FormModel, FormValues, IJbDialog } from 'jibe-components';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { FormGroup } from '@angular/forms';
import { SpecificationSubItem } from '../../../models/interfaces/specification-sub-item';
import { SpecificationSubItemEditService } from '../specification-sub-items/specification-sub-item-edit.service';
import { GrowlMessageService } from '../../../services/growl-message.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { eSubItemsDialog } from '../../../models/enums/sub-items.enum';

@Component({
  selector: 'jb-edit-sub-item-popup',
  templateUrl: './edit-sub-item-popup.component.html',
  styleUrls: ['./edit-sub-item-popup.component.scss']
})
export class EditSubItemPopupComponent extends UnsubscribeComponent implements OnInit, AfterViewInit {
  @Input() isOpen: boolean;
  @Input() projectId: string;
  @Input() vesselUid: string;
  @Input() subItemDetails: SpecificationSubItem;
  @Input() specificationUid: string;

  @Output() closeDialog = new EventEmitter<boolean>();

  readonly popupConfig: IJbDialog = {
    ...getSmallPopup(),
    dialogWidth: 1000,
    closableIcon: true,
    dialogHeader: eSubItemsDialog.AddHeaderText
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

  ngAfterViewInit(): void {
    //@Description: Disable quantity field if this Popup is called for convert to sub item from Linking Component
    if (this.popupConfig.dialogHeader === eSubItemsDialog.AddHeaderText && this.subItemDetails.quantity > 0) {
      this.formGroup.controls[this.specificationSubItemEditService.formId].get('quantity').disable();
    }
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
    if (!this.formGroup.valid) {
      this.growlService.setErrorMessage('Please fill all the required fields');
    }

    this.loading$.next(true);
    const value = this.formGroup.value[this.specificationSubItemEditService.formId];
    //Because quantity is disabled in form, we need to get it from controls
    const controls = this.formGroup.controls[this.specificationSubItemEditService.formId];
    value.quantity = controls.get('quantity').value;

    let action$: Observable<SpecificationSubItem>;
    if (this.subItemDetails.uid) {
      action$ = this.specificationSubItemEditService.updateSubItem(value, this.subItemDetails.uid, this.specificationUid);
    } else {
      action$ = this.specificationSubItemEditService.createSubItem(value, this.specificationUid);
    }
    action$.subscribe(
      () => {
        this.closePopup(true);
        this.loading$.next(false);
      },
      (err) => {
        this.growlService.errorHandler(err);
        this.loading$.next(false);
      }
    );
  }

  private initForm(): void {
    this.formModel = this.specificationSubItemEditService.formStructure;
    this.formValues = this.specificationSubItemEditService.getFormValues(this.subItemDetails);
    this.popupConfig.dialogHeader = this.subItemDetails.dialogHeader ?? this.popupConfig.dialogHeader;
  }
}
