import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'jb-drydock-comparison-table-header',
  templateUrl: './comparison-table-header.component.html',
  styleUrls: ['./comparison-table-header.component.scss']
})
export class ComparisonTableHeaderComponent implements OnInit, OnChanges {
  @Input() yard; // TODO fixme type

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Method not implemented.');
  }

  ngOnInit(): void {
    console.log('Method not implemented.');
  }
}
