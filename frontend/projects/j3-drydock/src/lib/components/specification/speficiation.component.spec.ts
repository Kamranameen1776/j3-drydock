import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationComponent } from './specification.component';
import { SpecificationService } from './specification.service';

describe('SpecificationPageComponent', () => {
  let component: SpecificationComponent;
  let fixture: ComponentFixture<SpecificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificationComponent],
      providers: [SpecificationService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
