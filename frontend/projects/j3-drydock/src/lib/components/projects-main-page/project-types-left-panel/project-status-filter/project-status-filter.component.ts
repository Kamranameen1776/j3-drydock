import { Component, Input, OnInit } from '@angular/core';
import { LeftPanelFilterService } from '../../services/LeftPanelFilterService';
import { IGroupProjectStatusesDto } from '../../../../services/dtos/IGroupProjectStatusesDto';

@Component({
  selector: 'jb-project-status-filter',
  templateUrl: './project-status-filter.component.html',
  styleUrls: ['./project-status-filter.component.scss']
})
export class ProjectStatusFilterComponent implements OnInit {
  @Input()
  projectStatusFilter: IGroupProjectStatusesDto = null;

  constructor(private leftPanelFilterService: LeftPanelFilterService) {}

  ngOnInit(): void {
    return;
  }

  onGroupStatusClicked(projectTypeId: string, groupProjectStatusId: string) {
    this.leftPanelFilterService.setGroupStatusSelected({
      ProjectTypeId: projectTypeId,
      GroupProjectStatusId: groupProjectStatusId
    });
  }

  isActive(projectTypeId: string, groupProjectStatusId: string): boolean {
    return this.leftPanelFilterService.isGroupStatusSelected({
      ProjectTypeId: projectTypeId,
      GroupProjectStatusId: groupProjectStatusId
    });
  }
}
