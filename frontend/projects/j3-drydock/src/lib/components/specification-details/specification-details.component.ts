import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SpecificationDetailsService } from '../../services/specification-details/specification-details.service';
import { GetSpecificationDetailsDto } from '../../models/dto/specification-details/GetSpecificationDetailsDto';
import { ActivatedRoute } from '@angular/router';
// import { TypedFormGroup } from '../../shared/components/typed-forms';
// import { ISpecificationFormGroup, Section } from './specification-details-header/types';
import { eSpecificationDetailsPageMenuIds } from '../../models/enums/specification-details-menu-items.enum';
import { FormBuilder, Validators } from '@angular/forms';
import { JbDatePipe } from 'jibe-components';
import { Section, SectionEditMode, View, defaultSectionEditMode, sectionViewMap } from './specification-details-header/types';
import { SidebarMenuService } from '../../services/sidebar-menu.service';
import { getListSinglePageMenu } from './specification-details-header/single-page-menu';
import { UnsubscribeComponent } from '../../shared/unsubscribe.component';
import { NotificationService } from '../../services/notification.service';
import { UpdateSpecificationDetailsDto } from '../../models/dto/specification-details/UpdateSpecificationDetailsDto';

@Component({
  selector: 'jb-specification-details',
  templateUrl: './specification-details.component.html',
  styleUrls: ['./specification-details.component.scss'],
  providers: [JbDatePipe]
})
export class SpecificationDetailsComponent extends UnsubscribeComponent implements OnInit {
  public enums = {
    eSinglePageMenuIds: eSpecificationDetailsPageMenuIds
  };
  public formGroup;
  private pageTitle = 'Specification Details';
  public specificationDetails: GetSpecificationDetailsDto;
  public specificationUid: string;
  public currentView: View = eSpecificationDetailsPageMenuIds.SpecificationDetails;
  public sectionEditMode: SectionEditMode = {
    ...defaultSectionEditMode,
    generalInformation: true
  };

  constructor(
    private title: Title,
    private specificatioDetailService: SpecificationDetailsService,
    private readonly sidebarMenuService: SidebarMenuService,
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly notificationService: NotificationService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    const { snapshot } = this.activatedRoute;
    this.specificationUid = snapshot.params['specificationUid'];

    this.formGroup = this.formBuilder.group({
      uid: [this.specificationUid, Validators.required],
      title: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      assigneeUid: undefined
    });

    this.specificationDetails = await this.specificatioDetailService.getSpecificationDetails(this.specificationUid).toPromise();
    this.pageTitle = `Specification ${this.specificationDetails.SpecificationCode}`;
    this.title.setTitle(this.specificationDetails.Subject);
    this.setSinglePageMenu();
  }

  public setSectionEditMode(key: Section): void {
    this.sectionEditMode = {
      ...defaultSectionEditMode,
      [key]: true
    };
  }

  private setSinglePageMenu(): void {
    this.sidebarMenuService.init(getListSinglePageMenu(), this.componentDestroyed$, ({ id }) => {
      this.scrollInto(`#${id}`);
      this.currentView = sectionViewMap[id] ?? id;
      this.changeDetectorRef.markForCheck();
    });
  }

  private scrollInto(selector: string): void {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  }

  public async save(): Promise<void> {
    const data: UpdateSpecificationDetailsDto = this.formGroup.value;
    data.functionUid = this.specificationDetails.FunctionUid;
    data.itemCategoryUid = this.specificationDetails.FunctionUid;
    data.description = this.specificationDetails.Description;

    try {
      const uid = await this.specificatioDetailService.updateSpecification(data).toPromise();
      if (uid === this.specificationUid) {
        this.notificationService.success("Specification's information has been saved successfully.");
      }
    } catch (err) {
      this.notificationService.showWarningError(err);
    }
  }
  async applyStep(event): Promise<void> {}

  reworkStep(): void {}
}
