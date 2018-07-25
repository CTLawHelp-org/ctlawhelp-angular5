import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFormSegmentRefComponent } from './admin-form-segment-ref.component';

describe('AdminFormSegmentRefComponent', () => {
  let component: AdminFormSegmentRefComponent;
  let fixture: ComponentFixture<AdminFormSegmentRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFormSegmentRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFormSegmentRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
