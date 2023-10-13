import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Specification, SpecificationService, SpecificationType } from './specification.service';
import { ITopSectionFieldSet, JmsTechApiService, WebApiRequest } from 'jibe-components';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GridInputsWithDataObject } from '../../models/interfaces/grid-inputs';

@Component({
  selector: 'jb-specification-page',
  templateUrl: './specification.component.html',
  styleUrls: ['./specification.component.scss']
})
export class SpecificationComponent implements OnInit, OnDestroy {
  @ViewChild('statusTemplate', { static: true }) statusTemplate: TemplateRef<any>;
  treeData: WebApiRequest;
  gridData: GridInputsWithDataObject<Specification>;
  activeIndex = 0;
  types = [
    SpecificationType.ALL,
    SpecificationType.PMS,
    SpecificationType.FINDINGS,
    SpecificationType.STANDARD,
    SpecificationType.ADHOC
  ];
  topFieldsConfig: ITopSectionFieldSet = {
    showStatus: true,
    showVessel: true,
    showJobCard: true,
    jobStatus: 'raise',
    statusClass: 'status-9',
    jobStatusDisplayName: 'Planned',
    typeIconClass: 'icons8-document-4',
    worklistType: 'drydock',
    worklistDisplayName: 'Dry dock',
    jobCardNo: 'DD-O-102',
    vesselName: 'Niara',
    jobTitle: 'Niara Dry dock 21-02-2022',
    bottomFieldsConfig: [
      {
        id: 'pm',
        label: 'Project Manager',
        isRequired: true,
        isEditable: true,
        type: 'text',
        getFieldName: 'pm',
        saveFieldName: 'pm',
        controlContent: {
          id: 'pm'
        }
      },
      {
        id: 'start_date',
        label: 'Start date',
        isRequired: true,
        isEditable: true,
        type: 'date',
        getFieldName: 'start_date',
        saveFieldName: 'start_date',
        formatDate: true,
        controlContent: {
          id: 'start_date',
          type: 'date',
          placeholder: 'Select',
          calendarWithInputIcon: true
        }
      },
      {
        id: 'due_date',
        label: 'Due date',
        isRequired: true,
        isEditable: true,
        type: 'date',
        getFieldName: 'due_date',
        saveFieldName: 'due_date',
        formatDate: true,
        controlContent: {
          id: 'due_date',
          type: 'date',
          placeholder: 'Select',
          calendarWithInputIcon: true
        }
      },
      {
        id: 'yard_name',
        label: 'Yard Name',
        isRequired: true,
        isEditable: true,
        type: 'text',
        getFieldName: 'yard_name',
        saveFieldName: 'yard_name',
        controlContent: {
          id: 'yard_name'
        }
      }
    ]
  };

  detailedData = {
    start_date: new Date(),
    due_date: new Date(),
    pm: 'Alexander Crisan',
    yard_name: 'Cochin Shipyard Limited'
  };

  canEdit = true;

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
    private specsService: SpecificationService,
    private jmsTechService: JmsTechApiService
  ) {}

  ngOnInit(): void {
    this.treeData = this.jmsTechService.getComponentFunctionTree;
    this.treeData.params = `vesselUid=3EEF2E1B-2533-45C7-82C7-C13D6AA79559`;
    this.callData(SpecificationType.ALL);
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
