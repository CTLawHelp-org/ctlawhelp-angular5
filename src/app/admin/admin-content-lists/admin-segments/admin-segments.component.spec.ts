import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSegmentsComponent } from './admin-segments.component';

describe('AdminSegmentsComponent', () => {
  let component: AdminSegmentsComponent;
  let fixture: ComponentFixture<AdminSegmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSegmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSegmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
