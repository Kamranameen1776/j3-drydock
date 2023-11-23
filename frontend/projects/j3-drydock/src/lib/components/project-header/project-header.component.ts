import { Component, OnInit } from '@angular/core';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { SpecificationTopDetailsService, TopFieldsData } from '../../services/specifications/specification-top-details.service';
import { filter, finalize, first, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AdvancedSettings } from 'jibe-components';
import { CurrentProjectService } from '../project-details/current-project.service';
import { TaskManagerService } from '../../services/task-manager.service';
import { ProjectDetails } from '../../models/interfaces/project-details';

@Component({
  selector: 'jb-project-header',
  templateUrl: './project-header.component.html',
  styleUrls: ['./project-header.component.scss']
})
export class ProjectHeaderComponent extends UnsubscribeComponent implements OnInit {
  topDetailsData: TopFieldsData<ProjectDetails>;
  loading = true;
  threeDotsActions: AdvancedSettings[] = [
    {
      show: true,
      color: 'status-0',
      label: 'Export'
    },
    {
      show: true,
      color: 'status-0',
      label: 'Rework'
    },
    {
      show: true,
      color: 'status-0',
      label: 'Re-sync'
    }
  ];

  constructor(
    private specsTopDetailsService: SpecificationTopDetailsService,
    private currentProject: CurrentProjectService,
    private taskManagerService: TaskManagerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadTopDetailsData();
  }

  save() {
    return this.currentProject.projectId$
      .pipe(
        first(),
        switchMap((projectId) => this.specsTopDetailsService.save(projectId, this.topDetailsData.detailedData))
      )
      .toPromise();
  }

  private loadTopDetailsData() {
    this.currentProject.projectId$
      .pipe(
        filter((projectId) => !!projectId),
        tap(() => {
          this.loading = true;
        }),
        switchMap((projectId) => this.specsTopDetailsService.getTopDetailsData(projectId).pipe(takeUntil(this.unsubscribe$))),
        takeUntil(this.unsubscribe$),
        finalize(() => (this.loading = false))
      )
      .subscribe((data) => {
        this.topDetailsData = data;
        this.currentProject.vesselUid$.next(data.detailedData?.VesselUid as string);
      });
  }
}
