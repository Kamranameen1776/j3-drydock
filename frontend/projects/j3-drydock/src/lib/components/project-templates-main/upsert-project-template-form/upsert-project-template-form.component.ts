import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormModel, FormValues } from 'jibe-components';

import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { startWith, takeUntil } from 'rxjs/operators';
import { EditorConfig } from '../../../models/interfaces/EditorConfig';
import { ProjectTemplateUpsertFormService } from './upsert-project-template-form.service';
import { ProjectTemplate } from '../../../models/interfaces/project-template';
import { eProjectTemplatesFields } from '../../../models/enums/project-templates.enum';

@Component({
  selector: 'jb-upsert-project-template-form',
  templateUrl: './upsert-project-template-form.component.html',
  styleUrls: ['./upsert-project-template-form.component.scss']
})
export class UpsertProjectTemplateFormComponent extends UnsubscribeComponent implements OnInit {
  @Input() item: ProjectTemplate;

  @Input() formStructure: FormModel;

  @Output() formValid = new EventEmitter<boolean>();

  // can be used from parent to get form value when submitting
  public formGroup: FormGroup;

  formValues: FormValues;

  isFormValid = false;

  get isEditing() {
    return !!this.item;
  }

  editorsFormGroup: FormGroup = new FormGroup({
    description: new FormControl('', Validators.required)
  });

  descriptionEditorConfig: EditorConfig;

  constructor(private popupFormService: ProjectTemplateUpsertFormService) {
    super();
  }

  ngOnInit(): void {
    this.initFormValues();

    this.descriptionEditorConfig = this.popupFormService.getDescriptionEditorConfig();
  }

  dispatchForm(event: FormGroup) {
    this.formGroup = event;

    this.setEditorsForm();

    this.listenFormValid();
    this.listenVesselSpecificChanges();
  }

  updateDescriptionEditorCtrlValue(event) {
    this.editorsFormGroup.get('description').setValue(event.value);
  }

  private initFormValues() {
    this.formValues = this.popupFormService.formValues;

    const values = this.formValues.values[this.popupFormService.formId];
    if (this.isEditing) {
      Object.assign(values, this.item, {
        subject: this.item.Subject ?? '',
        vesselTypeSpecific: this.item.vesselTypeSpecific ? 1 : 0
      });
    }
  }

  private listenFormValid() {
    this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.isFormValid = this.formGroup.valid;
      this.formValid.emit(this.isFormValid);
    });
  }

  private setFieldEnabledAndRequired(fieldName: eProjectTemplatesFields, isEnabled: boolean) {
    this.popupFormService.setEnabled(this.formGroup, fieldName, isEnabled, true);
    this.popupFormService.setValidationRequired(this.formStructure, fieldName, isEnabled);
  }

  private listenVesselSpecificChanges() {
    this.popupFormService
      .getFormControl(this.formGroup, eProjectTemplatesFields.VesselSpecific)
      .valueChanges.pipe(
        startWith(this.popupFormService.getFormControlValue(this.formGroup, eProjectTemplatesFields.VesselSpecific)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((value) => {
        this.setFieldEnabledAndRequired(eProjectTemplatesFields.VesselTypeUid, !!value);
      });
  }

  private setEditorsForm() {
    if (this.item) {
      this.editorsFormGroup.setValue({
        description: this.item.Description
      });
    }

    this.formGroup.addControl(this.popupFormService.editors, this.editorsFormGroup);
  }
}
