import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, makeStateKey, TransferState } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { transition, trigger, query, stagger, animate, style } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { isPlatformBrowser } from '@angular/common';
import { Angulartics2 } from 'angulartics2';
import { Subject } from 'rxjs/Subject';

const TRIAGE = makeStateKey('triage');
const STATUS = makeStateKey('status');
const USER_STATUS = makeStateKey('user_status');
const ISSUES = makeStateKey('user_issues');

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

  @Output() success = new EventEmitter();

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
    const _user_status = this.state.get(USER_STATUS, null as any);
    const _issues = this.state.get(ISSUES, null as any);
    if (_triage !== null && _status !== null && _user_status !== null && _issues !== null) {
      this.triage = _triage;
      this.status = _status;
      this.user_status = _user_status;
      this.issues = _issues;
      this.current = this.triage;
      this.doneLoading();
    } else {
      const triage_obs = this.apiService.getTriage();
      const status_obs = this.variableService.getStatus();
      const issues_obs = this.variableService.getIssues();

      this.connection = forkJoin([triage_obs, status_obs, issues_obs]).subscribe(results => {
        this.triage = results[0]['triage'];
        this.state.set(TRIAGE, this.triage as any);
        this.status = JSON.parse(JSON.stringify(results[0]['triage_status']));
        this.state.set(STATUS, this.status as any);
        this.user_status = results[1];
        this.state.set(USER_STATUS, this.user_status as any);
        this.issues = results[2];
        this.state.set(ISSUES, this.issues as any);
        this.current = this.triage;
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
      this.gotoTerm();
    }
    this.working = false;
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.startStats();
  }

  gotoTerm() {
    if (this.isNumeric(this.term)) {
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
      this.findTid(this.triage, this.term, sub);
    }
  }

  isNumeric(value: any): boolean {
    return !isNaN(value - parseFloat(value));
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
        tar.forEach(function(t, index) {
          self.triage.forEach(function(i) {
            if (i.tid === t) {
              self.history.push(i);
              if (index === (tar.length - 1)) {
                self.current = i.children;
              } else {
                self.triage = i.children;
              }
            }
          });
        });
      }
    } else {
      this.history.push(item);
      this.current = item.children;
    }
    this.scroll();
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
    const cur_status = [];
    this.status.forEach(function(i) {
      if (i.enabled) {
        cur_status.push(i.tid);
      }
    });
    const status_obs = this.variableService.setStatus(cur_status);
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
