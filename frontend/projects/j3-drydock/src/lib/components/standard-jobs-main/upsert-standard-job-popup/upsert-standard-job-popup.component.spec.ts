import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertStandardJobPopupComponent } from './upsert-standard-job-popup.component';

describe('UpsertStandardJobPopupComponent', () => {
  let component: UpsertStandardJobPopupComponent;
  let fixture: ComponentFixture<UpsertStandardJobPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpsertStandardJobPopupComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertStandardJobPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
