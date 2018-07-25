import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageBlocksComponent } from './admin-manage-blocks.component';

describe('AdminManageBlocksComponent', () => {
  let component: AdminManageBlocksComponent;
  let fixture: ComponentFixture<AdminManageBlocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminManageBlocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
