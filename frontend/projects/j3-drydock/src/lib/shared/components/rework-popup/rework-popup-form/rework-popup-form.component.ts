import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { UnsubscribeComponent } from '../../../classes/unsubscribe.base';
import { FormGroup } from '@angular/forms';
import { FormModel, FormValues } from 'jibe-components';
import { ReworkPopupFormService } from './rework-popup-form.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jb-drydock-rework-popup-form',
  templateUrl: './rework-popup-form.component.html',
  styleUrls: ['./rework-popup-form.component.scss']
})
export class ReworkPopupFormComponent extends UnsubscribeComponent implements OnInit {
  @Output() formValid = new EventEmitter<boolean>();
  // can be used from parent to get formvalue when submitting
  public formGroup: FormGroup;

  formStructure: FormModel;

  formValues: FormValues;

  isFormValid = false;

  constructor(private popupFormService: ReworkPopupFormService) {
    super();
  }

  ngOnInit(): void {
    this.initFormStructure();
    this.initFormValues();
  }

  dispatchForm(event: FormGroup) {
    this.formGroup = event;
    this.listenFormValid();
  }

  private initFormStructure() {
    this.formStructure = this.popupFormService.formStructure;
  }

  private initFormValues() {
    this.formValues = this.popupFormService.formValues;
  }

  private listenFormValid() {
    this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.isFormValid = this.formGroup.valid;
      this.formValid.emit(this.isFormValid);
    });
  }
}
