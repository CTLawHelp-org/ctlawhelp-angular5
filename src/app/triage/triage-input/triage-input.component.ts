import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer, makeStateKey, TransferState } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { transition, trigger, query, stagger, animate, style } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { forkJoin ,  Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Angulartics2 } from 'angulartics2';

const TRIAGE = makeStateKey('triage');
const STATUS = makeStateKey('status');
const TRIAGE_BLOCKS = makeStateKey('triage_input_blocks');

@Component({
  selector: 'app-triage-input',
  templateUrl: './triage-input.component.html',
  styleUrls: ['./triage-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':enter', [
          style({ opacity: 0 }),
          stagger(100, [
            animate('0.25s', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class TriageInputComponent implements OnInit {
  @Input() term;
  @Input() dialog;
  private connection: any;
  private triage = [];
  private user_status: any;
  public status = [];
  public status_set = false;
  public working = true;
  public history = [];
  public current = [];
  private issues = [];
  public variables: any;
  public media: any;
  @ViewChild('top', { static: false }) top: ElementRef;
  @Output() success = new EventEmitter();
  public block_setup = [];

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private breakpointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId,
    private angulartics2: Angulartics2,
    private state: TransferState,
  ) {
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    const _triage = this.state.get(TRIAGE, null as any);
    const _status = this.state.get(STATUS, null as any);
    const _blocks = this.state.get(TRIAGE_BLOCKS, null as any);
    if (_triage !== null && _status !== null && _blocks !== null) {
      this.block_setup = this.variables.processBlock(_blocks);
      this.triage = _triage;
      this.status = _status;
      this.current = this.triage;
      const status_obs = this.variableService.getStatus();
      const issues_obs = this.variableService.getIssues();
      this.connection = forkJoin([status_obs, issues_obs]).subscribe(results => {
        this.user_status = results[0];
        this.issues = results[1];
        this.doneLoading();
      });
    } else {
      const triage_obs = this.apiService.getTriage();
      const status_obs = this.variableService.getStatus();
      const issues_obs = this.variableService.getIssues();
      const block_obs = this.apiService.getBlocks('all', 'triage_input', 'all');
      this.connection = forkJoin([triage_obs, status_obs, issues_obs, block_obs]).subscribe(results => {
        this.triage = results[0]['triage'];
        this.state.set(TRIAGE, this.triage as any);
        this.status = JSON.parse(JSON.stringify(results[0]['triage_status']));
        this.state.set(STATUS, this.status as any);
        this.user_status = results[1];
        this.issues = results[2];
        this.current = this.triage;
        this.state.set(TRIAGE_BLOCKS, results[3] as any);
        this.block_setup = this.variables.processBlock(results[3]);
        this.doneLoading();
      });
    }
  }

  doneLoading() {
    const self = this;
    this.triage.forEach(function(i) {
      if (i.term_export.field_public_term_file.length > 0) {
        self.iconRegistry.addSvgIcon(
          'tid' + i.id,
          self.sanitizer.bypassSecurityTrustResourceUrl(i.term_export.field_public_term_file[0].url));
      }
    });
    if (this.user_status !== null && this.user_status.length > 0) {
      this.status.forEach(function(i) {
        if (self.user_status.indexOf(i.tid) !== -1) {
          i.enabled = true;
        }
      });
    }
    if (this.term) {
      this.gotoTerm(this.term);
    }
    this.working = false;
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.startStats();
  }

  gotoTerm(term: any) {
    if (this.isNumeric(term)) {
      const sub = new Subject();
      const map = [];
      sub.subscribe( data => {
        map.push(data);
        if (data['parentId'] !== '0') {
          this.findTid(this.triage, data['parentId'], sub);
        } else {
          const self = this;
          map.reverse().forEach(function (value) {
            self.choose(value);
          });
        }
      });
      this.findTid(this.triage, term, sub);
    }
  }

  isNumeric(value: any): boolean {
    return !isNaN(value - parseFloat(value));
  }

  hasStatus(item: any): boolean {
    if (this.user_status === null || this.user_status.length < 1) {
      return false;
    }
    return this.user_status.indexOf(item.tid) !== -1;
  }

  setStatus(item: any) {
    const idx = this.user_status.indexOf(item.tid);
    if (idx === -1) {
      this.user_status.push(item.tid);
    } else {
      this.user_status.splice(idx, 1);
    }
  }

  findTid(array: any, target: string, sub: Subject<any>) {
    const self = this;
    array.forEach(function (item) {
      if (item['tid'] === target) {
        sub.next(item);
      } else if (item['children'].length > 0) {
        self.findTid(item['children'], target, sub);
      }
    });
  }

  startStats() {
    const props = {};
    props['category'] = 'triage';
    props['value'] = 1;
    props['metric1'] = 1;
    this.angulartics2.eventTrack.next({
      action: 'startTriage',
      properties: props
    });
  }

  finishStats() {
    const props = {};
    props['category'] = 'triage';
    props['value'] = 1;
    props['metric2'] = 1;
    this.angulartics2.eventTrack.next({
      action: 'finishTriage',
      properties: props
    });
  }

  choose(item: any) {
    const self = this;
    if (item.term_export.field_redirect.length > 0) {
      if (item.term_export.field_redirect[0].value === '0') {
        this.current = this.triage;
        this.history = [];
      } else {
        const tar = item.term_export.field_redirect[0].value.split(',');
        this.history = [];
        this.gotoTerm(tar[tar.length - 1]);
      }
    } else {
      this.history.push(item);
      this.current = item.children;
    }
    if (this.top) {
      this.top.nativeElement.focus();
    }
  }

  back(item: any, index: number) {
    if (item.parentId === '0') {
      this.current = this.triage;
      this.history = [];
    } else {
      if (index > 0) {
        this.current = this.history[index - 1].children;
        this.history = this.history.slice(0, index);
      }
    }
    this.scroll();
  }

  mnext() {
    this.status_set = true;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout (() => {
        window.scrollTo(0, 0);
      });
    }
  }

  mback() {
    this.status_set = false;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout (() => {
        window.scrollTo(0, 0);
      });
    }
  }

  scroll() {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById('issues');
      if (element) {
        setTimeout (() => {
          element.scrollIntoView();
        });
      }
    }
  }

  submit() {
    const status_obs = this.variableService.setStatus(this.user_status);
    // minimize issue map
    const issues = [];
    const self = this;
    this.history.forEach(function (item, index) {
      if (index === 0) {
        const obj = {
          name: item.name,
          tid: item.tid,
          term_export: item.term_export,
          i18n: item.i18n
        };
        issues.push(obj);
      } else if (index === (self.history.length - 1)) {
        const obj = {
          name: item.name,
          tid: item.tid,
          term_export: item.term_export,
          i18n: item.i18n
        };
        issues.push(obj);
      } else {
        const obj = {
          name: item.name,
          tid: item.tid,
          i18n: item.i18n
        };
        issues.push(obj);
      }
    });
    const new_issue = {
      issues: issues
    };
    this.issues.push(new_issue);
    const issues_obs = this.variableService.setIssues(this.issues);
    const conn = forkJoin([status_obs, issues_obs]).subscribe(results => {
      this.finishStats();
      this.success.next();
      conn.unsubscribe();
    });
  }

}
