import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLabelsComponent } from './admin-labels.component';

describe('AdminLabelsComponent', () => {
  let component: AdminLabelsComponent;
  let fixture: ComponentFixture<AdminLabelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLabelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
