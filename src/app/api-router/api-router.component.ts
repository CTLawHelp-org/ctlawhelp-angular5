import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ApiService } from '../services/api.service';
import { VariableService } from '../services/variable.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { forkJoin } from 'rxjs';
import { Location, DOCUMENT } from '@angular/common';
import { Angulartics2 } from 'angulartics2';
import { makeStateKey, Meta, TransferState } from '@angular/platform-browser';

const STATE_KEY = makeStateKey;
const PATHS = makeStateKey('paths');
const OLD_PATHS = makeStateKey('old_paths');
const TERM_PATHS = makeStateKey('term_paths');

@Component({
  selector: 'app-api-router',
  templateUrl: './api-router.component.html',
  styleUrls: ['./api-router.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ApiRouterComponent implements OnInit, OnDestroy {
  private connection: any;
  private langconn: any;
  private authsub: any;
  public node = [];
  private id = '';
  private path: string;
  private paths: any = [];
  private old_paths: any = [];
  private term_paths: any = [];
  private url: string;
  public working = true;
  private subscription: any;
  public media: any;
  private lang: string;
  public variables: any;
  public block_setup = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService,
    private breakpointObserver: BreakpointObserver,
    private location: Location,
    private angulartics2: Angulartics2,
    private meta: Meta,
    @Inject(DOCUMENT) private document: any,
    private renderer2: Renderer2,
    private state: TransferState,
    private cdr: ChangeDetectorRef,
  ) {
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.load();

    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.node = [];
        this.load();
      }
    });

    this.langconn = this.variableService.langSubject.subscribe( e => {
      if (this.node.length > 0) {
        this.setTitle();
        this.updatePath();
        this.cdr.detectChanges();
      }
    });

    this.authsub = this.variableService.authSubject.subscribe(result => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.langconn) {
      this.langconn.unsubscribe();
    }
    if (this.authsub) {
      this.authsub.unsubscribe();
    }
    this.meta.removeTag('name="og:description"');
  }

  load() {
    this.id = this.route.snapshot.paramMap.get('id');
    const p_array = [];
    this.route.parent.snapshot.url.forEach(function (item) {
      p_array.push(item.path);
    });
    this.path = p_array.join('/');
    this.lang = typeof this.variableService.lang === 'undefined' ? 'en' : this.variableService.lang;
    if (this.id !== '' && this.isNumeric(this.id)) {
      this.loadNode(false);
    } else {
      // not an ID, continue as a path
      if (this.router.url.match(/^\/en\//) === null && this.router.url.match(/^\/es\//) === null) {
        const new_url = '/' + this.lang + '/' + this.path;
        this.location.replaceState(new_url);
      }
      this.url = this.path;
      const _paths = this.state.get(PATHS, null as any);
      if (_paths !== null) {
        this.paths = _paths;
        this.checkPaths();
      } else {
        this.connection = this.apiService.getPaths().subscribe(data => {
          this.paths = data;
          this.state.set(PATHS, this.paths as any);
          this.checkPaths();
        });
      }
    }
  }

  checkPaths() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
    const self = this;
    let found = false;
    this.paths.forEach(function(i) {
      if (i.path === self.url) {
        found = true;
        self.id = i.nid;
      }
    });
    if (found) {
      this.loadNode(false);
    } else {
      const _old_paths = this.state.get(OLD_PATHS, null as any);
      if (_old_paths !== null) {
        this.old_paths = _old_paths;
        this.checkOldPaths();
      } else {
        this.connection = this.apiService.getOldPaths().subscribe(data => {
          this.old_paths = data;
          this.state.set(OLD_PATHS, this.old_paths as any);
          this.checkOldPaths();
        });
      }
    }
  }

  checkOldPaths() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
    const self = this;
    let found = false;
    this.old_paths.forEach(function(i) {
      if (i.old_path === self.url) {
        found = true;
        self.id = i.nid;
      }
    });
    if (found) {
      this.loadNode(true);
    } else {
      const _term_paths = this.state.get(TERM_PATHS, null as any);
      if (_term_paths !== null) {
        this.term_paths = _term_paths;
        this.checkTermPaths();
      } else {
        this.connection = this.apiService.getTermPaths().subscribe(data => {
          this.term_paths = data;
          this.state.set(TERM_PATHS, this.term_paths as any);
          this.checkTermPaths();
        });
      }
    }
  }

  checkTermPaths() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
    const self = this;
    let found = false;
    let ptid = '';
    this.term_paths.forEach(function(i) {
      if (i.path === self.url) {
        found = true;
        self.id = i.tid;
        ptid = i.ptid;
      }
    });
    if (found) {
      const new_url = ptid !== '' ? this.lang + '/self-help/' + ptid + '/' + this.id : this.lang + '/self-help/' + this.id;
      this.router.navigate([new_url], { skipLocationChange: true });
    } else {
      // Page not found - Send to error page / home
      const er = this.lang + '/404';
      this.router.navigate([er]);
    }
  }

  loadNode(usePath: boolean) {
    const _node = this.state.get(STATE_KEY(this.id), null as any);
    const _blocks = this.state.get(STATE_KEY('blocks' + this.id), null as any);
    if (_node !== null && _blocks !== null) {
      this.working = false;
      this.node = _node;
      this.variables.currentBlockSetup = _blocks[0];
      this.block_setup = this.variables.processBlock(_blocks[0]);
      this.processNode(usePath);
      this.doneLoading();
    } else {
      const node_obs = this.apiService.getNode(this.id);
      const blockset = this.apiService.getBlockSetup(this.id);
      this.connection = forkJoin([node_obs, blockset]).subscribe(data => {
        this.node = data[0];
        if (this.node.length > 0) {
          if (data[1]['results'].length > 0) {
            this.state.set(STATE_KEY('blocks' + this.id), data[1]['results'] as any);
            this.variables.currentBlockSetup = data[1]['results'][0];
            this.block_setup = this.variables.processBlock(data[1]['results'][0]);
          }
          this.state.set(STATE_KEY(this.id), this.node as any);
          this.processNode(usePath);
          this.doneLoading();
        } else {
          // Page not found - Send to error page / home
          const er = this.lang + '/404';
          this.router.navigate([er]);
        }
      }, error => {
        const er = this.lang + '/404';
        this.router.navigate([er]);
      });
    }
  }

  processNode(usePath: boolean) {
    this.meta.updateTag({ name: 'og:url', content: this.document.location.href});
    // meta title
    this.setTitle();
    // meta desc
    if (this.node[0].node_export.field_meta_desc && this.node[0].node_export.field_meta_desc.length > 0) {
      this.meta.updateTag({ name: 'og:description', content: this.htmlToPlain(this.node[0].node_export.field_meta_desc[0].value)});
    } else if (this.node[0].node_export.body.length > 0
      && typeof this.node[0].node_export.body[0].summary !== 'undefined'
      && this.node[0].node_export.body[0].summary !== null) {
      this.meta.updateTag({ name: 'og:description', content: this.htmlToPlain(this.node[0].node_export.body[0].summary)});
    }
    const dimensions = {};
    // analytics for field_reporting
    if (this.node[0].node_export.field_reporting && this.node[0].node_export.field_reporting.length > 0) {
      const output = [];
      this.node[0].node_export.field_reporting.forEach(function (i) {
        output.push(i.name);
      });
      dimensions['dimension1'] = output.join(';');
    }
    // analytics for field_nsmi
    if (this.node[0].node_export.field_nsmi && this.node[0].node_export.field_nsmi.length > 0) {
      const output = [];
      this.node[0].node_export.field_nsmi.forEach(function (i) {
        output.push(i.target_id);
      });
      dimensions['dimension2'] = output.join(';');
    }
    // analytics for field_type
    if (this.node[0].node_export.field_type && this.node[0].node_export.field_type.length > 0) {
      dimensions['dimension3'] = this.node[0].node_export.field_type[0].name;
    }
    // analytics for Page content ID
    if (this.node[0].node_export.type[0].target_id === 'page') {
      dimensions['dimension4'] = this.node[0].nid;
    }
    this.angulartics2.setUserProperties.next(dimensions);
    if (usePath) {
      this.updatePath();
    } else {
      this.angulartics2.pageTrack.next({ path: this.path });
    }
  }

  setTitle() {
    if (this.variableService.lang === 'en') {
      if (this.node[0].node_export.field_meta_title && this.node[0].node_export.field_meta_title.length > 0) {
        this.variableService.setPageTitle(this.decodeTitle(this.node[0].node_export.field_meta_title[0].value));
        this.meta.updateTag({ name: 'og:title', content: this.decodeTitle(this.node[0].node_export.field_meta_title[0].value)});
      } else {
        this.variableService.setPageTitle(this.decodeTitle(this.node[0].title));
        this.meta.updateTag({ name: 'og:title', content: this.decodeTitle(this.node[0].title)});
      }
    } else if (this.variableService.lang === 'es') {
      if (this.node[0].node_export.i18n.es.field_meta_title && this.node[0].node_export.i18n.es.field_meta_title.length > 0) {
        this.variableService.setPageTitle(this.decodeTitle(this.node[0].node_export.i18n.es.field_meta_title[0].value));
        this.meta.updateTag({ name: 'og:title', content: this.decodeTitle(this.node[0].node_export.i18n.es.field_meta_title[0].value)});
      } else {
        this.variableService.setPageTitle(this.decodeTitle(this.node[0].node_export.i18n.es.title[0].value));
        this.meta.updateTag({ name: 'og:title', content: this.decodeTitle(this.node[0].node_export.i18n.es.title[0].value)});
      }
    }
  }

  updatePath() {
    this.lang = this.variableService.lang;
    if (this.lang === 'en') {
      if (this.node[0].node_export.field_path && this.node[0].node_export.field_path.length > 0) {
        this.path = '/' + this.lang + '/' + this.node[0].node_export.field_path[0].value;
        this.location.replaceState(this.path);
      } else if (this.node[0].node_export.field_old_path && this.node[0].node_export.field_old_path.length > 0) {
        this.path = '/' + this.lang + '/' + this.node[0].node_export.field_old_path[0].value;
        this.location.replaceState(this.path);
      }
    } else if (this.lang === 'es') {
      if (this.node[0].node_export.i18n.es.field_path && this.node[0].node_export.i18n.es.field_path.length > 0) {
        this.path = '/' + this.lang + '/' + this.node[0].node_export.i18n.es.field_path[0].value;
        this.location.replaceState(this.path);
      } else if (this.node[0].node_export.i18n.es.field_old_path && this.node[0].node_export.i18n.es.field_old_path.length > 0) {
        this.path = '/' + this.lang + '/' + this.node[0].node_export.i18n.es.field_old_path[0].value;
        this.location.replaceState(this.path);
      }
    }
    this.angulartics2.pageTrack.next({ path: this.path });
  }

  doneLoading() {
    this.angulartics2.setUserProperties.next({});
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.working = false;
    this.cdr.detectChanges();
  }

  isNumeric(value: any): boolean {
    return !isNaN(value - parseFloat(value));
  }

  decodeTitle(str: string): string {
    return str.replace(/&#(\d+);/g, function(match, dec) {
      return String.fromCharCode(dec);
    });
  }

  htmlToPlain(str: string): string {
    return str.replace(/<.*?>/g, '');
  }

}
