import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../services/variable.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { DOCUMENT, makeStateKey, TransferState } from '@angular/platform-browser';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Angulartics2 } from 'angulartics2';
import { MetaService } from '@ngx-meta/core';
import { isPlatformBrowser } from '@angular/common';

const STATE_KEY = makeStateKey;
const SELF_HELP_NSMI = makeStateKey('self_help_nsmi');

@Component({
  selector: 'app-self-help',
  templateUrl: './self-help.component.html',
  styleUrls: ['./self-help.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelfHelpComponent implements OnInit, OnDestroy {
  public working = true;
  public variables: any;
  public media: any;
  private subscription: any;
  private connection: any;
  public id: string;
  public cat: string;
  private nsmi: any;
  public term: any;
  public content = [];
  public isBrowser: boolean;
  public hasBlocks = false;
  public blocks = {
    content_top: [],
    left: [],
    right: [],
    content_bottom: [],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private variableService: VariableService,
    private apiService: ApiService,
    private breakpointObserver: BreakpointObserver,
    private angulartics2: Angulartics2,
    private meta: MetaService,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId,
    private state: TransferState,
  ) {
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.load();

    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.blocks = {
          content_top: [],
          left: [],
          right: [],
          content_bottom: [],
        };
        this.working = true;
        this.load();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  load() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.cat = this.route.snapshot.paramMap.get('cat');
    if (this.id !== '' && this.isNumeric(this.id)) {
      this.loadTerm();
    }
  }

  loadTerm() {
    const self = this;
    const _nsmi = this.state.get(SELF_HELP_NSMI, null as any);
    const _blocks = this.state.get(STATE_KEY('blockst' + this.id), null as any);
    if (_nsmi !== null && _blocks !== null) {
      if (_nsmi !== null) {
        _nsmi.forEach(function(i) {
          if (self.id === i.tid) {
            self.term = i;
            self.variableService.setPageTitle(i.name);
            self.meta.setTag('og:title', i.name);
            self.meta.setTag('og:url', self.document.location.href);
            self.loadContent();
          }
        });
      }
      if (_blocks !== null) {
        this.setupBlocks(_blocks, _blocks.term_export.field_block_setup);
      }
    } else {
      const selfhelp_blocks = this.apiService.getBlocks('all', 'selfhelp', 'all');
      const term_blocks = this.apiService.getBlocks('all', 'all', this.id);
      const nsmi = this.apiService.getNSMI();
      this.connection = forkJoin([nsmi, term_blocks, selfhelp_blocks]).subscribe(data => {
        if (data[0].nsmi.length > 0) {
          data[0].nsmi.forEach(function(i) {
            if (self.id === i.tid) {
              self.term = i;
              self.variableService.setPageTitle(i.name);
              self.meta.setTag('og:title', i.name);
              self.meta.setTag('og:url', self.document.location.href);
              self.loadContent();
            }
          });
          this.state.set(SELF_HELP_NSMI, data[0].nsmi as any);
        }
        if (data[1].length > 0) {
          this.state.set(STATE_KEY('blockst' + this.id), data[1][0] as any);
          this.setupBlocks(data[1][0], data[1][0].term_export.field_block_setup);
        } else {
          this.state.set(STATE_KEY('blockst' + this.id), data[2][0] as any);
          this.setupBlocks(data[2][0], data[2][0].term_export.field_block_setup);
        }
      });
    }
  }

  setupBlocks(src: any, items: any) {
    this.hasBlocks = true;
    const self = this;
    items.forEach(function (item) {
      if (!item.processed) {
        item.value = item.value.split(',');
        item.processed = true;
      }
      self.blocks[item.value[0]][item.value[1]] = item.target_id;
    });
    this.variableService.currentBlocksSrc = src;
    this.variableService.currentBlocks = items;
  }

  loadContent() {
    const _term = this.state.get(STATE_KEY('shterm' + this.id), null as any);
    if (_term !== null) {
      this.term = _term;
      this.doneLoading();
    } else {
      if (this.term.children.length > 0) {
        const self = this;
        const obs = [];
        this.term.children.forEach(function(i) {
          obs.push(self.apiService.getNSMIContent(i.tid));
        });
        this.connection = forkJoin(obs).subscribe(data => {
          this.term.children.forEach(function(i, index) {
            i.content = data[index];
            if (self.cat && self.cat === i.tid) {
              self.showContent(i);
            }
            i.content_en = 0;
            i.content_es = 0;
            i.content.forEach(function(cont) {
              if (cont.node_export.field_lang_status[0].value === 'en' || cont.node_export.field_lang_status[0].value === 'both') {
                i.content_en++;
              }
              if (cont.node_export.field_lang_status[0].value === 'es' || cont.node_export.field_lang_status[0].value === 'both') {
                i.content_es++;
              }
            });
          });
          this.state.set(STATE_KEY('shterm' + this.id), this.term as any);
          this.doneLoading();
        });
      } else {
        this.connection = this.apiService.getNSMIContent(this.id).subscribe(data => {
          this.term.content = data;
          this.state.set(STATE_KEY('shterm' + this.id), this.term as any);
          this.doneLoading();
        });
      }
    }
  }

  doneLoading() {
    this.angulartics2.pageTrack.next({ path: this.router.url });
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.working = false;
  }

  isNumeric(value: any): boolean {
    return !isNaN(value - parseFloat(value));
  }

  showContent(item: any) {
    item.show = !item.show;
    if (item.show) {
      const props = {};
      props['category'] = 'nsmi';
      props['value'] = 1;
      props['dimension2'] = item.tid;
      this.angulartics2.eventTrack.next({
        action: 'viewNSMICategory',
        properties: props
      });
    }
  }

}
