import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTermNodeOrderComponent } from './admin-term-node-order.component';

describe('AdminTermNodeOrderComponent', () => {
  let component: AdminTermNodeOrderComponent;
  let fixture: ComponentFixture<AdminTermNodeOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTermNodeOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTermNodeOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
