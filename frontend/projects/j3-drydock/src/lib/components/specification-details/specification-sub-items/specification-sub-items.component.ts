import { Component, Input, OnInit } from '@angular/core';
import { GetSpecificationDetailsDto } from '../../../models/dto/specification-details/GetSpecificationDetailsDto';
import { SpecificationDetailsSubItemsGridService } from '../../../services/specification-details/specification-details-sub-item.service';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { eGridRowActions } from 'jibe-components';
import { GridAction } from 'jibe-components/lib/grid/models/grid-action.model';

@Component({
  selector: 'jb-specification-sub-items',
  templateUrl: './specification-sub-items.component.html',
  styleUrls: ['./specification-sub-items.component.scss']
})
export class SpecificationSubItemsComponent implements OnInit {
  @Input() specificationDetailsInfo: GetSpecificationDetailsDto;
  gridData: GridInputsWithRequest;

  constructor(private subItemsGridService: SpecificationDetailsSubItemsGridService) {}

  ngOnInit(): void {
    this.gridData = this.getData();
  }

  actionHandler(action: GridAction<eGridRowActions, {}>): void {
    console.log(action);
  }

  private getData() {
    return this.subItemsGridService.getGridData(this.specificationDetailsInfo?.uid);
  }
}
