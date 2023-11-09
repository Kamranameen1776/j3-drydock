import { YardLink } from './../../../../../models/interfaces/project-details';
import { ProjectDetailsService } from './../../../../../services/project-details.service';
import { GrowlMessageService } from './../../../../../services/growl-message.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getSmallPopup } from '../../../../../models/constants/popup';
import { IJbDialog } from 'jibe-components';
import { UnsubscribeComponent } from '../../../../../shared/classes/unsubscribe.base';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'jb-drydock-link-yard-popup',
  templateUrl: './link-yard-popup.component.html',
  styleUrls: ['./link-yard-popup.component.scss']
})
export class LinkYardPopupComponent extends UnsubscribeComponent {
  @Input() linkedGuids: string[];

  @Input() projectId: string;

  @Input() isOpen: boolean;

  @Output() closeDialog = new EventEmitter<YardLink[]>();

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 800, dialogHeader: 'Link Yard' };

  okLabel = 'Save';

  isSaving: boolean;

  private guidsToLink: string[];

  constructor(
    private growlMessageService: GrowlMessageService,
    private projectDetailsService: ProjectDetailsService
  ) {
    super();
  }

  onClosePopup() {
    this.closePopup();
  }

  onOkPopup() {
    this.save();
  }

  onSelectedChanged(guidsToLink: string[]) {
    this.guidsToLink = guidsToLink;
  }

  private closePopup(saved?: YardLink[]) {
    this.closeDialog.emit(saved);
    this.guidsToLink = undefined;
  }

  private save() {
    this.isSaving = true;

    const guidsToLink = this.guidsToLink ?? this.linkedGuids;

    if (!guidsToLink || !guidsToLink.length) {
      this.closePopup();
      return;
    }

    this.projectDetailsService
      .linkYardsToProject(this.projectId, guidsToLink)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe(
        (yards: YardLink[]) => {
          this.closePopup(yards);
        },
        (err) => {
          if (err?.status === 422 && err?.error?.message) {
            this.growlMessageService.setErrorMessage(err.error.message);
          } else {
            this.growlMessageService.setErrorMessage('Server error occured');
          }
        }
      );
  }
}
