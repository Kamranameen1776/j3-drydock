import { StandardJobResult } from './../../../models/interfaces/standard-jobs';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { getSmallPopup } from '../../../models/constants/popup';
import { IJbDialog } from 'jibe-components';
import { UpsertStandardJobFormComponent } from '../upsert-standard-job-form/upsert-standard-job-form.component';
import { StandardJobUpsertFormService } from '../StandardJobUpsertFormService';

@Component({
  selector: 'jb-upsert-standard-job-popup',
  templateUrl: './upsert-standard-job-popup.component.html'
})
export class UpsertStandardJobPopupComponent implements OnChanges {
  @Input() item: StandardJobResult;
  @Input() isOpen: boolean;
  @Output() closeDialog = new EventEmitter<boolean>();

  @ViewChild(UpsertStandardJobFormComponent) popupForm: UpsertStandardJobFormComponent;

  public isPopupValid = false;

  public readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 1000, closableIcon: false };

  public get isEditing() {
    return !!this.item;
  }

  public okLabel: string;

  public isSaving: boolean;

  constructor(private formService: StandardJobUpsertFormService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      this.setPopupHeader();
      this.setPopupFooter();
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

  private setPopupHeader() {
    this.popupConfig.dialogHeader = !this.isEditing ? 'Create New Standard Job' : 'Update Standard Job';
  }

  private setPopupFooter() {
    this.okLabel = this.isEditing ? 'Update' : 'Create';
  }

  private closePopup(isSaved = false) {
    this.closeDialog.emit(isSaved);
    this.isPopupValid = false;
  }

  private save() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const value = this.popupForm?.formGroup.getRawValue()[this.formService.formId];

    // TODO here can be addded validation messages for the form that appear in growl

    this.isSaving = true;
    this.okLabel = 'Saving';

    // this.projectsLibraryService.upsertProjectRecord(this.item?.uid, value).pipe(
    //   finalize(() => {
    //     this.isSaving = false;
    //     this.setPopupFooter();
    //   })
    // ).subscribe(res => {
    //   this.closePopup(true);
    // }, err => {
    //   if (err?.status === 422) {
    //     this.growlMessageService.setValidationErrorMessage(err.error);
    //   } else {
    //     this.growlMessageService.setValidationErrorMessage('Server error occured');
    //   }
    // });
  }
}
