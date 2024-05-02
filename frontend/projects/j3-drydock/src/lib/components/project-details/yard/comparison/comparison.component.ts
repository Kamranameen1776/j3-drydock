import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'jb-drydock-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss']
})
export class ComparisonComponent implements OnInit, OnChanges {
  yards = [{}, {}, {}]; // fixme type
  isTableInCollapsedMode = false;

  ngOnInit(): void {
    console.log('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Method not implemented.');
  }

  loadYards(): void {
    console.log('Method not implemented.');
  }
}
