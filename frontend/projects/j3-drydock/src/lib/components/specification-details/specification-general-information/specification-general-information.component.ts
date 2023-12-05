import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SpecificationGeneralInformationInputservice } from './specification-general-information-inputs';
import { FormModel, FormValues } from 'jibe-components';
import { SpecificationDetails } from '../../../models/interfaces/specification-details';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'jb-specification-general-information',
  templateUrl: './specification-general-information.component.html',
  styleUrls: ['./specification-general-information.component.scss'],
  providers: [SpecificationGeneralInformationInputservice]
})
export class SpecificationGeneralInformationComponent extends UnsubscribeComponent implements OnInit {
  @Input() specificationDetailsInfo: SpecificationDetails;
  @Output() formData = new EventEmitter<FormGroup>();

  formStructure: FormModel;
  formValues: FormValues;
  formGroup: FormGroup;
  verticalLabel = true;

  constructor(private specificationInformationInputService: SpecificationGeneralInformationInputservice) {
    super();
  }

  async ngOnInit(): Promise<void> {
    const { formModel, formValues } = this.specificationInformationInputService.getFormModelAndInitialValues(this.specificationDetailsInfo);
    this.formStructure = formModel;
    this.formValues = formValues;
  }

  handleDispatchForm(event: FormGroup) {
    this.formGroup = event;
    this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      if (this.formGroup.valid) {
        this.formData.emit(event);
      }
    });
  }
}
