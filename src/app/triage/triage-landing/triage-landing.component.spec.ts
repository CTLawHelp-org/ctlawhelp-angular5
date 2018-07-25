import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageLandingComponent } from './triage-landing.component';

describe('TriageLandingComponent', () => {
  let component: TriageLandingComponent;
  let fixture: ComponentFixture<TriageLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriageLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriageLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
