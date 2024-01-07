import { FormModel, UserService, eFieldControlType } from 'jibe-components';
import { JobOrdersService } from '../../../../services/project-monitoring/job-orders/JobOrdersService';
import { Injectable } from '@angular/core';
import { eJobOrderUpdateDisplayNames, eJobOrderUpdateFieldNames } from '../../../../models/enums/job-order-update.enum';
import { EditorConfig } from '../../../../models/interfaces/EditorConfig';

@Injectable()
export class JobOrdersFormService {
  public readonly dateFormat = this.userService.getUserDetails().Date_Format.toLocaleUpperCase();

  public readonly dateTimeFormat = `${this.dateFormat} HH:mm`;

  public readonly updateJobOrderFormId = 'jobOrderUpdate';

  constructor(
    private userService: UserService,
    private jobOrdersService: JobOrdersService
  ) {}

  public getUpdateJobOrderForm(hideSpecificationStartEndDate: boolean): FormModel {
    if (hideSpecificationStartEndDate) {
      const model = {
        id: 'UpdateJobOrder',
        label: '',
        type: 'form',
        sections: {
          [this.updateJobOrderFormId]: {
            type: 'grid',
            label: '',
            formID: this.updateJobOrderFormId,
            gridRowStart: 1,
            gridRowEnd: 2,
            gridColStart: 1,
            gridColEnd: 2,
            fields: {
              [eJobOrderUpdateFieldNames.SpecificationUid]: {
                label: eJobOrderUpdateDisplayNames.SpecificationUid,
                type: eFieldControlType.String,
                sectionID: this.updateJobOrderFormId,
                enabled: true,
                show: 'hidden',
                gridRowStart: 0,
                gridRowEnd: 0,
                gridColStart: 0,
                gridColEnd: 0
              },

              [eJobOrderUpdateFieldNames.Subject]: {
                label: eJobOrderUpdateDisplayNames.Subject,
                type: eFieldControlType.Text,
                sectionID: this.updateJobOrderFormId,
                enabled: true,
                validatorRequired: true,
                gridRowStart: 1,
                gridRowEnd: 1,
                gridColStart: 1,
                gridColEnd: 2,
                maxLength: 200,
                minLength: 1
              },

              [eJobOrderUpdateFieldNames.Status]: {
                label: eJobOrderUpdateDisplayNames.Status,
                type: eFieldControlType.Dropdown,
                sectionID: this.updateJobOrderFormId,
                enabled: true,
                validatorRequired: true,
                gridRowStart: 2,
                gridRowEnd: 2,
                gridColStart: 1,
                gridColEnd: 1,
                listRequest: {
                  webApiRequest: this.jobOrdersService.getJobOrderStatusesRequest(),
                  labelKey: 'Value',
                  valueKey: 'Key'
                }
              },

              [eJobOrderUpdateFieldNames.Progress]: {
                label: eJobOrderUpdateDisplayNames.Progress,
                type: eFieldControlType.Number,
                sectionID: this.updateJobOrderFormId,
                enabled: true,
                validatorRequired: true,
                gridRowStart: 2,
                gridRowEnd: 2,
                gridColStart: 2,
                gridColEnd: 2,
                validatorMin: 0,
                validatorMax: 100
              }
            }
          }
        }
      };

      return model as FormModel;
    }

    const model = {
      id: 'UpdateJobOrder',
      label: '',
      type: 'form',
      sections: {
        [this.updateJobOrderFormId]: {
          type: 'grid',
          label: '',
          formID: this.updateJobOrderFormId,
          gridRowStart: 1,
          gridRowEnd: 2,
          gridColStart: 1,
          gridColEnd: 4,
          fields: {
            [eJobOrderUpdateFieldNames.SpecificationUid]: {
              label: eJobOrderUpdateDisplayNames.SpecificationUid,
              type: eFieldControlType.String,
              sectionID: this.updateJobOrderFormId,
              enabled: true,
              show: 'hidden',
              gridRowStart: 0,
              gridRowEnd: 0,
              gridColStart: 0,
              gridColEnd: 0
            },

            [eJobOrderUpdateFieldNames.Subject]: {
              label: eJobOrderUpdateDisplayNames.Subject,
              type: eFieldControlType.Text,
              sectionID: this.updateJobOrderFormId,
              enabled: true,
              validatorRequired: true,
              gridRowStart: 1,
              gridRowEnd: 1,
              gridColStart: 1,
              gridColEnd: 3,
              maxLength: 200,
              minLength: 1
            },

            [eJobOrderUpdateFieldNames.Status]: {
              label: eJobOrderUpdateDisplayNames.Status,
              type: eFieldControlType.Dropdown,
              sectionID: this.updateJobOrderFormId,
              enabled: true,
              validatorRequired: true,
              gridRowStart: 2,
              gridRowEnd: 2,
              gridColStart: 1,
              gridColEnd: 1,
              listRequest: {
                webApiRequest: this.jobOrdersService.getJobOrderStatusesRequest(),
                labelKey: 'Value',
                valueKey: 'Key'
              }
            },

            [eJobOrderUpdateFieldNames.Progress]: {
              label: eJobOrderUpdateDisplayNames.Progress,
              type: eFieldControlType.Number,
              sectionID: this.updateJobOrderFormId,
              enabled: true,
              validatorRequired: true,
              gridRowStart: 2,
              gridRowEnd: 2,
              gridColStart: 2,
              gridColEnd: 2,
              validatorMin: 0,
              validatorMax: 100
            },
            [eJobOrderUpdateFieldNames.SpecificationStartDate]: {
              label: eJobOrderUpdateDisplayNames.SpecificationStartDate,
              type: eFieldControlType.DateTime,
              sectionID: this.updateJobOrderFormId,
              enabled: true,
              validatorRequired: true,
              gridRowStart: 2,
              gridRowEnd: 2,
              gridColStart: 3,
              gridColEnd: 3
            },

            [eJobOrderUpdateFieldNames.SpecificationEndDate]: {
              label: eJobOrderUpdateDisplayNames.SpecificationEndDate,
              type: eFieldControlType.DateTime,
              sectionID: this.updateJobOrderFormId,
              enabled: true,
              validatorRequired: true,
              gridRowStart: 2,
              gridRowEnd: 2,
              gridColStart: 4,
              gridColEnd: 4
            }
          }
        }
      }
    };

    return model as FormModel;
  }

  public getRemarksEditorConfig(): EditorConfig {
    return {
      id: 'Remarks',
      maxLength: 5000,
      placeholder: 'Enter Remarks',
      crtlName: 'RemarksCtrl',
      moduleCode: 'project',
      functionCode: 'remarks_jb_editor',
      inlineMode: {
        enable: false,
        onSelection: true
      }
    };
  }
}
