import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SideMenuComponent implements OnInit {
  public connection: any;
  public menu: any;
  public variables: any;
  public working = true;

  @Output() nav = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.connection = this.apiService.getMenu().subscribe(data => {
      this.menu = JSON.parse(JSON.stringify(data['main_menu']));
      this.doneLoading();
    });

    this.variables = this.variableService;
  }

  doneLoading() {
    const self = this;
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.menu.forEach(function(i) {
      if (i.tid === '643' && i.term_export.field_pages_plus.length > 0) {
        i.show = true;
      }
    });
    this.menu = this.menu.reverse();
    this.working = false;
  }

  toggleMenu() {
    this.nav.next();
  }

  toggleItem(item: any) {
    item.show = !item.show;
  }

  isElder(id: string): boolean {
    if (id === '643' && (this.router.url.indexOf('/en/self-help/537') !== -1 || this.router.url.indexOf('/es/self-help/537') !== -1)) {
      return true;
    } else {
      return false;
    }
  }

}
