import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinRouterComponent } from './min-router.component';

describe('MinRouterComponent', () => {
  let component: MinRouterComponent;
  let fixture: ComponentFixture<MinRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
