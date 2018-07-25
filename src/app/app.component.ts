import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { VariableService } from './services/variable.service';
import { DOCUMENT, makeStateKey, TransferState } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

const WORKING_KEY = makeStateKey('app_working');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('logoAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0 }),
          animate('0.3s', style({ opacity: 1 }))
        ], { optional: true })
      ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription: any;
  public searching = false;
  public variables: any;
  public working = true;
  public isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document,
    private route: ActivatedRoute,
    private router: Router,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private variableService: VariableService,
    private state: TransferState,
  ) {
    this.variables = this.variableService;
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    const _working = this.state.get(WORKING_KEY, null as any);
    if (_working !== null) {
      this.working = false;
    } else {
      this.variableService.varSubject.subscribe( () => {
        this.setLang();
        this.state.set(WORKING_KEY, this.working as any);
      });
    }

    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.scroll();
      }
    });

    if (isPlatformBrowser(this.platformId) && environment.production) {
      if (environment.appId === 'ng5') {
        // setup analytics
        const ga = this.renderer2.createElement('script');
        ga.text = '(function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){\n' +
          '(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n' +
          'm=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n' +
          '})(window,document,\'script\',\'https://www.google-analytics.com/analytics.js\',\'ga\');\n' +
          '\n' +
          'ga(\'create\', \'UA-16262780-5\', \'auto\');';
        this.renderer2.appendChild(this.document.body, ga);
      }

      // setup structured data
      const sd = this.renderer2.createElement('script');
      sd.type = 'application/ld+json';
      const data = {
        '@context': 'http://schema.org',
        '@type': 'LegalService',
        'name': this.variableService.site_title,
        'logo': 'https://ctlawhelp.org/assets/ctlawhelp-logo.png',
        'image': 'https://ctlawhelp.org/assets/ctlawhelp-logo.png',
        'url': 'https://ctlawhelp.org'
      };
      sd.innerText = JSON.stringify(data);
      this.renderer2.appendChild(this.document.head, sd);
    }
  }

  setLang() {
    if (this.route.children.length > 0) {
      this.route.children[0].data.subscribe(d => {
        if (d.message && (d.message !== this.variables.lang)) {
          this.variables.lang = d.message;
          this.variableService.setLanguage(d.message).subscribe(() => {
            if (this.variables.varDone) {
              this.working = false;
            }
          }, () => {
            console.log('langrouter error');
          });
        } else {
          if (this.variables.varDone) {
            this.working = false;
          }
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  scroll() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout (() => {
        window.scrollTo(0, 0);
      });
    }
  }

  searchFab() {
    this.searching = !this.searching;
  }

}
