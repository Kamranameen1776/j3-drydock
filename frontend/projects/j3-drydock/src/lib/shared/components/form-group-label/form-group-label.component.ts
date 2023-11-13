import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'drydock-form-group-label',
  templateUrl: './form-group-label.component.html',
  styleUrls: ['./form-group-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGroupLabelComponent {
  @Input() label: string;
}
