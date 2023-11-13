/* eslint-disable no-console */
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormModel, FormValues } from 'jibe-components';
import { SpecificationCreateFormService } from './specification-create-form-service';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jb-specification-form',
  templateUrl: './specification-form.component.html',
  styleUrls: ['./specification-form.component.scss']
})
export class SpecificationFormComponent extends UnsubscribeComponent implements OnInit {
  @Input() formStructure: FormModel;

  @ViewChild('treeTemplate', { static: true }) treeTemplate: TemplateRef<unknown>;

  @Output() formValid = new EventEmitter<boolean>();
  // can be used from parent to get formvalue when submitting
  public formGroup: FormGroup;

  formValues: FormValues;

  isFormValid = false;

  functionsFlatTree$ = this.popupFormService.functionsFlatTree$;

  constructor(private popupFormService: SpecificationCreateFormService) {
    super();
  }

  ngOnInit(): void {
    this.setFunctionConfig();
  }

  dispatchForm(event: FormGroup) {
    this.formGroup = event;

    this.listenFormValid();
  }

  private listenFormValid() {
    this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.isFormValid = this.formGroup.valid;
      this.formValid.emit(this.isFormValid);
    });
  }

  private setFunctionConfig() {
    const field = this.popupFormService.getFormFieldModel(this.formStructure, 'function_uid');
    console.log(field)
    if (!field) {
      return;
    }
    field.inputWithDlgConfig.dlgTemplate = this.treeTemplate;
  }
}
