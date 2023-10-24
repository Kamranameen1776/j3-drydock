/* eslint-disable no-console */
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormModel, FormValues } from 'jibe-components';
import { StandardJobResult } from '../../../models/interfaces/standard-jobs';
import { StandardJobUpsertFormService } from './StandardJobUpsertFormService';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { startWith, takeUntil } from 'rxjs/operators';
import { eStandardJobsMainFields } from '../../../models/enums/standard-jobs-main.enum';

@Component({
  selector: 'jb-upsert-standard-job-form',
  templateUrl: './upsert-standard-job-form.component.html',
  styleUrls: ['./upsert-standard-job-form.component.scss']
})
export class UpsertStandardJobFormComponent extends UnsubscribeComponent implements OnInit {
  @Input() item: StandardJobResult;

  @ViewChild('treeTemplate', { static: true }) treeTemplate: TemplateRef<unknown>;

  @Output() formValid = new EventEmitter<boolean>();
  // can be used from parent to get formvalue when submitting
  public formGroup: FormGroup;

  public formStructure: FormModel;

  public formValues: FormValues;

  public isFormValid = false;

  public get isEditing() {
    return !!this.item;
  }

  public functionsTree$ = this.popupFormService.functionsTree$;

  constructor(private popupFormService: StandardJobUpsertFormService) {
    super();
  }

  ngOnInit(): void {
    this.initFormStructure();
    this.initFormValues();
    this.setFunctionConfig();
  }

  public dispatchForm(event: FormGroup) {
    this.formGroup = event;
    // TODO listen to changes and logic to change some fields state
    this.initFormState();
    this.listenFormValid();
    this.listenVesselSpecificChanges();
  }

  private initFormState() {
    if (this.isEditing) {
      this.popupFormService.setEnabled(this.formGroup, eStandardJobsMainFields.Function, false);
      this.popupFormService.setEnabled(this.formGroup, eStandardJobsMainFields.ItemNumber, false);
    }
  }

  private initFormStructure() {
    this.formStructure = this.popupFormService.formStructure;
  }

  private initFormValues() {
    this.formValues = this.popupFormService.formValues;

    if (this.isEditing) {
      const values = this.formValues.values[this.popupFormService.formId];
      Object.assign(values, this.item, { subject: this.item.subject?.value ?? '' });
    }
  }

  private listenFormValid() {
    this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.isFormValid = this.formGroup.valid;
      this.formValid.emit(this.isFormValid);
    });
  }

  private setFunctionConfig() {
    const field = this.popupFormService.getFormFieldModel(this.formStructure, eStandardJobsMainFields.Function);
    if (!field) {
      return;
    }
    // TODO waiting j-component version with 'inputWithDlg' type in form field
    // field.inputWithDlgConfig = {
    //   dlgTemplate: this.treeTemplate,
    //   inputLabelKey: 'jb_value_label',
    //   dlgConfiguration: { appendTo: '' }
    // };
  }

  private setFieldEnabledAndRequired(fieldName: eStandardJobsMainFields, isEnabled: boolean) {
    this.popupFormService.setEnabled(this.formGroup, fieldName, isEnabled);
    this.popupFormService.setValidationRequired(this.formStructure, fieldName, isEnabled);
  }

  private listenVesselSpecificChanges() {
    this.popupFormService
      .getFormControl(this.formGroup, eStandardJobsMainFields.VesselSpecific)
      .valueChanges.pipe(
        startWith(this.popupFormService.getFormControlValue(this.formGroup, eStandardJobsMainFields.VesselSpecific)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((value) => {
        this.setFieldEnabledAndRequired(eStandardJobsMainFields.VesselTypeID, !!value);
      });
  }
}
