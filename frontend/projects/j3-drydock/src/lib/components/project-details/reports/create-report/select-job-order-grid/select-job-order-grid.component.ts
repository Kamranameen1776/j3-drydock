import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { IJobOrderDto } from '../../../project-monitoring/job-orders/dtos/IJobOrderDto';
import { GridInputsWithRequest } from '../../../../../models/interfaces/grid-inputs';
import { SelectJobOrdersGridService } from './select-job-order-grid.service';
import { JobOrdersGridOdataKeys } from '../../../../../models/enums/JobOrdersGridOdataKeys';
import { IDailyReportsResultDto } from '../../dto/IDailyReportsResultDto';
import { GridComponent } from 'jibe-components';

@Component({
  selector: 'jb-select-job-order-grid',
  templateUrl: './select-job-order-grid.component.html',
  styleUrls: ['./select-job-order-grid.component.scss'],
  providers: [SelectJobOrdersGridService]
})
export class SelectJobOrderGridComponent implements OnInit {
  @ViewChild('lastUpdatedTemplate', { static: true }) lastUpdatedTemplate: TemplateRef<unknown>;
  @ViewChild('selectJobOrdersGrid') selectJobOrdersGrid: GridComponent;

  @Input() projectId: string;
  @Output() selectedChanged = new EventEmitter<IJobOrderDto[]>();
  readonly dateTimeFormat = this.selectJobOrdersGridService.dateTimeFormat;

  public gridInputs: GridInputsWithRequest;
  selected: IJobOrderDto[] = [];

  constructor(private selectJobOrdersGridService: SelectJobOrdersGridService) {}

  ngOnInit(): void {
    this.gridInputs = this.selectJobOrdersGridService.getGridInputs();
    this.setCellTemplate(this.lastUpdatedTemplate, 'LastUpdated');
  }

  onSelect(rows: IJobOrderDto[]) {
    this.selected = rows;
    this.selectedChanged.emit(this.selected);
  }

  public onMatrixRequestChanged() {
    this.selectJobOrdersGrid.odata.filter.eq(JobOrdersGridOdataKeys.ProjectUid, this.projectId);
  }

  private setCellTemplate(template: TemplateRef<unknown>, fieldName: string) {
    const col = this.gridInputs.columns.find((col) => col.FieldName === fieldName);
    if (!col) {
      return;
    }
    col.cellTemplate = template;
  }
}
