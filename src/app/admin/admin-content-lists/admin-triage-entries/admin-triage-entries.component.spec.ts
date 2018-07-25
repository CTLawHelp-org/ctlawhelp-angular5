import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTriageEntriesComponent } from './admin-triage-entries.component';

describe('AdminTriageEntriesComponent', () => {
  let component: AdminTriageEntriesComponent;
  let fixture: ComponentFixture<AdminTriageEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTriageEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTriageEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
