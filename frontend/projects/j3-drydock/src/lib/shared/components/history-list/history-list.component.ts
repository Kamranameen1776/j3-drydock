import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ICard } from '../item-card/item-card.component';

@Component({
  selector: 'jb-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent<T extends object = object> {
  @Input() data: ICard<T>[];
  @Output() changeSelected = new EventEmitter<ICard<T>>();

  onSelect(event: ICard<T>) {
    this.changeSelected.emit(event);
  }
}
