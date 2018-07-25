// Import the core angular services.
import { ActivatedRoute } from '@angular/router';
import { Directive, Input } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Inject } from '@angular/core';
import { InjectionToken } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { NgModule } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

export interface WindowScrollerOptions {
  smooth: boolean;
}

export const WINDOW_SCROLLER_OPTIONS = new InjectionToken<WindowScrollerOptions>( 'WindowScroller.Options' );

// I provide the dependency-injection token for the window-scroller so that it can be
// more easily injected into the FragmentTarget directive. This allows other developers
// to provide an override that implements this Type without have to deal with the silly
// @Inject() decorator.
export abstract class WindowScroller {
  abstract scrollIntoView( elementRef: ElementRef ): void;
}

// I provide an implementation for scrolling a given Element Reference into view. By
// default, it uses the native .scrollIntoView() method; but, it can be overridden to
// use something like a jQuery plug-in, or other custom implementation.
export class NativeWindowScroller implements WindowScroller {
  private behavior: 'auto' | 'smooth';
  private timer: number;

  // I initialize the window scroller implementation.
  public constructor( @Inject( WINDOW_SCROLLER_OPTIONS ) options: WindowScrollerOptions ) {
    this.behavior = ( options.smooth ? 'smooth' : 'auto' );
    this.timer = null;
  }

  // I scroll the given ElementRef into the client's viewport.
  public scrollIntoView( elementRef: ElementRef ): void {
    setTimeout((): void => {
      this.doScroll(elementRef);
    });
  }

  // I perform the scrolling of the viewport.
  private doScroll( elementRef: ElementRef ): void {
    elementRef.nativeElement.scrollIntoView({
      behavior: this.behavior,
      block: 'start'
    });
  }
}

@Directive({
  selector: '[id], a[name]',
})
export class FragmentTargetDirective implements OnInit, OnDestroy {
  @Input() id;
  @Input() name;
  private fragmentSubscription: Subscription;

  // I initialize the fragment-target directive.
  constructor(
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef,
    private windowScroller: WindowScroller
  ) {
    this.id = null;
    this.fragmentSubscription = null;
    this.name = null;
  }

  // I get called once when the directive is being destroyed.
  public ngOnDestroy(): void {
    if (this.fragmentSubscription) {
      this.fragmentSubscription.unsubscribe();
    }
  }

  // I get called once after the inputs have been bound for the first time.
  public ngOnInit(): void {
    this.fragmentSubscription = this.activatedRoute.fragment.subscribe(( fragment: string ): void => {
      if (!fragment) {
        return;
      }
      if ((fragment !== this.id) && (fragment !== this.name)) {
        return;
      }
      this.windowScroller.scrollIntoView( this.elementRef );
    });
  }
}

interface ModuleOptions {
  smooth?: boolean;
}

@NgModule({
  exports: [
    FragmentTargetDirective
  ],
  declarations: [
    FragmentTargetDirective
  ]
})
export class FragmentPolyfillModule {
  static forRoot( options?: ModuleOptions ): ModuleWithProviders {
    return({
      ngModule: FragmentPolyfillModule,
      providers: [
        {
          provide: WINDOW_SCROLLER_OPTIONS,
          useValue: {
            smooth: ( ( options && options.smooth ) || false )
          }
        },
        {
          provide: WindowScroller,
          useClass: NativeWindowScroller
        }
      ]
    });
  }
}
