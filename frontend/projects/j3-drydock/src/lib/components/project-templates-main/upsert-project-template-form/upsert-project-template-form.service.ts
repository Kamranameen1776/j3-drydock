import { Injectable } from '@angular/core';

import { eFieldControlType, FormModel, FormValues } from 'jibe-components';
import { projectTemplateUpsertFormId } from '../../../models/constants/constants';
import { FormServiceBase } from '../../../shared/classes/form-service.base';
import { BehaviorSubject } from 'rxjs';
import { FunctionsFlatTreeNode } from '../../../models/interfaces/functions-tree-node';
import { EditorConfig } from '../../../models/interfaces/EditorConfig';
import { ToolbarModule } from 'primeng';
import { eFunction } from '../../../models/enums/function.enum';
import { eModule } from '../../../models/enums/module.enum';
import { eProjectTemplatesFields, eProjectTemplatesLabels } from '../../../models/enums/project-templates.enum';
import { ProjectsService } from '../../../services/ProjectsService';
import { StandardJobsService } from '../../../services/standard-jobs.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectTemplateUpsertFormService extends FormServiceBase {
  readonly formId = projectTemplateUpsertFormId;

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
        gridRowEnd: 1,
        gridColStart: 1,
        gridColEnd: 3,
        fields: {
          [eProjectTemplatesFields.Subject]: {
            type: eFieldControlType.Text,
            label: eProjectTemplatesLabels.Subject,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: true,
            maxLength: 200,
            gridRowStart: 1,
            gridRowEnd: 2,
            gridColStart: 1,
            gridColEnd: 2
          },

          [eProjectTemplatesFields.VesselSpecific]: {
            type: eFieldControlType.Dropdown,
            label: eProjectTemplatesLabels.VesselSpecific,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: true,
            gridRowStart: 1,
            gridRowEnd: 2,
            gridColStart: 2,
            gridColEnd: 3,
            list: this.standardJobsService.getVesselSpecificList()
          },

          [eProjectTemplatesFields.VesselTypeUid]: {
            type: eFieldControlType.MultiSelect,
            label: eProjectTemplatesLabels.VesselType,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: true,
            gridRowStart: 2,
            gridRowEnd: 3,
            gridColStart: 1,
            gridColEnd: 2,
            listRequest: {
              labelKey: 'VesselTypes',
              valueKey: 'uid',
              webApiRequest: this.standardJobsService.getVesselTypesRequest()
            }
          },
          [eProjectTemplatesFields.ProjectTypeUid]: {
            type: eFieldControlType.Dropdown,
            label: eProjectTemplatesLabels.ProjectType,
            sectionID: this.formId,
            enabled: true,
            validatorRequired: true,
            gridRowStart: 2,
            gridRowEnd: 3,
            gridColStart: 2,
            gridColEnd: 3,
            listRequest: {
              labelKey: 'ProjectTypeName',
              valueKey: 'ProjectTypeUId',
              webApiRequest: this.projectsService.getProjectTypesRequest()
            }
          }
        }
      }
    }
  };
  // TODO vesselspecific add
  protected readonly _formValues: FormValues = {
    keyID: this.formId,
    values: {
      [this.formId]: {
        [eProjectTemplatesFields.Subject]: null,
        [eProjectTemplatesFields.VesselTypeUid]: null,
        [eProjectTemplatesFields.ProjectTypeUid]: null,
        [eProjectTemplatesFields.Description]: null,
        [eProjectTemplatesFields.VesselSpecific]: 0
      }
    }
  };

  constructor(
    private projectsService: ProjectsService,
    private standardJobsService: StandardJobsService
  ) {
    super();
  }

  getDescriptionEditorConfig(): EditorConfig {
    return {
      id: 'description',
      maxLength: 10000,
      placeholder: '',
      crtlName: 'description',
      moduleCode: eModule.Project,
      functionCode: eFunction.StandardJob,
      tools: this.getEditorTools(),
      inlineMode: {
        enable: false,
        onSelection: true
      }
    };
  }

  private getEditorTools(): ToolbarModule {
    return {
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
    };
  }
}
