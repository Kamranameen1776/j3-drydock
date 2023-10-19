import { Injectable } from '@angular/core';
import { Observable, merge, of } from 'rxjs';
import { Column, Filter, FilterListSet, GridRowActions, eFieldControlType, eGridAction } from 'jibe-components';
import { map } from 'rxjs/operators';
import { GridInputsWithDataObject } from '../../models/interfaces/grid-inputs';

export enum SpecificationType {
  ALL = 'All',
  PMS = 'PMS',
  FINDINGS = 'Findings',
  ADHOC = 'Ad hoc',
  STANDARD = 'Standard'
}

export enum SpecificationStatus {
  RAISED = 'Raised',
  APPROVED = 'Approved',
  COMPLETED = 'Completed'
}

export interface Specification {
  id: string;
  // Either must be an object
  // Depends on routing and backend implementation
  spec: string;
  subject: string;
  kind: Exclude<SpecificationType, SpecificationType.ALL>;
  category: string;
  done_by: string;
  inspection: string;
  status: SpecificationStatus;
}

@Injectable()
export class SpecificationGridService {
  // Will be replaced with WebApiRequest later, but will have same interface
  getData(projectId: string, kind: SpecificationType): Observable<Specification[]> {
    return of(
      [
        {
          id: 'GA0012',
          spec: 'SPEC-O-1860',
          subject: 'Inspection of the Fixed fire fighting system',
          kind: SpecificationType.STANDARD,
          category: 'Inspection',
          done_by: 'Technician',
          inspection: 'Class',
          due_date: new Date(),
          status: SpecificationStatus.RAISED
        },
        {
          id: 'DF0270',
          spec: 'SPEC-O-1861',
          subject: 'Hatch Coaming renewal',
          kind: SpecificationType.ADHOC,
          category: 'Steel Renewal',
          done_by: 'Yard',
          inspection: 'Owner',
          status: SpecificationStatus.APPROVED
        },
        {
          id: 'DF0345',
          spec: 'SPEC-O-1863',
          subject: 'Main Engine Air Cooler Pressure Test',
          kind: SpecificationType.PMS,
          category: 'Overhaul',
          done_by: 'Yard',
          inspection: 'Manufacturer',
          status: SpecificationStatus.COMPLETED
        }
      ].filter((spec) => {
        if (kind === SpecificationType.ALL) {
          return true;
        }

        return spec.kind === kind;
      }) as Specification[]
    );
  }

  getGridData(projectId: string, kind: SpecificationType): Observable<GridInputsWithDataObject<Specification>> {
    const gridParams: GridInputsWithDataObject<Specification> = {
      columns: this.columns,
      gridName: this.gridName,
      data: {
        records: [],
        count: 0
      },
      actions: this.gridActions,
      filters: this.filters,
      filtersLists: this.filtersLists
    };

    return merge(
      of(gridParams),
      this.getData(projectId, kind).pipe(
        map((data) => {
          return {
            ...gridParams,
            data: {
              records: data,
              count: data.length
            }
          } as GridInputsWithDataObject<Specification>;
        })
      )
    );
  }

  public readonly gridName: string = 'specificationGrid';

  private readonly columns: Column[] = [
    {
      DisableSort: true,
      DisplayText: 'Item No',
      FieldName: 'id',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '70px'
    },
    {
      DisableSort: true,
      DisplayText: 'Code',
      FieldName: 'spec',
      hyperlink: true,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '123px'
    },
    {
      DisableSort: true,
      DisplayText: 'Subject',
      FieldName: 'subject',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '395px'
    },
    {
      DisableSort: true,
      DisplayText: 'Item source',
      FieldName: 'kind',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '83px'
    },
    {
      DisableSort: true,
      DisplayText: 'Item category',
      FieldName: 'category',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '110px'
    },
    {
      DisableSort: true,
      DisplayText: 'Done by',
      FieldName: 'done_by',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '84px'
    },
    {
      DisableSort: true,
      DisplayText: 'Inspection / Survey',
      FieldName: 'inspection',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '130px'
    },
    {
      DisableSort: true,
      DisplayText: 'Status',
      FieldName: 'status',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '182px'
    }
  ];

  private readonly filters: Filter[] = [
    {
      DisplayText: 'Item Category',
      FieldName: 'category',
      placeholder: 'Select',
      default: true
    },
    {
      DisplayText: 'Inspection / Survey',
      FieldName: 'inspection',
      placeholder: 'Select',
      default: true
    },
    {
      DisplayText: 'Status',
      FieldName: 'status',
      type: 'multiselect',
      placeholder: 'Select',
      Active_Status: true,
      Active_Status_Config_Filter: true,
      ControlType: 'simple',
      Details: 'Status',
      DisplayCode: 'label',
      ValueCode: 'label',
      default: true
    },
    {
      DisplayText: 'Due Date Range From',
      FieldName: 'due_date',
      type: 'date',
      placeholder: 'Select',
      default: true
    }
  ];

  private filtersLists: FilterListSet = {
    status: {
      list: [
        {
          label: SpecificationStatus.APPROVED,
          value: SpecificationStatus.APPROVED
        },
        {
          label: SpecificationStatus.COMPLETED,
          value: SpecificationStatus.COMPLETED
        },
        {
          label: SpecificationStatus.RAISED,
          value: SpecificationStatus.RAISED
        }
      ],
      type: eFieldControlType.MultiSelect,
      odataKey: 'status'
    },
    inspection: {
      list: [
        {
          label: 'Owner',
          value: 'Owner'
        },
        {
          label: 'Manufacturer',
          value: 'Manafacturer'
        },
        {
          label: 'Class',
          value: 'Class'
        }
      ],
      type: eFieldControlType.MultiSelect,
      odataKey: 'inspection'
    },
    category: {
      list: [
        {
          label: 'Steel Renewal',
          value: 'Steel Renewal'
        },
        {
          label: 'Overhaul',
          value: 'Overhaul'
        },
        {
          label: 'Inspection',
          value: 'Inspection'
        }
      ],
      type: eFieldControlType.MultiSelect,
      odataKey: 'category'
    },
    due_date: {
      type: eFieldControlType.Date,
      odadaKey: 'due_date'
    }
  };

  private gridActions: GridRowActions[] = [
    { name: eGridAction.Edit, icon: 'icons8-edit' },
    { name: eGridAction.Delete, icon: 'icons8-delete' }
  ];
}
