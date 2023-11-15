import { YardsService } from './../../../../../services/yards.service';
import { YardLink, YardToLink } from './../../../../../models/interfaces/project-details';
import { GrowlMessageService } from './../../../../../services/growl-message.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { getSmallPopup } from '../../../../../models/constants/popup';
import { IJbDialog } from 'jibe-components';
import { UnsubscribeComponent } from '../../../../../shared/classes/unsubscribe.base';
import { finalize } from 'rxjs/operators';
import { SelectLinkYardGridComponent } from '../select-link-yard-grid/select-link-yard-grid.component';

@Component({
  selector: 'jb-drydock-link-yard-popup',
  templateUrl: './link-yard-popup.component.html',
  styleUrls: ['./link-yard-popup.component.scss']
})
export class LinkYardPopupComponent extends UnsubscribeComponent implements OnInit, OnChanges {
  @ViewChild('selectLinkYardGrid') selectLinkYardGrid: SelectLinkYardGridComponent;

  @Input() linked: YardLink[];

  @Input() projectId: string;

  @Input() isOpen: boolean;

  @Output() closeDialog = new EventEmitter<YardLink[]>();

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 800, dialogHeader: 'Link Yard' };

  okLabel = 'Add';

  isSaving: boolean;

  allYardsToLink: YardToLink[];

  private guidsToLink: string[];

  private linkedGuids: string[];

  constructor(
    private growlMessageService: GrowlMessageService,
    private yardsService: YardsService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.linked) {
      this.linkedGuids = this.linked?.map((yard) => yard.yardUid) ?? [];
      this.setAllYardsToLink(this.allYardsToLink);
    }
    if (changes.isOpen) {
      this.defaultSortYardsToLink();
    }
  }

  ngOnInit(): void {
    this.loadAllYardsToLink();
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

    // eslint-disable-next-line no-console
    console.log(this.selectLinkYardGrid);

    if (!guidsToLink || !guidsToLink.length) {
      this.closePopup();
      return;
    }

    this.yardsService
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

  private loadAllYardsToLink() {
    this.yardsService.getYardsToLink(this.projectId).subscribe((yards: YardToLink[]) => {
      this.setAllYardsToLink(yards ?? []);
      this.defaultSortYardsToLink();
    });
  }

  private setAllYardsToLink(yards: YardToLink[]) {
    if (!yards) {
      return;
    }

    this.allYardsToLink = yards.map((yard) => {
      const isLinked = this.linkedGuids.includes(yard.uid);
      return {
        ...yard,
        isLinked: isLinked,
        isSelected: isLinked
      };
    });
  }

  private defaultSortYardsToLink() {
    this.allYardsToLink?.sort((a, b) => a.yardName.localeCompare(b.yardName));
  }
}
