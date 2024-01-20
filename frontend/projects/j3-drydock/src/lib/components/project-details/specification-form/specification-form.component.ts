import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormModel, FormValues } from 'jibe-components';
import { SpecificationCreateFormService } from './specification-create-form-service';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { takeUntil } from 'rxjs/operators';
import { EditorConfig } from '../../../models/interfaces/EditorConfig';

@Component({
  selector: 'jb-specification-form',
  templateUrl: './specification-form.component.html',
  styleUrls: ['./specification-form.component.scss']
})
export class SpecificationFormComponent extends UnsubscribeComponent implements OnInit {
  @Input() formStructure: FormModel;
  @Input() projectId: string;
  @Input() vesselId: string;

  @ViewChild('treeTemplate', { static: true }) treeTemplate: TemplateRef<unknown>;

  @Output() formValid = new EventEmitter<boolean>();
  // can be used from parent to get formvalue when submitting
  public formGroup: FormGroup;

  formValues: FormValues;

  isFormValid = false;

  functionsFlatTree$ = this.popupFormService.functionsFlatTree$;

  editorsFormGroup: FormGroup = new FormGroup({
    description: new FormControl('', Validators.required)
  });

  descriptionEditorConfig: EditorConfig;

  constructor(private popupFormService: SpecificationCreateFormService) {
    super();
  }

  ngOnInit(): void {
    this.setFunctionConfig();

    this.descriptionEditorConfig = this.popupFormService.getDescriptionEditorConfig();
  }

  dispatchForm(event: FormGroup) {
    this.formGroup = event;

    this.listenFormValid();

    this.setEditorsForm();
  }

  updateEditorCtrlValue(event) {
    this.editorsFormGroup.get('description').setValue(event.value);
  }

  private listenFormValid() {
    this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.isFormValid = this.formGroup.valid;
      this.formValid.emit(this.isFormValid);
    });
  }

  private setFunctionConfig() {
    const field = this.popupFormService.getFormFieldModel(this.formStructure, 'FunctionUid');

    if (!field) {
      return;
    }
    field.inputWithDlgConfig.dlgTemplate = this.treeTemplate;
  }

  private setEditorsForm() {
    this.formGroup.addControl(this.popupFormService.editors, this.editorsFormGroup);
  }
}
