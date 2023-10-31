import { Injectable } from '@angular/core';

import { eFieldControlType, FormModel, FormValues } from 'jibe-components';
import { standardJobsUpsertFormId } from '../../../models/constants/constants';
import { StandardJobsService } from '../../../services/StandardJobsService';
import { FormServiceBase } from '../../../shared/classes/form-service.base';
import { eStandardJobsMainFields, eStandardJobsMainLabels } from '../../../models/enums/standard-jobs-main.enum';
import { BehaviorSubject } from 'rxjs';
import { FunctionsFlatTreeNode, FunctionsTreeNode } from '../../../models/interfaces/functions-tree-node';

@Injectable({
  providedIn: 'root'
})
export class StandardJobUpsertFormService extends FormServiceBase {
  public readonly formId = standardJobsUpsertFormId;

  public functionsFlatTree$ = new BehaviorSubject<FunctionsFlatTreeNode[]>([]);

  public functionsTree$ = new BehaviorSubject<FunctionsTreeNode[]>([]);

  public functionsTreeNodesMap: Map<string | number, FunctionsTreeNode> = new Map();

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
        gridColEnd: 3,
        fields: {
          [eStandardJobsMainFields.Function]: {
            type: 'inputWithDlg',
            label: eStandardJobsMainLabels.Function,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: true,
            gridRowStart: 1,
            gridRowEnd: 2,
            gridColStart: 1,
            gridColEnd: 2
          },
          [eStandardJobsMainFields.ItemNumber]: {
            type: eFieldControlType.Text,
            label: eStandardJobsMainLabels.ItemNumber,
            sectionID: this.formId,
            enabled: false,
            validatorRequired: false,
            maxLength: 20,
            gridRowStart: 1,
            gridRowEnd: 2,
            gridColStart: 2,
            gridColEnd: 3
          },
          [eStandardJobsMainFields.Subject]: {
            type: eFieldControlType.Text,
            label: eStandardJobsMainLabels.Subject,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: true,
            maxLength: 200,
            gridRowStart: 2,
            gridRowEnd: 3,
            gridColStart: 1,
            gridColEnd: 3
          },
          [eStandardJobsMainFields.ItemCategoryID]: {
            type: eFieldControlType.Dropdown,
            label: eStandardJobsMainLabels.ItemCategory,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: false,
            gridRowStart: 3,
            gridRowEnd: 4,
            gridColStart: 1,
            gridColEnd: 2,
            listRequest: {
              labelKey: 'displayName',
              valueKey: 'uid',
              webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.ItemCategory)
            }
          },
          [eStandardJobsMainFields.InspectionID]: {
            type: eFieldControlType.MultiSelect,
            label: eStandardJobsMainLabels.Inspection,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: false,
            gridRowStart: 3,
            gridRowEnd: 4,
            gridColStart: 2,
            gridColEnd: 3,
            listRequest: {
              labelKey: 'displayName',
              valueKey: 'uid',
              webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.Inspection)
            }
          },
          [eStandardJobsMainFields.MaterialSuppliedByID]: {
            type: eFieldControlType.Dropdown,
            label: eStandardJobsMainLabels.MaterialSuppliedBy,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: false,
            gridRowStart: 4,
            gridRowEnd: 5,
            gridColStart: 1,
            gridColEnd: 2,
            listRequest: {
              labelKey: 'displayName',
              valueKey: 'uid',
              webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.MaterialSuppliedBy)
            }
          },
          [eStandardJobsMainFields.DoneByID]: {
            type: eFieldControlType.Dropdown,
            label: eStandardJobsMainLabels.DoneBy,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: false,
            gridRowStart: 4,
            gridRowEnd: 5,
            gridColStart: 2,
            gridColEnd: 3,
            listRequest: {
              labelKey: 'displayName',
              valueKey: 'uid',
              webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.DoneBy)
            }
          },
          [eStandardJobsMainFields.VesselSpecific]: {
            type: eFieldControlType.Dropdown,
            label: eStandardJobsMainLabels.VesselSpecific,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: true,
            gridRowStart: 5,
            gridRowEnd: 6,
            gridColStart: 1,
            gridColEnd: 2,
            list: this.standardJobsService.getVesselSpevificList()
          },
          [eStandardJobsMainFields.VesselTypeID]: {
            type: eFieldControlType.MultiSelect,
            label: eStandardJobsMainLabels.VesselType,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: true,
            gridRowStart: 5,
            gridRowEnd: 6,
            gridColStart: 2,
            gridColEnd: 3,
            listRequest: {
              labelKey: 'VesselTypes',
              valueKey: 'ID',
              webApiRequest: this.standardJobsService.getVesselTypesRequest()
            }
          },
          [eStandardJobsMainFields.Description]: {
            type: eFieldControlType.TextAreaType,
            label: eStandardJobsMainLabels.Description,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: true,
            maxTextLength: 1000,
            gridRowStart: 6,
            gridRowEnd: 7,
            gridColStart: 1,
            gridColEnd: 3
          },
          [eStandardJobsMainFields.Scope]: {
            type: eFieldControlType.TextAreaType,
            label: eStandardJobsMainLabels.Scope,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: false,
            maxTextLength: 1000,
            gridRowStart: 7,
            gridRowEnd: 8,
            gridColStart: 1,
            gridColEnd: 3
          }
        }
      }
    }
  };

  protected readonly _formValues: FormValues = {
    keyID: this.formId,
    values: {
      [this.formId]: {
        [eStandardJobsMainFields.Function]: null,
        [eStandardJobsMainFields.ItemNumber]: null,
        [eStandardJobsMainFields.Subject]: null,
        [eStandardJobsMainFields.ItemCategoryID]: null,
        [eStandardJobsMainFields.InspectionID]: null,
        [eStandardJobsMainFields.MaterialSuppliedByID]: null,
        [eStandardJobsMainFields.DoneByID]: null,
        [eStandardJobsMainFields.VesselSpecific]: false,
        [eStandardJobsMainFields.VesselTypeID]: null,
        [eStandardJobsMainFields.Description]: null,
        [eStandardJobsMainFields.Scope]: null
      }
    }
  };

  constructor(private standardJobsService: StandardJobsService) {
    super();
  }
}
