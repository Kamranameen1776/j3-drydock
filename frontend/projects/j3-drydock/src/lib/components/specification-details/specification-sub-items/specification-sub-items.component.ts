import { Component, Input, OnInit } from '@angular/core';
import { GetSpecificationDetailsDto } from '../../../models/dto/specification-details/GetSpecificationDetailsDto';
import { SpecificationDetailsSubItemsGridService } from '../../../services/specification-details/specification-details-sub-item.service';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { JbButtonType } from 'jibe-components';
import { Router } from '@angular/router';

@Component({
  selector: 'jb-specification-sub-items',
  templateUrl: './specification-sub-items.component.html',
  styleUrls: ['./specification-sub-items.component.scss']
})
export class SpecificationSubItemsComponent implements OnInit {
  @Input() specificationDetailsInfo: GetSpecificationDetailsDto;

  gridData: GridInputsWithRequest;

  protected readonly JbButtonType = JbButtonType;

  public menuItems: { label: string; command: () => void }[] = [];

  constructor(
    private subItemsGridService: SpecificationDetailsSubItemsGridService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gridData = this.getData();

    this.menuItems = this.getAddSubItemsMenu();
  }

  private async linkRequisitions() {
    await this.router.navigate([`/procurement/general-browsing-page/specification-detail/${this.specificationDetailsInfo.uid}`], {
      queryParams: { vesselUid: this.specificationDetailsInfo?.VesselUid }
    });
  }

  private getAddSubItemsMenu() {
    return [
      {
        label: 'PMS / Findings',
        command: () => this.linkRequisitions()
      }
    ];
  }

  private getData() {
    return this.subItemsGridService.getGridData(this.specificationDetailsInfo?.uid);
  }
}
