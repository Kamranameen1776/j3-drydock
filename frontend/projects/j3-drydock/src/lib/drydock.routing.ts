import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'jibe-components';
import { ExampleProjectsComponent } from './components/example-projects/example-projects.component';
import { StandardJobsMainComponent } from './components/standard-jobs-main/standard-jobs-main.component';
import { ProjectsMainPageComponent } from './components/projects-main-page/projects-main-page.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    pathMatch: 'full',
    redirectTo: 'projects-main-page'
  },
  {
    path: 'example-projects',
    component: ExampleProjectsComponent,
    canActivate: [AuthGuardService],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: []
  },
  {
    path: 'projects-main-page',
    component: ProjectsMainPageComponent,
    canActivate: [AuthGuardService],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: []
  },

  {
    path: 'standard-jobs-main',
    component: StandardJobsMainComponent,
    canActivate: [AuthGuardService],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DryDockRoutingModule {}
