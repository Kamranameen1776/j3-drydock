import { Component, ElementRef, Input } from '@angular/core';
import { IAvatar } from 'jibe-components/lib/interfaces/avatar.interface';

export enum ICardStatus {
  InProgress = 'In Progress',
  Cancelled = 'Cancelled',
  Completed = 'Completed'
}

export interface ICard {
  title: string;
  description: string;
  date: Date;
  avatar?: IAvatar;
  status?: ICardStatus;
  selected?: boolean;
}

@Component({
  selector: 'jb-drydock-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent {
  @Input() data: ICard;
  @Input() selectable = false;

  get selected() {
    return this.selectable && this.data.selected;
  }

  constructor(private element: ElementRef) {}
}
