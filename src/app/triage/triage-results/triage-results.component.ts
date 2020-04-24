import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TriageDialogComponent } from '../triage-dialog/triage-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { forkJoin } from 'rxjs';
import { DomSanitizer, Meta } from '@angular/platform-browser';
import { Angulartics2 } from 'angulartics2';
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
  public user_status: any;
  public user_issues: any;
  public id: string;
  public block_setup = [];

  constructor(
    private variableService: VariableService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId,
    private angulartics2: Angulartics2,
    private meta: Meta,
    @Inject(DOCUMENT) private document: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.variableService.setPageTitle('Help for Your Legal Problem');
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.meta.updateTag({ name: 'og:title', content: 'Help for Your Legal Problem'});
    this.meta.updateTag({ name: 'og:url', content: this.document.location.href});
    this.id = this.route.snapshot.paramMap.get('id');
    // grab info
    const status_obs = this.variableService.getStatus();
    const issue_obs = this.variableService.getIssues();
    const blocks = this.apiService.getBlocks('all', 'triageresults', 'all');
    const connection = forkJoin([status_obs, issue_obs, blocks]).subscribe(results => {
      this.user_status = results[0];
      this.user_issues = results[1];
      if (results[2].length > 0) {
        this.variables.currentBlockSetup = results[2];
        this.block_setup = this.variables.processBlock(results[2]);
      }
      connection.unsubscribe();
      this.angulartics2.pageTrack.next({ path: this.router.url });
      this.working = false;
    });

    this.variableService.issuesSubject.subscribe(result => {
      this.user_issues = result;
    });

    this.variableService.statusSubject.subscribe(result => {
      this.user_status = result;
    });
  }

  newSearch(): void {
    let width = '95%';
    let height = '80%';
    if (this.isBrowser) {
      if (this.media.isMatched('(min-width: 960px)')) {
        width = '90%';
        height = '90%';
      }
    }
    const dialogRef = this.dialog.open(TriageDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95%',
      maxHeight: '95%',
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
