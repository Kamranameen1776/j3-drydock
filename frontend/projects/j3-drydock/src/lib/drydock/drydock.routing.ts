import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'jibe-components';
import { ExampleProjectsComponent } from './components/example-projects/example-projects.component';
import { SpecificationComponent } from '../components/specification/specification.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    pathMatch: 'full',
    redirectTo: 'example-projects',
  },

  {
    path: 'example-projects',
    component: ExampleProjectsComponent,
    canActivate: [AuthGuardService],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
  {
    path: 'specification',
    component: SpecificationComponent,
    // canActivate: [AuthGuardService],
    // runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DryDockRoutingModule {}
