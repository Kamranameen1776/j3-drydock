import { Injectable } from '@angular/core';
import { FormModel, FormValues, eFieldControlType } from 'jibe-components';
import { FieldSetModel } from 'jibe-components/lib/interfaces/field.model';
import { GetSpecificationDetailsDto } from '../../../models/dto/specification-details/GetSpecificationDetailsDto';
import {
  eSpecificationDetailsGeneralInformationFields,
  eSpecificationDetailsGeneralInformationLabels
} from '../../../models/enums/specification-details-general-information.enum';
import { BehaviorSubject } from 'rxjs';
import { FunctionsFlatTreeNode } from '../../../models/interfaces/functions-tree-node';
import { FormServiceBase } from '../../../shared/classes/form-service.base';
import { SpecificationDetailsService } from '../../../services/specification-details/specification-details.service';

@Injectable()
export class SpecificationGeneralInformationInputservice extends FormServiceBase {
  public genralInformatonFormId = 'generalInformation';
  public sectionId = 'generalInformation';
  functionsFlatTree$ = new BehaviorSubject<FunctionsFlatTreeNode[]>([]);
  readonly formId = this.genralInformatonFormId;
  protected readonly _formStructure: FormModel = this.getFormModel();
  protected readonly _formValues: FormValues = this.getInitialFormValues(null);

  constructor(private specificatioDetailService: SpecificationDetailsService) {
    super();
  }

  public getFormModelAndInitialValues(specificationDetailsInfo: GetSpecificationDetailsDto) {
    const formModel: FormModel = this.getFormModel();
    const formValues: FormValues = this.getInitialFormValues(specificationDetailsInfo);

    return { formModel, formValues };
  }

  private getFields(): FieldSetModel {
    const formFields: FieldSetModel = {
      [eSpecificationDetailsGeneralInformationFields.Function]: {
        type: eFieldControlType.Text,
        label: eSpecificationDetailsGeneralInformationLabels.Function,
        sectionID: this.sectionId,
        enabled: false,
        validatorRequired: true,
        gridRowStart: 1,
        gridRowEnd: 2,
        gridColStart: 1,
        gridColEnd: 2
      },
      [eSpecificationDetailsGeneralInformationFields.AccountCode]: {
        type: eFieldControlType.Text,
        sectionID: this.sectionId,
        label: eSpecificationDetailsGeneralInformationLabels.AccountCode,
        enabled: true,
        validatorRequired: false,
        gridRowStart: 1,
        gridRowEnd: 2,
        gridColStart: 2,
        gridColEnd: 3,
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
        gridRowEnd: 3,
        gridColStart: 1,
        gridColEnd: 2,
        placeHolder: 'Select Item Source',
        listRequest: {
          labelKey: 'display_name',
          valueKey: 'uid',
          webApiRequest: this.specificatioDetailService.getItemSourceRequest()
        }
      },
      [eSpecificationDetailsGeneralInformationFields.ItemNumber]: {
        type: eFieldControlType.Text,
        sectionID: this.sectionId,
        label: eSpecificationDetailsGeneralInformationLabels.ItemNumber,
        enabled: false,
        validatorRequired: false,
        gridRowStart: 2,
        gridRowEnd: 3,
        gridColStart: 2,
        gridColEnd: 3,
        placeHolder: 'Item Number'
      },
      [eSpecificationDetailsGeneralInformationFields.DoneBy]: {
        type: eFieldControlType.Dropdown,
        sectionID: this.sectionId,
        label: eSpecificationDetailsGeneralInformationLabels.DoneBy,
        enabled: true,
        validatorRequired: false,
        gridRowStart: 3,
        gridRowEnd: 4,
        gridColStart: 1,
        gridColEnd: 2,
        listRequest: {
          labelKey: 'displayName',
          valueKey: 'uid',
          webApiRequest: this.specificatioDetailService.getStandardJobsFiltersRequest(eSpecificationDetailsGeneralInformationFields.DoneBy)
        }
      },
      [eSpecificationDetailsGeneralInformationFields.InspectionID]: {
        type: eFieldControlType.MultiSelect,
        label: eSpecificationDetailsGeneralInformationLabels.Inspection,
        sectionID: this.sectionId,
        enabled: true,
        validatorRequired: false,
        gridRowStart: 3,
        gridRowEnd: 4,
        gridColStart: 2,
        gridColEnd: 3,
        placeHolder: 'Select Inspection',
        listRequest: {
          labelKey: 'displayName',
          valueKey: 'uid',
          webApiRequest: this.specificatioDetailService.getStandardJobsFiltersRequest(
            eSpecificationDetailsGeneralInformationFields.Inspection
          )
        }
      },
      [eSpecificationDetailsGeneralInformationFields.EquipmentDescription]: {
        type: eFieldControlType.Text,
        sectionID: this.sectionId,
        label: eSpecificationDetailsGeneralInformationLabels.EquipmentDescription,
        enabled: false,
        validatorRequired: false,
        gridRowStart: 4,
        gridRowEnd: 5,
        gridColStart: 1,
        gridColEnd: 2,
        placeHolder: 'Equipment Description',
        maxLength: 200
      },
      [eSpecificationDetailsGeneralInformationFields.Periority]: {
        type: eFieldControlType.Dropdown,
        sectionID: this.sectionId,
        label: eSpecificationDetailsGeneralInformationLabels.Periority,
        enabled: true,
        validatorRequired: false,
        gridRowStart: 4,
        gridRowEnd: 5,
        gridColStart: 2,
        gridColEnd: 3,
        placeHolder: 'Select Priority',
        listRequest: {
          labelKey: 'display_name',
          valueKey: 'uid',
          webApiRequest: this.specificatioDetailService.getPriorityRequest()
        }
      },
      [eSpecificationDetailsGeneralInformationFields.Description]: {
        type: eFieldControlType.TextAreaType,
        sectionID: this.sectionId,
        label: eSpecificationDetailsGeneralInformationLabels.Description,
        enabled: true,
        autoResize: true,
        validatorRequired: true,
        gridRowStart: 5,
        gridRowEnd: 6,
        gridColStart: 1,
        gridColEnd: 3,
        maxTextLength: 1000
      }
    };

    return formFields;
  }

  getInitialFormValues(specificationDetailsInfo: GetSpecificationDetailsDto): FormValues {
    if (specificationDetailsInfo == null) {
      return null;
    }

    const formValues: FormValues = {
      keyID: this.genralInformatonFormId,
      values: {
        [this.genralInformatonFormId]: {
          [eSpecificationDetailsGeneralInformationFields.Function]: specificationDetailsInfo.Function,
          [eSpecificationDetailsGeneralInformationFields.AccountCode]: specificationDetailsInfo.AccountCode,
          [eSpecificationDetailsGeneralInformationFields.ItemSource]: specificationDetailsInfo.ItemSourceUid,
          [eSpecificationDetailsGeneralInformationFields.ItemNumber]: specificationDetailsInfo.ItemNumber,
          [eSpecificationDetailsGeneralInformationFields.DoneBy]: specificationDetailsInfo.DoneByUid,
          [eSpecificationDetailsGeneralInformationFields.InspectionID]: specificationDetailsInfo.Inspections.map(
            (insection) => insection.InspectionId
          ),
          [eSpecificationDetailsGeneralInformationFields.EquipmentDescription]: specificationDetailsInfo.EquipmentDescription,
          [eSpecificationDetailsGeneralInformationFields.Periority]: specificationDetailsInfo.PriorityUid,
          [eSpecificationDetailsGeneralInformationFields.Description]: specificationDetailsInfo.Description
        }
      }
    };

    return formValues;
  }

  private getFormModel(): FormModel {
    const baseModel: FormModel = {
      id: this.genralInformatonFormId,
      label: 'General Information',
      type: 'form',
      sections: {
        [this.sectionId]: {
          type: 'grid',
          label: '',
          formID: this.genralInformatonFormId,
          gridRowStart: 1,
          gridRowEnd: 1,
          gridColStart: 1,
          gridColEnd: 1,
          fields: this.getFields()
        }
      }
    };

    return baseModel;
  }
}
