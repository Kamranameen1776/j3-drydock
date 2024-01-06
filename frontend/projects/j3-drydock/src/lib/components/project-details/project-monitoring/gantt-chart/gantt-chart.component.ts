import { Component, Input, OnInit } from '@angular/core';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { GanttChartService } from './gantt-chart.service';
import { JobOrderDto } from '../../../../services/project-monitoring/job-orders/JobOrderDto';
import { map, takeUntil } from 'rxjs/operators';
import { DayMarkersService } from '@syncfusion/ej2-angular-gantt';
import {
  statusBackground,
  statusIcon,
  statusProgressBarBackground,
  statusProgressBarBackgroundShaded
} from '../../../../shared/status-css.json';
import { UTCAsLocal } from 'projects/j3-drydock/src/lib/utils/date';
import { CentralizedDataService, JbDatePipe, UserService } from 'jibe-components';
import { DatePipe } from '@angular/common';

type TransformedJobOrder = Omit<JobOrderDto, 'SpecificationStatus'> & {
  SpecificationStatus: { StatusClass: string; IconClass: string; status: string };
};
@Component({
  selector: 'jb-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
  providers: [GanttChartService, DayMarkersService]
})
export class GanttChartComponent extends UnsubscribeComponent implements OnInit {
  @Input()
  projectId: string;

  dateFormat: string;

  tasks: TransformedJobOrder[] = [];
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

  columns = [
    {
      field: 'SpecificationSubject',
      headerText: 'Task Name',
      width: '150'
    },
    {
      field: 'SpecificationStartDateFormatted',
      headerText: 'Start Date',
      width: '80',
      minWidth: '80',
      maxWidth: '80'
    },
    {
      field: 'SpecificationEndDateFormatted',
      headerText: 'End Date',
      width: '80',
      minWidth: '80',
      maxWidth: '80'
    },
    {
      field: 'SpecificationStatus',
      headerText: 'Status',
      width: '100',
      minWidth: '100',
      template:
        '<div class="status-field ${SpecificationStatus.StatusClass}"><i class="${SpecificationStatus.IconClass}"></i>${SpecificationStatus.statusName}</div>'
    },
    {
      field: 'Progress',
      headerText: ' ',
      width: '60',
      minWidth: '60',
      maxWidth: '60',
      template: '<div>${Progress}%</div>'
    }
  ];

  statusCSS = { statusBackground: statusBackground, statusIcon: statusIcon };

  private jbPipe: JbDatePipe;

  constructor(
    private ganttChartService: GanttChartService,
    private userService: UserService,
    datePipe: DatePipe,
    cds: CentralizedDataService
  ) {
    super();

    this.jbPipe = new JbDatePipe(cds, datePipe);
  }

  ngOnInit(): void {
    this.dateFormat = this.userService.getUserDetails().Date_Format.toLocaleUpperCase();
    this.ganttChartService
      .getData(this.projectId)
      .pipe(
        map((data) =>
          data.records.map((jobOrder) => ({
            ...jobOrder,
            SpecificationEndDateFormatted: this.jbPipe.transform(UTCAsLocal(jobOrder.SpecificationEndDate)),
            SpecificationStartDateFormatted: this.jbPipe.transform(UTCAsLocal(jobOrder.SpecificationStartDate)),
            SpecificationStartDate: UTCAsLocal(jobOrder.SpecificationStartDate),
            SpecificationEndDate: UTCAsLocal(jobOrder.SpecificationEndDate),
            Progress: jobOrder.Progress || 0,
            SpecificationStatus: {
              status: jobOrder.SpecificationStatusCode,
              statusName: jobOrder.SpecificationStatus,
              StatusClass:
                this.statusCSS?.statusBackground[jobOrder.SpecificationStatusCode.toUpperCase()] || this.statusCSS.statusBackground.RAISE,
              IconClass: this.statusCSS?.statusIcon[jobOrder.SpecificationStatusCode.toUpperCase()] || this.statusCSS.statusIcon.RAISE
            }
          }))
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        this.tasks = data;
      });
  }

  queryTaskbarInfo(args: { data: TransformedJobOrder } & Record<string, string>) {
    args.progressBarBgColor =
      statusProgressBarBackgroundShaded[args.data.SpecificationStatus?.status?.toUpperCase()] || statusProgressBarBackgroundShaded.RAISE;
    args.taskbarBgColor =
      statusProgressBarBackground[args.data.SpecificationStatus?.status?.toUpperCase()] || statusProgressBarBackground.RAISE;
    args.taskbarBorderColor =
      statusProgressBarBackground[args.data.SpecificationStatus?.status?.toUpperCase()] || statusProgressBarBackground.RAISE;
  }
}
