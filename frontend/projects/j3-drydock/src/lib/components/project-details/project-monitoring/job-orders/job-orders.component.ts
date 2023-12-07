import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { JobOrdersGridService } from './JobOrdersGridService';
import { eGridRowActions, GridAction, GridComponent } from 'jibe-components';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { GridInputsWithRequest } from '../../../../models/interfaces/grid-inputs';
import { JobOrdersService } from '../../../../services/project-monitoring/job-orders/JobOrdersService';
import { IJobOrderDto } from './dtos/IJobOrderDto';
import { JobOrdersGridOdataKeys } from '../../../..//models/enums/JobOrdersGridOdataKeys';

@Component({
  selector: 'jb-job-orders',
  templateUrl: './job-orders.component.html',
  styleUrls: ['./job-orders.component.scss'],
  providers: [JobOrdersGridService]
})
export class JobOrdersComponent extends UnsubscribeComponent implements OnInit {
  @Input() projectId: string;

  @ViewChild('jobOrdersGrid')
  jobOrdersGrid: GridComponent;

  public gridInputs: GridInputsWithRequest;

  constructor(
    private jobOrdersGridService: JobOrdersGridService,
    private jobOrdersService: JobOrdersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setGridInputs();
  }

  public onGridAction({ type }: GridAction<string, string>, jobOrderDto: IJobOrderDto): void {
    if (type === eGridRowActions.Delete) {
      if (!jobOrderDto) {
        throw new Error('IJobOrderDto is null');
      }
      // TODO: implement
    } else if (type === eGridRowActions.Edit) {
      if (!jobOrderDto) {
        throw new Error('IJobOrderDto is null');
      }

      // TODO: implement
    } else if (type === this.gridInputs.gridButton.label) {
      // TODO: implement
    }
  }

  public onMatrixRequestChanged() {
    this.jobOrdersGrid.odata.filter.eq(JobOrdersGridOdataKeys.ProjectUid, this.projectId);
  }

  private setGridInputs() {
    this.gridInputs = this.jobOrdersGridService.getGridInputs();
    this.setGridActions();
  }

  private setGridActions() {
    this.gridInputs.actions.length = 0;

    this.gridInputs.actions.push({
      name: eGridRowActions.Edit,
      label: 'Update Job'
    });
  }
}
