import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CreateExampleCloseResultDto } from './dtos/CreateExampleCloseResultDto';
import { FormModel, FormValues, IJbDialog, eFieldControlType } from 'jibe-components';
import { FormGroup } from '@angular/forms';
import { ExampleProjectsService } from '../../../../services/ExampleProjectsService';

@Component({
  selector: 'jb-create-example-project-popup',
  templateUrl: './create-example-project-popup.component.html',
  styleUrls: ['./create-example-project-popup.component.scss']
})
export class CreateExampleProjectPopupComponent implements OnInit {
  @Output() OnClose = new EventEmitter<CreateExampleCloseResultDto>();

  public formGroup: FormGroup;
  public dialogContent: IJbDialog;
  public formValues: FormValues = {
    keyID: 'createExampleProjectFormId',
    values: {
      createExampleProjectSection: {
        ExampleProjectName: ''
      }
    }
  };

  public formStructure: FormModel = {
    id: 'createExampleProjectFormId',
    label: 'Details',
    type: 'form',
    sections: {
      createExampleProjectSection: {
        type: 'grid',
        label: 'Details',
        formID: 'createExampleProjectFormId',
        gridRowStart: 1,
        gridRowEnd: 2,
        gridColStart: 1,
        gridColEnd: 3,
        fields: {
          ExampleProjectName: {
            label: 'Example project Name',
            type: eFieldControlType.Text,
            sectionID: 'createExampleProjectSection',
            enabled: true,
            gridRowStart: 1,
            gridRowEnd: 2,
            gridColStart: 1,
            gridColEnd: 2
          }
        }
      }
    }
  };

  constructor(private exampleProjectsService: ExampleProjectsService) {}

  ngOnInit(): void {
    return;
  }

  //#region Commands
  async createExampleProject(): Promise<void> {
    const exampleProjectName = this.formGroup.value.createExampleProjectSection.ExampleProjectName;

    if (!exampleProjectName) {
      return;
    }

    // Create new project
    const createdProject = await this.exampleProjectsService.createNewExampleProject({ Name: exampleProjectName });

    const dto = new CreateExampleCloseResultDto();
    dto.ProjectName = exampleProjectName;
    dto.ExampleProjectId = createdProject.ExampleProjectId;

    // Pass new project back to parent angular component(grid)
    this.OnClose.emit(dto);
  }

  closeDialog() {
    this.OnClose.emit(null);
  }

  dispatchForm(event) {
    this.formGroup = event;
  }

  //#endregion Commands
}
