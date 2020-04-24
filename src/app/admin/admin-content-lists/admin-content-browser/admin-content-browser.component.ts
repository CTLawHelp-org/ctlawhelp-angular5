import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { ConfirmDialogComponent } from '../../admin-utils/confirm-dialog/confirm-dialog.component';
import { environment } from '../../../../environments/environment';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-admin-content-browser',
  templateUrl: './admin-content-browser.component.html',
  styleUrls: ['./admin-content-browser.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminContentBrowserComponent implements OnInit, AfterViewInit, OnDestroy {
  private connection: any;
  private subscription: any;
  public id: string;
  public working = true;
  public loading = true;
  public variables: any;
  public displayedColumns: string[] = [];
  public dataSource: any;
  public selection = new SelectionModel(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  public search = '';
  public type = 'page';
  public orphans = [];
  public page_types = [];
  public page_types_filter = [];
  public status_filter = '';
  public lang_filter = '';
  public orphan_filter = '';
  public total_count = 0;

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.variables = this.variableService;
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = (item, filter) => this.contentFilter(item, filter);
    this.dataSource.paginator = this.paginator;

    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.working = true;
        this.total_count = 0;
        this.dataSource.data = [];
        this.clearSelection();
        this.clearFilter();
        this.load();
      }
    });
  }

  ngAfterViewInit() {
    this.load();
  }

  ngOnDestroy() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  load() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id === 'triage_entry') {
      this.type = 'triage_entry';
      this.displayedColumns = ['select', 'title', 'display_title', 'status', 'nid', 'lang'];
      this.variables.adminTitle = 'Triage Entries';
      setTimeout( () => {
        this.loadNodes(this.type, 0);
      });
    } else if (this.id === 'block') {
      this.type = 'block';
      this.displayedColumns = ['select', 'title', 'status', 'nid', 'lang', 'core'];
      this.variables.adminTitle = 'Blocks';
      setTimeout( () => {
        this.loadNodes(this.type, 0);
      });
    } else if (this.id === 'segment') {
      this.type = 'segment';
      this.displayedColumns = ['select', 'title', 'status', 'nid', 'lang', 'orphan'];
      this.variables.adminTitle = 'Segments';
      this.apiService.getAdminOrphans().subscribe( result => {
        this.orphans = result;
        this.loadNodes(this.type, 0);
      });
    } else {
      this.type = 'page';
      this.displayedColumns = ['select', 'title', 'path', 'type', 'status', 'nid', 'lang'];
      this.variables.adminTitle = 'Pages';
      this.apiService.getPageTypes().subscribe( result => {
        this.page_types = result;
        this.loadNodes(this.type, 0);
      });
    }
  }

  loadNodes(type: string, page: number) {
    this.working = false;
    this.connection = this.apiService.getContentAdminNew(type, '' + page).subscribe(data => {
      this.total_count = this.total_count + data.length;
      const nodes = this.processNodes(data);
      let array = this.dataSource.data;
      array = array.concat(nodes);
      this.dataSource.data = array;
      if (data.length > 99) {
        const new_page = page + 1;
        this.loadNodes(type, new_page);
      } else {
        this.loading = false;
        this.doneLoading();
      }
    });
  }

  doneLoading() {
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    setTimeout( () => {
      this.filterContent();
    });
  }

  loadingPage(event: any) {
    document.querySelector('.content-table-wrapper').scroll(0, 0);
  }

  processNodes(data: any): any {
    if (this.type === 'segment') {
      const self = this;
      data.forEach(function (item) {
        item.orphan = '';
        self.orphans.forEach(function (orph) {
          if (item.nid === orph.nid) {
            item.orphan = '1';
          }
        });
      });
    }
    return data;
  }

  getPath(item: any): string {
    if (item.node_export.field_path.length > 0) { // eng
      return item.node_export.field_path[0].value;
    } else if (item.node_export.field_old_path.length > 0) { // eng-alt
      return item.node_export.field_old_path[0].value;
    } else if (item.node_export.i18n.es && item.node_export.i18n.es.field_path.length > 0) { // span
      return item.node_export.i18n.es.field_path[0].value;
    } else if (item.node_export.i18n.es && item.node_export.i18n.es.field_old_path.length > 0) { // span-alt
      return item.node_export.i18n.es.field_old_path[0].value;
    } else {
      return '';
    }
  }

  clearFilter() {
    this.search = '';
    this.status_filter = '';
    this.lang_filter = '';
    this.page_types_filter = [];
    this.orphan_filter = '';
    this.filterContent();
  }

  emptyFilter(): boolean {
    return this.search.length + this.status_filter.length + this.lang_filter.length + this.page_types_filter.length
      + this.orphan_filter.length === 0;
  }

  clearSelection() {
    this.selection.clear();
  }

  contentFilter(data: any, filter: string) {
    const filterArray = filter.split(';');
    const fulltext = [data.title, data.path, data.nid];
    if (data.node_export.field_display_title && data.node_export.field_display_title.length > 0) {
      fulltext.push(data.node_export.field_display_title[0].value);
    }
    return (!filterArray[0] || fulltext.join('').toLowerCase().indexOf(filterArray[0].trim().toLowerCase()) > -1)
      && (!filterArray[1] || data.status.indexOf(filterArray[1].trim().toLowerCase()) > -1)
      && (!filterArray[2] || data.node_export.field_lang_status[0].value.indexOf(filterArray[2].trim().toLowerCase()) > -1)
      && (!filterArray[3] || filterArray[3].indexOf(data.node_export.field_type[0].target_id) > -1)
      && (!filterArray[4] || data.orphan.indexOf(filterArray[4].trim().toLowerCase()) > -1);
  }

  filterContent() {
    const orphan_f = this.orphan_filter ? '1' : '';
    this.dataSource.filter = [this.search, this.status_filter, this.lang_filter, this.page_types_filter, orphan_f].join(';');
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  reload() {
    this.working = true;
    this.clearSelection();
    this.total_count = 0;
    this.dataSource.data = [];
    this.loadNodes(this.type, 0);
    this.filterContent();
  }

  confirmUnpub() {
    const width = '250px';
    const height = '110px';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95vw',
      maxHeight: '95vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.unpubSelection();
      }
    });
  }

  unpubSelection() {
    this.working = true;
    const obs = [];
    const self = this;
    const data = {
      status: [{value: '0'}],
      _links: {type: {href: environment.apiUrl + '/rest/type/node/' + this.type}}
    };
    this.selection.selected.forEach(function (item) {
      if (item.node_export.field_managed && item.node_export.field_managed.length > 0 && item.node_export.field_managed[0].value === '1') {
        // managed
      } else {
        obs.push(self.apiService.updateNode(item.nid, data, self.variables.token));
      }
    });
    if (obs.length > 0) {
      forkJoin(obs).subscribe( result => {
        this.reload();
      });
    } else {
      this.working = false;
    }
  }

  pubSelection() {
    this.working = true;
    const obs = [];
    const self = this;
    const data = {
      status: [{value: '1'}],
      _links: {type: {href: environment.apiUrl + '/rest/type/node/' + this.type}}
    };
    this.selection.selected.forEach(function (item) {
      if (item.node_export.field_managed && item.node_export.field_managed.length > 0 && item.node_export.field_managed[0].value === '1') {
        // managed
      } else {
        obs.push(self.apiService.updateNode(item.nid, data, self.variables.token));
      }
    });
    if (obs.length > 0) {
      forkJoin(obs).subscribe( result => {
        this.reload();
      });
    } else {
      this.working = false;
    }
  }

  confirmDelete() {
    const width = '250px';
    const height = '110px';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95vw',
      maxHeight: '95vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteSelection();
      }
    });
  }

  deleteSelection() {
    this.working = true;
    const obs = [];
    const self = this;
    this.selection.selected.forEach(function (item) {
      if (item.node_export.field_managed && item.node_export.field_managed.length > 0 && item.node_export.field_managed[0].value === '1') {
        // managed
      } else {
        obs.push(self.apiService.deleteNode(item.nid, self.variables.token));
      }
    });
    if (obs.length > 0) {
      forkJoin(obs).subscribe( result => {
        this.reload();
      });
    } else {
      this.working = false;
    }
  }

}
