import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSideListComponent } from './left-side-list.component';

describe('LeftSideListComponent', () => {
  let component: LeftSideListComponent;
  let fixture: ComponentFixture<LeftSideListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftSideListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftSideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
