import { Component, Input, OnInit } from '@angular/core';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { GanttChartService } from './gantt-chart.service';
import { JobOrderDto } from '../../../../services/project-monitoring/job-orders/JobOrderDto';
import { map, takeUntil } from 'rxjs/operators';
import { DayMarkersService } from '@syncfusion/ej2-angular-gantt';
import { statusBackground, statusIcon, statusProgressBarBackground, statusProgressBarBackgroundShaded } from './status-css.json';
import { Observable } from 'rxjs';

@Component({
  selector: 'jb-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
  providers: [GanttChartService, DayMarkersService]
})
export class GanttChartComponent extends UnsubscribeComponent implements OnInit {
  @Input()
  projectId: string;

  tasks$: Observable<JobOrderDto[]>;
  taskConfig = {
    id: 'SpecificationUid',
    name: 'SpecificationSubject',
    startDate: 'SpecificationStartDate',
    endDate: 'SpecificationEndDate',
    progress: 'Progress'
  };
  splitterSettings = {
    position: '50%'
  };
  eventMarkers = [
    {
      day: new Date(),
      label: ''
    }
  ];
  statusCSS = { statusBackground: statusBackground, statusIcon: statusIcon };

  constructor(private ganttChartService: GanttChartService) {
    super();
  }

  ngOnInit(): void {
    this.tasks$ = this.ganttChartService.getData(this.projectId).pipe(
      map((data) => data.records.map((jobOrder) => ({ ...jobOrder, Progress: jobOrder.Progress || 0 }))),
      takeUntil(this.unsubscribe$)
    );
  }

  queryTaskbarInfo(args: { data: JobOrderDto } & Record<string, string>) {
    args.progressBarBgColor =
      statusProgressBarBackgroundShaded[args.data.SpecificationStatus?.toUpperCase()] || statusProgressBarBackgroundShaded.RAISE;
    args.taskbarBgColor = statusProgressBarBackground[args.data.SpecificationStatus?.toUpperCase()] || statusProgressBarBackground.RAISE;
    args.taskbarBorderColor =
      statusProgressBarBackground[args.data.SpecificationStatus?.toUpperCase()] || statusProgressBarBackground.RAISE;
  }
}
