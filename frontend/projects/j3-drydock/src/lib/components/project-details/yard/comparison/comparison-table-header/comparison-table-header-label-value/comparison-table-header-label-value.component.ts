import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'jb-drydock-comparison-table-header-label-value',
  templateUrl: './comparison-table-header-label-value.component.html',
  styleUrls: ['./comparison-table-header-label-value.component.scss']
})
export class ComparisonTableHeaderLabelValueComponent {
  @Input() labelText: string;
  @Input() valueText: string;
  @Input() @HostBinding('class.row-big') isBig = false;
}
