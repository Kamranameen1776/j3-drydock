import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { IAvatar } from 'jibe-components/lib/interfaces/avatar.interface';

export enum ICardStatus {
  InProgress = 'In Progress',
  Cancelled = 'Cancelled',
  Completed = 'Completed'
}

export interface ICard<T extends object = object> {
  title: string;
  description: string;
  date: Date;
  avatar?: IAvatar;
  status?: ICardStatus;
  selected?: boolean;
  data?: T;
}

@Component({
  selector: 'jb-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent<T extends object> {
  @Input() data: ICard<T>;
  @Input() selectable = false;
  @Output() changeSelected = new EventEmitter<ICard<T>>();

  cardStatus = ICardStatus;

  get selected() {
    return this.selectable && this.data.selected;
  }

  constructor(private element: ElementRef) {}

  onSelect() {
    this.changeSelected.emit(this.data);
  }
}
