import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNodePickerComponent } from './admin-node-picker.component';

describe('AdminNodePickerComponent', () => {
  let component: AdminNodePickerComponent;
  let fixture: ComponentFixture<AdminNodePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNodePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNodePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
