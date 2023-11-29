import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SpecificationGeneralInformationInputservice } from './specification-general-information-inputs';
import { FormModel, FormValues } from 'jibe-components';
import { SpecificationDetails } from '../../../models/interfaces/specification-details';
@Component({
  selector: 'jb-specification-general-information',
  templateUrl: './specification-general-information.component.html',
  styleUrls: ['./specification-general-information.component.scss'],
  providers: [SpecificationGeneralInformationInputservice]
})
export class SpecificationGeneralInformationComponent implements OnInit {
  @Input() specificationDetailsInfo: SpecificationDetails;

  formStructure: FormModel;
  formValues: FormValues;
  formGroup: FormGroup;
  verticalLabel = true;

  constructor(private specificationInformationInputService: SpecificationGeneralInformationInputservice) {}

  async ngOnInit(): Promise<void> {
    const { formModel, formValues } = this.specificationInformationInputService.getFormModelAndInitialValues(this.specificationDetailsInfo);
    this.formStructure = formModel;
    this.formValues = formValues;
  }

  handleDispatchForm(event: FormGroup) {
    this.formGroup = event;
  }
}
