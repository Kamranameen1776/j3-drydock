import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { GridService, IGridAction, IJbDialog, eGridRefreshType, eGridRowActions, GridAction } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { takeUntil } from 'rxjs/operators';
import { getSmallPopup } from '../../../models/constants/popup';
import { DailyReportsGridService } from './reports.service';
import { IProjectsForMainPageGridDto } from '../../projects-main-page/projects-specifications-grid/dtos/IProjectsForMainPageGridDto';

@Component({
  selector: 'jb-daily-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [DailyReportsGridService]
})
export class DailyReportsComponent extends UnsubscribeComponent implements OnInit, OnChanges {
  @Input() projectId: string;
  gridData: GridInputsWithRequest;

  @ViewChild('reportDateTemplate', { static: true }) reportDateTemplate: TemplateRef<unknown>;

  reportUid: string;

  deleteReportDialog: IJbDialog = {
    ...getSmallPopup(),
    dialogHeader: 'Delete Daily Report'
  };

  deleteDialogVisible = false;
  createPopupVisible = false;
  deleteBtnLabel = 'Delete';
  deleteDialogMessage = 'Are you sure you want to delete this report?';

  constructor(
    private reportsService: DailyReportsGridService,
    private gridService: GridService
  ) {
    super();
  }

  ngOnInit(): void {
    this.gridData = this.getData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.projectId) {
      this.getData(changes.projectId.currentValue);
    }
  }

  async onActionClick({ type, payload }: IGridAction) {
    const uid = payload?.uid;
    if (uid) {
      this.reportUid = uid;
    }

    switch (type) {
      case eGridRowActions.Delete:
        this.showDeleteDialog(true);
        break;
      case eGridRowActions.Edit:
        break;
      case this.gridData.gridButton.label:
        this.showCreateReport();
        break;
      default:
        return;
    }
  }

  showCreateReport(uid?: string) {
    this.createPopupVisible = true;
  }

  public deleteReportHandler() {
    this.reportsService
      .deleteDailyReport({ uid: this.reportUid })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.showDeleteDialog(false);
        this.gridService.refreshGrid(eGridRefreshType.Table, this.gridData.gridName);
      });
  }

  public showDeleteDialog(value: boolean) {
    this.deleteDialogVisible = value;
  }

  onCloseCreatePopup(hasSaved?: boolean) {
    this.createPopupVisible = false;

    if (hasSaved) {
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridData.gridName);
    }
  }

  private getData(projectId?: string) {
    const gridData = this.reportsService.getGridData(projectId || this.projectId);
    const dateCol = gridData.columns.find((col) => col.FieldName === 'reportDate');
    dateCol.cellTemplate = this.reportDateTemplate;
    return gridData;
  }
}
