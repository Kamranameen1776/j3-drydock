import { StandardJobsMainComponent } from './components/standard-jobs-main/standard-jobs-main.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DryDockRoutingModule } from './drydock.routing';
import { DropdownModule, MenuModule, SidebarModule, TieredMenuModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule as PrimeNgModule } from 'primeng';
import { JiBeTheme, JibeComponentsModule } from 'jibe-components';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { SpecificationGridService } from './services/specifications/specification.service';
import { SpecificationStatusPipe } from './components/project-details/specification/specification-status.pipe';
import { StatusCodeColorPipe } from './shared/pipes/status-code-color.pipe';
import { SpecificationTopDetailsService } from './services/specifications/specification-top-details.service';
import { UpsertStandardJobPopupComponent } from './components/standard-jobs-main/upsert-standard-job-popup/upsert-standard-job-popup.component';
import { UpsertStandardJobFormComponent } from './components/standard-jobs-main/upsert-standard-job-form/upsert-standard-job-form.component';
import { FunctionsTreeSelectComponent } from './shared/components/functions-tree-select/functions-tree-select.component';
import { ProjectHeaderComponent } from './components/project-header/project-header.component';
import { SpecificationsComponent } from './components/project-details/specification/specifications.component';
import { SubItemsComponent } from './components/standard-jobs-main/sub-items/sub-items.component';
import { UpsertSubItemFormComponent } from './components/standard-jobs-main/sub-items/upsert-sub-item-form/upsert-sub-item-form.component';
import { UpsertSubItemPopupComponent } from './components/standard-jobs-main/sub-items/upsert-sub-item-popup/upsert-sub-item-popup.component';
import { StandardJobsStatusNamePipe } from './components/standard-jobs-main/pipes/status-name.pipe';
import { StandardJobsStatusColorPipe } from './components/standard-jobs-main/pipes/status-color.pipe';
import { ProjectsMainPageComponent } from './components/projects-main-page/projects-main-page.component';
import { ProjectsSpecificationsGridComponent } from './components/projects-main-page/projects-specifications-grid/projects-specifications-grid.component';
import { ProjectsService } from './services/ProjectsService';
import { StaticGridSearchPipe } from './shared/pipes/static-grid-search.pipe';
import { CreateSpecificationPopupComponent } from './components/project-details/create-specification-popup/create-specification-popup.component';
import { SpecificationFormComponent } from './components/project-details/specification-form/specification-form.component';
import { SpecificationCreateFormService } from './components/project-details/specification-form/specification-create-form-service';
import { ProjectTypesLeftPanelComponent } from './components/projects-main-page/project-types-left-panel/project-types-left-panel.component';
import { ProjectStatusFilterComponent } from './components/projects-main-page/project-types-left-panel/project-status-filter/project-status-filter.component';
import { LeftPanelFilterService } from './components/projects-main-page/services/LeftPanelFilterService';
import { RfqComponent } from './components/project-details/yard/rfq/rfq.component';
import { ComparisonComponent } from './components/project-details/yard/comparison/comparison.component';
import { LinkYardPopupComponent } from './components/project-details/yard/rfq/link-yard-popup/link-yard-popup.component';
import { SelectLinkYardGridComponent } from './components/project-details/yard/rfq/select-link-yard-grid/select-link-yard-grid.component';
import { SpecificationDetailsComponent } from './components/specification-details/specification-details.component';
import { SpecificationDetailsService } from './services/specification-details/specification-details.service';
import { SpecificationDetailsHeaderComponent } from './components/specification-details/specification-details-header/specification-details-header.component';

export function winEnv(): unknown {
  const winEnv = 'environment';

  return {
    ...window[winEnv],
    origin: window.location.origin + '/'
  };
}

@NgModule({
  declarations: [
    SpecificationStatusPipe,
    StatusCodeColorPipe,
    ProjectDetailsComponent,
    SpecificationsComponent,
    ProjectsMainPageComponent,
    ProjectsSpecificationsGridComponent,
    StandardJobsMainComponent,
    UpsertStandardJobPopupComponent,
    UpsertStandardJobFormComponent,
    FunctionsTreeSelectComponent,
    ProjectTypesLeftPanelComponent,
    ProjectStatusFilterComponent,
    ProjectHeaderComponent,
    SubItemsComponent,
    UpsertSubItemFormComponent,
    UpsertSubItemPopupComponent,
    StandardJobsStatusNamePipe,
    StandardJobsStatusColorPipe,
    StaticGridSearchPipe,
    RfqComponent,
    ComparisonComponent,
    LinkYardPopupComponent,
    SelectLinkYardGridComponent,
    CreateSpecificationPopupComponent,
    SpecificationFormComponent,
    SpecificationDetailsComponent,
    SpecificationDetailsHeaderComponent
  ],
  imports: [
    CommonModule,
    JibeComponentsModule.forRoot({
      environment: winEnv,
      theme: JiBeTheme.Figma
    }),
    DryDockRoutingModule,
    ReactiveFormsModule,
    DropdownModule,
    TieredMenuModule,
    SidebarModule,
    FormsModule,
    PrimeNgModule,
    MenuModule
  ],
  providers: [
    DatePipe,
    SpecificationGridService,
    SpecificationTopDetailsService,
    ProjectsService,
    SpecificationDetailsService,
    LeftPanelFilterService,
    SpecificationCreateFormService
  ],
  exports: [],
  entryComponents: []
})
export class J3DryDockModule {}
