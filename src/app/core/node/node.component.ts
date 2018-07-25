import {
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
import { DOCUMENT } from '@angular/platform-browser';
import { isPlatformBrowser, Location } from '@angular/common';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
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
  @ViewChild('body_en') body_en: ElementRef;
  @ViewChild('body_es') body_es: ElementRef;
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
          this.renderer2.removeChild(this.body_en.nativeElement, this.body_en.nativeElement.children[0]);
          this.renderer2.removeChild(this.body_es.nativeElement, this.body_es.nativeElement.children[0]);
          setTimeout (() => {
            this.processBody();
          });
        }
      });
    }
    this.processBody();
    this.working = false;
  }

  public ngOnDestroy(): void {
    if (this.fragmentSubscription) {
      this.fragmentSubscription.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  processBody() {
    // process page body
    const self = this;
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
      if (this.curNode[0].node_export.body.length > 0) {
        const b_en = this.renderer2.createElement('div');
        b_en.innerHTML = this.curNode[0].node_export.body[0].value;
        const link_array = b_en.getElementsByTagName('a');
        Array.from(link_array).forEach(function (i) {
          if (i['hash'] !== '') {
            i['href'] = '/en/' + self.currentPath + i['hash'];
            self.renderer2.listen(i, 'click', (evt) => {
              evt.preventDefault();
              self.scrollToFragment(evt.srcElement.hash.substr(1));
              if (self.currentPath !== '') {
                self.location.go('/en/' + self.currentPath + evt.srcElement.hash);
              }
            });
          }
        });
        this.renderer2.appendChild(this.body_en.nativeElement, b_en);
      }
      // spanish
      if (this.curNode[0].node_export.i18n.es.body.length > 0) {
        const b_es = this.renderer2.createElement('div');
        b_es.innerHTML = this.curNode[0].node_export.i18n.es.body[0].value;
        const link_array = b_es.getElementsByTagName('a');
        Array.from(link_array).forEach(function (i) {
          if (i['hash'] !== '') {
            i['href'] = '/es/' + self.currentPath + i['hash'];
            self.renderer2.listen(i, 'click', (evt) => {
              evt.preventDefault();
              self.scrollToFragment(evt.srcElement.hash.substr(1));
              if (self.currentPath !== '') {
                self.location.go('/es/' + self.currentPath + evt.srcElement.hash);
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
