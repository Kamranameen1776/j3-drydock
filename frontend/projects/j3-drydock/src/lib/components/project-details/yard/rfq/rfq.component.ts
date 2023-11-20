import { YardsService } from './../../../../services/yards.service';
import { YardLink } from './../../../../models/interfaces/project-details';
import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RfqGridService } from './rfq-grid.service';
import { GridInputsWithData } from './../../../../models/interfaces/grid-inputs';
import { eRfqFields } from './../../../../models/enums/rfq.enum';
import { DispatchAction, GridAction, GridRowActions, GridService, eGridEvents, eGridRowActions, eLayoutWidgetSize } from 'jibe-components';
import { concatMap, filter, finalize, map, takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jb-drydock-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.scss']
})
export class RfqComponent extends UnsubscribeComponent implements OnInit, OnDestroy {
  @Input() projectId: string;

  @ViewChild('isSelectedTmpl', { static: true }) isSelectedTmpl: TemplateRef<unknown>;

  gridInputs: GridInputsWithData<YardLink> = this.rfqGridService.getGridInputs();

  isLinkPopupVisible = false;

  gridRowActions: GridRowActions[] = [];

  eRfqFields = eRfqFields;

  linked: YardLink[];

  searchTerm$ = this.gridService.storeState$.pipe(
    filter((event: DispatchAction) => event.type === eGridEvents.SearchTable && event.gridName === this.gridInputs.gridName),
    map((event: DispatchAction) => event.payload)
  );

  readonly eLayoutWidgetSize = eLayoutWidgetSize;

  private loadLinkedYardsSub: Subscription;

  constructor(
    private rfqGridService: RfqGridService,
    private gridService: GridService,
    private yardsService: YardsService
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

  onGridAction({ type, payload }: GridAction<string, YardLink>): void {
    switch (type) {
      case 'Export':
        this.export(payload);
        break;

      case eGridRowActions.Select:
        this.select(payload);
        break;

      case eGridRowActions.Delete:
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
    this.gridRowActions.push({ name: 'Export' });
    // TODO Access rigths
    this.gridRowActions.push({ name: eGridRowActions.Select });
    // TODO Access rigths
    this.gridRowActions.push({ name: eGridRowActions.Delete });
  }

  private select(row: YardLink) {
    const uid = row.uid;
    const previousSelected: YardLink = this.linked.find((yard) => yard.isSelected);
    const newSelected = this.linked.find((yard) => yard.uid === uid);

    if (!newSelected) {
      return;
    }

    this.unselectPreviousAndSelectNew(previousSelected, row)
      .pipe(
        finalize(() => {
          this.linked = cloneDeep(this.linked);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        row.isSelected = true;
      });
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
    const lastExportedDate = new Date().toISOString();
    this.yardsService
      .updateYardLink({ ...row, lastExportedDate })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        row.lastExportedDate = lastExportedDate;
        this.linked = cloneDeep(this.linked);
      });
  }

  private setCellTemplates() {
    this.setCellTemplate(this.isSelectedTmpl, eRfqFields.IsSelected);
  }

  private setCellTemplate(template: TemplateRef<unknown>, fieldName: string) {
    const col = this.gridInputs.columns.find((col) => col.FieldName === fieldName);
    if (!col) {
      return;
    }
    col.cellTemplate = template;
  }

  private unselectPreviousAndSelectNew(previousSelected: YardLink, newSelected: YardLink) {
    if (previousSelected) {
      return this.sendSelect(previousSelected, false).pipe(
        concatMap(() => {
          previousSelected.isSelected = false;
          return this.sendSelect(newSelected, true);
        })
      );
    }
    return this.sendSelect(newSelected, true);
  }

  private sendSelect(yard: YardLink, isSelected: boolean) {
    return this.yardsService.updateYardLink({ ...yard, isSelected });
  }
}
