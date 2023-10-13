import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DryDockRoutingModule } from './drydock.routing';
import { DropdownModule, MenuModule, SidebarModule, TieredMenuModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule as PrimeNgModule } from 'primeng';
import { JiBeTheme, JibeComponentsModule } from 'jibe-components';
import { ExampleProjectsComponent } from './components/example-projects/example-projects.component';
import { ExampleProjectsGridComponent } from './components/example-projects/example-projects-grid/example-projects-grid.component';
import { ExampleProjectsService } from './infrastructure-layer/api-services/example-projects/ExampleProjectsService';
import { CreateExampleProjectPopupComponent } from './components/example-projects/example-projects-grid/create-example-project-popup/create-example-project-popup.component';
import { SpecificationService } from '../components/specification/specification.service';
import { SpecificationComponent } from '../components/specification/specification.component';

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
    SpecificationComponent
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
  providers: [ExampleProjectsService, DatePipe, SpecificationService],
  exports: [],
  entryComponents: []
})
export class J3DryDockModule {}
