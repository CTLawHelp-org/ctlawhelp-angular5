import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { VariableService } from '../services/variable.service';
import { ApiService } from '../services/api.service';
import { MetaService } from '@ngx-meta/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';

const STATE_KEY = makeStateKey;

@Component({
  selector: 'app-min-router',
  templateUrl: './min-router.component.html',
  styleUrls: ['./min-router.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MinRouterComponent implements OnInit, OnDestroy {
  private connection: any;
  public node = [];
  private id = '';
  public working = true;
  private subscription: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService,
    private meta: MetaService,
    private state: TransferState,
  ) {}

  ngOnInit() {
    this.load();

    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.load();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.meta.removeTag('property="og:description"');
  }

  load() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id !== '' && this.isNumeric(this.id)) {
      this.loadNode();
    }
  }

  loadNode() {
    const _node = this.state.get(STATE_KEY(this.id), null as any);
    if (_node !== null) {
      this.node = _node;
      this.variableService.setPageTitle(this.decodeTitle(this.node[0].title));
      this.doneLoading();
    } else {
      this.connection = this.apiService.getNode(this.id).subscribe(data => {
        this.node = data;
        this.state.set(STATE_KEY(this.id), this.node as any);
        this.variableService.setPageTitle(this.decodeTitle(this.node[0].title));
        this.doneLoading();
      });
    }
  }

  doneLoading() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.working = false;
  }

  isNumeric(value: any): boolean {
    return !isNaN(value - parseFloat(value));
  }

  decodeTitle(str: string): string {
    return str.replace(/&#(\d+);/g, function(match, dec) {
      return String.fromCharCode(dec);
    });
  }

}
