import { Component, Input, OnInit } from '@angular/core';
import { GetSpecificationDetailsDto } from '../../../models/dto/specification-details/GetSpecificationDetailsDto';
import { SpecificationDetailsSubItemsGridService } from '../../../services/specification-details/sub-item.service';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';

@Component({
  selector: 'jb-specification-sub-items',
  templateUrl: './specification-sub-items.component.html',
  styleUrls: ['./specification-sub-items.component.scss']
})
export class SpecificationSubItemsComponent implements OnInit {
  @Input() specificationDetailsInfo: GetSpecificationDetailsDto;

  constructor(private SubItemsGridService: SpecificationDetailsSubItemsGridService) {}
  gridData: GridInputsWithRequest;

  ngOnInit(): void {
    this.getData();
    this.gridData = this.getData();
    this.gridData.request = this.SubItemsGridService.getApiRequest(this.specificationDetailsInfo?.uid);
  }

  private getData() {
    const gridData = this.SubItemsGridService.getGridData();
    return gridData;
  }
}
