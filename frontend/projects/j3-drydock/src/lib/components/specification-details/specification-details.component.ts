import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SpecificationDetailsService } from '../../services/specification-details/specification-details.service';
import { ActivatedRoute } from '@angular/router';
import { eSpecificationDetailsPageMenuIds, specificationDetailsMenuData } from '../../models/enums/specification-details-menu-items.enum';
import { IJbAttachment, IJbMenuItem, JbDatePipe, JbMenuService, JiBeTheme } from 'jibe-components';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { takeUntil } from 'rxjs/operators';
import { GrowlMessageService } from '../../services/growl-message.service';
import { UpdateSpecificationDetailsDto } from '../../models/dto/specification-details/UpdateSpecificationDetailsDto';
import { eModule } from '../../models/enums/module.enum';
import { eFunction } from '../../models/enums/function.enum';
import { SpecificationDetails } from '../../models/interfaces/specification-details';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'jb-specification-details',
  templateUrl: './specification-details.component.html',
  styleUrls: ['./specification-details.component.scss'],
  providers: [JbDatePipe, GrowlMessageService]
})
export class SpecificationDetailsComponent extends UnsubscribeComponent implements OnInit, OnDestroy {
  @ViewChild(eSpecificationDetailsPageMenuIds.SpecificationDetails) [eSpecificationDetailsPageMenuIds.SpecificationDetails]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.GeneralInformation) [eSpecificationDetailsPageMenuIds.GeneralInformation]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.SubItems) [eSpecificationDetailsPageMenuIds.SubItems]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.PMSJobs) [eSpecificationDetailsPageMenuIds.PMSJobs]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.Requisition) [eSpecificationDetailsPageMenuIds.Requisition]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.Source) [eSpecificationDetailsPageMenuIds.Source]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.SpecificationAttachments)
  [eSpecificationDetailsPageMenuIds.SpecificationAttachments]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.Attachments) [eSpecificationDetailsPageMenuIds.Attachments]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.AuditTrail) [eSpecificationDetailsPageMenuIds.AuditTrail]: ElementRef;

  private pageTitle = 'Specification Details';
  public specificationDetailsInfo: SpecificationDetails;
  public updateSpecificationDetailsInfo: UpdateSpecificationDetailsDto;
  public specificationUid: string;
  public attachmentConfig: IJbAttachment;

  private readonly menuId = 'specification-details-menu';
  public detailForm: FormGroup;
  detailData: boolean;
  currentSectionId = eSpecificationDetailsPageMenuIds.SpecificationDetails;
  eProjectDetailsSideMenuId = eSpecificationDetailsPageMenuIds;
  growlMessage$ = this.growlMessageService.growlMessage$;

  constructor(
    private title: Title,
    private specificatioDetailService: SpecificationDetailsService,
    private readonly activatedRoute: ActivatedRoute,
    private growlMessageService: GrowlMessageService,
    private jbMenuService: JbMenuService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    const { snapshot } = this.activatedRoute;
    this.specificationUid = snapshot.params.specificationUid;
    this.specificationDetailsInfo = await this.specificatioDetailService.getSpecificationDetails(this.specificationUid).toPromise();
    this.pageTitle = `Specification ${this.specificationDetailsInfo.SpecificationCode}`;
    this.title.setTitle(this.pageTitle);
    this.initSideMenu();
    this.initializeAttachments(this.specificationUid);
  }

  ngOnDestroy() {
    this.hideSideMenu();
  }

  private initializeAttachments(id: string): void {
    this.attachmentConfig = {
      Module_Code: eModule.Project,
      Function_Code: eFunction.SpecificationDetails,
      Key1: id
    };
  }

  private initSideMenu() {
    this.jbMenuService.setSlideLayout.next('static');
    this.jbMenuService.setSlideMenuConfig.next({
      theme: JiBeTheme.Figma,
      activeMenu: true,
      id: this.menuId,
      menuData: specificationDetailsMenuData
    });

    this.jbMenuService.selectedMenuOpt.pipe(takeUntil(this.unsubscribe$)).subscribe((selectedMenu) => {
      if (!selectedMenu) {
        return;
      }
      if (this.isMenuSection(selectedMenu)) {
        this.currentSectionId = selectedMenu.id as eSpecificationDetailsPageMenuIds;
      }
      if (selectedMenu.id) {
        this[selectedMenu.id]?.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  private hideSideMenu() {
    this.jbMenuService.setSlideMenuConfig.next({
      activeMenu: false,
      id: this.menuId,
      menuData: null
    });
  }

  private isMenuSection(menuItem: IJbMenuItem) {
    return (
      menuItem.id === eSpecificationDetailsPageMenuIds.SpecificationDetails ||
      menuItem.id === eSpecificationDetailsPageMenuIds.Attachments ||
      menuItem.id === eSpecificationDetailsPageMenuIds.AuditTrail ||
      !!menuItem.items?.length
    );
  }

  validateDetail(form: FormGroup) {
    form.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      if (form.valid) {
        this.detailData = true;
        this.detailForm = form;
      }
    });
  }

  public async save(headerform: FormGroup): Promise<void> {
    const generalInformationData = this.detailForm?.controls.generalInformation.value;

    const data: UpdateSpecificationDetailsDto = {
      uid: this.specificationDetailsInfo.uid,
      Subject: headerform ? headerform.controls.Job_Short_Description.value : this.specificationDetailsInfo.Subject,
      AccountCode: generalInformationData.accountCode,
      DoneByUid: generalInformationData.doneBy,
      Description: generalInformationData.description,
      PriorityUid: generalInformationData.priorityUid,
      Inspections: generalInformationData.inspectionId
    };

    try {
      this.specificatioDetailService.updateSpecification(data).toPromise();
      this.growlMessageService.setSuccessMessage("Specification's information has been saved successfully.");
    } catch (err) {
      this.growlMessageService.setErrorMessage(err.error);
    }
  }
}
