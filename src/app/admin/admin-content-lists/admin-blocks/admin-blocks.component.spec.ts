import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBlocksComponent } from './admin-blocks.component';

describe('AdminBlocksComponent', () => {
  let component: AdminBlocksComponent;
  let fixture: ComponentFixture<AdminBlocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBlocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
