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

import { CentralizedDataService, JbDatePipe, UserService } from 'jibe-components';
import { DatePipe } from '@angular/common';
import { UTCAsLocal } from '../../../../utils/date';
import { Router } from '@angular/router';
import moment from 'moment';

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
  taskFields = {
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
      field: 'SpecificationURL',
      headerText: '',
      width: '0',
      minWidth: '0',
      maxWidth: '0'
    },
    {
      field: 'SpecificationCode',
      headerText: 'Specification',
      width: '100',
      minWidth: '100',
      maxWidth: '100',
      template: '<a href="${SpecificationURL}" target="_blank" class="gantt-grid-link" >${SpecificationCode}</a>'
    },
    {
      field: 'SpecificationSubject',
      headerText: 'Subject',
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
      headerText: 'Progress',
      width: '80',
      minWidth: '80',
      maxWidth: '80',
      template: '<div>${Progress}%</div>'
    },
    {
      field: 'Responsible',
      headerText: 'Responsible',
      width: '100',
      minWidth: '100',
      maxWidth: '100'
    }
  ];

  // TODO: Fill with correct dates
  projectStartDate;
  projectEndDate;

  timelineSettings: any;

  statusCSS = { statusBackground: statusBackground, statusIcon: statusIcon };

  private jbPipe: JbDatePipe;

  constructor(
    private ganttChartService: GanttChartService,
    private userService: UserService,
    private router: Router,
    datePipe: DatePipe,
    cds: CentralizedDataService
  ) {
    super();

    this.jbPipe = new JbDatePipe(cds, datePipe);
  }

  ngOnInit(): void {
    this.dateFormat = this.userService.getUserDetails().Date_Format.toLocaleUpperCase();
    this.timelineSettings = {
      timelineUnitSize: 40,
      weekendBackground: '#f5f5f5',
      topTier: {
        unit: 'Month',
        formatter: (date: Date) => {
          const dateStr = moment(date).format(this.dateFormat);

          return dateStr;// + `<a href='#40'>g</a>`;
        }
      },
      bottomTier: {
        unit: 'Day',
        formatter: (date: Date) => {
          const days = 'SMTWTFS';

          const dayOfWeek = days[date.getDay()];
          const dayOfMonth = date.getDate();
          const str = `<span id='gantt-day-of-year-${date.getDay()}' class='gantt-day-of-month'>${dayOfMonth}</span><span class='gantt-day-of-week'>${dayOfWeek}</span>`;

          return str;
        }
      }
    };

    this.ganttChartService
      .getData(this.projectId)
      .pipe(
        map((data) =>
          data.records.map((jobOrder) => ({
            ...jobOrder,
            SpecificationCode: jobOrder.Code,
            SpecificationURL: this.router.createUrlTree(['dry-dock', 'specification-details', jobOrder.SpecificationUid]).toString(),
            Responsible: jobOrder.Responsible,
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
