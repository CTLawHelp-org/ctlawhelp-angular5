import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../environments/environment';
import { NavigationEnd, Router } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

const MENU = makeStateKey('menu');

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity: 0}),
        animate('0.35s', style({opacity: 1}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate('0.35s', style({opacity: 0}))
      ])
    ])
  ]
})
export class MenuComponent implements OnInit, OnDestroy {
  private connection: any;
  private subscription: any;
  private langsub: any;
  private authsub: any;
  public menu: any;
  public admin = false;
  public variables: any;
  public adminUrl: string;
  public isBrowser: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private apiService: ApiService,
    private variableService: VariableService,
    private router: Router,
    private state: TransferState,
    private cdr: ChangeDetectorRef,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.adminUrl = environment.adminUrl;
    const _menu = this.state.get(MENU, null as any);
    if (_menu !== null) {
      this.menu = _menu;
      this.doneLoading();
    } else {
      this.connection = this.apiService.getMenu().subscribe(data => {
        this.menu = data['main_menu'];
        this.state.set(MENU, this.menu as any);
        this.doneLoading();
      });
    }

    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.cdr.detectChanges();
      }
    });

    this.langsub = this.variableService.langSubject.subscribe(result => {
      this.cdr.detectChanges();
    });

    this.authsub = this.variableService.authSubject.subscribe(result => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.langsub) {
      this.langsub.unsubscribe();
    }
    if (this.authsub) {
      this.authsub.unsubscribe();
    }
  }

  doneLoading() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.cdr.detectChanges();
  }

  over(item: any) {
    item.over = true;
  }

  out(item: any) {
    item.over = false;
  }

  isElder(id: string): boolean {
    if (id === '643' && (this.router.url.indexOf('/en/self-help/537') !== -1 || this.router.url.indexOf('/es/self-help/537') !== -1)) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.apiService.logoutService().subscribe( result => {
      if (this.isBrowser) {
        window.location.reload();
      }
    });
  }

}
