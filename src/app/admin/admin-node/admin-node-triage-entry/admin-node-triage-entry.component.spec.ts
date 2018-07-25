import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNodeTriageEntryComponent } from './admin-node-triage-entry.component';

describe('AdminNodeTriageEntryComponent', () => {
  let component: AdminNodeTriageEntryComponent;
  let fixture: ComponentFixture<AdminNodeTriageEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNodeTriageEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNodeTriageEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
