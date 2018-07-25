import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiRouterComponent } from './api-router.component';

describe('ApiRouterComponent', () => {
  let component: ApiRouterComponent;
  let fixture: ComponentFixture<ApiRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
