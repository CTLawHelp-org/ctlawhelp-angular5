import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTriageOverviewComponent } from './admin-triage-overview.component';

describe('AdminTriageOverviewComponent', () => {
  let component: AdminTriageOverviewComponent;
  let fixture: ComponentFixture<AdminTriageOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTriageOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTriageOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
