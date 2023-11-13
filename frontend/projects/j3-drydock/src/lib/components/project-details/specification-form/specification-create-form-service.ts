import { Injectable } from '@angular/core';

import { eFieldControlType, FormModel, FormValues } from 'jibe-components';
import { StandardJobsService } from '../../../services/standard-jobs.service';
import { FormServiceBase } from '../../../shared/classes/form-service.base';
import { BehaviorSubject } from 'rxjs';
import { FunctionsFlatTreeNode } from '../../../models/interfaces/functions-tree-node';
import { eStandardJobsMainFields } from '../../../models/enums/standard-jobs-main.enum';

@Injectable({
  providedIn: 'root'
})
export class SpecificationCreateFormService extends FormServiceBase {
  readonly formId = 'specificationFormId';

  functionsFlatTree$ = new BehaviorSubject<FunctionsFlatTreeNode[]>([]);

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
        gridRowEnd: 6,
        gridColStart: 1,
        gridColEnd: 12,
        fields: {
          function_uid: {
            type: 'inputWithDlg',
            label: 'Function',
            sectionID: this.formId,
            enabled: true,
            validatorRequired: true,
            gridRowStart: 1,
            gridRowEnd: 2,
            gridColStart: 1,
            gridColEnd: 1,
            inputWithDlgConfig: {
              inputLabelKey: 'DisplayText',
              dlgConfiguration: { appendTo: '' }
            }
          },
          subject: {
            type: eFieldControlType.Text,
            label: 'Subject',
            sectionID: this.formId,
            enabled: true,
            validatorRequired: true,
            maxLength: 200,
            gridRowStart: 2,
            gridRowEnd: 3,
            gridColStart: 1,
            gridColEnd: 1
          },
          item_category_uid: {
            type: eFieldControlType.Dropdown,
            label: 'Item Category',
            sectionID: this.formId,
            enabled: true,
            validatorRequired: true,
            gridRowStart: 3,
            gridRowEnd: 4,
            gridColStart: 1,
            gridColEnd: 1,
            listRequest: {
              labelKey: 'displayName',
              valueKey: 'uid',
              webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.ItemCategory)
            }
          },
          done_by_uid: {
            type: eFieldControlType.Dropdown,
            label: 'Done By',
            sectionID: this.formId,
            enabled: true,
            validatorRequired: false,
            gridRowStart: 4,
            gridRowEnd: 5,
            gridColStart: 1,
            gridColEnd: 1,
            listRequest: {
              labelKey: 'displayName',
              valueKey: 'uid',
              webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.DoneBy)
            }
          },
          description: {
            type: eFieldControlType.TextAreaType,
            label: 'description',
            sectionID: this.formId,
            enabled: true,
            validatorRequired: true,
            maxTextLength: 1000,
            gridRowStart: 1,
            gridRowEnd: 5,
            gridColStart: 2,
            gridColEnd: 12
          }
        }
      }
    }
  };

  protected readonly _formValues: FormValues = {
    keyID: this.formId,
    values: {
      [this.formId]: {
        function: null,
        subject: null,
        item_category_uid: null,
        material_supplied_by_uid: null,
        done_by_uid: null,
        description: null
      }
    }
  };

  constructor(private standardJobsService: StandardJobsService) {
    super();
  }
}
