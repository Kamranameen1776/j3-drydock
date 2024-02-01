import { YardsService } from '../../../../../services/yards.service';
import { YardLink, YardToLink } from '../../../../../models/interfaces/project-details';
import { GrowlMessageService } from '../../../../../services/growl-message.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { getSmallPopup } from '../../../../../models/constants/popup';
import { IJbDialog } from 'jibe-components';
import { UnsubscribeComponent } from '../../../../../shared/classes/unsubscribe.base';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jb-drydock-link-yard-popup',
  templateUrl: './link-yard-popup.component.html',
  styleUrls: ['./link-yard-popup.component.scss']
})
export class LinkYardPopupComponent extends UnsubscribeComponent implements OnInit, OnChanges {
  @Input() linked: YardLink[];

  @Input() projectId: string;

  @Input() isOpen: boolean;

  @Output() closeDialog = new EventEmitter<boolean>();

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

  onSelectedChanged(yardsToLink: YardToLink[]) {
    this.guidsToLink = yardsToLink.filter((yard) => !yard.isLinked).map((yard) => yard.uid);
  }

  private closePopup(isSaved = false) {
    this.closeDialog.emit(isSaved);
    this.guidsToLink = undefined;
  }

  private save() {
    this.isSaving = true;

    if (!this.guidsToLink || !this.guidsToLink.length) {
      this.closePopup();
      return;
    }

    this.yardsService
      .linkYardsToProject(this.projectId, this.guidsToLink)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe(
        () => {
          this.closePopup(true);
        },
        // eslint-disable-next-line rxjs/no-implicit-any-catch
        (err) => {
          this.growlMessageService.errorHandler(err);
        }
      );
  }

  private loadAllYardsToLink() {
    this.yardsService
      .getYardsToLink(this.projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((yards: YardToLink[]) => {
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
        isDisable: isLinked
      };
    });
  }

  private defaultSortYardsToLink() {
    this.allYardsToLink?.sort((a, b) => a.yardName.localeCompare(b.yardName));
  }
}
