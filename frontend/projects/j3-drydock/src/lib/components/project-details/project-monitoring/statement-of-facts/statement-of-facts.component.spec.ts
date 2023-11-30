import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementOfFactsComponent } from './statement-of-facts.component';

describe('StatementOfFactsComponent', () => {
  let component: StatementOfFactsComponent;
  let fixture: ComponentFixture<StatementOfFactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatementOfFactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementOfFactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
