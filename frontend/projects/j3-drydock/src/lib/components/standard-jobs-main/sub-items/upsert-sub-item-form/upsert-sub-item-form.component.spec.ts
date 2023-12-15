import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertSubItemFormComponent } from './upsert-sub-item-form.component';

describe('UpsertSubItemFormComponent', () => {
  let component: UpsertSubItemFormComponent;
  let fixture: ComponentFixture<UpsertSubItemFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpsertSubItemFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertSubItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
