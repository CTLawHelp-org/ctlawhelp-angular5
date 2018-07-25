import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTermTriageEditComponent } from './admin-term-triage-edit.component';

describe('AdminTermTriageEditComponent', () => {
  let component: AdminTermTriageEditComponent;
  let fixture: ComponentFixture<AdminTermTriageEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTermTriageEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTermTriageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
