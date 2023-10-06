import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormModel, FormValues } from 'jibe-components';
import { StandardJobResult } from '../../../models/interfaces/standard-jobs';

@Component({
  selector: 'jb-upsert-standard-job-form',
  templateUrl: './upsert-standard-job-form.component.html',
  styleUrls: ['./upsert-standard-job-form.component.scss']
})
export class UpsertStandardJobFormComponent {
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
}
