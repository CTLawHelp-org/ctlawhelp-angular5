import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-admin-dash',
  templateUrl: './admin-dash.component.html',
  styleUrls: ['./admin-dash.component.scss']
})
export class AdminDashComponent implements OnInit, OnDestroy {
  public working = true;
  public variables: any;
  public viewContent = false;
  private subscription: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.variableService.setPageTitle('Admin');
    this.viewingContent(this.router.url);
    this.doneLoading();

    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        this.working = true;
      }
      if (e instanceof NavigationEnd) {
        this.viewingContent(e.url);
        this.doneLoading();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  doneLoading() {
    setTimeout( () => {
      this.working = false;
    });
  }

  viewingContent(url: string) {
    if (url === '/admin/content/blocks' || url === '/admin/content/triage-entries'
      || url === '/admin/content/pages' || url === '/admin/content/segments') {
      this.viewContent = true;
    } else {
      this.viewContent = false;
    }
  }

}
