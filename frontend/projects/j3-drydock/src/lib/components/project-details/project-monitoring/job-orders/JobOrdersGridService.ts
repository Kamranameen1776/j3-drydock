import { Column, FormModel, GridRowActions, JbEditorComponent, UserService, eFieldControlType, eGridColumnsWidth } from 'jibe-components';
import { nameOf } from '../../../../utils/nameOf';
import { IJobOrderDto } from './dtos/IJobOrderDto';
import { JobOrdersService } from '../../../../services/project-monitoring/job-orders/JobOrdersService';
import { GridInputsWithRequest } from '../../../../models/interfaces/grid-inputs';
import { Injectable } from '@angular/core';
import { eJobOrderUpdateDisplayNames, eJobOrderUpdateFieldNames } from 'projects/j3-drydock/src/lib/models/enums/job-order-update.enum';
import { EditorConfig } from 'projects/j3-drydock/src/lib/models/interfaces/EditorConfig';

@Injectable()
export class JobOrdersGridService {
  public readonly gridName: string = 'jobOrdersGrid';

  public readonly dateFormat = this.userService.getUserDetails().Date_Format.toLocaleUpperCase();

  public readonly dateTimeFormat = `${this.dateFormat} HH:mm`;

  public readonly updateJobOrderFormId = 'jobOrderUpdate';

  private readonly columns: Column[] = [
    {
      DisplayText: 'SpecificationUid',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.SpecificationUid),
      IsActive: true,
      IsMandatory: true,
      IsVisible: false,
      ReadOnly: true
    },
    {
      DisplayText: 'SpecificationStartDate',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.SpecificationStartDate),
      IsActive: true,
      IsMandatory: true,
      IsVisible: false,
      ReadOnly: true
    },
    {
      DisplayText: 'SpecificationEndDate',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.SpecificationEndDate),
      IsActive: true,
      IsMandatory: true,
      IsVisible: false,
      ReadOnly: true
    },
    {
      DisplayText: 'Status',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.Status),
      IsActive: true,
      IsMandatory: true,
      IsVisible: false,
      ReadOnly: true
    },
    {
      DisplayText: 'JobOrderUid',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.JobOrderUid),
      IsActive: true,
      IsMandatory: true,
      IsVisible: false,
      ReadOnly: true
    },
    {
      DisplayText: 'Code',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.Code),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      hyperlink: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisplayText: 'Subject',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.Subject),
      IsActive: true,
      IsMandatory: true,
      IsVisible: false,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisplayText: 'Subject',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.SpecificationSubject),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisplayText: 'Item Source',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.ItemSource),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisplayText: 'Status',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.SpecificationStatus),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisplayText: 'Progress',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.Progress),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisplayText: 'Responsible',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.Responsible),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisplayText: 'Last Updated',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.LastUpdated),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription,
      pipe: {
        value: 'date',
        format: this.dateTimeFormat
      }
    }
  ];

  private searchFields: string[] = [nameOf<IJobOrderDto>((prop) => prop.Subject)];
  private gridActions: GridRowActions[] = [];

  constructor(
    private userService: UserService,
    private jobOrdersService: JobOrdersService
  ) {}

  public getGridInputs(): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      searchFields: this.searchFields,
      request: this.jobOrdersService.getJobOrdersRequest(),
      actions: this.gridActions,
      sortField: nameOf<IJobOrderDto>((prop) => prop.LastUpdated),
      sortOrder: -1,
      name: 'Job Orders'
    };
  }

  public getUpdateJobOrderForm(): FormModel {
    return {
      id: 'UpdateJobOrder',
      label: '',
      type: 'form',
      sections: {
        [this.updateJobOrderFormId]: {
          type: 'grid',
          label: '',
          formID: this.updateJobOrderFormId,
          gridRowStart: 1,
          gridRowEnd: 14,
          gridColStart: 1,
          gridColEnd: 2,
          fields: {
            [eJobOrderUpdateFieldNames.JobOrderUid]: {
              label: eJobOrderUpdateDisplayNames.JobOrderUid,
              type: eFieldControlType.String,
              sectionID: this.updateJobOrderFormId,
              enabled: true,
              show: 'hidden',
              gridRowStart: 4,
              gridRowEnd: 5,
              gridColStart: 1,
              gridColEnd: 3
            },

            [eJobOrderUpdateFieldNames.SpecificationUid]: {
              label: eJobOrderUpdateDisplayNames.SpecificationUid,
              type: eFieldControlType.String,
              sectionID: this.updateJobOrderFormId,
              enabled: true,
              show: 'hidden',
              gridRowStart: 4,
              gridRowEnd: 5,
              gridColStart: 1,
              gridColEnd: 3
            },

            [eJobOrderUpdateFieldNames.Code]: {
              label: eJobOrderUpdateDisplayNames.Code,
              type: eFieldControlType.Text,
              sectionID: this.updateJobOrderFormId,
              enabled: true,
              minLength: 1,
              maxLength: 300,
              validatorRequired: false,
              gridRowStart: 1,
              gridRowEnd: 1,
              gridColStart: 1,
              gridColEnd: 1
            },

            [eJobOrderUpdateFieldNames.Subject]: {
              label: eJobOrderUpdateDisplayNames.Subject,
              type: eFieldControlType.Text,
              sectionID: this.updateJobOrderFormId,
              enabled: true,
              validatorRequired: true,
              gridRowStart: 2,
              gridRowEnd: 2,
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
              gridRowStart: 3,
              gridRowEnd: 3,
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
              gridRowStart: 4,
              gridRowEnd: 4,
              gridColStart: 1,
              gridColEnd: 1,
              validatorMin: 0,
              validatorMax: 100
            },

            [eJobOrderUpdateFieldNames.SpecificationStartDate]: {
              label: eJobOrderUpdateDisplayNames.SpecificationStartDate,
              type: eFieldControlType.DateTime,
              sectionID: this.updateJobOrderFormId,
              enabled: true,
              validatorRequired: true,
              gridRowStart: 5,
              gridRowEnd: 5,
              gridColStart: 1,
              gridColEnd: 1
            },

            [eJobOrderUpdateFieldNames.SpecificationEndDate]: {
              label: eJobOrderUpdateDisplayNames.SpecificationEndDate,
              type: eFieldControlType.DateTime,
              sectionID: this.updateJobOrderFormId,
              enabled: true,
              validatorRequired: true,
              gridRowStart: 6,
              gridRowEnd: 6,
              gridColStart: 1,
              gridColEnd: 1
            },

            [eJobOrderUpdateFieldNames.Remarks]: {
              label: eJobOrderUpdateDisplayNames.Remarks,
              type: eFieldControlType.String,
              sectionID: this.updateJobOrderFormId,
              enabled: true,
              show: 'hidden',
              gridRowStart: 7,
              gridRowEnd: 7,
              gridColStart: 1,
              gridColEnd: 3
            }
          }
        }
      }
    };
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
        enable: true,
        onSelection: true
      }
    };
  }
}
