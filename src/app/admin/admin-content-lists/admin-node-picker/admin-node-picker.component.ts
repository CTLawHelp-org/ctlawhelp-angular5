import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VariableService } from '../../../services/variable.service';
import { ApiService } from '../../../services/api.service';
import { SelectionModel } from '@angular/cdk/collections';

export interface NodeObj {
  title: string;
  type: string;
  lang: string;
  nid: string;
  status: string;
}

@Component({
  selector: 'app-admin-node-picker',
  templateUrl: './admin-node-picker.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AdminNodePickerComponent implements OnInit {
  @Input() src;
  @Input() altsrc;
  @Input() type;
  @Input() push = true;
  @Output() output = new EventEmitter();

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  addContent(type: string): void {
    const width = '95%';
    const height = '80%';
    const dialogRef = this.dialog.open(AdminNodePickerDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95%',
      maxHeight: '95%',
      data: { type: type, altsrc: this.altsrc }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result['value'].length > 0) {
        const self = this;
        if (this.push) {
          result['value'].forEach(function (item) {
            item.src = item.node_export;
            item.value = '';
            self.src.push(item);
            if (result['both'] && typeof self.altsrc !== 'undefined') {
              self.altsrc.push(item);
            }
          });
          this.output.next();
        } else {
          const output = {
            src: this.src,
            result: result['value']
          };
          this.output.next(output);
        }
      }
    });
  }

}

@Component({
  selector: 'app-admin-node-picker-dialog',
  templateUrl: './admin-node-picker.dialog.html',
  styleUrls: ['./admin-node-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminNodePickerDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  private connection: any;
  public nodes: NodeObj[] = [];
  public displayedColumns: string[] = ['select', 'title', 'lang', 'type', 'nid', 'status'];
  public dataSource: any;
  public selection = new SelectionModel<NodeObj>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public search = '';
  public types: string;
  public types_array = [];
  public types_filter = [];
  public lang_filter = '';
  public status_filter = '';
  public loading = true;
  public variables: any;
  public total_count = 0;
  public showBoth = false;
  public both = false;

  constructor(
    public dialogRef: MatDialogRef<AdminNodePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private variableService: VariableService,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.showBoth = typeof this.data.altsrc !== 'undefined';
    this.types = this.data.type;
    this.types_array = this.types.split('+');
    this.dataSource = new MatTableDataSource<NodeObj>();
    this.dataSource.filterPredicate = (item, filter) => this.contentFilter(item, filter);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadNodes(0);
  }

  ngOnDestroy() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
  }

  loadNodes(page: number) {
    this.connection = this.apiService.getContentAdminNew(this.types, '' + page).subscribe( result => {
      this.total_count = this.total_count + result.length;
      let array = this.dataSource.data;
      array = array.concat(result);
      this.dataSource.data = array;
      if (result.length > 99) {
        const new_page = page + 1;
        this.loadNodes(new_page);
      } else {
        this.loading = false;
        this.filterContent();
      }
    });
  }

  loadingPage(event: any) {
    document.querySelector('.mat-dialog-content').scroll(0, 0);
  }

  contentFilter(data: any, filter: string) {
    const filterArray = filter.split(';');
    const text_search = [data.title, data.nid].join('');
    return (!filterArray[0] || text_search.toLowerCase().indexOf(filterArray[0].trim().toLowerCase()) > -1)
      && (!filterArray[1] || this.hasMatch(data, filterArray[1]))
      && (!filterArray[2] || data.node_export.field_lang_status[0].value.indexOf(filterArray[2].trim().toLowerCase()) > -1)
      && (!filterArray[3] || data.status.indexOf(filterArray[3].trim().toLowerCase()) > -1);
  }

  filterContent() {
    this.dataSource.filter = [this.search, this.types_filter, this.lang_filter, this.status_filter].join(';');
  }

  hasMatch(data: any, filter: any): boolean {
    let found = false;
    const array = filter.split(',');
    array.forEach(function (i) {
      if (data.type === i) {
        found = true;
      }
    });
    return found;
  }

  clearSelection() {
    this.selection.clear();
  }

  clearFilter() {
    this.search = '';
    this.types_filter = [];
    this.lang_filter = '';
    this.status_filter = '';
    this.filterContent();
  }

  emptyFilter(): boolean {
    return this.search.length + this.types_filter.length + this.lang_filter.length + this.status_filter.length === 0;
  }

  onNoClick(): void {
    this.dialogRef.close({ both: false, value: []});
  }

  addNodes(): void {
    this.dialogRef.close({ both: this.both, value: this.selection.selected});
  }

}
