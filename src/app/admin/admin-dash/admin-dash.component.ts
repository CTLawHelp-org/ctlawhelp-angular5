import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

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
    this.working = false;

    this.viewingContent(this.router.url);

    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.viewingContent(e.url);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  viewingContent(url: string) {
    if (url === '/admin/content/blocks' || url === '/admin/content/triage-entries') {
      this.viewContent = true;
    } else {
      this.viewContent = false;
    }
  }

}
