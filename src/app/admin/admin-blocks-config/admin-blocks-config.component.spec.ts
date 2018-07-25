import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBlocksConfigComponent } from './admin-blocks-config.component';

describe('AdminBlocksConfigComponent', () => {
  let component: AdminBlocksConfigComponent;
  let fixture: ComponentFixture<AdminBlocksConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBlocksConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBlocksConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
