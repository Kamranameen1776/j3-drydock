import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { GanttChartService } from './gantt-chart.service';
import { JobOrderDto } from '../../../../services/project-monitoring/job-orders/JobOrderDto';
import { finalize, map, takeUntil } from 'rxjs/operators';
import {
  ColumnModel,
  DayMarkersService,
  EditService,
  EditSettingsModel,
  TooltipSettingsModel,
  TimelineSettingsModel,
  Gantt
} from '@syncfusion/ej2-angular-gantt';
import {
  statusBackground,
  statusIcon,
  statusProgressBarBackground,
  statusProgressBarBackgroundShaded
} from '../../../../shared/status-css.json';

import { IJbDialog, JmsService, UserService, eJMSWorkflowAction } from 'jibe-components';
import { UTCAsLocal, currentLocalAsUTC } from '../../../../utils/date';
import { IJobOrderFormDto } from '../job-orders-form/dtos/IJobOrderFormDto';
import { JobOrdersService } from '../../../../services/project-monitoring/job-orders/JobOrdersService';
import { IJobOrdersFormComponent } from '../job-orders-form/IJobOrdersFormComponent';
import { GrowlMessageService } from '../../../../services/growl-message.service';
import { IJobOrderFormResultDto } from '../job-orders-form/dtos/IJobOrderFormResultDto';
import { IUpdateJobOrderDto } from '../../../../services/project-monitoring/job-orders/IUpdateJobOrderDto';
import moment from 'moment';
import { IUpdateJobOrderDurationDto } from '../../../../services/project-monitoring/job-orders/IUpdateJobOrderDurationDto';
import { ProjectDetailsFull } from '../../../../models/interfaces/project-details';

type TransformedJobOrder = Omit<JobOrderDto, 'SpecificationStatus'> & {
  SpecificationStatus: { StatusClass: string; IconClass: string; status: string };
};
@Component({
  selector: 'jb-project-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
  providers: [GanttChartService, DayMarkersService, EditService]
})
export class GanttChartComponent extends UnsubscribeComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input()
  projectId: string;

  @Input() vesselId: number;

  @Input() project: ProjectDetailsFull;

  @ViewChild('jobOrderForm')
  jobOrderForm: IJobOrdersFormComponent;

  public updateBtnLabel = 'Update';

  public updateDialogVisible = false;

  updateJobOrderDialog: IJbDialog = { dialogHeader: 'Update Job Order' };

  updateJobOrderButtonDisabled = false;

  dateFormat: string;

  showSpinner: boolean;

  tasks: TransformedJobOrder[] = [];

  taskFields = {
    id: 'SpecificationUid',
    name: 'SpecificationSubject',
    startDate: 'SpecificationStartDate',
    endDate: 'SpecificationEndDate',
    progress: 'Progress'
  };
  splitterSettings = {
    position: '65%'
  };
  eventMarkers = [
    {
      day: new Date(),
      label: ''
    }
  ];

  ganttChart: Gantt;
  tooltipSettings: TooltipSettingsModel = {
    taskbar:
      '<table class="e-gantt-tooltiptable">' +
      '<tbody>' +
      '<tr class="e-gantt-tooltip-rowcell">' +
      '<td colspan="3">${SpecificationSubject}</td>' +
      '</tr>' +
      '<tr>' +
      '<td class="e-gantt-tooltip-label">Start Date</td><td>:</td>' +
      '<td class="e-gantt-tooltip-value">&nbsp;${SpecificationStartDateFormatted}</td>' +
      '</tr>' +
      '<tr><td class="e-gantt-tooltip-label">End Date</td><td>:</td>' +
      '<td class="e-gantt-tooltip-value">&nbsp;${SpecificationEndDateFormatted}</td></tr>' +
      '<td class="e-gantt-tooltip-label">Progress</td><td>:</td>' +
      '<td class="e-gantt-tooltip-value">&nbsp;${Progress}</td></tr>' +
      '<tr><td class="e-gantt-tooltip-label">Duration</td><td>:</td>' +
      '<td class="e-gantt-tooltip-value">&nbsp;${DurationInDays}</td></tr><tr>' +
      '<td class="e-gantt-tooltip-label">Status</td><td>:</td>' +
      '<td class="e-gantt-tooltip-value">&nbsp;${SpecificationStatus.statusName}</td></tr>' +
      '</tbody>' +
      '</table>',
    showTooltip: true
  };

  columns: ColumnModel[] = [
    {
      // This column with 'isPrimaryKey' is needed for the editing taskbar

      field: 'SpecificationUid',
      headerText: '',
      allowEditing: false,
      visible: false,
      isPrimaryKey: true
    },
    {
      field: 'DurationInDays',
      headerText: '',
      allowEditing: false,
      visible: false
    },
    {
      field: 'SpecificationCode',
      headerTemplate: '<div class="gantt-grid-header">Specification</div>',
      allowEditing: false,
      width: '80',
      minWidth: '80',
      maxWidth: '80',
      template:
        '<span data-name="gantt-grid-specification-code" data-specification-code="${SpecificationCode.Code}"  data-specification-uid="${SpecificationCode.SpecificationUid}" target="_blank" class="gantt-grid-link jb_grid_topCellValue">${SpecificationCode.Code}</span>'
    },
    {
      field: 'SpecificationSubject',
      headerTemplate: '<div class="gantt-grid-header">Description</div>',
      allowEditing: false,
      width: '80',
      minWidth: '80'
    },
    {
      field: 'SpecificationStartDateFormatted',
      headerTemplate: '<div class="gantt-grid-header">Start Date</div>',
      allowEditing: false,
      width: '65',
      minWidth: '65',
      maxWidth: '65'
    },
    {
      field: 'SpecificationEndDateFormatted',
      headerTemplate: '<div class="gantt-grid-header">End Date</div>',
      allowEditing: false,
      width: '65',
      minWidth: '65',
      maxWidth: '65'
    },
    {
      field: 'SpecificationStatus',
      headerTemplate: '<div class="gantt-grid-header">Status</div>',
      allowEditing: false,
      width: '60',
      minWidth: '60',
      maxWidth: '80',
      template:
        '<div class="status-field ${SpecificationStatus.StatusClass}"><i class="${SpecificationStatus.IconClass}"></i>${SpecificationStatus.statusName}</div>'
    },
    {
      field: 'Progress',
      headerTemplate: '<div class="gantt-grid-header">Progress</div>',
      allowEditing: false,
      width: '60',
      minWidth: '60',
      maxWidth: '60',
      template: '<div>${Progress}%</div>'
    },
    {
      field: 'Responsible',
      headerTemplate: '<div class="gantt-grid-header">Responsible</div>',
      allowEditing: false,
      width: '120',
      minWidth: '120',
      maxWidth: '180'
    }
  ];

  editSettings: EditSettingsModel = {
    allowEditing: true,
    allowTaskbarEditing: true
  };

  timelineSettings: TimelineSettingsModel;

  statusCSS = { statusBackground: statusBackground, statusIcon: statusIcon };

  id = 'project_gantt';

  constructor(
    private ganttChartService: GanttChartService,
    private userService: UserService,
    private element: ElementRef,
    private jobOrdersService: JobOrdersService,
    private growlMessageService: GrowlMessageService,
    private jmsService: JmsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initComponent();
    this.updateEventMarkers(this.project);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.project) {
      this.updateEventMarkers(changes.project.currentValue);
    }
  }

  ngAfterViewInit(): void {
    this.listenGanttClicks();

    this.jobOrderForm.onValueChangesIsFormValid.pipe(takeUntil(this.unsubscribe$)).subscribe((isValid) => {
      this.updateJobOrderButtonDisabled = !isValid;
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.element.nativeElement.querySelector(`#${this.id}`).removeEventListener('click', this.linkClick);
  }

  transformToEJ2DateFormat(dateFormat: string) {
    return dateFormat.replace('DD', 'dd').replace('YYYY', 'yyyy');
  }

  updateEventMarkers(project: ProjectDetailsFull) {
    const eventMarkers = [
      {
        day: new Date(),
        label: '',
        cssClass: ''
      }
    ];

    if (project?.StartDate) {
      eventMarkers.push({
        day: new Date(project?.StartDate),
        label: '',
        cssClass: 'overdue-line'
      });
    }

    if (project.EndDate) {
      eventMarkers.push({
        day: new Date(project?.EndDate),
        label: '',
        cssClass: 'overdue-line'
      });
    }

    this.eventMarkers = eventMarkers;
  }

  queryTaskbarInfo(args: { data: TransformedJobOrder } & Record<string, string>) {
    args.progressBarBgColor =
      statusProgressBarBackgroundShaded[args.data.SpecificationStatus?.status?.toUpperCase()] || statusProgressBarBackgroundShaded.RAISE;
    args.taskbarBgColor =
      statusProgressBarBackground[args.data.SpecificationStatus?.status?.toUpperCase()] || statusProgressBarBackground.RAISE;
    args.taskbarBorderColor =
      statusProgressBarBackground[args.data.SpecificationStatus?.status?.toUpperCase()] || statusProgressBarBackground.RAISE;
  }

  taskbarEdited(event) {
    if (!event || !event.previousData || !event.editingFields || !event.data || !event.data.taskData || !event.taskBarEditAction) {
      return;
    }

    const jobOrderUid = event.data.taskData.JobOrderUid;

    if (event.taskBarEditAction === 'ProgressResizing' && !jobOrderUid) {
      this.growlMessageService.setErrorMessage("The progress can't be changed Please fill job order form first.");
      this.initComponent();
      return;
    }

    const oldProgress = event.previousData.Progress;
    const oldStartDate = event.previousData.SpecificationStartDate;
    const oldEndDate = event.previousData.SpecificationEndDate;

    let newProgress: number;

    if (jobOrderUid) {
      newProgress = event.editingFields.progress;
    }

    const newStartDate = event.editingFields.startDate;
    const newEndDate = event.editingFields.endDate;

    if (
      oldProgress === newProgress &&
      oldStartDate?.getTime() === newStartDate.getTime() &&
      oldEndDate?.getTime() === newEndDate.getTime()
    ) {
      return;
    }

    this.showSpinner = true;

    const dto: IUpdateJobOrderDurationDto = {
      SpecificationUid: event.data.SpecificationUid,
      SpecificationStartDate: newStartDate,
      SpecificationEndDate: newEndDate,
      Progress: newProgress,
      LastUpdated: currentLocalAsUTC()
    };

    this.jobOrdersService
      .updateJobOrderDuration(dto)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => {
          this.initComponent();
        })
      )
      .subscribe(
        () => {
          return;
        },
        (error) => {
          this.growlMessageService.setErrorMessage(error?.error?.name ?? 'Unexpected error.');
        }
      );
  }

  public showUpdateDialog(value = true) {
    this.updateDialogVisible = value;
  }

  public updateJobOrder() {
    this.updateJobOrderButtonDisabled = true;

    const result = this.jobOrderForm.save();

    if (result instanceof Error) {
      this.growlMessageService.setErrorMessage(result.message);
      return;
    }

    const jobOrder = result as IJobOrderFormResultDto;

    const data: IUpdateJobOrderDto = {
      SpecificationUid: jobOrder.SpecificationUid,
      LastUpdated: currentLocalAsUTC(),
      Progress: jobOrder.Progress,

      SpecificationStartDate: jobOrder.SpecificationStartDate,
      SpecificationEndDate: jobOrder.SpecificationEndDate,

      Status: jobOrder.Status,
      Subject: jobOrder.Subject,

      Remarks: jobOrder.Remarks
    };

    // TODO - temp workaround until normal event is provided by infra team: Event to upload editor images
    this.jmsService.jmsEvents.next({ type: eJMSWorkflowAction.AddClassFlag });

    this.jobOrdersService
      .updateJobOrder(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.updateJobOrderButtonDisabled = false;
        this.showUpdateDialog(false);

        this.initComponent();
      });
  }

  private listenGanttClicks() {
    this.element.nativeElement.querySelector(`#${this.id}`).addEventListener('click', this.linkClick);
  }

  private linkClick = (e) => {
    if (e.target.attributes['data-name']?.value === 'gantt-grid-specification-code') {
      const specificationUid = e.target.attributes['data-specification-uid'].value;
      const code = e.target.attributes['data-specification-code'].value;
      this.showJobOrderForm(specificationUid, code);
    }
  };

  private showJobOrderForm(specificationUid: string, code: string) {
    this.jobOrdersService
      .getJobOrderBySpecification({
        SpecificationUid: specificationUid
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((jobOrder) => {
        const jobOrderForm: IJobOrderFormDto = {
          SpecificationUid: specificationUid,
          Code: code
        };

        if (jobOrder) {
          jobOrderForm.Remarks = jobOrder.Remarks;
          jobOrderForm.Progress = jobOrder.Progress;
          jobOrderForm.Subject = jobOrder.Subject;
          jobOrderForm.Status = jobOrder.Status;
          jobOrderForm.SpecificationStartDate = jobOrder.SpecificationStartDate;
          jobOrderForm.SpecificationEndDate = jobOrder.SpecificationEndDate;
        }

        this.jobOrderForm.init(jobOrderForm);

        this.showUpdateDialog(true);
      });
  }

  private initComponent(): void {
    this.dateFormat = this.userService.getUserDetails().Date_Format.toLocaleUpperCase();
    this.timelineSettings = {
      timelineUnitSize: 40,
      weekendBackground: '#f5f5f5',
      topTier: {
        unit: 'Month',
        formatter: (date: Date) => {
          const dateStr = moment(date).format(this.dateFormat);

          return dateStr;
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

    this.showSpinner = true;

    this.ganttChartService
      .getData(this.projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .pipe(
        map((data) =>
          data.records.map((jobOrder) => {
            const specificationStartDate = UTCAsLocal(jobOrder.SpecificationStartDate);
            const specificationEndDate = UTCAsLocal(jobOrder.SpecificationEndDate);
            const obj = {
              ...jobOrder,
              JobOrderUid: jobOrder.JobOrderUid,
              SpecificationCode: { Code: jobOrder.Code, SpecificationUid: jobOrder.SpecificationUid },
              Responsible: jobOrder.Responsible,

              SpecificationStartDateFormatted: moment(specificationStartDate).format(this.dateFormat),
              SpecificationEndDateFormatted: moment(specificationEndDate).format(this.dateFormat),

              SpecificationStartDate: specificationStartDate,
              SpecificationEndDate: specificationEndDate,

              DurationInDays: this.calculateCountOfDays(specificationEndDate, specificationStartDate),

              Progress: jobOrder.Progress || 0,
              SpecificationStatus: {
                status: jobOrder.SpecificationStatusCode,
                statusName: jobOrder.SpecificationStatus,
                StatusClass:
                  this.statusCSS?.statusBackground[jobOrder.SpecificationStatusCode.toUpperCase()] || this.statusCSS.statusBackground.RAISE,
                IconClass: this.statusCSS?.statusIcon[jobOrder.SpecificationStatusCode.toUpperCase()] || this.statusCSS.statusIcon.RAISE
              }
            };

            return obj;
          })
        ),
        finalize(() => {
          this.showSpinner = false;
        })
      )
      .subscribe((data) => {
        this.showSpinner = false;
        this.tasks = data;
      });
  }

  private calculateCountOfDays(startDate: Date, endDate: Date): number {
    const msInOneDay = 1000 * 60 * 60 * 24;

    return Math.abs(Math.ceil((endDate.getTime() - startDate.getTime()) / msInOneDay));
  }
}
