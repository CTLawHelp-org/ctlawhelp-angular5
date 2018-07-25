import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { animate, query, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/platform-browser';

const MENU = makeStateKey('menu');

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity: 0}),
        animate('0.35s', style({opacity: 1}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate('0.35s', style({opacity: 0}))
      ])
    ])
  ]
})
export class MenuComponent implements OnInit {
  public connection: any;
  public menu: any;
  public admin = false;
  public variables: any;
  public adminUrl: string;

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    private router: Router,
    private state: TransferState,
  ) { }

  ngOnInit() {
    const _menu = this.state.get(MENU, null as any);
    if (_menu !== null) {
      this.menu = _menu;
    } else {
      this.connection = this.apiService.getMenu().subscribe(data => {
        this.menu = data['main_menu'];
        this.state.set(MENU, this.menu as any);
        this.doneLoading();
      });
    }
    this.variables = this.variableService;
    this.adminUrl = environment.adminUrl;
  }

  doneLoading() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
  }

  over(item: any) {
    item.over = true;
  }

  out(item: any) {
    item.over = false;
  }

  isElder(id: string): boolean {
    if (id === '643' && (this.router.url.indexOf('/en/self-help/537') !== -1 || this.router.url.indexOf('/es/self-help/537') !== -1)) {
      return true;
    } else {
      return false;
    }
  }

}
