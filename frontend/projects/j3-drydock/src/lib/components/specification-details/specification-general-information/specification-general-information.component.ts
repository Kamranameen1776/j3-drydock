import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SpecificationGeneralInformationInputservice } from './specification-general-information-inputs';
import { FormModel, FormValues, UserService } from 'jibe-components';
import { SpecificationDetails } from '../../../models/interfaces/specification-details';
import { Subject } from 'rxjs';
import { EditorConfig } from '../../../models/interfaces/EditorConfig';
@Component({
  selector: 'jb-specification-general-information',
  templateUrl: './specification-general-information.component.html',
  styleUrls: ['./specification-general-information.component.scss'],
  providers: [SpecificationGeneralInformationInputservice]
})
export class SpecificationGeneralInformationComponent implements OnInit {
  @Input() specificationDetailsInfo: SpecificationDetails;
  @Output() formValue = new Subject<FormGroup>();

  public formGroup: FormGroup;

  formStructure: FormModel;
  formValues: FormValues;
  verticalLabel = true;

  editorsFormGroup: FormGroup = new FormGroup({
    description: new FormControl('', Validators.nullValidator)
  });

  descriptionEditorConfig: EditorConfig;

  specificationUid: string;
  vesselId: number;

  constructor(
    private specificationInformationInputService: SpecificationGeneralInformationInputservice,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    const { formModel, formValues } = this.specificationInformationInputService.getFormModelAndInitialValues(this.specificationDetailsInfo);
    this.formStructure = formModel;
    this.formValues = formValues;

    this.vesselId = this.specificationDetailsInfo.VesselId;
    this.specificationUid = this.specificationDetailsInfo.uid;

    this.descriptionEditorConfig = this.specificationInformationInputService.getDescriptionEditorConfig();
  }

  handleDispatchForm(event: FormGroup) {
    this.formGroup = event;

    this.setEditorsForm();

    this.formValue.next(event);
  }

  private setEditorsForm() {
    this.editorsFormGroup.setValue({
      description: this.specificationDetailsInfo.Description
    });

    this.formGroup.addControl('editors', this.editorsFormGroup);
  }
}
