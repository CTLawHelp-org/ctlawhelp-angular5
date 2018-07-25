import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFormNodeRefComponent } from './admin-form-node-ref.component';

describe('AdminFormNodeRefComponent', () => {
  let component: AdminFormNodeRefComponent;
  let fixture: ComponentFixture<AdminFormNodeRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFormNodeRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFormNodeRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
