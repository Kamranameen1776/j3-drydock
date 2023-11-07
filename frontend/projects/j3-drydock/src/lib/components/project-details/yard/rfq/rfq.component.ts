import { ProjectDetailsService } from './../../../../services/project-details.service';
import { YardLink } from './../../../../models/interfaces/project-details';
import { Component, Input, OnInit } from '@angular/core';
import { RfqGridService } from './rfq-grid.service';
import { GridInputsWithData } from './../../../../models/interfaces/grid-inputs';
import { eRfqFields } from './../../../../models/enums/rfq.enum';
import { DispatchAction, GridAction, GridRowActions, GridService, eGridEvents, eGridRowActions, eLayoutWidgetSize } from 'jibe-components';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'jb-drydock-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.scss']
})
export class RfqComponent implements OnInit {
  @Input() projectId: string;

  gridInputs: GridInputsWithData<YardLink> = this.rfqGridService.getGridInputs();

  isLinkPopupVisible = false;

  currentRow: unknown; // fixme type

  gridRowActions: GridRowActions[] = [];

  eRfqFields = eRfqFields;

  linked: YardLink[] = [];

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
  }

  onLinkYard() {
    // TODO
  }

  onGridAction({ type, payload }: GridAction<string, unknown>): void {
    switch (type) {
      case 'Export':
        break;

      case eGridRowActions.Select:
        break;

      case eGridRowActions.Delete:
        break;

      default:
        break;
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
}
