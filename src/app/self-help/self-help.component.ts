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
import { VariableService } from '../services/variable.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { forkJoin } from 'rxjs';
import { makeStateKey, Meta, TransferState } from '@angular/platform-browser';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Angulartics2 } from 'angulartics2';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

const STATE_KEY = makeStateKey;
const SELF_HELP_NSMI = makeStateKey('self_help_nsmi');

@Component({
  selector: 'app-self-help',
  templateUrl: './self-help.component.html',
  styleUrls: ['./self-help.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('loadAnimation', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate('0.25s', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class SelfHelpComponent implements OnInit, OnDestroy {
  public working = true;
  public variables: any;
  public media: any;
  private subscription: any;
  private connection: any;
  private langsub: any;
  public id: string;
  public cat: string;
  private nsmi: any;
  public term: any;
  public content = [];
  public isBrowser: boolean;
  public block_setup = [];
  public loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private variableService: VariableService,
    private apiService: ApiService,
    private breakpointObserver: BreakpointObserver,
    private angulartics2: Angulartics2,
    private meta: Meta,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId,
    private state: TransferState,
    private cdr: ChangeDetectorRef,
  ) {
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.load();

    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.working = true;
        this.load();
      }
    });

    this.langsub = this.variableService.langSubject.subscribe(result => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.langsub) {
      this.langsub.unsubscribe();
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
      _nsmi.forEach(function(i) {
        if (self.id === i.tid) {
          self.setupTerm(i);
        }
      });
      this.variables.currentBlockSetup = _blocks;
      this.block_setup = this.variables.processBlock(_blocks);
      this.doneLoading();
    } else {
      const selfhelp_blocks = this.apiService.getBlocks('all', 'selfhelp', 'all');
      const term_blocks = this.apiService.getBlocks('all', 'all', this.id);
      const nsmi = this.apiService.getNSMI();
      this.connection = forkJoin([nsmi, term_blocks, selfhelp_blocks]).subscribe(data => {
        if (data[0].nsmi.length > 0) {
          data[0].nsmi.forEach(function(i) {
            if (self.id === i.tid) {
              self.setupTerm(i);
            }
          });
          this.state.set(SELF_HELP_NSMI, data[0].nsmi as any);
        }
        if (data[1].length > 0) {
          this.variables.currentBlockSetup = data[1];
          this.state.set(STATE_KEY('blockst' + this.id), data[1] as any);
          this.block_setup = this.variables.processBlock(data[1]);
          this.doneLoading();
        } else {
          this.variables.currentBlockSetup = data[2];
          this.state.set(STATE_KEY('blockst' + this.id), data[2] as any);
          this.block_setup = this.variables.processBlock(data[2]);
          this.doneLoading();
        }
      });
    }
  }

  setupTerm(term: any) {
    this.term = term;
    this.variableService.setPageTitle(term.name);
    this.meta.updateTag({ name: 'og:title', content: term.name});
    this.meta.updateTag({ name: 'og:url', content: this.document.location.href});
  }

  loadContent() {
    const self = this;
    const _term = this.state.get(STATE_KEY('shterm' + this.id), null as any);
    if (_term !== null) {
      this.term = _term;
      if (this.term.children.length > 0) {
        this.term.children.forEach(function(i) {
          if (self.cat && self.cat === i.tid) {
            self.showContent(i);
          }
        });
      }
      this.loading = false;
      this.cdr.detectChanges();
    } else {
      if (this.term.children.length > 0) {
        this.connection = this.apiService.getNSMIContentNew(this.id).subscribe(data => {
          this.term.children.forEach(function(i) {
            i.content = data['nsmicontent'][i.tid];
            if (self.cat && self.cat === i.tid) {
              self.showContent(i);
              self.cdr.detectChanges();
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
          this.loading = false;
          this.cdr.detectChanges();
        });
      } else {
        this.connection = this.apiService.getNSMIContentNew(this.id).subscribe(data => {
          this.term.content = data['nsmicontent'];
          this.state.set(STATE_KEY('shterm' + this.id), this.term as any);
          this.loading = false;
          this.cdr.detectChanges();
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
    this.cdr.detectChanges();
    if ((this.term.children.length < 1 || this.cat) || this.isBrowser) {
      this.loadContent();
    }
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
