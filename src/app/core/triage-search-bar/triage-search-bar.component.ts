import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { VariableService } from '../../services/variable.service';
import { Angulartics2 } from 'angulartics2';

@Component({
  selector: 'app-triage-search-bar',
  templateUrl: './triage-search-bar.component.html',
  styleUrls: ['./triage-search-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TriageSearchBarComponent implements OnInit {
  public variables: any;
  public keyword: any;
  public isBrowser: boolean;

  @Output() success = new EventEmitter();

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private variableService: VariableService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId,
    private angulartics2: Angulartics2,
  ) {
    this.variables = this.variableService;
  }

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  search() {
    if (this.keyword && this.keyword !== '') {
      this.variableService.getIssues().subscribe(result => {
        const issue_dem = [];
        result.forEach(function (i) {
          const last = i.issues.length - 1;
          issue_dem.push(i.issues[last].tid);
        });
        // analytics
        if (this.isBrowser) {
          const props = {};
          props['dimension5'] = issue_dem.join(';');
          props['dimension9'] = this.keyword;
          props['category'] = 'triage';
          props['value'] = 1;
          this.angulartics2.eventTrack.next({
            action: 'searchFromTriage',
            properties: props
          });
        }
        this.doneSearching();
      });
    }
  }

  doneSearching() {
    this.success.next();
    this.router.navigate(['/' + this.variables.lang + '/search', this.keyword]);
  }

}
