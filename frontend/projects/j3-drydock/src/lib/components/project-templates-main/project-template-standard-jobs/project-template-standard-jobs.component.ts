import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DispatchAction, GridAction, GridRowActions, GridService, eGridEvents, eGridRowActions } from 'jibe-components';
import { GridInputsWithData } from '../../../models/interfaces/grid-inputs';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { getSmallPopup } from '../../../models/constants/popup';
import { filter, map } from 'rxjs/operators';
import { ProjectTemplateStandardJob, ProjectTemplateStandardJobsGridService } from './project-template-standard-jobs-grid.service';

@Component({
  selector: 'jb-drydock-project-template-standard-jobs',
  templateUrl: './project-template-standard-jobs.component.html',
  styleUrls: ['./project-template-standard-jobs.component.scss'],
  providers: [ProjectTemplateStandardJobsGridService]
})
export class ProjectTemplateStandardJobsComponent extends UnsubscribeComponent implements OnInit {
  @Input() linked: ProjectTemplateStandardJob[];

  @Output() changed = new EventEmitter<ProjectTemplateStandardJob[]>();

  gridInputs: GridInputsWithData<ProjectTemplateStandardJob>;

  isAddPopupVisible = false;

  private currentDeleteRow: ProjectTemplateStandardJob;

  searchTerm$ = this.gridService.storeState$.pipe(
    filter((event: DispatchAction) => event.type === eGridEvents.SearchTable && event.gridName === this.gridInputs.gridName),
    map((event: DispatchAction) => event.payload)
  );

  gridRowActions: GridRowActions[] = [];

  confirmationPopUp = {
    ...getSmallPopup(),
    dialogHeader: 'Delete Sub Item'
  };

  isConfirmDeleteVisible = false;

  constructor(
    private standardJobsGridService: ProjectTemplateStandardJobsGridService,
    private gridService: GridService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setGridInputs();
    this.setGridRowActions();
  }

  onGridAction({ type, payload }: GridAction<string, unknown>): void {
    switch (type) {
      case this.gridInputs.gridButton.label:
        this.isAddPopupVisible = true;
        break;
      case eGridRowActions.Delete:
        this.deleteRow(<ProjectTemplateStandardJob>payload);
        break;
      default:
        break;
    }
  }

  onCloseAddPopup(items: ProjectTemplateStandardJob[] | null) {
    this.add(items);
    this.isAddPopupVisible = false;
  }

  onConfirmDeleteOk() {
    this.delete(this.currentDeleteRow);
    this.isConfirmDeleteVisible = false;
  }

  onConfirmDeleteCancel() {
    this.isConfirmDeleteVisible = false;
  }

  onCloseConfirmationDeletePopup() {
    this.currentDeleteRow = undefined;
  }

  searchFn = (record: ProjectTemplateStandardJob, term: string) => {
    term = term ?? '';
    return record.Subject?.toLowerCase().includes(term.toLowerCase());
  };

  private deleteRow(row: ProjectTemplateStandardJob) {
    this.currentDeleteRow = row;
    this.isConfirmDeleteVisible = true;
  }

  private delete(record: ProjectTemplateStandardJob) {
    const idx = this.linked.findIndex((item) => item === record);

    if (idx > -1) {
      const allRows = [...this.linked];
      allRows.splice(idx, 1);
      this.changed.emit(allRows);
    }
  }

  private add(records: ProjectTemplateStandardJob[] = []) {
    const allRows = [...this.linked, ...records];
    this.changed.emit(allRows);
  }

  private setGridRowActions(): void {
    this.gridRowActions.length = 0;

    this.gridRowActions.push({
      name: eGridRowActions.Delete
    });
  }

  private setGridInputs() {
    this.gridInputs = this.standardJobsGridService.getGridInputs();
  }
}
