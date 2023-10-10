import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormModel, FormValues } from 'jibe-components';
import { StandardJobResult } from '../../../models/interfaces/standard-jobs';
import { StandardJobUpsertFormService } from '../StandardJobUpsertFormService';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';

@Component({
  selector: 'jb-upsert-standard-job-form',
  templateUrl: './upsert-standard-job-form.component.html',
  styleUrls: ['./upsert-standard-job-form.component.scss']
})
export class UpsertStandardJobFormComponent extends UnsubscribeComponent implements OnInit {
  @Input() item: StandardJobResult;

  @Output() formValid = new EventEmitter<boolean>();
  // can be used from parent to get formvalue when submitting
  public formGroup: FormGroup;

  public formStructure: FormModel;
  public formValues: FormValues;

  public isFormValid = false;

  public get isEditing() {
    return !!this.item;
  }

  constructor(private popupFormService: StandardJobUpsertFormService) {
    super();
  }

  ngOnInit(): void {
    this.initFormStructure();
    this.initFormValues();
  }

  private initFormStructure() {
    this.formStructure = this.popupFormService.formStructure;
  }

  private initFormValues() {
    this.formValues = this.popupFormService.formValues;

    if (this.isEditing) {
      const values = this.formValues.values[this.popupFormService.formId];
      Object.assign(values, this.item);
    }
  }

  public dispatchForm(event: FormGroup) {
    this.formGroup = event;
    // TODO listen to changes and logic to change some fields state
  }
}
