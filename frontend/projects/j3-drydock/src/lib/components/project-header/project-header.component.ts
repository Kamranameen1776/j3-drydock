import { Component, OnInit } from '@angular/core';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { SpecificationTopDetailsService, TopFieldsData } from '../../services/specifications/specification-top-details.service';
import { finalize, first, switchMap, takeUntil } from 'rxjs/operators';
import { AdvancedSettings } from 'jibe-components';
import { CurrentProjectService } from '../project-details/current-project.service';

@Component({
  selector: 'jb-project-header',
  templateUrl: './project-header.component.html',
  styleUrls: ['./project-header.component.scss']
})
export class ProjectHeaderComponent extends UnsubscribeComponent implements OnInit {
  topDetailsData: TopFieldsData;
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
    private currentProject: CurrentProjectService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;

    this.currentProject.projectId$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((projectId) => this.specsTopDetailsService.getTopDetailsData(projectId).pipe(takeUntil(this.unsubscribe$))),
        finalize(() => (this.loading = false))
      )
      .subscribe((data) => {
        this.topDetailsData = data;
        this.currentProject.projectId$.next(data.detailedData?.vesselUid as string);
      });
  }

  save() {
    return this.currentProject.projectId$
      .pipe(
        first(),
        switchMap((projectId) => this.specsTopDetailsService.save(projectId, this.topDetailsData.detailedData))
      )
      .toPromise();
  }
}
