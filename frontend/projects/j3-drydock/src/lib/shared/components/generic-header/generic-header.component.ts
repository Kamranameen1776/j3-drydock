import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Optional,
  Output,
  Self,
  TemplateRef
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MenuItem } from 'primeng';
import { HeaderButton, HeaderSection, HeaderStatus } from './generic-header.interfaces';

@Component({
  selector: 'drydock-generic-header',
  templateUrl: './generic-header.component.html',
  styleUrls: ['./generic-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericHeaderComponent implements ControlValueAccessor {
  @Input() showThreeDot = true;
  @Input() status: HeaderStatus;
  @Input() editMode = false;
  @Input() sections: HeaderSection[] = [];
  @Input() buttons: HeaderButton[] = [
    {
      label: 'Save',
      buttonClass: 'save',
      buttonType: 'Button',
      command(event): void {
        this.submitButtonClick.emit(event);
      }
    }
  ];
  @Input() icons: {
    dg?: boolean;
    ihm?: boolean;
    ec?: boolean;
    critical?: boolean;
  } = {};
  @Input() settingsOptions: MenuItem[];
  @Output() fileSelected = new EventEmitter<File>();
  @Output() submitButtonClick = new EventEmitter<Event>();
  @ContentChild('headerImage') uploadImageTemplateRef: TemplateRef<any>;
  @ContentChild('headerButton') buttonTemplateRef: TemplateRef<any>;
  @ContentChild('headerSection') sectionTemplateRef: TemplateRef<any>;
  title: string;
  titleDisabled = false;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private cdr: ChangeDetectorRef
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  updateTitle(title: string): void {
    this.title = title;
    this.onChange(title);
  }

  onChange = (title: string) => {};

  onTouched = () => {};

  writeValue(title: string): void {
    this.title = title;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (title: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.titleDisabled = isDisabled;
  }
}
