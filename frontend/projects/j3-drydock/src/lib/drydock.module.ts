import { StandardJobsMainComponent } from './components/standard-jobs-main/standard-jobs-main.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DryDockRoutingModule } from './drydock.routing';
import { DropdownModule, MenuModule, SidebarModule, TieredMenuModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule as PrimeNgModule } from 'primeng';
import { JiBeTheme, JibeComponentsModule } from 'jibe-components';
import { ExampleProjectsComponent } from './components/example-projects/example-projects.component';
import { ExampleProjectsGridComponent } from './components/example-projects/example-projects-grid/example-projects-grid.component';
import { ExampleProjectsService } from './services/ExampleProjectsService';
import { CreateExampleProjectPopupComponent } from './components/example-projects/example-projects-grid/create-example-project-popup/create-example-project-popup.component';
import { SpecificationComponent } from './components/specification/specification.component';
import { SpecificationGridService } from './services/specifications/specification.service';
import { SpecificationStatusPipe } from './components/specification/specification-status.pipe';
import { StatusCodeColorPipe } from './utils/status-code-color.pipe';
import { JibeTabViewComponent } from './components/jb-tabview/jb-tabview.component';
import { SpecificationTopDetailsService } from './services/specifications/specification-top-details.service';
import { UpsertStandardJobPopupComponent } from './components/standard-jobs-main/upsert-standard-job-popup/upsert-standard-job-popup.component';
import { UpsertStandardJobFormComponent } from './components/standard-jobs-main/upsert-standard-job-form/upsert-standard-job-form.component';
import { FunctionsTreeSelectComponent } from './shared/components/functions-tree-select/functions-tree-select.component';

export function winEnv(): unknown {
  const winEnv = 'environment';

  return {
    ...window[winEnv],
    origin: window.location.origin + '/'
  };
}

@NgModule({
  declarations: [
    ExampleProjectsComponent,
    JibeTabViewComponent,
    SpecificationStatusPipe,
    StatusCodeColorPipe,
    ExampleProjectsGridComponent,
    CreateExampleProjectPopupComponent,
    SpecificationComponent,
    StandardJobsMainComponent,
    UpsertStandardJobPopupComponent,
    UpsertStandardJobFormComponent,
    FunctionsTreeSelectComponent
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
  providers: [ExampleProjectsService, DatePipe, SpecificationGridService, SpecificationTopDetailsService],
  exports: [],
  entryComponents: []
})
export class J3DryDockModule {}
