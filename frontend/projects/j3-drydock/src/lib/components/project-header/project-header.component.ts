import { Component, OnInit } from '@angular/core';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { SpecificationTopDetailsService } from '../../services/specifications/specification-top-details.service';
import { filter, finalize, first, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AdvancedSettings, ITopSectionFieldSet, ShowSettings, UserService, eAppLocation, eGridColors } from 'jibe-components';
import { CurrentProjectService } from '../project-details/current-project.service';
import { TaskManagerService } from '../../services/task-manager.service';
import { ProjectDetails, ProjectTopHeaderDetails } from '../../models/interfaces/project-details';
import { eFunction } from '../../models/enums/function.enum';
import { eModule } from '../../models/enums/module.enum';

export enum eProjectHeader3DotActions {
  Export = 'Export',
  Rework = 'Rework',
  Resync = 'Re-sync'
}

@Component({
  selector: 'jb-project-header',
  templateUrl: './project-header.component.html',
  styleUrls: ['./project-header.component.scss']
})
export class ProjectHeaderComponent extends UnsubscribeComponent implements OnInit {
  canEdit = false;
  detailedData: ProjectTopHeaderDetails;
  topFieldsConfig: ITopSectionFieldSet;

  loading = true;
  threeDotsActions: AdvancedSettings[] = [
    {
      show: true,
      color: eGridColors.JbBlack,
      label: eProjectHeader3DotActions.Export
    },
    {
      show: true,
      color: eGridColors.JbBlack,
      label: eProjectHeader3DotActions.Rework
    },
    {
      show: true,
      color: eGridColors.JbBlack,
      label: eProjectHeader3DotActions.Resync
    }
  ];

  threeDotsActionsShow: ShowSettings = {
    [eProjectHeader3DotActions.Export]: true,
    [eProjectHeader3DotActions.Rework]: true,
    [eProjectHeader3DotActions.Resync]: true,
    showDefaultLables: false
  };

  threeDotAction: eProjectHeader3DotActions = null;

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
        switchMap((projectId) => this.specsTopDetailsService.save(projectId, this.detailedData))
      )
      .toPromise();
  }

  threeDotActionClicked(event: { type: string; payload: ProjectTopHeaderDetails }) {
    if (!event) {
      return;
    }

    // eslint-disable-next-line no-console
    console.log(event);

    // eslint-disable-next-line default-case
    switch (event.type) {
      case eProjectHeader3DotActions.Export:
        this.threeDotAction = event.type;
        // TODO method to export
        break;
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
        this.canEdit = data.canEdit;
        this.topFieldsConfig = data.topFieldsConfig;

        const userLocation = UserService.getUserDetails().AppLocation === eAppLocation.Office ? 1 : 0;
        this.detailedData = {
          ...data.detailedData,
          ProjectStatusCode: data.detailedData.ProjectStatusCode || 'dry_dock', // fixme  remove once api is ready
          taskManager: { status: { code: null } },
          officeId: userLocation,
          vessel: { uid: data.detailedData.VesselUid },
          _id: data.detailedData.TaskManagerUid,
          functionCode: eFunction.Project, // fixme - clarify what to use
          moduleCode: eModule.Project // fixme - clarify what to use
        };

        this.currentProject.savedProject$.next(data.detailedData);
        this.initTaskManger(data.detailedData);
      });
  }

  private initTaskManger(savedProject: ProjectDetails) {
    this.taskManagerService.getWorkflow(savedProject.TaskManagerUid, 'dry_dock').subscribe((records) => {
      // eslint-disable-next-line no-console
      console.log(records);

      // if (records?.records.length < 1) {
      //   this.createTask();
      // } else {
      //   this.loadWorkflowJobStatus(this.jobHeaderDetails.uid, this.jobHeaderDetails.workFlowType);
      // }
    });
  }
}
