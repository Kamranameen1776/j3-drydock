import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
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

type TransformedJobOrder = Omit<JobOrderDto, 'SpecificationStatus'> & {
  SpecificationStatus: { StatusClass: string; IconClass: string; status: string };
};
@Component({
  selector: 'jb-project-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
  providers: [GanttChartService, DayMarkersService]
})
export class GanttChartComponent extends UnsubscribeComponent implements OnInit, OnDestroy, AfterViewInit {
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
      template: '<span target="_blank" class="gantt-grid-link jb_grid_topCellValue">${SpecificationCode}</span>'
    },
    {
      field: 'SpecificationSubject',
      headerText: 'Description',
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
      width: '60',
      minWidth: '60',
      maxWidth: '60',
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

  statusCSS = { statusBackground: statusBackground, statusIcon: statusIcon };

  id = 'project_gantt';

  private jbPipe: JbDatePipe;

  constructor(
    private ganttChartService: GanttChartService,
    private userService: UserService,
    private router: Router,
    private element: ElementRef,
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
            SpecificationCode: jobOrder.Code,
            SpecificationURL: this.router.createUrlTree(['dry-dock', 'specification-details', jobOrder.SpecificationUid]).toString(),
            Responsible: jobOrder.DoneBy,
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

  ngAfterViewInit(): void {
    this.listenGanttClicks();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.element.nativeElement.querySelector(`#${this.id}`).removeEventListener('click', this.linkClick);
  }

  queryTaskbarInfo(args: { data: TransformedJobOrder } & Record<string, string>) {
    args.progressBarBgColor =
      statusProgressBarBackgroundShaded[args.data.SpecificationStatus?.status?.toUpperCase()] || statusProgressBarBackgroundShaded.RAISE;
    args.taskbarBgColor =
      statusProgressBarBackground[args.data.SpecificationStatus?.status?.toUpperCase()] || statusProgressBarBackground.RAISE;
    args.taskbarBorderColor =
      statusProgressBarBackground[args.data.SpecificationStatus?.status?.toUpperCase()] || statusProgressBarBackground.RAISE;
  }

  private listenGanttClicks() {
    this.element.nativeElement.querySelector(`#${this.id}`).addEventListener('click', this.linkClick);
  }

  private linkClick = (e) => {
    // eslint-disable-next-line no-console
    console.log(e.target.innerText);
  };
}
