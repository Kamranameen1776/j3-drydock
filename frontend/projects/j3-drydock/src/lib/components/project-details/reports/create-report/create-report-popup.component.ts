import { EditorConfig } from './../../../../models/interfaces/EditorConfig';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IJbDialog, IJbTextBox, JbDatePipe } from 'jibe-components';
import { getSmallPopup } from '../../../../models/constants/popup';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { GrowlMessageService } from '../../../../services/growl-message.service';
import { DailyReportsGridService } from '../reports.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { JobOrdersUpdatesDto } from '../dto/JobOrdersUpdatesDto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UTCAsLocal, localAsUTC } from '../../../../utils/date';
import { DailyReportCreate, DailyReportUpdate } from '../../../../models/interfaces/project-details';
import { eFunction } from '../../../../models/enums/function.enum';
import { eModule } from '../../../../models/enums/module.enum';

@Component({
  selector: 'jb-drydock-create-report-popup',
  templateUrl: './create-report-popup.component.html',
  styleUrls: ['./create-report-popup.component.scss'],
  providers: [JbDatePipe]
})
export class CreateReportPopupComponent extends UnsubscribeComponent implements OnInit {
  @Input() isOpen: boolean;
  @Input() reportUid: string;
  @Input() projectId: string;

  @Output() closeDialog = new EventEmitter<boolean>();

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 1200, dialogHeader: 'Daily Report' };

  saveLabel = 'Save';

  isSaving: boolean;

  isJobOrderPopupVisible: boolean;

  createReportForm = new FormGroup({
    reportName: new FormControl('', Validators.required)
  });

  reportNameText: IJbTextBox = {
    maxTextLength: 200,
    id: 'reportName',
    pValidateOnly: false,
    style: '',
    type: 'text',
    placeholder: 'Report Name',
    required: true
  };

  bodyForm: FormGroup = new FormGroup({
    body: new FormControl('')
  });

  bodyConfig: EditorConfig = {
    id: 'editorBody',
    maxLength: 8000,
    placeholder: '',
    crtlName: 'body',
    moduleCode: eModule.Project,
    functionCode: eFunction.SpecificationDetails,
    inlineMode: {
      enable: false,
      onSelection: true
    },
    tools: {
      items: [
        'Bold',
        'Italic',
        'Underline',
        'StrikeThrough',
        'FontName',
        'FontSize',
        'FontColor',
        'Formats',
        'Alignments',
        'Image',
        'ClearFormat',
        'FullScreen'
      ]
    }
  };

  private get isEditing() {
    return !!this.reportUid;
  }

  private get bodyControl() {
    return this.bodyForm.get('body') as FormControl;
  }

  constructor(
    private growlMessageService: GrowlMessageService,
    private reportsService: DailyReportsGridService,
    private jbDatePipe: JbDatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.isEditing) {
      this.getDailyReport();
    } else {
      this.createReportForm.controls.reportName.setValue('Daily Report ' + this.jbDatePipe.transform(new Date()));
    }
  }

  onClosePopup() {
    this.closePopup();
  }

  onSubmit() {
    this.save();
  }

  openJobOrderDialog() {
    this.isJobOrderPopupVisible = true;
  }

  onCloseJobOrderPopup(updates: JobOrdersUpdatesDto[]) {
    this.processSelectedUpdates(updates);
    this.isJobOrderPopupVisible = false;
  }

  private getDailyReport() {
    this.reportsService
      .getOneDailyReport(this.reportUid)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((reportInfo) => {
        this.createReportForm.get('reportName').setValue(reportInfo.reportName);
        this.bodyControl.setValue(reportInfo.body);
      });
  }

  private closePopup(isSaved = false) {
    this.closeDialog.emit(isSaved);
  }

  private save() {
    if (this.createReportForm.invalid) {
      this.growlMessageService.setErrorMessage('Report name is required');
      return;
    }

    this.isSaving = true;

    let payload: DailyReportCreate | DailyReportUpdate;

    if (this.isEditing) {
      payload = {
        DailyReportUid: this.reportUid,
        ProjectUid: this.projectId,
        ReportName: this.createReportForm.controls.reportName.value,
        Body: this.bodyControl.value
      };
    } else {
      payload = {
        ProjectUid: this.projectId,
        ReportName: this.createReportForm.controls.reportName.value,
        ReportDate: localAsUTC(new Date()),
        Body: this.bodyControl.value
      };
    }

    const request$ = this.isEditing
      ? this.reportsService.updateDailyReport(payload as DailyReportUpdate)
      : this.reportsService.createDailyReport(payload as DailyReportCreate);

    request$
      .pipe(
        finalize(() => {
          this.isSaving = false;
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        () => {
          const message = this.isEditing ? 'Daily report updated successfully' : 'Daily report created successfully';
          this.growlMessageService.setSuccessMessage(message);
          this.closePopup(true);
        },
        (err) => {
          if (err?.status === 422 && err?.error?.message) {
            this.growlMessageService.setErrorMessage(err.error.message);
          } else {
            this.growlMessageService.setErrorMessage('Server error occurred');
          }
        }
      );
  }

  private processSelectedUpdates(updates: JobOrdersUpdatesDto[]) {
    if (!updates) {
      return;
    }
    const selectedUpdates = [...updates];

    let bodyValue: string = this.bodyControl.value ?? '';

    selectedUpdates.forEach((update) => {
      bodyValue = bodyValue + this.createEditorUpdate(update);
    });

    this.bodyControl.setValue(bodyValue);
  }

  private createEditorUpdate(update: JobOrdersUpdatesDto) {
    return (
      this.stringInParagraph(`1. Specification Code: ${update.specificationCode}`) +
      this.stringInParagraph(`2. Specification Name: ${update.specificationSubject}`) +
      this.stringInParagraph(`3. Status: ${update.status}`) +
      this.stringInParagraph(`4. Start Date: ${this.jbDatePipe.transform(UTCAsLocal(update.specificationStartDate))}`) +
      this.stringInParagraph(`5. End Date: ${this.jbDatePipe.transform(UTCAsLocal(update.specificationEndDate))}`) +
      this.stringInParagraph(`6. Remarks: ${update.remark}`)
    );
  }

  private stringInParagraph(str: string) {
    return `<p>${str}</p>`;
  }
}
