import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TriageDialogComponent } from '../triage-dialog/triage-dialog.component';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { isPlatformBrowser } from '@angular/common';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { Angulartics2 } from 'angulartics2';
import { MetaService } from '@ngx-meta/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-triage-results',
  templateUrl: './triage-results.component.html',
  styleUrls: ['./triage-results.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TriageResultsComponent implements OnInit {
  public working = true;
  public isBrowser: any;
  public variables: any;
  public media: any;
  public show_loc = false;
  public user_status: any;
  public user_issues: any;
  public id: string;
  public hasBlocks = false;
  public blocks = {
    content_top: [],
    left: [],
    right: [],
    content_bottom: [],
  };

  constructor(
    private variableService: VariableService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId,
    private angulartics2: Angulartics2,
    private meta: MetaService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.variableService.setPageTitle('Help for Your Legal Problem');
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.meta.setTag('og:title', 'Help for Your Legal Problem');
    this.meta.setTag('og:url', this.document.location.href);
    this.id = this.route.snapshot.paramMap.get('id');
    // grab info
    const loc_obs = this.variableService.getGetLoc();
    const status_obs = this.variableService.getStatus();
    const issue_obs = this.variableService.getIssues();
    const blocks = this.apiService.getBlocks('all', 'triageresults', 'all');
    const connection = forkJoin([loc_obs, status_obs, issue_obs, blocks]).subscribe(results => {
      this.show_loc = results[0] !== null ? results[0] : false;
      this.user_status = results[1];
      this.user_issues = results[2];
      if (results[3].length > 0) {
        this.setupBlocks(results[3][0], results[3][0].term_export.field_block_setup);
      }
      connection.unsubscribe();
      this.angulartics2.pageTrack.next({ path: this.router.url });
      this.working = false;
    });

    this.variableService.issuesSubject.subscribe(result => {
      this.user_issues = result;
    });

    this.variableService.getlocSubject.subscribe(result => {
      if (result) {
        this.show_loc = true;
      } else {
        this.show_loc = false;
      }
    });

    this.variableService.statusSubject.subscribe(result => {
      this.user_status = result;
    });
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

  hasStatus(tid: string): boolean {
    let output = false;
    if (typeof tid !== 'undefined' && this.user_status.indexOf(tid) !== -1) {
      output = true;
    }
    return output;
  }

  showDV(): boolean {
    let output = false;
    if (this.user_issues.length > 0) {
      this.user_issues.forEach(function (entry) {
        if (entry.issues[entry.issues.length - 1].tid === '42'
          || entry.issues[entry.issues.length - 1].tid === '47'
          || entry.issues[entry.issues.length - 1].tid === '123') {
          output = true;
        }
      });
    }
    if (this.hasStatus('594')) {
      output = true;
    }
    return output;
  }

  newSearch(): void {
    let width = '95vw';
    let height = '80vh';
    if (this.isBrowser) {
      if (this.media.isMatched('(min-width: 960px)')) {
        width = '90vw';
        height = '90vh';
      }
    }
    const dialogRef = this.dialog.open(TriageDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95vw',
      maxHeight: '95vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      // ok
    });
  }

  startOver() {
    this.working = true;
    const status_obs = this.variableService.setStatus([]);
    const issues_obs = this.variableService.setIssues([]);
    const state_obs = this.variableService.setState(false);
    const loc_obs = this.variableService.setLocation({});
    const getloc_obs = this.variableService.setGetLoc(false);
    const conn = forkJoin([status_obs, issues_obs, state_obs, loc_obs, getloc_obs]).subscribe(results => {
      this.working = false;
      conn.unsubscribe();
      this.router.navigate([ this.variables.lang + '/legal-help']);
    });
  }

}
