import { Injectable } from '@angular/core';

import { eFieldControlType, FormModel, FormValues } from 'jibe-components';
import { StandardJobsService } from '../../../services/standard-jobs.service';
import { FormServiceBase } from '../../../shared/classes/form-service.base';
import { BehaviorSubject } from 'rxjs';
import { FunctionsFlatTreeNode } from '../../../models/interfaces/functions-tree-node';
import { eStandardJobsMainFields } from '../../../models/enums/standard-jobs-main.enum';
import { SpecificationGridService } from '../../../services/project/specification.service';
import { EditorConfig } from '../../../models/interfaces/EditorConfig';

@Injectable({
  providedIn: 'root'
})
export class SpecificationCreateFormService extends FormServiceBase {
  readonly formId = 'specificationFormId';

  readonly editors = 'editors';

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
        gridRowEnd: 5,
        gridColStart: 1,
        gridColEnd: 12,
        fields: {
          FunctionUid: {
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
              inputLabelKey: 'jb_value_label',
              dlgConfiguration: { appendTo: '', dialogHeader: 'Functions' }
            }
          },
          Subject: {
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
          Inspections: {
            type: eFieldControlType.MultiSelect,
            label: 'Inspections/ Survey',
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
              webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.Inspection)
            }
          },
          DoneByUid: {
            type: eFieldControlType.Dropdown,
            label: 'Done By',
            sectionID: this.formId,
            enabled: true,
            validatorRequired: false,
            gridRowStart: 5,
            gridRowEnd: 6,
            gridColStart: 1,
            gridColEnd: 1,
            listRequest: {
              labelKey: 'displayName',
              valueKey: 'uid',
              webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.DoneBy)
            }
          }
        }
      }
    }
  };

  protected readonly _formValues: FormValues = {
    keyID: this.formId,
    values: {
      [this.formId]: {
        FunctionUid: null,
        Subject: null,
        ItemCategoryUid: null,
        MaterialSuppliedByUid: null,
        DoneByUid: null,
        Description: null
      }
    }
  };

  constructor(
    private standardJobsService: StandardJobsService,
    private specifications: SpecificationGridService
  ) {
    super();
  }

  getDescriptionEditorConfig(key1: string, vesselId: number): EditorConfig {
    return {
      id: 'description',
      maxLength: 8000,
      placeholder: '',
      crtlName: 'description',
      moduleCode: 'project',
      functionCode: 'job_description_jb_editor',
      key1: key1,
      vesselId: vesselId,
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
