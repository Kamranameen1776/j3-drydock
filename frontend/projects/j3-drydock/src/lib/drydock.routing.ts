import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'jibe-components';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { StandardJobsMainComponent } from './components/standard-jobs-main/standard-jobs-main.component';
import { ProjectsMainPageComponent } from './components/projects-main-page/projects-main-page.component';
import { SpecificationDetailsComponent } from './components/specification-details/specification-details.component';
import { Statement } from '@angular/compiler';
import { StatementOfFactsComponent } from './components/project-monitoring/statement-of-facts/statement-of-facts.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    pathMatch: 'full',
    redirectTo: 'projects-main-page'
  },
  {
    path: 'projects-main-page',
    component: ProjectsMainPageComponent,
    canActivate: [AuthGuardService],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: 'project/:projectId',
    component: ProjectDetailsComponent,
    canActivate: [AuthGuardService],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: 'standard-jobs-main',
    component: StandardJobsMainComponent,
    canActivate: [AuthGuardService],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: 'specification-details/:specificationUid',
    component: SpecificationDetailsComponent,
    canActivate: [AuthGuardService],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: 'project-monitoring/statement-of-facts/:projectUid',
    component: StatementOfFactsComponent,
    canActivate: [AuthGuardService],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DryDockRoutingModule {}
