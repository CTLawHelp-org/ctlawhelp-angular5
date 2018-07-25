import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNodePageComponent } from './admin-node-page.component';

describe('AdminNodePageComponent', () => {
  let component: AdminNodePageComponent;
  let fixture: ComponentFixture<AdminNodePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNodePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
