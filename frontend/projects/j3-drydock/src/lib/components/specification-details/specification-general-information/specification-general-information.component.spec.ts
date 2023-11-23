import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationGeneralInformationComponent } from './specification-general-information.component';

describe('SpecificationGeneralInformationComponent', () => {
  let component: SpecificationGeneralInformationComponent;
  let fixture: ComponentFixture<SpecificationGeneralInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificationGeneralInformationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationGeneralInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
