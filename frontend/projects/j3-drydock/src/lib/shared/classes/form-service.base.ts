import { FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { FormModel, FormValues } from 'jibe-components';

export abstract class FormServiceBase {
  public abstract readonly formId: string;

  protected abstract _formValues: FormValues;

  protected abstract _formModel: FormModel;

  public get formValues() {
    return _.cloneDeep(this.formValues);
  }

  public get formModel() {
    return _.cloneDeep(this.formModel);
  }

  public getFormControlValue<T extends string>(fg: FormGroup, fieldName: T) {
    if (!fg) {
      return undefined;
    }

    return fg.getRawValue()[this.formId][fieldName];
  }

  public getFormControl<T extends string>(fg: FormGroup, fieldName: T) {
    if (!fg) {
      return undefined;
    }
    return fg.controls[this.formId].get(fieldName) as FormControl;
  }

  public getFormFieldModel<T extends string>(formStructure: FormModel, fieldName: T) {
    return formStructure.sections[this.formId].fields[fieldName];
  }

  public setEnabled<T extends string>(formGroup: FormGroup, fieldName: T, isEnable: boolean, isDisableWithReset = true) {
    const control = this.getFormControl(formGroup, fieldName);
    this.enableOrDisableControl(control, isEnable, isDisableWithReset);
  }

  public setValidationRequired<T extends string>(formStructure: FormModel, fieldName: T, isEnable: boolean) {
    const fieldModel = this.getFormFieldModel(formStructure, fieldName);
    if (fieldModel) {
      fieldModel.validatorRequired = isEnable;
    }
  }

  public setFieldsEnabled<T extends string>(formGroup: FormGroup, fieldNames: T[], isEnable: boolean) {
    fieldNames.forEach((fieldName) => {
      this.setEnabled(formGroup, fieldName, isEnable);
    });
  }

  public setFieldsRequired<T extends string>(formStructure: FormModel, fieldNames: T[], isEnable: boolean) {
    fieldNames.forEach((fieldName) => {
      this.setValidationRequired(formStructure, fieldName, isEnable);
    });
  }

  public setFieldList<T extends string, K>(formStructure: FormModel, fieldName: T, list: K[]) {
    const fieldModel = this.getFormFieldModel(formStructure, fieldName);
    if (!fieldModel) {
      return;
    }
    fieldModel.list = list;
  }

  public resetModelValueIfNotInList<T extends { label: unknown; value: unknown }>(formGroup: FormGroup, list: T[], fieldName: string) {
    const control = this.getFormControl(formGroup, fieldName);
    const currentValue = control.value;
    const isValueInList = !!list.find((it) => it.value === currentValue);
    if (currentValue && !isValueInList) {
      control.reset();
    }
  }

  private enableOrDisableControl(fc: FormControl, isEnable: boolean, isDisableWithReset?: boolean) {
    if (!fc) {
      return;
    }
    if (isEnable) {
      fc.enable();
    } else {
      if (isDisableWithReset) {
        fc.reset();
      }
      fc.disable();
    }
  }
}
