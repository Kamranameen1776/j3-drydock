import { Injectable } from '@angular/core';
import { ITopSectionFieldSet } from 'jibe-components';
import { Observable } from 'rxjs';

export interface TopFieldsData {
  topFieldsConfig: ITopSectionFieldSet;
  detailedData: Record<string, unknown>;
  canEdit: boolean;
}

@Injectable()
export class SpecificationTopDetailsService {
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

  getTopDetailsData(): Observable<TopFieldsData> {
    return new Observable((sub) => {
      sub.next({
        topFieldsConfig: this.topFieldsConfig,
        detailedData: this.detailedData,
        canEdit: this.canEdit
      });

      sub.complete();
    });
  }
}
