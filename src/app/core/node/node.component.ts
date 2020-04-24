import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { environment } from './../../../environments/environment';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ApiService } from '../../services/api.service';

import { isPlatformBrowser, Location, DOCUMENT } from '@angular/common';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('contentAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0 }),
          animate('0.3s', style({ opacity: 1 }))
        ], { optional: true })
      ])
    ])
  ]
})
export class NodeComponent implements OnInit, OnDestroy {
  @Input() curNode;
  @Input() dialog = false;
  @ViewChild('body_en', { static: true }) body_en: ElementRef;
  @ViewChild('body_es', { static: true }) body_es: ElementRef;
  private langsub: any;
  private authsub: any;
  public variables: any;
  public adminUrl: string;
  public media: any;
  public working = true;
  public isBrowser: any;
  private fragmentSubscription: Subscription;
  private currentPath: string;
  private subscription: any;

  constructor(
    private variableService: VariableService,
    private apiService: ApiService,
    private breakpointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document,
    private route: ActivatedRoute,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private cdr: ChangeDetectorRef,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.adminUrl = environment.adminUrl + '/admin/content/edit/' + this.curNode[0].nid;

    if (this.curNode[0].node_export.type[0].target_id === 'page') {
      this.fragmentSubscription = this.activatedRoute.fragment.subscribe(( fragment: string ): void => {
        if (!fragment) {
          return;
        }
        this.scrollToFragment(fragment);
      });
      this.subscription = this.router.events.subscribe(e => {
        if (e instanceof NavigationEnd) {
          const path = '/' + this.variables.lang + '/' + this.currentPath;
          if (e.url.indexOf(path) === -1) {
            this.renderer2.removeChild(this.body_en.nativeElement, this.body_en.nativeElement.children[0]);
            this.renderer2.removeChild(this.body_es.nativeElement, this.body_es.nativeElement.children[0]);
            setTimeout (() => {
              this.processBody();
              this.cdr.detectChanges();
            });
          }
        }
      });
    }
    this.processBody();
    this.working = false;
    this.cdr.detectChanges();

    this.langsub = this.variableService.langSubject.subscribe(result => {
      this.cdr.detectChanges();
    });

    this.authsub = this.variableService.authSubject.subscribe(result => {
      this.cdr.detectChanges();
    });
  }

  public ngOnDestroy(): void {
    if (this.fragmentSubscription) {
      this.fragmentSubscription.unsubscribe();
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

  processBody() {
    // process page body
    const self = this;
    const regex_func = /^.+?[^\/:](?=[?\/]|$)/g;
    const curr_url = this.document.location.href.match(regex_func);
    if (this.curNode[0].node_export.type[0].target_id === 'page') {
      const p_array = [];
      if (this.route.parent) {
        this.route.parent.snapshot.url.forEach(function (item) {
          p_array.push(item.path);
        });
        this.currentPath = p_array.join('/');
      } else {
        this.currentPath = '';
      }
      // english
      if (this.curNode[0].node_export.body.length > 0 && this.curNode[0].node_export.body[0].value !== '') {
        const b_en = this.renderer2.createElement('div');
        b_en.innerHTML = this.curNode[0].node_export.body[0].value;
        const link_array = b_en.getElementsByTagName('a');
        Array.from(link_array).forEach(function (i) {
          if (i['hash'] !== '' && curr_url[0] === i['href'].match(regex_func)[0]) {
            i['href'] = '/en/' + self.currentPath + i['hash'];
            self.renderer2.listen(i, 'click', (evt) => {
              evt.preventDefault();
              self.scrollToFragment(evt.target.hash.substr(1));
              if (self.currentPath !== '' && !self.dialog) {
                self.location.go('/en/' + self.currentPath + evt.target.hash);
              }
            });
          }
        });
        this.renderer2.appendChild(this.body_en.nativeElement, b_en);
      }
      // spanish
      if (this.curNode[0].node_export.i18n.es.body.length > 0 && this.curNode[0].node_export.i18n.es.body[0].value !== '') {
        const b_es = this.renderer2.createElement('div');
        b_es.innerHTML = this.curNode[0].node_export.i18n.es.body[0].value;
        const link_array = b_es.getElementsByTagName('a');
        Array.from(link_array).forEach(function (i) {
          if (i['hash'] !== '' && curr_url[0] === i['href'].match(regex_func)[0]) {
            i['href'] = '/es/' + self.currentPath + i['hash'];
            self.renderer2.listen(i, 'click', (evt) => {
              evt.preventDefault();
              self.scrollToFragment(evt.target.hash.substr(1));
              if (self.currentPath !== '' && !self.dialog) {
                self.location.go('/es/' + self.currentPath + evt.target.hash);
              }
            });
          }
        });
        this.renderer2.appendChild(this.body_es.nativeElement, b_es);
      }
    }
  }

  scrollToFragment(fragment: string) {
    setTimeout (() => {
      const el_array = this.document.getElementsByName(fragment);
      if (el_array.length > 0) {
        Array.from(el_array).forEach(function (i, index) {
          el_array[index].scrollIntoView();
        });
      }
    });
  }

  showCredit(): boolean {
    let output = false;
    if (this.curNode[0].node_export.field_reporting && this.curNode[0].node_export.field_reporting.length > 0) {
      this.curNode[0].node_export.field_reporting.forEach(function (i) {
        if (i.target_id === '642') {
          output = true;
        }
      });
    }
    return output;
  }

  print() {
    if (this.isBrowser) {
      window.print();
    }
  }

}
