import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SpecificationDetailsService } from '../../services/specification-details/specification-details.service';
import { GetSpecificationDetailsDto } from '../../models/dto/specification-details/GetSpecificationDetailsDto';
import { ActivatedRoute } from '@angular/router';
import { eSpecificationDetailsPageMenuIds, specificationDetailsMenuData } from '../../models/enums/specification-details-menu-items.enum';
import { IJbAttachment, IJbMenuItem, JbDatePipe, JbMenuService, JiBeTheme } from 'jibe-components';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { takeUntil } from 'rxjs/operators';
import { GrowlMessageService } from '../../services/growl-message.service';
import { UpdateSpecificationDetailsDto } from '../../models/dto/specification-details/UpdateSpecificationDetailsDto';
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
  @ViewChild(eSpecificationDetailsPageMenuIds.Requisition) [eSpecificationDetailsPageMenuIds.Requisition]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.Source) [eSpecificationDetailsPageMenuIds.Source]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.SpecificationAttachments)
  [eSpecificationDetailsPageMenuIds.SpecificationAttachments]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.Attachments) [eSpecificationDetailsPageMenuIds.Attachments]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.AuditTrail) [eSpecificationDetailsPageMenuIds.AuditTrail]: ElementRef;

  private pageTitle = 'Specification Details';
  public specificationDetailsInfo: GetSpecificationDetailsDto;
  public updateSpecificationDetailsInfo: UpdateSpecificationDetailsDto;
  public specificationUid: string;
  public attachmentConfig: IJbAttachment;

  private readonly menuId = 'specification-details-menu';
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
      Module_Code: 'j3_drydock',
      Function_Code: 'specification_details',
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

  public async save(): Promise<void> {
    const data: UpdateSpecificationDetailsDto = {
      uid: this.specificationDetailsInfo.uid,
      Subject: this.specificationDetailsInfo.Subject
    };

    try {
      this.specificatioDetailService.updateSpecification(data).toPromise();
      this.growlMessageService.setSuccessMessage("Specification's information has been saved successfully.");
    } catch (err) {
      this.growlMessageService.setErrorMessage(err.error);
    }
  }
}
