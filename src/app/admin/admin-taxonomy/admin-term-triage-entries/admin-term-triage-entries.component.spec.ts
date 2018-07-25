import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTermTriageEntriesComponent } from './admin-term-triage-entries.component';

describe('AdminTermTriageEntriesComponent', () => {
  let component: AdminTermTriageEntriesComponent;
  let fixture: ComponentFixture<AdminTermTriageEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTermTriageEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTermTriageEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
