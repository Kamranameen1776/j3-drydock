import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SpecificationGridService, SpecificationType } from '../../services/specifications/specification.service';
import { JmsTechApiService, WebApiRequest, eJbTreeEvents } from 'jibe-components';
import { GridInputsWithRequest } from '../../models/interfaces/grid-inputs';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';

@Component({
  selector: 'jb-specification-details',
  templateUrl: './specification-details.component.html',
  styleUrls: ['./specification-details.component.scss']
})
export class SpecificationDetailsComponent extends UnsubscribeComponent implements OnInit {
  @ViewChild('statusTemplate', { static: true }) statusTemplate: TemplateRef<unknown>;
  treeData: WebApiRequest;
  gridData: GridInputsWithRequest;
  eventsList = [eJbTreeEvents.NodeSelect, eJbTreeEvents.Select, eJbTreeEvents.UnSelect];
  activeIndex = 0;
  componentUIDs: string[] = [];
  functionUIDs: string[] = [];
  types = [SpecificationType.ALL, SpecificationType.PMS, SpecificationType.FINDINGS, SpecificationType.STANDARD, SpecificationType.ADHOC];

  createNewItems = [
    {
      label: 'Add from PMS'
    },
    {
      label: 'Add from Findings'
    },
    {
      label: 'Add from Standard Jobs'
    },
    {
      label: 'Create Ad hoc'
    }
  ];

  constructor(
    private specsService: SpecificationGridService,
    private jmsTechService: JmsTechApiService
  ) {
    super();
  }

  ngOnInit(): void {
    this.treeData = this.jmsTechService.getComponentFunctionTree;
    this.treeData.params = `vesselUid=3EEF2E1B-2533-45C7-82C7-C13D6AA79559`;
    this.gridData = this.getData();
  }

  activeIndexChange(index: number) {
    this.activeIndex = index;
    this.gridData = this.getData();
  }

  setNodeData(event) {
    if (event?.type === eJbTreeEvents.NodeSelect) {
      if (event.payload.tag === 'component') {
        this.componentUIDs = [...this.componentUIDs, event.payload.uid];
        this.getData();
      } else if (event.payload.tag === 'function') {
        this.functionUIDs = [...this.functionUIDs, event.payload.uid];
        this.getData();
      }
    } else if (event?.type === eJbTreeEvents.UnSelect) {
      if (event.payload.tag === 'component') {
        this.componentUIDs = this.componentUIDs.filter((uid) => uid !== event.payload.uid);
      } else if (event.payload.tag === 'function') {
        this.functionUIDs = this.functionUIDs.filter((uid) => uid !== event.payload.uid);
        this.getData();
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
