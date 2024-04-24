import { cloneDeep } from 'lodash';
/* eslint-disable dot-notation */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StandardJobResult } from '../../../models/interfaces/standard-jobs';
import { UpsertStandardJobFormComponent } from './upsert-standard-job-form.component';
import { FormModel } from 'jibe-components';
import { StandardJobUpsertFormService } from './standard-job-upsert-form.service';

export interface UpsertStandardJobFormComponentInputs {
  item: StandardJobResult;
  formStructure: FormModel;
}

export const componentInputsDefault: UpsertStandardJobFormComponentInputs = {
  item: {} as StandardJobResult,
  formStructure: undefined
};

describe('UpsertStandardJobFormComponent', () => {
  let component: UpsertStandardJobFormComponent;
  let fixture: ComponentFixture<UpsertStandardJobFormComponent>;
  let componentInputs: UpsertStandardJobFormComponentInputs;
  let initFormValuesSpy: jasmine.Spy;
  let setFunctionConfigSpy: jasmine.Spy;
  let popupFormService: StandardJobUpsertFormService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [UpsertStandardJobFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [StandardJobUpsertFormService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertStandardJobFormComponent);
    component = fixture.componentInstance;

    componentInputs = cloneDeep(componentInputsDefault);
    component.formStructure = component['popupFormService'].formStructure;
    component.item = componentInputs.item;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initFormValuesSpy = spyOn<any>(component, 'initFormValues').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFunctionConfigSpy = spyOn<any>(component, 'setFunctionConfig').and.callThrough();

    popupFormService = fixture.debugElement.injector.get(StandardJobUpsertFormService);
    // ngOnInit
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
      (fixture.nativeElement as HTMLElement).remove();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should descriptionEditorConfig be defined in ngOnInit', () => {
    expect(component.descriptionEditorConfig).toBeDefined();
  });

  it('should descriptionEditorConfig be set in ngOnInit', () => {
    expect(component.descriptionEditorConfig).toEqual(popupFormService.getDescriptionEditorConfig());
  });

  it('should scopeEditorConfig be defined in ngOnInit', () => {
    expect(component.scopeEditorConfig).toBeDefined();
  });

  it('should scopeEditorConfig be set in ngOnInit', () => {
    expect(component.scopeEditorConfig).toEqual(popupFormService.getScopeEditorConfig());
  });

  it('should formValues be defined in ngOnInit', () => {
    expect(component.formValues).toBeDefined();
  });

  it('should isEditing be true if item input is provided', () => {
    expect(component.isEditing).toBe(true);
  });

  it('should call initFormValues on ngOnInit 1 time', () => {
    expect(initFormValuesSpy.calls.count()).toBe(1, 'initFormValues called once onInit');
  });

  it('should call setFunctionConfig on ngOnInit 1 time', () => {
    expect(setFunctionConfigSpy.calls.count()).toBe(1, 'setFunctionConfig called once onInit');
  });
});
