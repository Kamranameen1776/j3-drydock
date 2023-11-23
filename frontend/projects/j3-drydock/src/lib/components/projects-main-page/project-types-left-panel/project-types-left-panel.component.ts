import { Component, OnInit, ViewChild } from '@angular/core';
import { Datasource, IMultiSelectDropdown, JbMultiSelectDropdownComponent, SystemLevelFiltersService } from 'jibe-components';
import { ProjectsService } from '../../../services/ProjectsService';
import { IGroupProjectStatusesDto } from '../../../services/dtos/IGroupProjectStatusesDto';
import { LeftPanelFilterService } from '../services/LeftPanelFilterService';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';

@Component({
  selector: 'jb-project-types-left-panel',
  templateUrl: './project-types-left-panel.component.html',
  styleUrls: ['./project-types-left-panel.component.scss']
})
export class ProjectTypesLeftPanelComponent extends UnsubscribeComponent implements OnInit {
  @ViewChild('vesselsSelectDropdownList')
  vesselsSelectDropdownList: JbMultiSelectDropdownComponent;

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
      .groupProjectStatuses()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((groupProjectStatuses: IGroupProjectStatusesDto[]) => {
        this.projectsStatusFilters = groupProjectStatuses;

        this.vesselsSelectDropdownList.registerOnChange(this.onVesselsSelected.bind(this));
      });
  }

  onVesselsSelected(vesselsIds: number[]) {
    this.leftPanelFilterService.setVesselsSelected(vesselsIds);
  }
}
