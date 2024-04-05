import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DispatchAction, GridAction, GridRowActions, GridService, eGridEvents, eGridRowActions } from 'jibe-components';
import { GridInputsWithData } from '../../../models/interfaces/grid-inputs';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { getSmallPopup } from '../../../models/constants/popup';
import { filter, map, takeUntil } from 'rxjs/operators';
import { ProjectTemplateStandardJob, ProjectTemplateStandardJobsGridService } from './project-template-standard-jobs-grid.service';
import { eAddSpecificationFromStandardJobPopupType } from '../../project-details/add-specification-from-standard-job-popup/add-specification-from-standard-job-popup.component';
import { Observable } from 'rxjs';
import { FunctionsFlatTreeNode, ShellFunctionTreeResponseNode } from '../../../models/interfaces/functions-tree-node';
import { FunctionsService } from '../../../services/functions.service';
import { StandardJobResult } from '../../../models/interfaces/standard-jobs';
import { GrowlMessageService } from '../../../services/growl-message.service';

@Component({
  selector: 'jb-drydock-project-template-standard-jobs',
  templateUrl: './project-template-standard-jobs.component.html',
  styleUrls: ['./project-template-standard-jobs.component.scss'],
  providers: [ProjectTemplateStandardJobsGridService]
})
export class ProjectTemplateStandardJobsComponent extends UnsubscribeComponent implements OnInit, OnChanges {
  @Input() linked: ProjectTemplateStandardJob[];

  @Input() templateUid: string;

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
    dialogHeader: 'Delete Standard Job'
  };

  isConfirmDeleteVisible = false;

  addPopupType = eAddSpecificationFromStandardJobPopupType.ProjectTemplate;

  treeData$: Observable<FunctionsFlatTreeNode[]>;

  linkedUids: string[];

  // eslint-disable-next-line dot-notation
  private maxJobsNum = window['environment']?.['maxStandardJobsNum'] || 75;

  private vesselNode: Pick<ShellFunctionTreeResponseNode, 'uid' | 'parent_function_uid' | 'name' | 'expanded'> = {
    uid: 'vesselParent',
    name: 'Functions',
    parent_function_uid: '0',
    expanded: true
  };

  constructor(
    private standardJobsGridService: ProjectTemplateStandardJobsGridService,
    private gridService: GridService,
    private functionsService: FunctionsService,
    private growlMessageService: GrowlMessageService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.linked) {
      this.linkedUids = (this.linked || []).map((item) => item.StandardJobUid);
    }
  }

  ngOnInit(): void {
    this.treeData$ = this.functionsService.getFunctions(this.vesselNode.uid).pipe(
      map((functions) => {
        functions.push(this.functionsService.createFlatNode(this.vesselNode));
        return functions.map((func) => this.functionsService.calculateSelectable(func, functions));
      }),
      takeUntil(this.unsubscribe$)
    );
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

  onCloseAddPopup(selected: StandardJobResult[]) {
    const hasSaved = !!selected?.length;

    const linkedNum = this.linked?.length || 0;
    if (hasSaved && linkedNum + selected.length > this.maxJobsNum) {
      this.growlMessageService.setErrorMessage(`Project template cannot contain more than ${this.maxJobsNum} standard jobs`);
      return;
    }

    if (hasSaved) {
      this.add(selected.map((item) => this.mapStandardJobTOProjectTemplateStandardJob(item)));
    }
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
    this.linkedUids = allRows.map((item) => item.StandardJobUid);
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

  private mapStandardJobTOProjectTemplateStandardJob(standardJob: StandardJobResult): ProjectTemplateStandardJob {
    return {
      ProjectTemplateUid: this.templateUid,
      StandardJobUid: standardJob.uid,
      ItemNumber: standardJob.code,
      Subject: standardJob.subject?.value || '',
      VesselType: standardJob.vesselType,
      VesselTypeId: standardJob.vesselTypeId,
      InspectionSurvey: standardJob.inspection,
      InspectionSurveyId: standardJob.inspectionId,
      DoneBy: standardJob.doneBy,
      DoneByUid: standardJob.doneByUid,
      MaterialSuppliedBy: standardJob.materialSuppliedBy,
      MaterialSuppliedByUid: standardJob.materialSuppliedByUid
    };
  }
}
