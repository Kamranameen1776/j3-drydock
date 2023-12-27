import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectJobOrderGridComponent } from './select-job-order-grid.component';

describe('SelectJobOrderGridComponent', () => {
  let component: SelectJobOrderGridComponent;
  let fixture: ComponentFixture<SelectJobOrderGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectJobOrderGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectJobOrderGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
