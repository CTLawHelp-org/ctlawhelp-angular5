import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageSummaryComponent } from './triage-summary.component';

describe('TriageSummaryComponent', () => {
  let component: TriageSummaryComponent;
  let fixture: ComponentFixture<TriageSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriageSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriageSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
