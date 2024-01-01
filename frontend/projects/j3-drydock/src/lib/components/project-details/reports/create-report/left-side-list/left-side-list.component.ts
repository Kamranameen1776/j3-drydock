import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { UnsubscribeComponent } from '../../../../../shared/classes/unsubscribe.base';
import { JobOrdersUpdatesDto } from '../../dto/JobOrdersUpdatesDto';

@Component({
  selector: 'jb-left-side-list',
  templateUrl: './left-side-list.component.html',
  styleUrls: ['./left-side-list.component.scss']
})
export class LeftSideListComponent extends UnsubscribeComponent implements OnInit, OnChanges {
  @Input() jobOrdersToLink: JobOrdersUpdatesDto[];
  @Output() openJobOrderDialog = new EventEmitter<boolean>();
  @Output() selectedSpecificationUid = new EventEmitter<string>();

  updates = [];
  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.jobOrdersToLink) {
      this.updates = changes.jobOrdersToLink.currentValue;
      this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {
    this.updates = this.jobOrdersToLink;
  }

  onAddClicked() {
    this.openJobOrderDialog.emit(true);
  }
  onUpdateClicked(SpecificationUid: string) {
    this.selectedSpecificationUid.emit(SpecificationUid);
  }
}
