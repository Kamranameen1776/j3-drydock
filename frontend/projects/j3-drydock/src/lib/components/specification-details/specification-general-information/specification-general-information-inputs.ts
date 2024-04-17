import { Injectable } from '@angular/core';
import { FormModel, FormValues, eFieldControlType } from 'jibe-components';
import { FieldSetModel } from 'jibe-components/lib/interfaces/field.model';
import {
  eSpecificationDetailsGeneralInformationFields,
  eSpecificationDetailsGeneralInformationLabels
} from '../../../models/enums/specification-details-general-information.enum';
import { BehaviorSubject } from 'rxjs';
import { FunctionsFlatTreeNode } from '../../../models/interfaces/functions-tree-node';
import { FormServiceBase } from '../../../shared/classes/form-service.base';
import { SpecificationDetailsService } from '../../../services/specification-details/specification-details.service';
import { SpecificationDetails } from '../../../models/interfaces/specification-details';
import { EditorConfig } from '../../../models/interfaces/EditorConfig';
import { eFunction } from '../../../models/enums/function.enum';
import { eModule } from '../../../models/enums/module.enum';

@Injectable()
export class SpecificationGeneralInformationInputService extends FormServiceBase {
  generalInformationFormId = 'generalInformation';
  sectionId = 'generalInformation';
  functionsFlatTree$ = new BehaviorSubject<FunctionsFlatTreeNode[]>([]);

  readonly formId = this.generalInformationFormId;
  protected readonly _formStructure: FormModel = this.getFormModel(true);
  protected readonly _formValues: FormValues = this.getInitialFormValues(null);

  constructor(private specificationDetailService: SpecificationDetailsService) {
    super();
  }

  getFormModelAndInitialValues(specificationDetailsInfo: SpecificationDetails, isEnabled: boolean) {
    const formModel: FormModel = this.getFormModel(isEnabled);
    const formValues: FormValues = this.getInitialFormValues(specificationDetailsInfo);

    return { formModel, formValues };
  }

  private getFields(isEnabled: boolean): FieldSetModel {
    const formFields: FieldSetModel = {
      [eSpecificationDetailsGeneralInformationFields.Function]: {
        type: eFieldControlType.Text,
        label: eSpecificationDetailsGeneralInformationLabels.Function,
        sectionID: this.sectionId,
        enabled: false,
        validatorRequired: true,
        gridRowStart: 1,
        gridRowEnd: 1,
        gridColStart: 1,
        gridColEnd: 1
      },
      [eSpecificationDetailsGeneralInformationFields.AccountCode]: {
        type: eFieldControlType.Text,
        sectionID: this.sectionId,
        label: eSpecificationDetailsGeneralInformationLabels.AccountCode,
        enabled: isEnabled,
        validatorRequired: false,
        gridRowStart: 1,
        gridRowEnd: 1,
        gridColStart: 2,
        gridColEnd: 2,
        placeHolder: 'Account Code',
        maxTextLength: 200
      },
      [eSpecificationDetailsGeneralInformationFields.ItemSource]: {
        type: eFieldControlType.Dropdown,
        sectionID: this.sectionId,
        label: eSpecificationDetailsGeneralInformationLabels.ItemSource,
        enabled: false,
        validatorRequired: false,
        gridRowStart: 2,
        gridRowEnd: 2,
        gridColStart: 1,
        gridColEnd: 1,
        placeHolder: 'Select Item Source',
        listRequest: {
          labelKey: 'display_name',
          valueKey: 'uid',
          webApiRequest: this.specificationDetailService.getItemSourceRequest()
        }
      },
      [eSpecificationDetailsGeneralInformationFields.InspectionID]: {
        type: eFieldControlType.MultiSelect,
        label: eSpecificationDetailsGeneralInformationLabels.Inspection,
        sectionID: this.sectionId,
        enabled: isEnabled,
        validatorRequired: false,
        gridRowStart: 2,
        gridRowEnd: 2,
        gridColStart: 2,
        gridColEnd: 2,
        placeHolder: 'Select Inspection',
        listRequest: {
          labelKey: 'displayName',
          valueKey: 'uid',
          webApiRequest: this.specificationDetailService.getStandardJobsFiltersRequest(
            eSpecificationDetailsGeneralInformationFields.Inspection
          )
        }
      },
      [eSpecificationDetailsGeneralInformationFields.ItemNumber]: {
        type: eFieldControlType.Text,
        sectionID: this.sectionId,
        label: eSpecificationDetailsGeneralInformationLabels.ItemNumber,
        enabled: false,
        show: 'hidden',
        validatorRequired: false,
        gridRowStart: 0,
        gridRowEnd: 0,
        gridColStart: 0,
        gridColEnd: 0,
        placeHolder: 'Item Number'
      },
      [eSpecificationDetailsGeneralInformationFields.DoneBy]: {
        type: eFieldControlType.Dropdown,
        sectionID: this.sectionId,
        label: eSpecificationDetailsGeneralInformationLabels.DoneBy,
        enabled: isEnabled,
        validatorRequired: false,
        gridRowStart: 3,
        gridRowEnd: 3,
        gridColStart: 1,
        gridColEnd: 1,
        listRequest: {
          labelKey: 'displayName',
          valueKey: 'uid',
          webApiRequest: this.specificationDetailService.getStandardJobsFiltersRequest(eSpecificationDetailsGeneralInformationFields.DoneBy)
        }
      },
      [eSpecificationDetailsGeneralInformationFields.Priority]: {
        type: eFieldControlType.Dropdown,
        sectionID: this.sectionId,
        label: eSpecificationDetailsGeneralInformationLabels.Priority,
        enabled: isEnabled,
        validatorRequired: false,
        gridRowStart: 3,
        gridRowEnd: 3,
        gridColStart: 2,
        gridColEnd: 2,
        placeHolder: 'Select Priority',
        listRequest: {
          labelKey: 'display_name',
          valueKey: 'uid',
          webApiRequest: this.specificationDetailService.getPriorityRequest()
        }
      },
      [eSpecificationDetailsGeneralInformationFields.EquipmentDescription]: {
        type: eFieldControlType.Text,
        sectionID: this.sectionId,
        label: eSpecificationDetailsGeneralInformationLabels.EquipmentDescription,
        enabled: false,
        validatorRequired: false,
        gridRowStart: 4,
        gridRowEnd: 4,
        gridColStart: 1,
        gridColEnd: 1,
        placeHolder: 'Equipment Description',
        maxLength: 200
      },
      [eSpecificationDetailsGeneralInformationFields.EstimatedDuration]: {
        type: eFieldControlType.Number,
        label: eSpecificationDetailsGeneralInformationLabels.EstimatedDuration,
        sectionID: this.formId,
        enabled: true,
        validatorRequired: false,
        gridRowStart: 4,
        gridRowEnd: 4,
        gridColStart: 2,
        gridColEnd: 2,
        format: { afterDecimal: 2 },
        validatorMin: 0
      },
      [eSpecificationDetailsGeneralInformationFields.BufferTime]: {
        type: eFieldControlType.Number,
        label: eSpecificationDetailsGeneralInformationLabels.BufferTime,
        sectionID: this.formId,
        enabled: true,
        validatorRequired: false,
        gridRowStart: 5,
        gridRowEnd: 5,
        gridColStart: 1,
        gridColEnd: 1,
        format: { afterDecimal: 2 },
        validatorMin: 0
      },
      [eSpecificationDetailsGeneralInformationFields.GLAccount]: {
        type: eFieldControlType.Dropdown,
        label: eSpecificationDetailsGeneralInformationLabels.GLAccount,
        sectionID: this.formId,
        enabled: true,
        validatorRequired: false,
        gridRowStart: 5,
        gridRowEnd: 5,
        gridColStart: 2,
        gridColEnd: 2,
        list: []
      },
      [eSpecificationDetailsGeneralInformationFields.JobExecution]: {
        type: eFieldControlType.Dropdown,
        label: eSpecificationDetailsGeneralInformationLabels.JobExecution,
        sectionID: this.formId,
        enabled: true,
        validatorRequired: false,
        gridRowStart: 6,
        gridRowEnd: 6,
        gridColStart: 1,
        gridColEnd: 1,
        list: []
      },
      [eSpecificationDetailsGeneralInformationFields.JobRequired]: {
        type: eFieldControlType.Dropdown,
        label: eSpecificationDetailsGeneralInformationLabels.JobRequired,
        sectionID: this.formId,
        enabled: true,
        validatorRequired: false,
        gridRowStart: 6,
        gridRowEnd: 6,
        gridColStart: 2,
        gridColEnd: 2,
        list: this.specificationDetailService.getJobRequiredList()
      },
      [eSpecificationDetailsGeneralInformationFields.EstimatedBudget]: {
        type: eFieldControlType.Number,
        label: eSpecificationDetailsGeneralInformationLabels.EstimatedBudget,
        sectionID: this.formId,
        enabled: true,
        validatorRequired: false,
        gridRowStart: 7,
        gridRowEnd: 7,
        gridColStart: 1,
        gridColEnd: 1,
        format: { afterDecimal: 2 },
        validatorMin: 0
      },
      [eSpecificationDetailsGeneralInformationFields.EstimatedCost]: {
        type: eFieldControlType.Number,
        label: eSpecificationDetailsGeneralInformationLabels.EstimatedCost,
        sectionID: this.formId,
        enabled: true,
        readOnly: true,
        validatorRequired: false,
        gridRowStart: 7,
        gridRowEnd: 7,
        gridColStart: 2,
        gridColEnd: 2,
        format: { afterDecimal: 2 }
      },
      [eSpecificationDetailsGeneralInformationFields.OverallCost]: {
        type: eFieldControlType.Number,
        label: eSpecificationDetailsGeneralInformationLabels.OverallCost,
        sectionID: this.formId,
        enabled: true,
        readOnly: true,
        validatorRequired: false,
        gridRowStart: 8,
        gridRowEnd: 8,
        gridColStart: 1,
        gridColEnd: 1,
        format: { afterDecimal: 2 }
      }
    };

    return formFields;
  }

  getInitialFormValues(specificationDetailsInfo: SpecificationDetails): FormValues {
    if (specificationDetailsInfo == null) {
      return null;
    }

    const formValues: FormValues = {
      keyID: this.generalInformationFormId,
      values: {
        [this.generalInformationFormId]: {
          [eSpecificationDetailsGeneralInformationFields.Function]: specificationDetailsInfo.Function,
          [eSpecificationDetailsGeneralInformationFields.AccountCode]: specificationDetailsInfo.AccountCode,
          [eSpecificationDetailsGeneralInformationFields.ItemSource]: specificationDetailsInfo.ItemSourceUid,
          [eSpecificationDetailsGeneralInformationFields.ItemNumber]: specificationDetailsInfo.ItemNumber,
          [eSpecificationDetailsGeneralInformationFields.DoneBy]: specificationDetailsInfo.DoneByUid,
          [eSpecificationDetailsGeneralInformationFields.InspectionID]: specificationDetailsInfo.Inspections.map(
            (inspection) => inspection.InspectionId
          ),
          [eSpecificationDetailsGeneralInformationFields.EquipmentDescription]: specificationDetailsInfo.EquipmentDescription,
          [eSpecificationDetailsGeneralInformationFields.Priority]: specificationDetailsInfo.PriorityUid,
          [eSpecificationDetailsGeneralInformationFields.Description]: specificationDetailsInfo.Description,

          [eSpecificationDetailsGeneralInformationFields.EstimatedDuration]: specificationDetailsInfo.Duration,
          [eSpecificationDetailsGeneralInformationFields.BufferTime]: specificationDetailsInfo.BufferTime,
          [eSpecificationDetailsGeneralInformationFields.GLAccount]: specificationDetailsInfo.GlAccountUid,
          [eSpecificationDetailsGeneralInformationFields.JobExecution]: specificationDetailsInfo.JobExecutionUid,
          [eSpecificationDetailsGeneralInformationFields.JobRequired]: specificationDetailsInfo.JobRequired,
          [eSpecificationDetailsGeneralInformationFields.EstimatedBudget]: specificationDetailsInfo.EstimatedBudget,
          [eSpecificationDetailsGeneralInformationFields.EstimatedCost]: specificationDetailsInfo.EstimatedCost,
          [eSpecificationDetailsGeneralInformationFields.OverallCost]: specificationDetailsInfo.OverallCost
        }
      }
    };

    return formValues;
  }

  private getFormModel(isEnabled: boolean): FormModel {
    const baseModel: FormModel = {
      id: this.generalInformationFormId,
      label: 'General Information',
      type: 'form',
      sections: {
        [this.sectionId]: {
          type: 'grid',
          label: '',
          formID: this.generalInformationFormId,
          gridRowStart: 1,
          gridRowEnd: 4,
          gridColStart: 1,
          gridColEnd: 2,
          fields: this.getFields(isEnabled)
        }
      }
    };

    return baseModel;
  }

  getDescriptionEditorConfig(): EditorConfig {
    return {
      id: 'description',
      maxLength: 10000,
      placeholder: '',
      crtlName: 'description',
      moduleCode: eModule.Project,
      functionCode: eFunction.SpecificationDetails,
      inlineMode: {
        enable: false,
        onSelection: true
      },
      tools: {
        items: [
          'Bold',
          'Italic',
          'Underline',
          'StrikeThrough',
          'FontName',
          'FontSize',
          'FontColor',
          'Formats',
          'Alignments',
          'Image',
          'ClearFormat',
          'FullScreen'
        ]
      }
    };
  }
}
