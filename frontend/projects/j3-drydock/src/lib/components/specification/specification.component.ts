import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Specification, SpecificationGridService, SpecificationType } from '../../services/specifications/specification.service';
import { JmsTechApiService, WebApiRequest } from 'jibe-components';
import { takeUntil } from 'rxjs/operators';
import { GridInputsWithDataObject } from '../../models/interfaces/grid-inputs';
import { SpecificationTopDetailsService, TopFieldsData } from '../../services/specifications/specification-top-details.service';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';

@Component({
  selector: 'jb-specification-page',
  templateUrl: './specification.component.html',
  styleUrls: ['./specification.component.scss']
})
export class SpecificationComponent extends UnsubscribeComponent implements OnInit {
  @ViewChild('statusTemplate', { static: true }) statusTemplate: TemplateRef<unknown>;
  treeData: WebApiRequest;
  gridData: GridInputsWithDataObject<Specification>;
  topDetailsData: TopFieldsData;
  activeIndex = 0;
  types = [
    SpecificationType.ALL,
    SpecificationType.PMS,
    SpecificationType.FINDINGS,
    SpecificationType.STANDARD,
    SpecificationType.ADHOC
  ];

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
    private jmsTechService: JmsTechApiService,
    private specsTopDetailsService: SpecificationTopDetailsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.treeData = this.jmsTechService.getComponentFunctionTree;
    this.treeData.params = `vesselUid=3EEF2E1B-2533-45C7-82C7-C13D6AA79559`;
    this.callData(SpecificationType.ALL);
    this.specsTopDetailsService
      .getTopDetailsData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.topDetailsData = data;
      });
  }

  activeIndexChange(index: number) {
    this.activeIndex = index;
    this.callData(this.types[index]);
  }

  private callData(type: SpecificationType) {
    this.specsService
      .getGridData('', type)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.gridData = data;
        const statusCol = this.gridData.columns.find((col) => col.FieldName === 'status');
        statusCol.cellTemplate = this.statusTemplate;
      });
  }
}
