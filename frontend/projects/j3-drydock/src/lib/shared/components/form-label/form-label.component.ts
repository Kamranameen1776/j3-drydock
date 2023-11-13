import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'drydock-form-label',
  templateUrl: './form-label.component.html',
  styleUrls: ['./form-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormLabelComponent {
  @Input() label: string;
  @Input() required = false;
  @Input() info: string;
  @Input() errorMessage: string;
}
