import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'jb-drydock-grid-cell-popover',
  templateUrl: './grid-cell-popover.component.html',
  styleUrls: ['./grid-cell-popover.component.scss']
})
export class GridCellPopoverComponent {
  @Input() value: string;

  constructor(private element: ElementRef) {}

  getTooltipValue(aValueEl: HTMLElement) {
    const isOverflowing = aValueEl.offsetWidth + 12 > this.element.nativeElement.offsetWidth;
    return isOverflowing ? this.value : '';
  }
}
