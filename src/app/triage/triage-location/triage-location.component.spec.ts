import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageLocationComponent } from './triage-location.component';

describe('TriageLocationComponent', () => {
  let component: TriageLocationComponent;
  let fixture: ComponentFixture<TriageLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriageLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriageLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
