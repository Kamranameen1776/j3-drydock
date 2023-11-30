import { Component, Input, OnInit } from '@angular/core';
import { GetSpecificationDetailsDto } from '../../../models/dto/specification-details/GetSpecificationDetailsDto';
import { SpecificationDetailsSubItemsGridService } from '../../../services/specification-details/specification-details-sub-item.service';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';

@Component({
  selector: 'jb-specification-sub-items',
  templateUrl: './specification-sub-items.component.html',
  styleUrls: ['./specification-sub-items.component.scss']
})
export class SpecificationSubItemsComponent implements OnInit {
  @Input() specificationDetailsInfo: GetSpecificationDetailsDto;

  constructor(private subItemsGridService: SpecificationDetailsSubItemsGridService) {}
  gridData: GridInputsWithRequest;

  ngOnInit(): void {
    this.gridData = this.getData();
  }

  private getData() {
    return this.subItemsGridService.getGridData(this.specificationDetailsInfo?.uid);
  }
}
