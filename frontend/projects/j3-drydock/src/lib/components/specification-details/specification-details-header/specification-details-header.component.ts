import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetSpecificationDetailsDto } from '../../../models/dto/specification-details/GetSpecificationDetailsDto';
import { SpecificationDetailsHeaderInputservice } from './specification-details-header-inputs';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { TopFieldsData } from '../../../services/specifications/specification-top-details.service';

@Component({
  selector: 'jb-specification-details-header',
  templateUrl: './specification-details-header.component.html',
  styleUrls: ['./specification-details-header.component.scss'],
  providers: [SpecificationDetailsHeaderInputservice]
})
export class SpecificationDetailsHeaderComponent extends UnsubscribeComponent implements OnInit {
  @Input() specificationDetailsInfo: GetSpecificationDetailsDto;
  @Output() saveButtonClick = new EventEmitter<void>();

  saveButtonDisabled = true;
  topDetailsData: TopFieldsData;

  constructor(private readonly headerInputService: SpecificationDetailsHeaderInputservice) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.headerInputService
      .getInputs()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        data.topFieldsConfig.vesselName = this.specificationDetailsInfo.VesselName;
        data.topFieldsConfig.jobTitle = this.specificationDetailsInfo.Subject;
        data.topFieldsConfig.jobCardNo = this.specificationDetailsInfo.SpecificationCode;
        data.topFieldsConfig.jobStatusDisplayName = this.specificationDetailsInfo.Status;
        data.detailedData.assigneeUid = this.specificationDetailsInfo.ProjectManagerUid;
        this.topDetailsData = data;
      });
  }

  onValueChange(event) {
    this.saveButtonDisabled = false;
  }

  save(): void {
    // if (this.formGroup.invalid) {
    //   // this.notificationService.error('Please fill the required fields.');
    //   return;
    // }
    this.saveButtonClick.emit();
  }
}
