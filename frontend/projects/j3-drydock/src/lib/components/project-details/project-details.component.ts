import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IJbMenuItem, JbAttachmentsComponent, JbMenuService, JiBeTheme, eAttachmentButtonTypes } from 'jibe-components';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { map, takeUntil } from 'rxjs/operators';
import { eProjectDetailsSideMenuId } from '../../models/enums/project-details.enum';
import { projectDetailsMenuData } from './project-details-menu';
import { GrowlMessageService } from '../../services/growl-message.service';
import { ActivatedRoute } from '@angular/router';
import { CurrentProjectService } from './current-project.service';
import { eFunction } from '../../models/enums/function.enum';
import { eModule } from '../../models/enums/module.enum';
import { DetailsService } from '../../services/details.service';

@Component({
  selector: 'jb-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  providers: [GrowlMessageService, CurrentProjectService]
})
export class ProjectDetailsComponent extends UnsubscribeComponent implements OnInit, OnDestroy {
  @ViewChild(eProjectDetailsSideMenuId.General) [eProjectDetailsSideMenuId.General]: ElementRef;

  @ViewChild(eProjectDetailsSideMenuId.Specifications) [eProjectDetailsSideMenuId.Specifications]: ElementRef;
  @ViewChild(eProjectDetailsSideMenuId.TechnicalSpecification) [eProjectDetailsSideMenuId.TechnicalSpecification]: ElementRef;
  @ViewChild(eProjectDetailsSideMenuId.Requisition) [eProjectDetailsSideMenuId.Requisition]: ElementRef;

  @ViewChild(eProjectDetailsSideMenuId.YardSelection) [eProjectDetailsSideMenuId.YardSelection]: ElementRef;
  @ViewChild(eProjectDetailsSideMenuId.RFQ) [eProjectDetailsSideMenuId.RFQ]: ElementRef;
  @ViewChild(eProjectDetailsSideMenuId.Comparison) [eProjectDetailsSideMenuId.Comparison]: ElementRef;
  @ViewChild(eProjectDetailsSideMenuId.Attachments) [eProjectDetailsSideMenuId.Attachments]: ElementRef;

  @ViewChild('attachmentsComponent') attachmentsComponent: JbAttachmentsComponent;

  @ViewChild(eProjectDetailsSideMenuId.ProjectMonitoring) [eProjectDetailsSideMenuId.ProjectMonitoring]: ElementRef;
  @ViewChild(eProjectDetailsSideMenuId.StatementOfFacts) [eProjectDetailsSideMenuId.StatementOfFacts]: ElementRef;

  private readonly menuId = 'project-details-menu';

  currentSectionId = eProjectDetailsSideMenuId.General;

  eProjectDetailsSideMenuId = eProjectDetailsSideMenuId;

  growlMessage$ = this.growlMessageService.growlMessage$;

  projectId: string;

  vesselUid: string;
  vesselType: number;

  isDiscussionFeedVisible = true;

  discussionFeedDetails;

  attachmentConfig;

  attachmentButton = {
    buttonLabel: 'Add New',
    buttonType: eAttachmentButtonTypes.NoButton
  };

  get discussionFeedFunctionCode() {
    return eFunction.DryDock;
  }

  get discussionFeedModuleCode() {
    return eModule.Project;
  }

  constructor(
    private jbMenuService: JbMenuService,
    private growlMessageService: GrowlMessageService,
    private route: ActivatedRoute,
    private currentProject: CurrentProjectService,
    private detailsService: DetailsService
  ) {
    super();
  }

  ngOnInit() {
    this.initSideMenu();

    this.route.paramMap
      .pipe(
        takeUntil(this.unsubscribe$),
        map((params) => params.get('projectId'))
      )
      .subscribe((projectId) => {
        this.projectId = projectId;

        this.attachmentConfig = {
          Module_Code: eModule.Project,
          Function_Code: eFunction.DryDock,
          Key1: projectId
        };
      });

    this.currentProject.initialProject$.pipe(takeUntil(this.unsubscribe$)).subscribe((project) => {
      this.vesselUid = project?.VesselUid;
      this.vesselType = project?.VesselType;
      if (project) {
        this.discussionFeedDetails = this.detailsService.getDiscussionFeedSetting(project.ProjectId, project.VesselId);
      }
    });
  }

  ngOnDestroy() {
    this.hideSideMenu();
  }

  onAddAttachment() {
    this.attachmentsComponent.dialogOnDemand();
  }

  private initSideMenu() {
    this.jbMenuService.setSlideLayout.next('static');
    this.jbMenuService.setSlideMenuConfig.next({
      theme: JiBeTheme.Figma,
      activeMenu: true,
      id: this.menuId,
      menuData: projectDetailsMenuData
    });

    this.jbMenuService.selectedMenuOpt.pipe(takeUntil(this.unsubscribe$)).subscribe((selectedMenu) => {
      if (!selectedMenu) {
        return;
      }
      if (this.isMenuSection(selectedMenu)) {
        this.currentSectionId = selectedMenu.id as eProjectDetailsSideMenuId;
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
    return menuItem.id === eProjectDetailsSideMenuId.General || !!menuItem.items?.length;
  }
}
