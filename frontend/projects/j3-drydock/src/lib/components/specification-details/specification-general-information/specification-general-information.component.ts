import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SpecificationGeneralInformationInputservice } from './specification-general-information-inputs';
import { GetSpecificationDetailsDto } from '../../../models/dto/specification-details/GetSpecificationDetailsDto';
import { FormModel, FormValues } from 'jibe-components';
@Component({
  selector: 'jb-specification-general-information',
  templateUrl: './specification-general-information.component.html',
  styleUrls: ['./specification-general-information.component.scss'],
  providers: [SpecificationGeneralInformationInputservice]
})
export class SpecificationGeneralInformationComponent implements OnInit {
  @Input() specificationDetailsInfo: GetSpecificationDetailsDto;

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
