import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DryDockRoutingModule } from './drydock.routing';
import { DropdownModule, MenuModule, SidebarModule, TieredMenuModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule as PrimeNgModule } from 'primeng';
import { JiBeTheme, JibeComponentsModule } from 'jibe-components';
import { ExampleProjectsComponent } from './components/example-projects/example-projects.component';
import { ExampleProjectsGridComponent } from './components/example-projects/example-projects-grid/example-projects-grid.component';
import { ExampleProjectsService } from './infrastructure-layer/api-services/example-projects/ExampleProjectsService';
import { CreateExampleProjectPopupComponent } from './components/example-projects/example-projects-grid/create-example-project-popup/create-example-project-popup.component';
import { ProjectsMainPageComponent } from './components/projects-main-page/projects-main-page.component';
import { ProjectsSpecificationsGridComponent } from './components/projects-main-page/projects-specifications-grid/projects-specifications-grid.component';
import { ProjectsService } from './infrastructure-layer/api-services/projects/ProjectsService';

export function winEnv(): unknown {
  const winEnv = 'environment';

  return {
    ...window[winEnv],
    origin: window.location.origin + '/'
  };
}

@NgModule({
  declarations: [ExampleProjectsComponent, ExampleProjectsGridComponent, CreateExampleProjectPopupComponent, ProjectsMainPageComponent, ProjectsSpecificationsGridComponent],
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
  providers: [ExampleProjectsService, ProjectsService],
  exports: [],
  entryComponents: []
})
export class J3DryDockModule {}
