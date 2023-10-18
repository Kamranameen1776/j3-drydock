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
import { UpsertStandardJobPopupComponent } from './components/standard-jobs-main/upsert-standard-job-popup/upsert-standard-job-popup.component';
import { UpsertStandardJobFormComponent } from './components/standard-jobs-main/upsert-standard-job-form/upsert-standard-job-form.component';
import { FunctionsTreeSelectComponent } from './shared/components/functions-tree-select/functions-tree-select.component';
import { SubItemsComponent } from './components/standard-jobs-main/sub-items/sub-items.component';
import { UpsertSubItemFormComponent } from './components/standard-jobs-main/sub-items/upsert-sub-item-form/upsert-sub-item-form.component';
import { UpsertSubItemPopupComponent } from './components/standard-jobs-main/sub-items/upsert-sub-item-popup/upsert-sub-item-popup.component';

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
    ExampleProjectsGridComponent,
    CreateExampleProjectPopupComponent,
    StandardJobsMainComponent,
    UpsertStandardJobPopupComponent,
    UpsertStandardJobFormComponent,
    FunctionsTreeSelectComponent,
    SubItemsComponent,
    UpsertSubItemFormComponent,
    UpsertSubItemPopupComponent
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
  providers: [ExampleProjectsService, DatePipe],
  exports: [],
  entryComponents: []
})
export class J3DryDockModule {}
