import { BehaviorSubject } from 'rxjs';
import { IProjectGroupStatusDto } from './IProjectGroupStatusDto';

export class LeftPanelFilterService {
  constructor() {
    this.groupStatusSelected = {
      GroupProjectStatusId: '',
      ProjectTypeId: ''
    };

    this.groupStatusChanged = new BehaviorSubject<IProjectGroupStatusDto>(this.groupStatusSelected);

    this.vesselsChanged = new BehaviorSubject<number[]>([]);
  }

  public groupStatusSelected: IProjectGroupStatusDto;

  public groupStatusChanged: BehaviorSubject<IProjectGroupStatusDto>;

  public vesselsChanged: BehaviorSubject<number[]>;

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
