import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SideMenuComponent implements OnInit, OnDestroy {
  private langsub: any;
  private connection: any;
  private subscription: any;
  public menu: any;
  public variables: any;
  public working = true;

  @Output() nav = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {

    this.connection = this.apiService.getMenu().subscribe(data => {
      this.menu = JSON.parse(JSON.stringify(data['main_menu']));
      this.doneLoading();
    });

    this.variables = this.variableService;

    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.cdr.detectChanges();
      }
    });

    this.langsub = this.variableService.langSubject.subscribe(result => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.langsub) {
      this.langsub.unsubscribe();
    }
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
    this.cdr.detectChanges();
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
