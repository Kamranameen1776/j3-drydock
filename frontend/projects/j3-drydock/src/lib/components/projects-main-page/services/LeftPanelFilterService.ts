import { BehaviorSubject } from 'rxjs';
import { IProjectGroupStatusDto } from './IProjectGroupStatusDto';
import { IProjectStatusDto } from '../../../services/dtos/IProjectStatusDto';
import { eProjectStatus, eProjectWorkflowStatusAction } from '../../../models/enums/project-details.enum';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeftPanelFilterService {
  groupStatusSelected: IProjectGroupStatusDto = {
    ProjectTypeId: ''
  };
  groupStatusChanged = new BehaviorSubject<IProjectGroupStatusDto>(this.groupStatusSelected);
  vesselsChanged = new BehaviorSubject<number[]>([]);

  statusToFilterMap: { [key in eProjectStatus]: IProjectStatusDto[] } = {
    [eProjectStatus.Planned]: [
      {
        ProjectStatusId: eProjectWorkflowStatusAction.Raise,
        ProjectStatusName: 'Planned'
      }
    ],
    [eProjectStatus.Active]: [
      {
        ProjectStatusId: eProjectWorkflowStatusAction['In Progress'],
        ProjectStatusName: 'Yard Selection'
      }
    ],
    [eProjectStatus.Completed]: [
      {
        ProjectStatusId: eProjectWorkflowStatusAction.Complete,
        ProjectStatusName: 'Execution'
      },
      {
        ProjectStatusId: eProjectWorkflowStatusAction.Verify,
        ProjectStatusName: 'Reporting'
      }
    ],
    [eProjectStatus.Closed]: [
      {
        ProjectStatusId: eProjectWorkflowStatusAction.Close,
        ProjectStatusName: 'Closed'
      }
    ]
  };

  constructor() {}

  setGroupStatusSelected(groupStatusSelected: IProjectGroupStatusDto): void {
    this.groupStatusSelected = groupStatusSelected;

    this.groupStatusChanged.next(this.groupStatusSelected);
  }

  setVesselsSelected(vessels: number[]): void {
    this.vesselsChanged.next(vessels);
  }

  isGroupStatusSelected(groupStatusSelected: IProjectGroupStatusDto): boolean {
    return JSON.stringify(this.groupStatusSelected) === JSON.stringify(groupStatusSelected);
  }
}
