import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationSubItemsComponent } from './specification-sub-items.component';

describe('SpecificationSubItemsComponent', () => {
  let component: SpecificationSubItemsComponent;
  let fixture: ComponentFixture<SpecificationSubItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificationSubItemsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationSubItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
