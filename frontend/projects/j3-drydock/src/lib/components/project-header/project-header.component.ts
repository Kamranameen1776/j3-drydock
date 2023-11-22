import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { SpecificationTopDetailsService, TopFieldsData } from '../../services/specifications/specification-top-details.service';
import { finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AdvancedSettings, ShowSettings } from 'jibe-components';

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

  @Output()
  vesselUid = new EventEmitter<string>();

  constructor(
    private specsTopDetailsService: SpecificationTopDetailsService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;

    this.route.paramMap
      .pipe(
        takeUntil(this.unsubscribe$),
        map((params) => params.get('projectId')),
        switchMap((projectId) => this.specsTopDetailsService.getTopDetailsData(projectId).pipe(takeUntil(this.unsubscribe$))),
        finalize(() => (this.loading = false))
      )
      .subscribe((data) => {
        this.topDetailsData = data;
        this.vesselUid.next(data.detailedData?.vesselUid as string);
      });
  }

  save() {
    return this.route.paramMap
      .pipe(
        takeUntil(this.unsubscribe$),
        map((params) => params.get('projectId')),
        switchMap((projectId) => this.specsTopDetailsService.save(projectId, this.topDetailsData.detailedData))
      )
      .toPromise();
  }
}
