import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTermNsmiEditComponent } from './admin-term-nsmi-edit.component';

describe('AdminTermNsmiEditComponent', () => {
  let component: AdminTermNsmiEditComponent;
  let fixture: ComponentFixture<AdminTermNsmiEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTermNsmiEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTermNsmiEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
