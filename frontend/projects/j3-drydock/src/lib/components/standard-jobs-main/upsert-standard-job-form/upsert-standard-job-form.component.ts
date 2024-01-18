import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormModel, FormValues } from 'jibe-components';
import { StandardJobResult } from '../../../models/interfaces/standard-jobs';
import { StandardJobUpsertFormService } from './standard-job-upsert-form.service';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { startWith, takeUntil } from 'rxjs/operators';
import { eStandardJobsMainFields } from '../../../models/enums/standard-jobs-main.enum';
import { EditorConfig } from '../../../models/interfaces/EditorConfig';
import * as uuid from 'uuid/v4';

@Component({
  selector: 'jb-upsert-standard-job-form',
  templateUrl: './upsert-standard-job-form.component.html',
  styleUrls: ['./upsert-standard-job-form.component.scss']
})
export class UpsertStandardJobFormComponent extends UnsubscribeComponent implements OnInit {
  @Input() item: StandardJobResult;

  @Input() formStructure: FormModel;

  @ViewChild('treeTemplate', { static: true }) treeTemplate: TemplateRef<unknown>;

  @Output() formValid = new EventEmitter<boolean>();

  // can be used from parent to get formvalue when submitting
  public formGroup: FormGroup;

  public newUid: string;

  formValues: FormValues;

  isFormValid = false;

  get isEditing() {
    return !!this.item;
  }

  functionsFlatTree$ = this.popupFormService.functionsFlatTree$;

  editorsFormGroup: FormGroup = new FormGroup({
    description: new FormControl('', Validators.required),
    scope: new FormControl('')
  });

  descriptionEditorConfig: EditorConfig;

  scopeEditorConfig: EditorConfig;

  constructor(private popupFormService: StandardJobUpsertFormService) {
    super();
  }

  ngOnInit(): void {
    this.initFormValues();
    this.setFunctionConfig();

    this.newUid = uuid();

    this.descriptionEditorConfig = this.popupFormService.getDescriptionEditorConfig();
    this.scopeEditorConfig = this.popupFormService.getScopeEditorConfig();
  }

  dispatchForm(event: FormGroup) {
    this.formGroup = event;

    this.setEditorsForm();

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

  private initFormValues() {
    this.formValues = this.popupFormService.formValues;

    const values = this.formValues.values[this.popupFormService.formId];
    if (this.isEditing) {
      Object.assign(values, this.item, {
        subject: this.item.subject?.value ?? '',
        vesselTypeSpecific: this.item.vesselTypeSpecific ? 1 : 0,
        function: {
          jb_value_label: this.item.function,
          Child_ID: this.item.functionUid
        }
      });
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
    field.inputWithDlgConfig.dlgTemplate = this.treeTemplate;
  }

  private setFieldEnabledAndRequired(fieldName: eStandardJobsMainFields, isEnabled: boolean) {
    this.popupFormService.setEnabled(this.formGroup, fieldName, isEnabled, true);
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

  private setEditorsForm() {
    if (this.item) {
      this.editorsFormGroup.setValue({
        description: this.item.description,
        scope: this.item.scope
      });
    }

    this.formGroup.addControl(this.popupFormService.editors, this.editorsFormGroup);
  }
}
