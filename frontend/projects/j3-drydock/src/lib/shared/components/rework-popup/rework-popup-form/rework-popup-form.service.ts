import { Injectable } from '@angular/core';

import { eFieldControlType, FormModel, FormValues } from 'jibe-components';
import { reworkPopupFormId } from '../../../../models/constants/constants';
import { eReworkPopupFields, eReworkPopupLabels } from './../../../../models/enums/rework-popup.enum';
import { FormServiceBase } from '../../../classes/form-service.base';

@Injectable({
  providedIn: 'root'
})
export class ReworkPopupFormService extends FormServiceBase {
  readonly formId = reworkPopupFormId;

  protected readonly _formStructure: FormModel = {
    id: this.formId,
    label: '',
    type: 'form',
    sections: {
      [this.formId]: {
        type: 'grid',
        label: '',
        formID: this.formId,
        gridRowStart: 1,
        gridRowEnd: 1,
        gridColStart: 1,
        gridColEnd: 2,
        fields: {
          [eReworkPopupFields.ItemNumber]: {
            type: eFieldControlType.Text,
            label: eReworkPopupLabels.ItemNumber,
            sectionID: this.formId,
            enabled: false,
            validatorRequired: false,
            gridRowStart: 1,
            gridRowEnd: 2,
            gridColStart: 1,
            gridColEnd: 2
          },
          [eReworkPopupFields.ReworkTo]: {
            type: eFieldControlType.Dropdown,
            label: eReworkPopupLabels.ReworkTo,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: true,
            gridRowStart: 2,
            gridRowEnd: 3,
            gridColStart: 1,
            gridColEnd: 2,
            list: []
          },
          [eReworkPopupFields.Remarks]: {
            type: eFieldControlType.TextAreaType,
            label: eReworkPopupLabels.Remarks,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: true,
            maxTextLength: 1000,
            gridRowStart: 3,
            gridRowEnd: 4,
            gridColStart: 1,
            gridColEnd: 2
          }
        }
      }
    }
  };

  protected readonly _formValues: FormValues = {
    keyID: this.formId,
    values: {
      [this.formId]: {
        [eReworkPopupFields.ItemNumber]: null,
        [eReworkPopupFields.ReworkTo]: null,
        [eReworkPopupFields.Remarks]: null
      }
    }
  };

  constructor() {
    super();
  }
}
