import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Specification, SpecificationGridService, SpecificationType } from '../../services/specifications/specification.service';
import { JmsTechApiService, WebApiRequest } from 'jibe-components';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GridInputsWithDataObject } from '../../models/interfaces/grid-inputs';
import { SpecificationTopDetailsService, TopFieldsData } from '../../services/specifications/specification-top-details.service';

@Component({
  selector: 'jb-specification-page',
  templateUrl: './specification.component.html',
  styleUrls: ['./specification.component.scss']
})
export class SpecificationComponent implements OnInit, OnDestroy {
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

  private $destroySubject = new Subject();

  constructor(
    private specsService: SpecificationGridService,
    private jmsTechService: JmsTechApiService,
    private specsTopDetailsService: SpecificationTopDetailsService
  ) {}

  ngOnInit(): void {
    this.treeData = this.jmsTechService.getComponentFunctionTree;
    this.treeData.params = `vesselUid=3EEF2E1B-2533-45C7-82C7-C13D6AA79559`;
    this.callData(SpecificationType.ALL);
    this.specsTopDetailsService
      .getTopDetailsData()
      .pipe(takeUntil(this.$destroySubject))
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
      .pipe(takeUntil(this.$destroySubject))
      .subscribe((data) => {
        this.gridData = data;
        const statusCol = this.gridData.columns.find((col) => col.FieldName === 'status');
        statusCol.cellTemplate = this.statusTemplate;
      });
  }

  ngOnDestroy(): void {
    this.$destroySubject.next();
  }
}
