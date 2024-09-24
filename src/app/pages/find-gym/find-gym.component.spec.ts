/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FindGymComponent } from './find-gym.component';

describe('FindGymComponent', () => {
  let component: FindGymComponent;
  let fixture: ComponentFixture<FindGymComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindGymComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindGymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
