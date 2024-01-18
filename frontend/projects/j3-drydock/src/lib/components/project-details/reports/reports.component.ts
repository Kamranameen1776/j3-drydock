import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GridCellData, GridService, IGridAction, IJbDialog, eGridRefreshType, eGridRowActions } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { takeUntil } from 'rxjs/operators';
import { getSmallPopup } from '../../../models/constants/popup';
import { DailyReportsGridService } from './reports.service';
import { IDailyReportsResultDto } from './dto/IDailyReportsResultDto';

@Component({
  selector: 'jb-drydock-daily-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [DailyReportsGridService]
})
export class DailyReportsComponent extends UnsubscribeComponent implements OnInit {
  @Input() projectId: string;

  @ViewChild('reportDateTemplate', { static: true }) reportDateTemplate: TemplateRef<unknown>;

  gridData: GridInputsWithRequest;

  reportUid: string;
  reportInfo: IDailyReportsResultDto;

  isShowLoader = false;
  isShowDeleteDialog = false;
  isShowReportDialog = false;

  deleteReportDialog: IJbDialog = {
    ...getSmallPopup(),
    dialogHeader: 'Delete Daily Report'
  };
  deleteBtnLabel = 'Delete';
  deleteDialogMessage = 'Are you sure you want to delete this report?';

  constructor(
    private reportsService: DailyReportsGridService,
    private gridService: GridService
  ) {
    super();
  }

  // public shows that it is used from parent of this component
  public showReportDialog(value: boolean) {
    this.isShowReportDialog = value;
  }

  ngOnInit(): void {
    this.setGridData();
    this.setCellTemplate(this.reportDateTemplate, 'reportDate');
  }

  onActionClick({ type, payload }: IGridAction) {
    this.reportInfo = payload;

    switch (type) {
      case eGridRowActions.Delete:
        this.showDeleteDialog(true);
        break;
      case eGridRowActions.Edit:
        this.showReportDialog(true);
        break;
      default:
        return;
    }
  }

  showDeleteDialog(value: boolean) {
    this.isShowDeleteDialog = value;
  }

  onDeleteReport() {
    this.isShowLoader = true;
    this.reportsService
      .deleteDailyReport({ uid: this.reportInfo.uid, projectUid: this.projectId })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.isShowLoader = false;
        this.showDeleteDialog(false);
        this.gridService.refreshGrid(eGridRefreshType.Table, this.gridData.gridName);
      });
  }

  onCloseCreatePopup(hasSaved?: boolean) {
    this.showReportDialog(false);
    this.reportInfo = null;

    if (hasSaved) {
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridData.gridName);
    }
  }

  onCellPlainTextClick({ cellType, rowData, columnDetail }: GridCellData) {
    if (cellType === 'hyperlink' && columnDetail.FieldName === 'reportName') {
      this.reportInfo = rowData;
      this.showReportDialog(true);
    }
  }

  private setGridData() {
    this.gridData = this.reportsService.getGridData(this.projectId);
  }

  private setCellTemplate(template: TemplateRef<unknown>, fieldName: string) {
    const col = this.gridData.columns.find((col) => col.FieldName === fieldName);
    if (!col) {
      return;
    }
    col.cellTemplate = template;
  }
}
