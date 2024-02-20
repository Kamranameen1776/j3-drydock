import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IJbDialog } from 'jibe-components';
import { getSmallPopup } from '../../../models/constants/popup';
import { BehaviorSubject } from 'rxjs';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { CreateProjectFromTemplateGridService } from './create-project-from-template-grid.service';

@Component({
  selector: 'jb-create-from-project-template-popup',
  templateUrl: './create-from-project-template-popup.component.html',
  styleUrls: ['./create-from-project-template-popup.component.scss']
})
export class CreateFromProjectTemplatePopupComponent implements OnInit {
  @Input() isOpen: boolean;
  @Input() vesselType: number;
  @Input() projectUid: string;

  @Output() closeDialog = new EventEmitter<boolean>();

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 1000, closableIcon: false, dialogHeader: 'Project Templates' };

  isPopupValid$ = new BehaviorSubject<boolean>(false);
  isSaving$ = new BehaviorSubject<boolean>(false);

  functionUIDs: string[] = [];
  gridData: GridInputsWithRequest;
  selected = [];

  constructor(private createProjectFromTemplateGridService: CreateProjectFromTemplateGridService) {}

  ngOnInit(): void {
    this.gridData = this.getData();
  }

  onCancel() {
    this.closePopup();
  }

  onSubmit() {
    this.save();
  }

  onSelect(rows: []) {
    this.selected = [];
    this.selected = rows;
    this.isPopupValid$.next(rows.length > 0);
  }

  private closePopup(isSaved = false) {
    this.closeDialog.emit(isSaved);
    this.isPopupValid$.next(false);
  }

  private save() {
    //TODO: Implement save logic
  }

  private getData() {
    return this.createProjectFromTemplateGridService.getGridInputs();
  }
}
