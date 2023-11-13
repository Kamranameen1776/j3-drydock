import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SpecificationGridService, SpecificationType } from '../../../services/specifications/specification.service';
import { ApiRequestService, GridService, JmsTechApiService, WebApiRequest, eGridRefreshType, eJbTreeEvents } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { SpecificationCreateFormService } from '../specification-form/specification-create-form-service';
import { GrowlMessageService } from '../../../services/growl-message.service';

@Component({
  selector: 'jb-specifications',
  templateUrl: './specifications.component.html',
  styleUrls: ['./specifications.component.scss']
})
export class SpecificationsComponent extends UnsubscribeComponent implements OnInit {
  @ViewChild('statusTemplate', { static: true }) statusTemplate: TemplateRef<unknown>;
  treeData: WebApiRequest;
  gridData: GridInputsWithRequest;
  eventsList = [eJbTreeEvents.NodeSelect, eJbTreeEvents.Select, eJbTreeEvents.UnSelect];
  activeIndex = 0;
  componentUIDs: string[] = [];
  functionUIDs: string[] = [];
  types = [SpecificationType.ALL, SpecificationType.PMS, SpecificationType.FINDINGS, SpecificationType.STANDARD, SpecificationType.ADHOC];
  isCreatePopupVisible = false;

  growlMessage$ = this.growlMessageService.growlMessage$;

  createNewItems = [
    {
      label: 'Add from PMS',
      command: () => {
        this.openPopup();
      }
    },
    {
      label: 'Add from Findings',
      command: () => {
        this.openPopup();
      }
    },
    {
      label: 'Add from Standard Jobs',
      command: () => {
        this.openPopup();
      }
    },
    {
      label: 'Create Ad hoc',
      command: () => {
        this.openPopup();
      }
    }
  ];

  constructor(
    private specsService: SpecificationGridService,
    private jmsTechService: JmsTechApiService,
    private formService: SpecificationCreateFormService,
    private apiRequestService: ApiRequestService,
    private gridService: GridService,
    private growlMessageService: GrowlMessageService
  ) {
    super();
  }

  openPopup() {
    this.isCreatePopupVisible = true;
  }

  ngOnInit(): void {
    this.treeData = this.jmsTechService.getComponentFunctionTree;
    this.treeData.params = `vesselUid=3EEF2E1B-2533-45C7-82C7-C13D6AA79559`;
    this.gridData = this.getData();

    this.loadFunctions();
  }

  onCloseCreatePopup(hasSaved: boolean) {
    this.isCreatePopupVisible = false;

    if (hasSaved) {
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridData.gridName);
    }
  }

  loadFunctions(): void {
    this.apiRequestService.sendApiReq(this.treeData).subscribe((flatTree) => {
      this.formService.functionsFlatTree$.next(flatTree.records.map((leaf) => ({ ...leaf, selectable: true })));
    });
  }

  activeIndexChange(index: number) {
    this.activeIndex = index;
    this.gridData = this.getData();
  }

  setNodeData(event) {
    if (event?.type === eJbTreeEvents.NodeSelect) {
      if (event.payload.tag === 'component') {
        this.componentUIDs = [...this.componentUIDs, event.payload.uid];
        this.gridData = this.getData();
      } else if (event.payload.tag === 'function') {
        this.functionUIDs = [...this.functionUIDs, event.payload.uid];
        this.gridData = this.getData();
      }
    } else if (event?.type === eJbTreeEvents.UnSelect) {
      if (event.payload.tag === 'component') {
        this.componentUIDs = this.componentUIDs.filter((uid) => uid !== event.payload.uid);
      } else if (event.payload.tag === 'function') {
        this.functionUIDs = this.functionUIDs.filter((uid) => uid !== event.payload.uid);
        this.gridData = this.getData();
      }
    }
  }

  private getData() {
    const gridData = this.specsService.getGridData(null, this.componentUIDs, this.functionUIDs);
    const statusCol = gridData.columns.find((col) => col.FieldName === 'status');
    statusCol.cellTemplate = this.statusTemplate;
    return gridData;
  }
}
