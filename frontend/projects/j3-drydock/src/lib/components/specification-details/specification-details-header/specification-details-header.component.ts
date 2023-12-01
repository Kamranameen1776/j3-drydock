import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetSpecificationDetailsDto } from '../../../models/dto/specification-details/GetSpecificationDetailsDto';
import { SpecificationDetailsHeaderInputs, SpecificationDetailsHeaderInputservice } from './specification-details-header-inputs';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { SpecificationDetailsService } from '../../../services/specification-details/specification-details.service';
import { eSpecificationAccessActions } from '../../../models/enums/access-actions.enum';

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
  completeButtonDisabled = true;
  topDetailsData: SpecificationDetailsHeaderInputs;

  constructor(
    private readonly headerInputService: SpecificationDetailsHeaderInputservice,
    private readonly specificationDetailsService: SpecificationDetailsService,
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
        data.topFieldsConfig.jobStatusDisplayName = this.specificationDetailsInfo.Status;
        data.detailedData.assigneeUid = this.specificationDetailsInfo.ProjectManagerUid;
        this.topDetailsData = data;
      });
    this.cd.markForCheck();
    this.saveButtonDisabled = !this.specificationDetailsService.hasAccess(eSpecificationAccessActions.editGeneralInformation);
    this.completeButtonDisabled = !this.specificationDetailsService.hasAccess(eSpecificationAccessActions.editWorkflow);
  }

  save(): void {
    this.saveButtonClick.emit();
  }
}
