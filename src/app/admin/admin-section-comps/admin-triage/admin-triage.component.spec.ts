import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTriageComponent } from './admin-triage.component';

describe('AdminTriageComponent', () => {
  let component: AdminTriageComponent;
  let fixture: ComponentFixture<AdminTriageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTriageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTriageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
