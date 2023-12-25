import { Error } from './dtos/Error';
import { IJobOrderFormDto } from './dtos/IJobOrderFormDto';
import { IJobOrderFormResultDto } from './dtos/IJobOrderFormResultDto';
import { EventEmitter } from '@angular/core';

export interface IJobOrdersFormComponent {
  /**
   * Initialize the form with the given values
   * @param jobOrderFormDto initial values for the form
   */
  init(jobOrderFormDto: IJobOrderFormDto): void;

  /**
   * Save the form values
   */
  save(): IJobOrderFormResultDto | Error;

  /**
   * Every time values at the form change, this event is emitted
   */
  onValueChangesIsFormValid: EventEmitter<boolean>;
}
