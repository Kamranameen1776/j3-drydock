import { eSubItemsFields, eSubItemsLabels } from '../../../../models/enums/sub-items.enum';
import { Injectable } from '@angular/core';

import { eFieldControlType, FormModel, FormValues } from 'jibe-components';
import { subItemUpsertFormId } from '../../../../models/constants/constants';
import { FormServiceBase } from '../../../../shared/classes/form-service.base';

// TODO fixme all
@Injectable({
  providedIn: 'root'
})
export class SubItemEditFormService extends FormServiceBase {
  public readonly formId = subItemUpsertFormId;

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
          [eSubItemsFields.ItemNumber]: {
            type: eFieldControlType.Text,
            label: eSubItemsLabels.ItemNumber,
            sectionID: this.formId,
            enabled: false,
            validatorRequired: false,
            maxLength: 20,
            gridRowStart: 1,
            gridRowEnd: 2,
            gridColStart: 1,
            gridColEnd: 2
          },
          [eSubItemsFields.Subject]: {
            type: eFieldControlType.Text,
            label: eSubItemsLabels.Subject,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: false,
            maxLength: 200,
            gridRowStart: 2,
            gridRowEnd: 3,
            gridColStart: 1,
            gridColEnd: 2
          },
          [eSubItemsFields.Description]: {
            type: eFieldControlType.TextAreaType,
            label: eSubItemsLabels.Description,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: false,
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
        [eSubItemsFields.ItemNumber]: null,
        [eSubItemsFields.Subject]: null,
        [eSubItemsFields.Description]: null
      }
    }
  };

  constructor() {
    super();
  }
}
