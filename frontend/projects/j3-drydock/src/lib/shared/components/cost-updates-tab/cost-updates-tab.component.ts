import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { CostUpdatesTabService, eCostUpdatesTabFields } from './cost-updates-tab.service';
import { GridInputsWithData } from '../../../models/interfaces/grid-inputs';
import { SpecificationSubItem } from '../../../models/interfaces/specification-sub-item';
import { SpecificationDetailsService } from '../../../services/specification-details/specification-details.service';
import { UnsubscribeComponent } from '../../classes/unsubscribe.base';
import { finalize, takeUntil } from 'rxjs/operators';
import { MoneyService } from '../../../services/money.service';

@Component({
  selector: 'jb-drydock-cost-updates-tab',
  templateUrl: './cost-updates-tab.component.html',
  styleUrls: ['./cost-updates-tab.component.scss'],
  providers: [CostUpdatesTabService]
})
export class CostUpdatesTabComponent extends UnsubscribeComponent implements OnInit {
  @Input() specificationUid: string;
  @Input() specificationName: string;

  @Output() wasChanged = new EventEmitter<boolean>();

  @ViewChild('quantityTemplate', { static: true }) quantityTemplate: TemplateRef<unknown>;
  @ViewChild('unitPriceTemplate', { static: true }) unitPriceTemplate: TemplateRef<unknown>;
  @ViewChild('discountPercentsTemplate', { static: true }) discountPercentsTemplate: TemplateRef<unknown>;
  @ViewChild('estimatedCostTemplate', { static: true }) estimatedCostTemplate: TemplateRef<unknown>;
  @ViewChild('costTemplate', { static: true }) costTemplate: TemplateRef<unknown>;

  gridInputs: GridInputsWithData<SpecificationSubItem>;
  items: SpecificationSubItem[];
  isLoadingItems = true;

  public changedRowsMap: Map<string, SpecificationSubItem> = new Map();

  constructor(
    private costUpdatesTabService: CostUpdatesTabService,
    private specificationDetailsService: SpecificationDetailsService,
    private moneyService: MoneyService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadGridItems();
    this.setGridInputs();
    this.wasChanged.emit(false);
  }

  private setGridInputs() {
    this.gridInputs = this.costUpdatesTabService.getGridInputs();

    this.setCellTemplate(this.quantityTemplate, eCostUpdatesTabFields.Quantity);
    this.setCellTemplate(this.unitPriceTemplate, eCostUpdatesTabFields.UnitPrice);
    this.setCellTemplate(this.discountPercentsTemplate, eCostUpdatesTabFields.DiscountPercents);
    this.setCellTemplate(this.estimatedCostTemplate, eCostUpdatesTabFields.EstimatesCost);
    this.setCellTemplate(this.costTemplate, eCostUpdatesTabFields.ActualCost);
  }

  private loadGridItems() {
    this.isLoadingItems = true;
    this.specificationDetailsService
      .getCostUpdates(this.specificationUid)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => {
          this.isLoadingItems = false;
        })
      )
      .subscribe((items) => {
        this.items = items.records || [];
      });
  }

  onInputChange(value: number, fieldName: string, row: SpecificationSubItem) {
    this.changedRowsMap.set(row.uid, row);
    this.wasChanged.emit(true);

    // TODO uncomment if need to calculate on the Front-End and check different scenarios of calculation
    // if (
    //   fieldName === eCostUpdatesTabFields.Quantity ||
    //   fieldName === eCostUpdatesTabFields.UnitPrice ||
    //   fieldName === eCostUpdatesTabFields.DiscountPercents
    // ) {
    //   this.calculateCost(row);
    // }
  }

  private setCellTemplate(template: TemplateRef<unknown>, fieldName: string) {
    const col = this.gridInputs.columns.find((col) => col.FieldName === fieldName);
    if (!col) {
      return;
    }
    col.cellTemplate = template;
  }

  private calculateCost(row: SpecificationSubItem) {
    const quantity = row.quantity || 0;
    const unitPrice = row.unitPrice || 0;
    const discountPercents = row.discount || 0;
    const withoutDiscount = quantity * unitPrice;
    const discount = (withoutDiscount * discountPercents) / 100;
    const cost = this.moneyService.defaultFormatter.format(withoutDiscount - discount);
    row.cost = cost;
  }
}
