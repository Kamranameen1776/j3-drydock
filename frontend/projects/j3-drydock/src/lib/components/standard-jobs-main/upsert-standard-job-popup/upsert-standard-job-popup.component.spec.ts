/* eslint-disable dot-notation */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { UpsertStandardJobPopupComponent } from './upsert-standard-job-popup.component';
import { JibeComponentsModule } from 'jibe-components';
import { GrowlMessageService } from '../../../services/growl-message.service';

describe('UpsertStandardJobPopupComponent', () => {
  let component: UpsertStandardJobPopupComponent;
  let fixture: ComponentFixture<UpsertStandardJobPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [JibeComponentsModule],
      declarations: [UpsertStandardJobPopupComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [GrowlMessageService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertStandardJobPopupComponent);
    component = fixture.componentInstance;

    // ngOnInit
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
