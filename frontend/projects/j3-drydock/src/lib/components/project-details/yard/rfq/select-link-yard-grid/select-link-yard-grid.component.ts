import { Component, Output, EventEmitter, Input } from '@angular/core';
import { DispatchAction, GridService, eGridEvents } from 'jibe-components';
import { cloneDeep } from 'lodash';
import { filter, map } from 'rxjs/operators';

import { YardToLink } from './../../../../../models/interfaces/project-details';
import { GridInputsWithData } from '../../../../../models/interfaces/grid-inputs';
import { UnsubscribeComponent } from '../../../../../shared/classes/unsubscribe.base';
import { eRfqFields } from './../../../../../models/enums/rfq.enum';
import { SelectLinkYardGridService } from './select-link-yard-grid.service';

@Component({
  selector: 'jb-drydock-select-link-yard-grid',
  templateUrl: './select-link-yard-grid.component.html',
  styleUrls: ['./select-link-yard-grid.component.scss'],
  providers: [SelectLinkYardGridService]
})
export class SelectLinkYardGridComponent extends UnsubscribeComponent {
  @Input() set yards(val: YardToLink[]) {
    this.items = cloneDeep(val);
  }

  @Output() changed = new EventEmitter<YardToLink>();

  gridInputs: GridInputsWithData<YardToLink> = this.selectLinkYardService.getGridInputs();

  searchTerm$ = this.gridService.storeState$.pipe(
    filter((event: DispatchAction) => event.type === eGridEvents.SearchTable && event.gridName === this.gridInputs.gridName),
    map((event: DispatchAction) => event.payload)
  );

  public items: YardToLink[] = [];

  searchFn = (record: YardToLink, term: string) => {
    term = term ?? '';
    return record?.[eRfqFields.Yard].toLowerCase().includes(term.toLowerCase());
  };

  constructor(
    private gridService: GridService,
    private selectLinkYardService: SelectLinkYardGridService
  ) {
    super();
  }

  onGridRowChanges(event) {
    // console.log(event);
  }
}
