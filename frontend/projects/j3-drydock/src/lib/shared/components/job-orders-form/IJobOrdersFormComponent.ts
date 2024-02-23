import { FormGroup } from '@angular/forms';
import { Error } from './dtos/Error';
import { IJobOrderFormDto } from './dtos/IJobOrderFormDto';
import { IJobOrderFormResultDto } from './dtos/IJobOrderFormResultDto';
import { EventEmitter } from '@angular/core';

export interface IJobOrdersFormComponent {
  /**
   * Save the form values
   */
  save(): IJobOrderFormResultDto | Error;

  /**
   * Every time values at the form change, this event is emitted
   */
  onValueChangesIsFormValid: EventEmitter<boolean>;

  onValueChangesIsForm: EventEmitter<FormGroup>;
  onRemarkValueChanges: EventEmitter<string>;
}
