import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { ConfirmDialogComponent } from '../../admin-utils/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SelectionModel } from '@angular/cdk/collections';

export interface FileObj {
  filename: string;
  thumbnail: string;
  type: string;
  nid: string;
  fid: string;
}

@Component({
  selector: 'app-admin-files',
  templateUrl: './admin-files.component.html',
  styleUrls: ['./admin-files.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminFilesComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['select', 'thumbnail', 'filename', 'type'];
  public dataSource: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public selection = new SelectionModel<FileObj>(true, []);
  public search = '';
  public working = true;
  public variables: any;
  public files = [];
  public type = 'all';
  public total_count = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.variables = this.variableService;
    this.variables.adminTitle = 'Files';
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  ngAfterViewInit() {
    this.load();
  }

  load() {
    this.apiService.getFilesAdmin().subscribe( results => {
      this.total_count = results.length;
      this.dataSource = new MatTableDataSource<FileObj>(results);
      this.dataSource.filterPredicate = (item, filter) => this.contentFilter(item, filter);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.filterContent();
      this.working = false;
    });
  }

  loadingPage(event: any) {
    document.querySelector('.files-table-wrapper').scroll(0, 0);
  }

  contentFilter(data: any, filter: string) {
    const filterArray = filter.split(';');
    return (!filterArray[0] || data.filename.toLowerCase().indexOf(filterArray[0].trim().toLowerCase()) > -1)
      && (!filterArray[1] || data.file_export.filemime[0].value.indexOf(filterArray[1]) > -1);
  }

  filterContent() {
    let type_search = '';
    if (this.type === 'images') {
      type_search = 'image';
    } else if (this.type === 'documents') {
      type_search = 'application';
    }
    this.dataSource.filter = [this.search, type_search].join(';');
  }

  clearSelection() {
    this.selection.clear();
  }

  addNewFiles() {
    const width = '80%';
    const height = '80%';
    const dialogRef = this.dialog.open(AdminFilesDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95%',
      maxHeight: '95%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.load();
    });
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
        this.working = true;
        const obs = [];
        const self = this;
        this.selection.selected.forEach(function (item) {
          obs.push(self.apiService.deleteFile(item.fid, self.variables.token));
        });
        if (obs.length > 0) {
          forkJoin(obs).subscribe( data => {
            this.clearSelection();
            this.search = '';
            this.load();
          });
        } else {
          this.working = false;
        }
      }
    });
  }

}

@Component({
  selector: 'app-admin-files-dialog',
  templateUrl: './admin-files.dialog.html',
  styleUrls: ['./admin-files.dialog.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminFilesDialogComponent implements OnInit, OnDestroy {
  public variables: any;
  private connection: any;
  public files = [];
  public photos = [];

  constructor(
    public dialogRef: MatDialogRef<AdminFilesDialogComponent>,
    private variableService: VariableService,
  ) {
    this.variables = variableService;
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
  }

  onNoClick(): void {
    this.dialogRef.close([]);
  }

}
