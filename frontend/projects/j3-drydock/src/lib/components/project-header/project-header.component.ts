import { Component, OnInit, ViewChild } from '@angular/core';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { SpecificationTopDetailsService, TopFieldsData } from '../../services/specifications/specification-top-details.service';
import { filter, finalize, first, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AdvancedSettings, JbDetailsTopSectionComponent } from 'jibe-components';
import { CurrentProjectService } from '../project-details/current-project.service';
import { TaskManagerService } from '../../services/task-manager.service';
import { ProjectDetails } from '../../models/interfaces/project-details';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'jb-project-header',
  templateUrl: './project-header.component.html',
  styleUrls: ['./project-header.component.scss']
})
export class ProjectHeaderComponent extends UnsubscribeComponent implements OnInit {
  @ViewChild('detailsTopSection') detailsTopSection: JbDetailsTopSectionComponent;
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
  formGroup: FormGroup;
  isValueChange = false;

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
    if (this.formGroup) {
      return this.currentProject.projectId$
        .pipe(
          first(),
          switchMap((projectId) =>
            this.specsTopDetailsService.save(projectId, {
              ...this.formGroup.value,
              Job_Short_Description: this.detailsTopSection.titleBoxContent.value
            })
          ),
          finalize(() => (this.isValueChange = false))
        )
        .toPromise();
    }

    return Promise.reject();
  }

  onFormCreate(form: FormGroup) {
    this.formGroup = form;
  }

  onValueChange(form: FormGroup) {
    this.formGroup = form;
    if (form && form.dirty) {
      this.isValueChange = form.dirty;
    }
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
        this.currentProject.savedProject$.next(data.detailedData);
      });
  }
}
