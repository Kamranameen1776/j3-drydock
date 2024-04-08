import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { IJbDialog } from 'jibe-components';
import { getSmallPopup } from '../../../models/constants/popup';
import { BehaviorSubject } from 'rxjs';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { CreateProjectFromTemplateGridService } from './create-project-from-template-grid.service';
import { ProjectTemplatesService } from '../../../services/project-templates.service';
import { GrowlMessageService } from '../../../services/growl-message.service';
import { eProjectTemplatesFields } from '../../../models/enums/project-templates.enum';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'jb-create-from-project-template-popup',
  templateUrl: './create-from-project-template-popup.component.html',
  styleUrls: ['./create-from-project-template-popup.component.scss']
})
export class CreateFromProjectTemplatePopupComponent implements OnInit {
  @ViewChild('lastUpdatedTemplate', { static: true }) lastUpdatedTemplate: TemplateRef<unknown>;

  @Input() isOpen: boolean;
  @Input() vesselType: number;
  @Input() projectUid: string;

  @Output() closeDialog = new EventEmitter<boolean>();

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 1000, dialogHeader: 'Project Templates' };

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
    this.setCellTemplate(this.lastUpdatedTemplate, eProjectTemplatesFields.LastUpdated);
  }

  onCancel() {
    this.closePopup();
  }

  onSubmit() {
    this.save();
  }

  onSelect(data) {
    this.selectedProjectTemplate = data;
    this.isPopupValid$.next(data !== null);
  }

  private closePopup(isSaved = false) {
    this.closeDialog.emit(isSaved);
    this.isPopupValid$.next(false);
  }

  private save() {
    this.showLoader = true;
    const projectTemplateUid = this.selectedProjectTemplate.ProjectTemplateUid;
    this.isSaving$.next(true);

    this.projectTemplatesService
      .createSpecificationFromProjectTemplate(this.projectUid, projectTemplateUid)
      .pipe(
        finalize(() => {
          this.showLoader = false;
          this.isSaving$.next(false);
        })
      )
      .subscribe(
        () => {
          this.closePopup(true);
        },
        (error) => {
          this.growlMessageService.errorHandler(error);
        }
      );
  }

  private getData() {
    return this.createProjectFromTemplateGridService.getGridInputs();
  }

  private setCellTemplate(template: TemplateRef<unknown>, fieldName: eProjectTemplatesFields) {
    const col = this.gridData.columns.find((col) => col.FieldName === fieldName);
    if (!col) {
      return;
    }
    col.cellTemplate = template;
  }
}
