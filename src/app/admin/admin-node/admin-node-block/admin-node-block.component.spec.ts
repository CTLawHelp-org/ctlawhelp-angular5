import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNodeBlockComponent } from './admin-node-block.component';

describe('AdminNodeBlockComponent', () => {
  let component: AdminNodeBlockComponent;
  let fixture: ComponentFixture<AdminNodeBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNodeBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNodeBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
