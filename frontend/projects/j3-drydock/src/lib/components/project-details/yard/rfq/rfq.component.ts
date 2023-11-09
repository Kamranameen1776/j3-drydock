import { ProjectDetailsService } from './../../../../services/project-details.service';
import { YardLink } from './../../../../models/interfaces/project-details';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RfqGridService } from './rfq-grid.service';
import { GridInputsWithData } from './../../../../models/interfaces/grid-inputs';
import { eRfqFields } from './../../../../models/enums/rfq.enum';
import { DispatchAction, GridAction, GridRowActions, GridService, eGridEvents, eGridRowActions, eLayoutWidgetSize } from 'jibe-components';
import { filter, map } from 'rxjs/operators';
import { getDateString } from './../../../../utils/date';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'jb-drydock-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.scss']
})
export class RfqComponent implements OnInit {
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

  constructor(
    private rfqGridService: RfqGridService,
    private gridService: GridService,
    private projectDetailsService: ProjectDetailsService
  ) {}

  ngOnInit(): void {
    this.loadLinkedYards();
    this.setGridRowActions();
    this.setCellTemplates();
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
  // TODO
  onCloseLinkYardPopup(saved: YardLink[]) {
    this.isLinkPopupVisible = false;

    if (saved?.length) {
      // refresh grid and linked
      this.linked = cloneDeep(saved);
    }
  }

  searchFn = (record: YardLink, term: string) => {
    term = term ?? '';
    return record.yard?.toLowerCase().includes(term.toLowerCase());
  };

  private loadLinkedYards(): void {
    this.projectDetailsService.getLinkedYards(this.projectId).subscribe((data) => {
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
    // TODO send request and then update the grid and linked
    const uid = row.uid;
    this.linked = this.linked.map((yard) => {
      return { ...yard, isSelected: yard.uid === uid };
    });
  }

  private delete(row: YardLink) {
    // TODO send request and then update the grid and linked
    const uid = row.uid;
    this.linked = this.linked.filter((yard) => yard.uid !== uid);
  }

  private export(row: YardLink) {
    // TODO send request and then update the grid and linked
    row.exportedDate = getDateString(new Date());
    this.linked = cloneDeep(this.linked);
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
}
