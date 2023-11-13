import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { JbControlOutputService, JbDatePipe } from 'jibe-components';
import { ISpecificationFormGroup } from '../types';
import { SpecificationDetailsHeaderInputs } from '../specification-details-header-inputs';
import { UnsubscribeComponent } from '../../../../shared/unsubscribe.component';
import { GetSpecificationDetailsDto } from '../../../../models/dto/specification-details/GetSpecificationDetailsDto';
import { takeUntil } from 'rxjs/operators';
import { TypedFormGroup } from '../../../../shared/components/typed-forms';

@Component({
  selector: 'jb-specification-details-sub-header',
  templateUrl: './specification-details-sub-header.component.html',
  styleUrls: ['./specification-details-sub-header.component.scss'],
  providers: [JbDatePipe]
})
export class SpecificationDetailsSubHeaderComponent extends UnsubscribeComponent implements OnInit {
  @Input() isEditMode = false;
  @Input() inputs: SpecificationDetailsHeaderInputs;
  @Input() specificationDetailsInfo: GetSpecificationDetailsDto;

  public formGroup: TypedFormGroup<ISpecificationFormGroup>;
  public numberOfItems: number;
  public deliveryPort: string;
  public deliveryDate: string;
  private isLocalAssignedToChange = false;

  constructor(
    private readonly controlContainer: ControlContainer,
    private readonly jbControlService: JbControlOutputService,
    private readonly jbDate: JbDatePipe,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup = this.controlContainer.control as TypedFormGroup<ISpecificationFormGroup>;
    this.bindFormDetails();

    const assignedToCtrl = this.formGroup.get('assigneeUid');
    assignedToCtrl.valueChanges.pipe(takeUntil(this.componentDestroyed$)).subscribe((uid) => {
      if (this.isLocalAssignedToChange) {
        this.isLocalAssignedToChange = false;
        return;
      }
      this.inputs.assigneeDropdown = {
        ...this.inputs.assigneeDropdown,
        ...{
          selectedValue: uid
        }
      };
      this.changeDetectorRef.markForCheck();
    });

    const headerCtrls = ['title', 'assigneeUid'];
    this.jbControlService.dynamicControl.pipe(takeUntil(this.componentDestroyed$)).subscribe(({ id, dataSource, selectedValue }) => {
      const controlName = id?.split('-req')[0];
      if (!headerCtrls.includes(controlName)) return;
      const ctrl = this.formGroup.get(controlName);
      if (!ctrl) return;
      this.isLocalAssignedToChange = true;
      ctrl.patchValue(selectedValue, { emitEvent: true });
      ctrl.markAsDirty();
    });
  }

  private async bindFormDetails(): Promise<void> {
    const { ProjectManagerUid } = this.specificationDetailsInfo;

    if (ProjectManagerUid) {
      this.inputs.assigneeDropdown = {
        ...this.inputs.assigneeDropdown,
        ...{
          selectedValue: ProjectManagerUid
        }
      };
    }
  }
}
