import { cloneDeep } from 'lodash';
/* eslint-disable dot-notation */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { UpsertStandardJobPopupComponent } from './upsert-standard-job-popup.component';
import { GrowlMessageService } from '../../../services/growl-message.service';
import { StandardJobResult } from '../../../models/interfaces/standard-jobs';
import { eModule } from '../../../models/enums/module.enum';
import { eFunction } from '../../../models/enums/function.enum';
import { JbAttachmentsFixDirective } from '../../../root-testing.module';
import { first } from 'rxjs/operators';

export interface UpsertStandardJobPopupComponentInputs {
  item: StandardJobResult;
  isOpen: boolean;
}

export const componentInputsDefault: UpsertStandardJobPopupComponentInputs = {
  item: undefined,
  isOpen: false
};

export const standardJobStub = {
  uid: '0A3F7B2C-7C41-4C21-BBDE-0017F786F155',
  function: 'gear > gear-child',
  functionUid: '34F1CA17-65BC-42B6-BD86-5C10E7C891C9',
  code: 'SJ-10002',
  scope: 'test',
  category: '-',
  doneBy: '-',
  doneByUid: null,
  materialSuppliedBy: 'supplied',
  materialSuppliedByUid: '8BA8F82C-8542-4BD8-95A1-2B2B75AF00EF',
  vesselTypeSpecific: false,
  description:
    '<p>test with image<img src="blob:http://localhost:4301/c9cae777-ea49-4add-9164-0f4fb3474015" class="e-rte-image e-imginline e-img-focus" width="auto" height="auto" style="min-width: 0px; max-width: 678px; min-height: 0px;" id="77083454-b62b-4dc0-b7f5-c52735f773aa"> <img src="blob:http://localhost:4301/7310c29a-5510-4e69-8ef7-8be08d012665" class="e-rte-image e-imginline e-resize" width="auto" height="auto" style="min-width: 0px; max-width: 615px; min-height: 0px;" id="e6b4f0f8-dff7-42c5-b390-ecf0e84872a3"> </p>',
  activeStatus: true,
  subject: {
    innerHTML: '<p class="jb_grid_mainText">test 1</p><p class="jb_grid_subText">gear > gear-child</p>',
    value: 'test 1',
    cellStyle: ''
  },
  inspectionId: [1, 2, 3],
  inspection: 'sss,Test 25,Test 24',
  vesselTypeId: [2, 3, 15],
  vesselType: 'CONTAINER,Bulk Carrier,Anchor Handling Tug Supply',
  subItems: [
    {
      uid: 'BB9FB19F-9D4A-4D2B-8F32-38AE3F64F94C',
      code: 83,
      subject: 'sdf',
      description: 'test 1',
      standardJobUid: '0A3F7B2C-7C41-4C21-BBDE-0017F786F155'
    },
    {
      uid: 'C540FECB-57A1-46A8-BECB-9871BE1D32A5',
      code: 218,
      subject: '11',
      description: 'test 2',
      standardJobUid: '0A3F7B2C-7C41-4C21-BBDE-0017F786F155'
    },
    {
      uid: '97A1814E-AF72-4520-A3F4-A167A6D9BD9C',
      code: 289,
      subject: 'test 3',
      description: null,
      standardJobUid: '0A3F7B2C-7C41-4C21-BBDE-0017F786F155'
    }
  ],
  hasSubItems: 'Yes',
  hasInspection: 'Yes'
};

describe('UpsertStandardJobPopupComponent', () => {
  let component: UpsertStandardJobPopupComponent;
  let fixture: ComponentFixture<UpsertStandardJobPopupComponent>;
  let componentInputs: UpsertStandardJobPopupComponentInputs;

  const setOnChanges = (
    newChange: UpsertStandardJobPopupComponentInputs = {
      isOpen: true,
      item: null
    }
  ) => {
    component.isOpen = newChange.isOpen;
    component.item = newChange.item;

    component.ngOnChanges({
      item: new SimpleChange(null, newChange.item, true),
      isOpen: new SimpleChange(null, newChange.isOpen, true)
    });
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [UpsertStandardJobPopupComponent, JbAttachmentsFixDirective],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [GrowlMessageService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertStandardJobPopupComponent);
    component = fixture.componentInstance;

    componentInputs = cloneDeep(componentInputsDefault);
    component.isOpen = componentInputs.isOpen;
    component.item = componentInputs.item;
  });

  afterEach(() => {
    if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
      (fixture.nativeElement as HTMLElement).remove();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set newItemUid  when isOpen changes and there is no item in input', () => {
    expect(component.newItemUid).toBeUndefined();
    setOnChanges();
    fixture.detectChanges();

    expect(component.newItemUid).toBeDefined();
  });

  it('should set dialog title to "Edit Standard Job" when isOpen changes and there is an item in input', () => {
    const newChange = {
      isOpen: true,
      item: cloneDeep(standardJobStub)
    };
    setOnChanges(newChange);
    fixture.detectChanges();

    expect(component.popupConfig.dialogHeader).toBe('Edit Standard Job');
  });

  it('should set dialog title to "Create New Standard Job" when isOpen changes and there is no item in input', () => {
    setOnChanges();
    fixture.detectChanges();

    expect(component.popupConfig.dialogHeader).toBe('Create New Standard Job');
  });

  it('should set Ok dialog button to "Save & Close" when isOpen changes and there is no item in input', () => {
    setOnChanges();
    fixture.detectChanges();

    expect(component.okLabel).toBe('Save & Close');
  });

  it('should set Ok dialog button to "Save & Close" when isOpen changes and there is an item in input', () => {
    const newChange = {
      isOpen: true,
      item: cloneDeep(standardJobStub)
    };
    setOnChanges(newChange);
    fixture.detectChanges();

    expect(component.okLabel).toBe('Save & Close');
  });

  it('should set attachmentConfig when isOpen changes', () => {
    expect(component.attachmentConfig).toBeUndefined();
    setOnChanges();
    fixture.detectChanges();

    expect(component.attachmentConfig.Module_Code).toBe(eModule.Project);
    expect(component.attachmentConfig.Function_Code).toBe(eFunction.StandardJob);
    expect(component.attachmentConfig.Key1).toBe(component['itemUid']);
  });

  it('should initialize changedSubItems when isOpen changes', () => {
    expect(component['changedSubItems']).toEqual([]);
    setOnChanges();
    fixture.detectChanges();

    expect(component['changedSubItems']).toEqual(component.item?.subItems ?? []);
  });

  it('should close popup on cancel', () => {
    // ngOnInit
    fixture.detectChanges();

    let isSaved = false;
    let wasCalled = false;
    component.closeDialog.pipe(first()).subscribe((wasSaved) => {
      isSaved = wasSaved;
      wasCalled = true;
    });

    fixture.detectChanges();

    component.onClosePopup();

    expect(wasCalled).toBe(true);
    expect(isSaved).toBe(false);
  });
});
