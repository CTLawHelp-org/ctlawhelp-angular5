import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTermMenuEditComponent } from './admin-term-menu-edit.component';

describe('AdminTermMenuEditComponent', () => {
  let component: AdminTermMenuEditComponent;
  let fixture: ComponentFixture<AdminTermMenuEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTermMenuEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTermMenuEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
