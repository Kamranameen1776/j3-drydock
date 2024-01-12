import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { GanttChartService } from './gantt-chart.service';
import { JobOrderDto } from '../../../../services/project-monitoring/job-orders/JobOrderDto';
import { map, takeUntil } from 'rxjs/operators';
import { DayMarkersService, EditService, ToolbarService } from '@syncfusion/ej2-angular-gantt';
import {
  statusBackground,
  statusIcon,
  statusProgressBarBackground,
  statusProgressBarBackgroundShaded
} from '../../../../shared/status-css.json';

import { CentralizedDataService, IJbDialog, JbDatePipe, UserService } from 'jibe-components';
import { DatePipe } from '@angular/common';
import { UTCAsLocal, currentLocalAsUTC } from '../../../../utils/date';
import { IJobOrderFormDto } from '../job-orders-form/dtos/IJobOrderFormDto';
import { JobOrdersService } from 'projects/j3-drydock/src/lib/services/project-monitoring/job-orders/JobOrdersService';
import { IJobOrdersFormComponent } from '../job-orders-form/IJobOrdersFormComponent';
import { GrowlMessageService } from 'projects/j3-drydock/src/lib/services/growl-message.service';
import { IJobOrderFormResultDto } from '../job-orders-form/dtos/IJobOrderFormResultDto';
import { IUpdateJobOrderDto } from 'projects/j3-drydock/src/lib/services/project-monitoring/job-orders/IUpdateJobOrderDto';
import moment from 'moment';

type TransformedJobOrder = Omit<JobOrderDto, 'SpecificationStatus'> & {
  SpecificationStatus: { StatusClass: string; IconClass: string; status: string };
};
@Component({
  selector: 'jb-project-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
  providers: [GanttChartService, DayMarkersService, EditService]
})
export class GanttChartComponent extends UnsubscribeComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  projectId: string;

  @ViewChild('jobOrderForm')
  jobOrderForm: IJobOrdersFormComponent;

  public updateBtnLabel = 'Update';

  public updateDialogVisible = false;

  updateJobOrderDialog: IJbDialog = { dialogHeader: 'Update Job Order' };

  updateJobOrderButtonDisabled = false;

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
      // This column is needed for the editing taskbar

      field: 'SpecificationUid',
      headerText: '',
      maxWidth: '0',
      minWidth: '0',
      isPrimaryKey: true
    },
    {
      field: 'SpecificationCode',
      headerText: 'Specification',
      width: '120',
      minWidth: '120',
      maxWidth: '120',
      template:
        '<span data-name="gantt-grid-specification-code" data-specification-code="${SpecificationCode.Code}"  data-specification-uid="${SpecificationCode.SpecificationUid}" target="_blank" class="gantt-grid-link jb_grid_topCellValue">${SpecificationCode.Code}</span>'
    },
    {
      field: 'SpecificationSubject',
      headerText: 'Description',
      width: '150',
      minWidth: '50'
    },
    {
      field: 'SpecificationStartDateFormatted',
      headerText: 'Start Date',
      width: '100',
      minWidth: '100',
      maxWidth: '100'
    },
    {
      field: 'SpecificationEndDateFormatted',
      headerText: 'End Date',
      width: '100',
      minWidth: '100',
      maxWidth: '100'
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

  editSettings = {
    allowEditing: true,
    allowTaskbarEditing: true
  };

  projectStartDate;
  projectEndDate;

  timelineSettings: any;

  statusCSS = { statusBackground: statusBackground, statusIcon: statusIcon };

  id = 'project_gantt';

  private jbPipe: JbDatePipe;

  constructor(
    private ganttChartService: GanttChartService,
    private userService: UserService,
    private element: ElementRef,
    private jobOrdersService: JobOrdersService,
    private growlMessageService: GrowlMessageService,
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

    this.ganttChartService
      .getData(this.projectId)
      .pipe(
        map((data) =>
          data.records.map((jobOrder) => {
            const specificationStartDate = UTCAsLocal(jobOrder.SpecificationStartDate);
            const specificationEndDate = UTCAsLocal(jobOrder.SpecificationEndDate);
            const obj = {
              ...jobOrder,
              SpecificationCode: { Code: jobOrder.Code, SpecificationUid: jobOrder.SpecificationUid },
              Responsible: jobOrder.Responsible,

              SpecificationStartDateFormatted: moment(specificationStartDate).format(this.dateFormat),
              SpecificationEndDateFormatted: moment(specificationEndDate).format(this.dateFormat),

              SpecificationStartDate: specificationStartDate,
              SpecificationEndDate: specificationEndDate,

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
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        this.tasks = data;
      });
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

  queryTaskbarInfo(args: { data: TransformedJobOrder } & Record<string, string>) {
    args.progressBarBgColor =
      statusProgressBarBackgroundShaded[args.data.SpecificationStatus?.status?.toUpperCase()] || statusProgressBarBackgroundShaded.RAISE;
    args.taskbarBgColor =
      statusProgressBarBackground[args.data.SpecificationStatus?.status?.toUpperCase()] || statusProgressBarBackground.RAISE;
    args.taskbarBorderColor =
      statusProgressBarBackground[args.data.SpecificationStatus?.status?.toUpperCase()] || statusProgressBarBackground.RAISE;
  }

  taskbarEdited(event) {
    if (!event && !event.previousData && !event.editingFields) {
      return;
    }

    const oldProgress = event.previousData.Progress;
    const oldStartDate = event.previousData.SpecificationStartDate;
    const oldEndDate = event.previousData.SpecificationEndDate;

    const newProgress = event.editingFields.progress;
    const newStartDate = event.editingFields.startDate;
    const newEndDate = event.editingFields.endDate;

    if (oldProgress === newProgress && oldStartDate.getTime() === newStartDate.getTime() && oldEndDate.getTime() === newEndDate.getTime()) {
      return;
    }

    this.jobOrdersService
      .getJobOrderBySpecification({
        SpecificationUid: event.data.SpecificationUid
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((jobOrder) => {

        // TODO: rework this, it's not working properly, oldEndDate not being set always
        // if (
        //   new Date(jobOrder.SpecificationEndDate).getTime() !== oldEndDate.getTime() ||
        //   new Date(jobOrder.SpecificationStartDate).getTime() !== oldStartDate.getTime() ||
        //   jobOrder.Progress !== oldProgress
        // ) {
        //   this.growlMessageService.setErrorMessage(
        //     'Cannot update job order. It was already updated. Please refresh the page and try again.'
        //   );
        // }

        const data: IUpdateJobOrderDto = {
          SpecificationUid: jobOrder.SpecificationUid,
          LastUpdated: currentLocalAsUTC(),
          Progress: newProgress,

          SpecificationStartDate: newStartDate,
          SpecificationEndDate: newEndDate,

          // TODO: optimize this, possibly create a new API service
          // to save just Progress and SpecificationStartDate and SpecificationEndDate
          //
          Status: jobOrder.Status,
          Subject: jobOrder.Subject,
          Remarks: jobOrder.Remarks
        };

        this.jobOrdersService
          .updateJobOrder(data)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(() => {
            this.ngOnInit();
          });
      });
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

    this.jobOrdersService
      .updateJobOrder(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.updateJobOrderButtonDisabled = false;
        this.showUpdateDialog(false);

        this.ngOnInit();
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
}
