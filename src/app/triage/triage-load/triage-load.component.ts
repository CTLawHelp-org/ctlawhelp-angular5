import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariableService } from '../../services/variable.service';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-triage-load',
  templateUrl: './triage-load.component.html',
  styleUrls: ['./triage-load.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TriageLoadComponent implements OnInit {
  private connection: any;
  private cur_status: any;
  private cur_issues: any;
  private triage = [];
  private user_status: any;
  private issues = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService
  ) {}

  ngOnInit() {
    this.cur_status = this.route.snapshot.paramMap.get('status');
    this.cur_issues = this.route.snapshot.paramMap.get('id');
    const triage_obs = this.apiService.getTriage();
    const status_obs = this.variableService.getStatus();
    const issues_obs = this.variableService.getIssues();

    this.connection = forkJoin([triage_obs, status_obs, issues_obs]).subscribe(results => {
      this.triage = results[0]['triage'];
      this.user_status = results[1];
      this.issues = results[2];
      this.doneLoading();
    });
  }

  doneLoading() {
    const self = this;
    if (this.connection) {
      this.connection.unsubscribe();
    }
    // Status processing
    const status_array = this.cur_status.split('-');
    if (status_array.length > 0) {
      status_array.forEach(function (i) {
        if (self.user_status.indexOf(i) === -1) {
          self.user_status.push(i);
        }
      });
    }
    const status_obs = this.variableService.setStatus(this.user_status);
    // Issues processing
    const new_issue = {
      issues: []
    };
    const issue_array = this.cur_issues.split('-');
    issue_array.forEach(function (i, index) {
      if (index === 0) {
        self.triage.forEach(function (term) {
          if (i === term.tid) {
            new_issue.issues.push(term);
          }
        });
      } else if (index > 0 && new_issue.issues[index - 1].children.length > 0) {
        new_issue.issues[index - 1].children.forEach(function (term) {
          if (i === term.tid) {
            new_issue.issues.push(term);
          }
        });
      }
    });
    this.issues.push(new_issue);
    const issues_obs = this.variableService.setIssues(this.issues);
    // Redirect user
    const conn = forkJoin([status_obs, issues_obs]).subscribe(results => {
      conn.unsubscribe();
      this.router.navigate([this.variableService.lang + '/legal-help/results']);
    });
  }

}
