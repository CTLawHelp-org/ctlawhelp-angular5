import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';

import { VariableService } from '../../services/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { MatIconRegistry } from '@angular/material';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { Angulartics2 } from 'angulartics2';
import { MetaService } from '@ngx-meta/core';

@Component({
  selector: 'app-triage-landing',
  templateUrl: './triage-landing.component.html',
  styleUrls: ['./triage-landing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TriageLandingComponent implements OnInit {
  public working = true;
  public variables: any;
  private connection: any;
  public issues = [];
  public in_state = false;
  public state = '';
  public media: any;
  public id: string;

  constructor(
    private variableService: VariableService,
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId,
    private angulartics2: Angulartics2,
    private meta: MetaService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.variableService.setPageTitle('Legal Help Finder');
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.meta.setTag('og:title', 'Legal Help Finder');
    this.meta.setTag('og:url', this.document.location.href);
    this.id = this.route.snapshot.paramMap.get('id');
    // grab info
    const issues_obs = this.variableService.getIssues();
    const state_obs = this.variableService.getState();
    this.connection = forkJoin([issues_obs, state_obs]).subscribe(results => {
      this.issues = results[0];
      this.in_state = results[1];
      this.doneLoading();
    });
  }

  doneLoading() {
    if (this.id) {
      this.state = '1';
      this.continue();
    }
    this.angulartics2.pageTrack.next({ path: this.router.url });
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.working = false;
  }

  continue() {
    if (this.state === '1') {
      const con = this.variableService.setState(true).subscribe(() => {
        this.in_state = true;
        con.unsubscribe();
        if (isPlatformBrowser(this.platformId)) {
          setTimeout (() => {
            window.scrollTo(0, 0);
          });
        }
      });
    }
  }

  search() {
    this.router.navigate([this.variables.lang + '/legal-help/results']);
  }

  reset() {
    this.state = '';
  }

  startOver() {
    this.working = true;
    this.reset();
    this.in_state = false;
    this.issues = [];
    const status_obs = this.variableService.setStatus([]);
    const issues_obs = this.variableService.setIssues([]);
    const state_obs = this.variableService.setState(false);
    const loc_obs = this.variableService.setLocation({});
    const getloc_obs = this.variableService.setGetLoc(false);
    const conn = forkJoin([status_obs, issues_obs, state_obs, loc_obs, getloc_obs]).subscribe(results => {
      this.working = false;
      conn.unsubscribe();
      this.router.navigate([this.variables.lang + '/legal-help']);
    });
  }

}
