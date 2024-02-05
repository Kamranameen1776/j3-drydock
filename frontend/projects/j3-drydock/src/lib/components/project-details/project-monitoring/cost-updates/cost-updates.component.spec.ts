import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostUpdatesComponent } from './cost-updates.component';

describe('CostUpdatesComponent', () => {
  let component: CostUpdatesComponent;
  let fixture: ComponentFixture<CostUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CostUpdatesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
