import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'jibe-components';
import { ExampleProjectsComponent } from './components/example-projects/example-projects.component';

const routes: Routes = [
  {
    path: '',
    component: null,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: 'example-projects'
      },
      {
        path: 'example-projects',
        component: ExampleProjectsComponent,
        canActivate: [AuthGuardService],
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        children: []
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DryDockRoutingModule {}
