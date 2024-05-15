import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Datasource, IMultiSelectDropdown, JbMultiSelectDropdownComponent, SystemLevelFiltersService } from 'jibe-components';
import { ProjectsService } from '../../../services/ProjectsService';
import { IGroupProjectStatusesDto } from '../../../services/dtos/IGroupProjectStatusesDto';
import { LeftPanelFilterService } from '../services/LeftPanelFilterService';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { IGroupProjectStatusesCountsRequestDto } from '../../../services/dtos/IGroupProjectStatusesCountsRequestDto';
import { BroadcastChannelService } from '../../../services/broadcast-channel.service';

@Component({
  selector: 'jb-project-types-left-panel',
  templateUrl: './project-types-left-panel.component.html',
  styleUrls: ['./project-types-left-panel.component.scss']
})
export class ProjectTypesLeftPanelComponent extends UnsubscribeComponent implements OnInit, OnDestroy {
  @ViewChild('vesselsSelectDropdownList') vesselsSelectDropdownList: JbMultiSelectDropdownComponent;

  projectsStatusFilters: IGroupProjectStatusesDto[] = null;

  constructor(
    private slfService: SystemLevelFiltersService,
    private projectsService: ProjectsService,
    private leftPanelFilterService: LeftPanelFilterService,
    private broadcastChannelService: BroadcastChannelService
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
    this.load();

    this.listenRefreshGridFromOutside();

    this.leftPanelFilterService.vesselsChanged.pipe(takeUntil(this.unsubscribe$)).subscribe((vesselsIds) => {
      this.groupProjectStatusesCounts(vesselsIds);
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.broadcastChannelService.projectChannel.removeEventListener('message', this.refreshProjectListener);
  }

  onVesselsSelected(vesselsIds: number[]) {
    this.leftPanelFilterService.setVesselsSelected(vesselsIds);
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

  private load() {
    this.projectsService
      .groupProjectStatusesLabels()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((groupProjectStatuses) => {
        this.setProjectStatusFilters(groupProjectStatuses);
        this.groupProjectStatusesCounts();
        this.vesselsSelectDropdownList.registerOnChange(this.onVesselsSelected.bind(this));
      });
  }

  private listenRefreshGridFromOutside() {
    this.broadcastChannelService.projectChannel.addEventListener('message', this.refreshProjectListener);
  }

  private refreshProjectListener = (event) => {
    if (event.data) {
      this.load();
    }
  };
}
