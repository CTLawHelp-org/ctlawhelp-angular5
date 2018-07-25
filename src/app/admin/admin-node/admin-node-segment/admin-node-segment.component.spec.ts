import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNodeSegmentComponent } from './admin-node-segment.component';

describe('AdminNodeSegmentComponent', () => {
  let component: AdminNodeSegmentComponent;
  let fixture: ComponentFixture<AdminNodeSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNodeSegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNodeSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
