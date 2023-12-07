import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SpecificationDetailsService } from '../../services/specification-details/specification-details.service';
import { GetSpecificationDetailsDto } from '../../models/dto/specification-details/GetSpecificationDetailsDto';
import { ActivatedRoute } from '@angular/router';
import { eSpecificationDetailsPageMenuIds, specificationDetailsMenuData } from '../../models/enums/specification-details-menu-items.enum';
import {
  GridRowActions,
  IJbAttachment,
  IJbMenuItem,
  JbDatePipe,
  JbMenuService,
  JiBeTheme,
  eAttachmentAction,
  eGridRowActions
} from 'jibe-components';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { takeUntil } from 'rxjs/operators';
import { GrowlMessageService } from '../../services/growl-message.service';
import { UpdateSpecificationDetailsDto } from '../../models/dto/specification-details/UpdateSpecificationDetailsDto';
import { eModule } from '../../models/enums/module.enum';
import { eFunction } from '../../models/enums/function.enum';
import { eSpecificationAccessActions } from '../../models/enums/access-actions.enum';
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
  public specificationDetailsInfo: GetSpecificationDetailsDto;
  public updateSpecificationDetailsInfo: UpdateSpecificationDetailsDto;
  public specificationUid: string;
  public attachmentConfig: IJbAttachment;
  canView = false;
  canViewSubItems = false;
  addAttachemnt = false;

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
    this.setAccessRights();
  }

  ngOnDestroy() {
    this.hideSideMenu();
  }

  private initializeAttachments(id: string): void {
    const actions: GridRowActions[] = [];
    const canEditAttachments = this.specificatioDetailService.hasAccess(eSpecificationAccessActions.editAttachments);
    const canDeleteAttachments = this.specificatioDetailService.hasAccess(eSpecificationAccessActions.deleteAttachments);

    if (canEditAttachments) {
      actions.push({
        name: eGridRowActions.Edit,
        icon: 'icons8-edit'
      });
    }

    if (canDeleteAttachments) {
      actions.push({
        name: eGridRowActions.Delete,
        icon: 'icons8-delete'
      });
    }

    actions.push({
      name: eAttachmentAction.Download,
      icon: 'icons8-download'
    });

    this.attachmentConfig = {
      Module_Code: eModule.Project,
      Function_Code: eFunction.SpecificationDetails,
      Key1: id,
      actions: actions
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

  private setAccessRights() {
    this.canView = this.specificatioDetailService.hasAccess(eSpecificationAccessActions.viewSpecificationDetail);
    this.canViewSubItems = this.specificatioDetailService.hasAccess(eSpecificationAccessActions.viewSubItemsSection);
    this.addAttachemnt = this.specificatioDetailService.hasAccess(eSpecificationAccessActions.addAttachments);
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
