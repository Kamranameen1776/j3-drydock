import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetSpecificationDetailsDto } from '../../../models/dto/specification-details/GetSpecificationDetailsDto';
import {
  HeaderButton,
  HeaderStatus,
  SpecificationHeaderStatuses
} from '../../../shared/components/generic-header/generic-header.interfaces';
import { MenuItem } from 'primeng';
import { HeaderInfoDto } from '../../../models/dto/specification-details/HeaderInfoDto';
import { TypedFormGroup } from '../../../shared/components/typed-forms';
import { ISpecificationFormGroup, Section, SectionEditMode, View, defaultSectionEditMode, sectionViewMap } from './types';
import { SpecificationDetailsHeaderInputs, SpecificationDetailsHeaderInputservice } from './specification-details-header-inputs';
import { NotificationService } from '../../../services/notification.service';
import { ControlContainer } from '@angular/forms';
import { UnsubscribeComponent } from '../../../shared/unsubscribe.component';
import { eSpecificationDetailsPageMenuIds } from '../../../models/enums/specification-details-menu-items.enum';
import { SidebarMenuService } from '../../../services/sidebar-menu.service';

@Component({
  selector: 'jb-specification-details-header',
  templateUrl: './specification-details-header.component.html',
  styleUrls: ['./specification-details-header.component.scss'],
  providers: [SpecificationDetailsHeaderInputservice]
})
export class SpecificationDetailsHeaderComponent extends UnsubscribeComponent implements OnInit {
  @Input() sepcificationDetails: GetSpecificationDetailsDto;
  @Output() saveButtonClick = new EventEmitter<void>();
  @Output() reworkStepButton = new EventEmitter();

  public status: HeaderStatus = SpecificationHeaderStatuses.Raise;
  public headerMenu: MenuItem[];
  public readonly headerInputs: SpecificationDetailsHeaderInputs;
  public headerInfo: HeaderInfoDto;
  headerButtons: HeaderButton[];
  public saveButtonDisabled = true;

  public formGroup: TypedFormGroup<ISpecificationFormGroup>;
  public currentView: View = eSpecificationDetailsPageMenuIds.SpecificationDetails;
  public sectionEditMode: SectionEditMode = {
    ...defaultSectionEditMode,
    generalInformation: true
  };

  constructor(
    private readonly singlePageHeaderInputService: SpecificationDetailsHeaderInputservice,
    private readonly notificationService: NotificationService,
    private readonly controlContainer: ControlContainer,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    super();
    this.headerInputs = this.singlePageHeaderInputService.getPopupInputs();
  }

  async ngOnInit(): Promise<void> {
    this.formGroup = this.controlContainer.control as TypedFormGroup<ISpecificationFormGroup>;

    const control = this.formGroup.get('title');
    control.setValue(this.sepcificationDetails.Subject);

    this.bindHeaderButtons();
    this.bindHeaderSections();

    this.setStatus(this.sepcificationDetails.Status);
  }

  setStatus(status): void {
    this.status.text = SpecificationHeaderStatuses[status].text;
    this.status.color = SpecificationHeaderStatuses[status].color;
  }

  private bindHeaderButtons(): void {
    this.headerInputs.headerButtons = [
      ...this.headerInputs.headerButtons.map((button) => ({
        ...button,
        disabled: button.id === 'save' ? this.saveButtonDisabled : button.disabled,
        command: () => this.headerButtonAction(button.id)
      }))
    ];
  }

  ngAfterViewInit() {
    this.formGroup?.valueChanges.subscribe((data) => {
      this.saveButtonDisabled = false;
      this.bindHeaderButtons();
    });
  }

  private bindHeaderSections() {
    const [vessel, code] = this.headerInputs.headerSections;
    vessel.label = this.sepcificationDetails.VesselName;
    code.label = `Specification ${this.sepcificationDetails.SpecificationCode}`;
    this.headerInputs.headerSections = [vessel, code];
  }

  private headerButtonAction(buttonId: string): void {
    switch (buttonId) {
      case 'save':
        this.save();
        break;
    }
  }

  private save(): void {
    if (this.formGroup.invalid) {
      this.notificationService.error('Please fill the required fields.');
      return;
    }
    this.saveButtonClick.emit();
  }

  setHeaderButtonsDisabled(disabled: boolean): void {}

  setHeaderMenuActions(label: string, visible, isRework: boolean = false, isApmFlow: boolean = false): void {}

  onClickWorkflowButton(isApmflow: boolean = false): void {}
}
