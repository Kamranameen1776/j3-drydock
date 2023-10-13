import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertStandardJobFormComponent } from './upsert-standard-job-form.component';

describe('UpsertStandardJobFormComponent', () => {
  let component: UpsertStandardJobFormComponent;
  let fixture: ComponentFixture<UpsertStandardJobFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpsertStandardJobFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertStandardJobFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
