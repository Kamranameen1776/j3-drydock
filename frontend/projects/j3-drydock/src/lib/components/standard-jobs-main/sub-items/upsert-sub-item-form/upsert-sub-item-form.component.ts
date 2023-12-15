import { SubItem } from '../../../../models/interfaces/sub-items';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { FormGroup } from '@angular/forms';
import { FormModel, FormValues } from 'jibe-components';
import { SubItemEditFormService } from './sub-item-edit-form.service';
import { SubItemCreateFormService } from './sub-item-create-form.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jb-upsert-sub-item-form',
  templateUrl: './upsert-sub-item-form.component.html',
  styleUrls: ['./upsert-sub-item-form.component.scss']
})
export class UpsertSubItemFormComponent extends UnsubscribeComponent implements OnInit {
  @Input() item: SubItem;

  @ViewChild('treeTemplate', { static: true }) treeTemplate: TemplateRef<unknown>;

  @Output() formValid = new EventEmitter<boolean>();
  // can be used from parent to get formvalue when submitting
  public formGroup: FormGroup;

  formStructure: FormModel;
  formValues: FormValues;

  isFormValid = false;

  get isEditing() {
    return !!this.item;
  }

  constructor(
    private popupEditFormService: SubItemEditFormService,
    private popupCreateFormService: SubItemCreateFormService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initFormStructure();
    this.initFormValues();
  }

  dispatchForm(event: FormGroup) {
    this.formGroup = event;
    this.listenFormValid();
  }

  private initFormStructure() {
    if (this.isEditing) {
      this.formStructure = this.popupEditFormService.formStructure;
    } else {
      this.formStructure = this.popupCreateFormService.formStructure;
    }
  }

  private initFormValues() {
    if (this.isEditing) {
      this.formValues = this.popupEditFormService.formValues;
      const values = this.formValues.values[this.popupEditFormService.formId];
      Object.assign(values, this.item);
    } else {
      this.formValues = this.popupCreateFormService.formValues;
    }
  }

  private listenFormValid() {
    this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.isFormValid = this.formGroup.valid;
      this.formValid.emit(this.isFormValid);
    });
  }
}
