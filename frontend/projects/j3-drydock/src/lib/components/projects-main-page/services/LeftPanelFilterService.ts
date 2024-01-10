import { BehaviorSubject } from 'rxjs';
import { IProjectGroupStatusDto } from './IProjectGroupStatusDto';
import { IProjectStatusDto } from '../../../services/dtos/IProjectStatusDto';

export class LeftPanelFilterService {
  public groupStatusSelected: IProjectGroupStatusDto;
  public groupStatusChanged: BehaviorSubject<IProjectGroupStatusDto>;
  public vesselsChanged: BehaviorSubject<number[]>;
  public statusToFilterMap: { [key: string]: IProjectStatusDto[] } = {
    Planned: [
      {
        ProjectStatusId: 'RAISE',
        ProjectStatusName: 'Planned'
      }
    ],
    Active: [
      {
        ProjectStatusId: 'IN PROGRESS',
        ProjectStatusName: 'Yard Selection'
      }
    ],
    Completed: [
      {
        ProjectStatusId: 'COMPLETE',
        ProjectStatusName: 'Execution'
      },
      {
        ProjectStatusId: 'VERIFY',
        ProjectStatusName: 'Reporting'
      }
    ],
    Closed: [
      {
        ProjectStatusId: 'CLOSE',
        ProjectStatusName: 'Closed'
      }
    ]
  };

  constructor() {
    this.groupStatusSelected = {
      GroupProjectStatusId: '',
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
