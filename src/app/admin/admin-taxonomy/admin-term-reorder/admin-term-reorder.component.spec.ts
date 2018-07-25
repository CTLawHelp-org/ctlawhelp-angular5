import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTermReorderComponent } from './admin-term-reorder.component';

describe('AdminTermReorderComponent', () => {
  let component: AdminTermReorderComponent;
  let fixture: ComponentFixture<AdminTermReorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTermReorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTermReorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
