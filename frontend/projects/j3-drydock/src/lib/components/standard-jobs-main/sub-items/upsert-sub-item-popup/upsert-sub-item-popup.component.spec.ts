import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertSubItemPopupComponent } from './upsert-sub-item-popup.component';

describe('UpsertSubItemPopupComponent', () => {
  let component: UpsertSubItemPopupComponent;
  let fixture: ComponentFixture<UpsertSubItemPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpsertSubItemPopupComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertSubItemPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
