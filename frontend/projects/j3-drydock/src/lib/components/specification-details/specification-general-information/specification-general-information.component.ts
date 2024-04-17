import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SpecificationGeneralInformationInputService } from './specification-general-information-inputs';
import { FormModel, FormValues, UserService } from 'jibe-components';
import { SpecificationDetails } from '../../../models/interfaces/specification-details';
import { EditorConfig } from '../../../models/interfaces/EditorConfig';
@Component({
  selector: 'jb-specification-general-information',
  templateUrl: './specification-general-information.component.html',
  styleUrls: ['./specification-general-information.component.scss'],
  providers: [SpecificationGeneralInformationInputService]
})
export class SpecificationGeneralInformationComponent implements OnInit, OnChanges {
  @Input() specificationDetailsInfo: SpecificationDetails;
  @Input() isEditable: boolean;
  @Input() fieldValuesToRefresh: { [key: string]: unknown}
  @Output() formValue = new EventEmitter<FormGroup>();

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
    private specificationInformationInputService: SpecificationGeneralInformationInputService,
    private userService: UserService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fieldValuesToRefresh && this.fieldValuesToRefresh && this.formGroup) {
      this.formGroup.get('generalInformation')?.patchValue(this.fieldValuesToRefresh);
    }
  }

  ngOnInit() {
    const { formModel, formValues } = this.specificationInformationInputService.getFormModelAndInitialValues(
      this.specificationDetailsInfo,
      this.isEditable
    );
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

  updateEditorCtrlValue(event) {
    this.editorsFormGroup.get('description').setValue(event.value);
  }

  private setEditorsForm() {
    this.editorsFormGroup.setValue({
      description: this.specificationDetailsInfo.Description
    });

    this.formGroup.addControl('editors', this.editorsFormGroup);
  }
}
