import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IJbDialog } from 'jibe-components';
import { getSmallPopup } from '../../../models/constants/popup';
import { BehaviorSubject } from 'rxjs';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { CreateProjectFromTemplateGridService } from './create-project-from-template-grid.service';
import { ProjectTemplatesService } from '../../../services/project-templates.service';
import { GrowlMessageService } from '../../../services/growl-message.service';

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
  selectedProjectTemplate;
  showLoader = false;
  growlMessage$ = this.growlMessageService.growlMessage$;

  constructor(
    private createProjectFromTemplateGridService: CreateProjectFromTemplateGridService,
    private projectTemplatesService: ProjectTemplatesService,
    private growlMessageService: GrowlMessageService
  ) {}

  ngOnInit(): void {
    this.gridData = this.getData();
  }

  onCancel() {
    this.closePopup();
  }

  onSubmit() {
    this.save();
  }

  onSelect(data) {
    this.selectedProjectTemplate = data;
    this.isPopupValid$.next(data);
  }

  private closePopup(isSaved = false) {
    this.closeDialog.emit(isSaved);
    this.isPopupValid$.next(false);
  }

  private save() {
    this.showLoader = true;
    const projectTemplateUid = this.selectedProjectTemplate.ProjectTemplateUid;
    this.isSaving$.next(true);

    this.projectTemplatesService.createSpecificationFromProjectTemplate(this.projectUid, projectTemplateUid).subscribe({
      next: () => {
        this.closePopup(true);
        this.showLoader = false;
        this.isSaving$.next(false);
      },
      error: (error) => {
        this.growlMessageService.errorHandler(error);
        this.showLoader = false;
        this.isSaving$.next(false);
      }
    });
  }

  private getData() {
    return this.createProjectFromTemplateGridService.getGridInputs();
  }
}
