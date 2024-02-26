import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { eGridRefreshType, eGridRowActions, GridAction, GridRowActions, GridService } from 'jibe-components';
import { GridInputsWithRequest } from '../../models/interfaces/grid-inputs';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { getSmallPopup } from '../../models/constants/popup';
import { GrowlMessageService } from '../../services/growl-message.service';
import { Title } from '@angular/platform-browser';
import { eStandardJobsAccessActions } from '../../models/enums/access-actions.enum';
import { ProjectTemplatesGridService } from './project-templates-grid.service';
import { ProjectTemplatesService } from '../../services/project-templates.service';
import { eProjectTemplatesFields } from '../../models/enums/project-templates.enum';
import { ProjectTemplate } from '../../models/interfaces/project-template';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'jb-project-templates-main',
  templateUrl: './project-templates-main.component.html',
  styleUrls: ['./project-templates-main.component.scss'],
  providers: [ProjectTemplatesGridService, GrowlMessageService]
})
export class ProjectTemplatesMainComponent extends UnsubscribeComponent implements OnInit {
  @ViewChild('lastUpdatedTemplate', { static: true }) lastUpdatedTemplate: TemplateRef<unknown>;

  gridInputs: GridInputsWithRequest;

  isUpsertPopupVisible = false;

  isConfirmDeleteVisible = false;

  currentRow: ProjectTemplate;

  gridRowActions: GridRowActions[] = [];

  confirmationPopUp = {
    ...getSmallPopup(),
    dialogHeader: 'Delete Project Template'
  };

  growlMessage$ = this.growlMessageService.growlMessage$;

  canView = false;

  private canCreate = false;

  private canEdit = false;

  private canDelete = false;

  constructor(
    private mainGridService: ProjectTemplatesGridService,
    private projectTemplatesService: ProjectTemplatesService,
    // private upsertFormService: StandardJobUpsertFormService,
    private gridService: GridService,
    private growlMessageService: GrowlMessageService,
    private title: Title
  ) {
    super();
  }

  ngOnInit(): void {
    this.setAccessRights();
    this.setGridInputs();
    this.setGridRowActions();
    this.setPageTitle();
  }

  cellPlainTextClick({ cellType, rowData, columnDetail }) {
    if (cellType === 'hyperlink' && columnDetail.FieldName === eProjectTemplatesFields.Code) {
      this.editRow(rowData);
    }
  }

  onGridAction({ type, payload }: GridAction<string, unknown>): void {
    switch (type) {
      case eGridRowActions.Edit:
        this.editRow(<ProjectTemplate>payload);
        break;

      case this.gridInputs.gridButton.label:
        this.createNewRow();
        break;

      case eGridRowActions.Delete:
        this.deleteRow(<ProjectTemplate>payload);
        break;

      default:
        break;
    }
  }

  onConfirmDeleteOk() {
    this.delete();
  }

  onConfirmDeleteCancel() {
    this.isConfirmDeleteVisible = false;
  }

  onCloseUpsertPopup(hasSaved: boolean) {
    this.isUpsertPopupVisible = false;
    this.currentRow = undefined;

    if (hasSaved) {
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridInputs.gridName);
    }
  }

  private createNewRow() {
    this.isUpsertPopupVisible = true;
  }

  private editRow(row: ProjectTemplate) {
    this.projectTemplatesService.getTemplate(row.ProjectTemplateUid).subscribe((res) => {
      this.currentRow = { ...row, ...res, VesselTypeSpecific: +res.VesselTypeSpecific };
      this.isUpsertPopupVisible = true;
    });
  }

  private deleteRow(row: ProjectTemplate) {
    this.isConfirmDeleteVisible = true;
    this.currentRow = row;
  }

  private setGridRowActions(): void {
    this.gridRowActions.length = 0;
    this.gridRowActions.push({ name: eGridRowActions.DoubleClick });

    if (this.canEdit) {
      this.gridRowActions.push({
        name: eGridRowActions.Edit
      });
    }

    if (this.canDelete) {
      this.gridRowActions.push({
        name: eGridRowActions.Delete
      });
    }
  }

  private setGridInputs() {
    this.gridInputs = this.mainGridService.getGridInputs();
    this.gridInputs.gridButton.show = this.canCreate;

    this.setCellTemplate(this.lastUpdatedTemplate, eProjectTemplatesFields.LastUpdated);
  }
  // TODO remove true condition once US for access rights is done
  private setAccessRights() {
    this.canView = true || this.mainGridService.hasAccess(eStandardJobsAccessActions.viewGrid);

    this.canCreate = true || this.mainGridService.hasAccess(eStandardJobsAccessActions.createJob);
    this.canEdit = true || this.mainGridService.hasAccess(eStandardJobsAccessActions.editJob);
    this.canDelete = true || this.mainGridService.hasAccess(eStandardJobsAccessActions.deleteJob);
  }

  private delete() {
    this.projectTemplatesService
      .delete(this.currentRow.ProjectTemplateUid)
      .pipe(
        finalize(() => {
          this.isConfirmDeleteVisible = false;
          this.currentRow = undefined;
        })
      )
      .subscribe(() => {
        this.gridService.refreshGrid(eGridRefreshType.Table, this.gridInputs.gridName);
      });
  }

  private setPageTitle() {
    this.title.setTitle('Project Templates');
  }

  private setCellTemplate(template: TemplateRef<unknown>, fieldName: eProjectTemplatesFields) {
    const col = this.gridInputs.columns.find((col) => col.FieldName === fieldName);
    if (!col) {
      return;
    }
    col.cellTemplate = template;
  }
}
