import { YardsService } from '../../../../services/yards.service';
import { ProjectDetails, YardLink } from '../../../../models/interfaces/project-details';
import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RfqGridService } from './rfq-grid.service';
import { GridInputsWithData } from '../../../../models/interfaces/grid-inputs';
import { eRfqActions, eRfqFields } from '../../../../models/enums/rfq.enum';
import { DispatchAction, eGridEvents, eLayoutWidgetSize, GridAction, GridRowActions, GridService } from 'jibe-components';
import { concatMap, filter, map, takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { Subscription } from 'rxjs';
import { ProjectDetailsService } from '../../project-details.service';
import { getFileNameDate } from '../../../../shared/functions/file-name';
import { currentLocalAsUTC } from '../../../../utils/date';

@Component({
  selector: 'jb-drydock-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.scss']
})
export class RfqComponent extends UnsubscribeComponent implements OnInit, OnDestroy {
  @Input() projectId: string;
  @Input() projectDetails: ProjectDetails;

  @ViewChild('isSelectedTmpl', { static: true }) isSelectedTmpl: TemplateRef<unknown>;
  @ViewChild('exportedDateTemplate', { static: true }) exportedDateTemplate: TemplateRef<HTMLElement>;

  gridInputs: GridInputsWithData<YardLink> = this.rfqGridService.getGridInputs();

  isLinkPopupVisible = false;

  gridRowActions: GridRowActions[] = [];

  public linked: YardLink[];

  searchTerm$ = this.gridService.storeState$.pipe(
    filter((event: DispatchAction) => event.type === eGridEvents.SearchTable && event.gridName === this.gridInputs.gridName),
    map((event: DispatchAction) => event.payload)
  );

  readonly eLayoutWidgetSize = eLayoutWidgetSize;

  private loadLinkedYardsSub: Subscription;

  constructor(
    private rfqGridService: RfqGridService,
    private gridService: GridService,
    private yardsService: YardsService,
    private projectService: ProjectDetailsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadLinkedYards();
    this.setGridRowActions();
    this.setCellTemplates();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.loadLinkedYardsSub?.unsubscribe();
  }

  onLinkYard() {
    this.isLinkPopupVisible = true;
  }

  onGridAction({ type, payload }: GridAction<eRfqActions, YardLink>): void {
    switch (type) {
      case eRfqActions.Export:
        this.export(payload);
        break;

      case eRfqActions.Delete:
        this.delete(payload);
        break;

      default:
        break;
    }
  }

  onCloseLinkYardPopup(isSaved: boolean) {
    this.isLinkPopupVisible = false;

    if (isSaved) {
      this.loadLinkedYards();
    }
  }

  searchFn = (record: YardLink, term: string) => {
    term = term ?? '';
    return record.yardName?.toLowerCase().includes(term.toLowerCase());
  };

  private loadLinkedYards(): void {
    this.loadLinkedYardsSub?.unsubscribe();
    this.loadLinkedYardsSub = this.yardsService.getLinkedYards(this.projectId).subscribe((data) => {
      this.linked = data ?? [];
    });
  }

  private setGridRowActions(): void {
    this.gridRowActions.length = 0;
    // TODO Access rigths
    this.gridRowActions.push({ name: eRfqActions.Export });
    // TODO Access rigths
    this.gridRowActions.push({ name: eRfqActions.Delete });
  }

  private delete(row: YardLink) {
    const uid = row.uid;

    this.yardsService
      .removeYardLink(uid)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.linked = this.linked.filter((yard) => yard.uid !== uid);
      });
  }

  private export(row: YardLink) {
    const lastExportedDate = currentLocalAsUTC().toISOString();
    this.projectService
      .exportExcel(this.projectId, row.yardUid, this.getExcelFilename(row[eRfqFields.Yard]))
      .pipe(
        concatMap(() => this.updateLastExportedDate(row, lastExportedDate)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        row.lastExportedDate = lastExportedDate;
        this.linked = cloneDeep(this.linked);
      });
  }

  private getExcelFilename(yard: string) {
    return `${this.projectDetails.VesselName}-${yard}-${new Date(this.projectDetails.StartDate).getFullYear()}-${getFileNameDate()}.xlsx`;
  }

  private updateLastExportedDate(row: YardLink, lastExportedDate: string) {
    const updatedRow = cloneDeep(row);
    updatedRow.lastExportedDate = lastExportedDate;
    return this.yardsService.updateYardLink(updatedRow);
  }

  private setCellTemplates() {
    this.setCellTemplate(this.exportedDateTemplate, eRfqFields.ExportedDate);
  }

  private setCellTemplate(template: TemplateRef<unknown>, fieldName: string) {
    const col = this.gridInputs.columns.find((col) => col.FieldName === fieldName);
    if (!col) {
      return;
    }
    col.cellTemplate = template;
  }
}
