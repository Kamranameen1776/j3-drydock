import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SpecificationGeneralInformationInputservice } from './specification-general-information-inputs';
import { GetSpecificationDetailsDto } from '../../../models/dto/specification-details/GetSpecificationDetailsDto';
import { FormModel, FormValues } from 'jibe-components';
import { SpecificationDetailsService } from '../../../services/specification-details/specification-details.service';
import { eFunction } from '../../../models/enums/function.enum';
import { eSpecificationAccessActions } from '../../../models/enums/access-actions.enum';
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
  canView = false;

  constructor(
    private specificationInformationInputService: SpecificationGeneralInformationInputservice,
    private service: SpecificationDetailsService,
  ) {}

  async ngOnInit(): Promise<void> {
    const { formModel, formValues } = this.specificationInformationInputService.getFormModelAndInitialValues(this.specificationDetailsInfo);
    const canEditForm = this.service.hasAccess(eSpecificationAccessActions.editGeneralInformation);
    if (!canEditForm) {
      this.disableFields(formModel);
    }
    this.formStructure = formModel;
    this.formValues = formValues;
    this.canView = this.service.hasAccess(eSpecificationAccessActions.viewGeneralInformationSection);
  }

  private disableFields(formModel: FormModel) {
    Object.values(formModel.sections).forEach((section) => {
      Object.values(section.fields).forEach((field) => {
        field.enabled = false;
      });
    });
  }

  handleDispatchForm(event: FormGroup) {
    this.formGroup = event;
  }
}
