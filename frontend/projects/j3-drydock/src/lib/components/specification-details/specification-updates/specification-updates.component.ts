import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GridService, IGridAction, eGridRefreshType, eGridRowActions } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { SpecificationUpdatesService } from './specification-updates.service';

@Component({
  selector: 'jb-drydock-specification-updates',
  templateUrl: './specification-updates.component.html',
  styleUrls: ['./specification-updates.component.scss'],
  providers: [SpecificationUpdatesService]
})
export class SpecificationUpdatesComponent extends UnsubscribeComponent implements OnInit {
  @Input() specificationId: string;

  @ViewChild('reportDateTemplate', { static: true }) reportDateTemplate: TemplateRef<unknown>;

  gridInputs: GridInputsWithRequest;

  isShowLoader = false;

  isShowDialog = false;

  row; // TODO fixme type

  readonly dateTimeFormat = this.specificationUpdatesService.dateTimeFormat;

  constructor(
    private gridService: GridService,
    private specificationUpdatesService: SpecificationUpdatesService
  ) {
    super();
  }

  // public shows that it is used from parent of this component
  public showDialog(value: boolean) {
    this.isShowDialog = value;
  }

  ngOnInit(): void {
    this.setGridData();
    this.setCellTemplate(this.reportDateTemplate, 'reportDate');
  }

  onGridAction({ type, payload }: IGridAction) {
    this.row = payload;

    switch (type) {
      case eGridRowActions.Edit:
        this.showDialog(true);
        break;
      default:
        return;
    }
  }

  onCloseDialog(hasSaved?: boolean) {
    this.showDialog(false);
    this.row = null;

    if (hasSaved) {
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridInputs.gridName);
    }
  }

  private setGridData() {
    this.gridInputs = this.specificationUpdatesService.getGridInputs(this.specificationId);
  }

  private setCellTemplate(template: TemplateRef<unknown>, fieldName: string) {
    const col = this.gridInputs.columns.find((col) => col.FieldName === fieldName);
    if (!col) {
      return;
    }
    col.cellTemplate = template;
  }
}
