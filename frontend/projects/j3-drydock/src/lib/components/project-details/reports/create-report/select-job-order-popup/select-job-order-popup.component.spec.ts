import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectJobOrderPopupComponent } from './select-job-order-popup.component';

describe('SelectJobOrderPopupComponent', () => {
  let component: SelectJobOrderPopupComponent;
  let fixture: ComponentFixture<SelectJobOrderPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectJobOrderPopupComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectJobOrderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
