import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageInputComponent } from './triage-input.component';

describe('TriageInputComponent', () => {
  let component: TriageInputComponent;
  let fixture: ComponentFixture<TriageInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriageInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
