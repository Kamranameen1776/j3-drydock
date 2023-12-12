import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SpecificationDetailsHeaderInputs, SpecificationDetailsHeaderInputservice } from './specification-details-header-inputs';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { SpecificationDetails } from '../../../models/interfaces/specification-details';

@Component({
  selector: 'jb-specification-details-header',
  templateUrl: './specification-details-header.component.html',
  styleUrls: ['./specification-details-header.component.scss'],
  providers: [SpecificationDetailsHeaderInputservice]
})
export class SpecificationDetailsHeaderComponent extends UnsubscribeComponent implements OnInit {
  @Input() specificationDetailsInfo: SpecificationDetails;
  @Output() saveButtonClick = new EventEmitter<void>();

  saveButtonDisabled = true;
  topDetailsData: SpecificationDetailsHeaderInputs;

  constructor(
    private readonly headerInputService: SpecificationDetailsHeaderInputservice,
    private cd: ChangeDetectorRef
  ) {
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
        data.topFieldsConfig.jobStatusDisplayName = this.specificationDetailsInfo.StatusName;
        data.detailedData.assigneeUid = this.specificationDetailsInfo.ProjectManagerUid;
        this.topDetailsData = data;
      });
    this.cd.markForCheck();
  }

  onValueChange() {
    this.saveButtonDisabled = false;
  }

  save(): void {
    this.saveButtonClick.emit();
  }
}
