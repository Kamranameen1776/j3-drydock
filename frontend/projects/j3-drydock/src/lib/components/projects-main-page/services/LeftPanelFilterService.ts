import { BehaviorSubject } from 'rxjs';
import { IProjectGroupStatusDto } from './IProjectGroupStatusDto';
import { IProjectStatusDto } from '../../../services/dtos/IProjectStatusDto';
import { eProjectStatus, eProjectWorkflowStatusAction } from '../../../models/enums/project-details.enum';

export class LeftPanelFilterService {
  public groupStatusSelected: IProjectGroupStatusDto;
  public groupStatusChanged: BehaviorSubject<IProjectGroupStatusDto>;
  public vesselsChanged: BehaviorSubject<number[]>;
  public statusToFilterMap: { [key in eProjectStatus]: IProjectStatusDto[] } = {
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

  constructor() {
    this.groupStatusSelected = {
      ProjectTypeId: ''
    };

    this.groupStatusChanged = new BehaviorSubject<IProjectGroupStatusDto>(this.groupStatusSelected);

    this.vesselsChanged = new BehaviorSubject<number[]>([]);
  }

  public setGroupStatusSelected(groupStatusSelected: IProjectGroupStatusDto): void {
    this.groupStatusSelected = groupStatusSelected;

    this.groupStatusChanged.next(this.groupStatusSelected);
  }

  public setVesselsSelected(vessels: number[]): void {
    this.vesselsChanged.next(vessels);
  }

  public isGroupStatusSelected(groupStatusSelected: IProjectGroupStatusDto): boolean {
    return JSON.stringify(this.groupStatusSelected) === JSON.stringify(groupStatusSelected);
  }
}
