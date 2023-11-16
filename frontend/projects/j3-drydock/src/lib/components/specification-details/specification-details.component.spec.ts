import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationDetailsComponent } from './specification-details.component';

describe('SpecificationDetailsComponent', () => {
  let component: SpecificationDetailsComponent;
  let fixture: ComponentFixture<SpecificationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificationDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
