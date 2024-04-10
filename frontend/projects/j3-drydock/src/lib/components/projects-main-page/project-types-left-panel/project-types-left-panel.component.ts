import { Component, OnInit, ViewChild } from '@angular/core';
import { Datasource, IMultiSelectDropdown, JbMultiSelectDropdownComponent, SystemLevelFiltersService } from 'jibe-components';
import { ProjectsService } from '../../../services/ProjectsService';
import { IGroupProjectStatusesDto } from '../../../services/dtos/IGroupProjectStatusesDto';
import { LeftPanelFilterService } from '../services/LeftPanelFilterService';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { IGroupProjectStatusesCountsRequestDto } from '../../../services/dtos/IGroupProjectStatusesCountsRequestDto';

@Component({
  selector: 'jb-project-types-left-panel',
  templateUrl: './project-types-left-panel.component.html',
  styleUrls: ['./project-types-left-panel.component.scss']
})
export class ProjectTypesLeftPanelComponent extends UnsubscribeComponent implements OnInit {
  @ViewChild('vesselsSelectDropdownList') vesselsSelectDropdownList: JbMultiSelectDropdownComponent;

  projectsStatusFilters: IGroupProjectStatusesDto[] = null;

  constructor(
    private slfService: SystemLevelFiltersService,
    private projectsService: ProjectsService,
    private leftPanelFilterService: LeftPanelFilterService
  ) {
    super();
  }

  vesselsSelectDropdown: IMultiSelectDropdown = {
    label: 'Vessel_Name',
    value: 'Vessel_ID',
    isValidation: false,
    apiRequest: this.slfService.getSLFDetails(Datasource.Vessels),
    isslfapplied: true,
    isslfsession: false,
    selectedValues: [],
    selectedLabels: [],
    maxSelectedLabels: 5
  };

  ngOnInit(): void {
    this.projectsService
      .groupProjectStatusesLabels()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((groupProjectStatuses) => {
        this.setProjectStatusFilters(groupProjectStatuses);
        this.groupProjectStatusesCounts();
        this.vesselsSelectDropdownList.registerOnChange(this.onVesselsSelected.bind(this));
      });
    this.leftPanelFilterService.vesselsChanged.pipe(takeUntil(this.unsubscribe$)).subscribe((vesselsIds) => {
      this.groupProjectStatusesCounts(vesselsIds);
    });
  }

  private groupProjectStatusesCounts(vesselsIds: number[] | null = null) {
    const requestDto: IGroupProjectStatusesCountsRequestDto = {
      VesselsIds: vesselsIds
    };
    this.projectsService
      .groupProjectStatusesCounts(requestDto)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((groupProjectStatusesRes) => {
        this.setProjectStatusFilters(groupProjectStatusesRes);
      });
  }

  private setProjectStatusFilters(projectStatuses: { [key: string]: IGroupProjectStatusesDto }) {
    this.projectsStatusFilters = Object.keys(projectStatuses ?? {}).map((key) => {
      return { ...projectStatuses[key], ProjectTypeId: key };
    });
  }

  onVesselsSelected(vesselsIds: number[]) {
    this.leftPanelFilterService.setVesselsSelected(vesselsIds);
  }
}
