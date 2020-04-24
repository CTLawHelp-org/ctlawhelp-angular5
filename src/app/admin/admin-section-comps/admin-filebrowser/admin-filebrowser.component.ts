import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { DOCUMENT } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminFilesDialogComponent } from '../admin-files/admin-files.component';

export interface FileObj {
  filename: string;
  thumbnail: string;
  type: string;
  nid: string;
}

@Component({
  selector: 'app-admin-filebrowser',
  templateUrl: './admin-filebrowser.component.html',
  styleUrls: ['./admin-filebrowser.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminFilebrowserComponent implements OnInit, AfterViewInit, OnDestroy {
  public displayedColumns: string[] = ['select', 'thumbnail', 'filename', 'type'];
  public dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public search = '';
  public working = true;
  public variables: any;
  public files = [];
  public type = 'all';
  private ckFuncNum: string;
  public total_count = 0;

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.renderer2.addClass(this.document.body, 'no-headroom');
    if (this.route.snapshot.queryParams && this.route.snapshot.queryParams.CKEditorFuncNum) {
      this.ckFuncNum = this.route.snapshot.queryParams.CKEditorFuncNum;
    }
    if (this.route.snapshot.paramMap.get('id')) {
      this.type = this.route.snapshot.paramMap.get('id');
    }
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  ngAfterViewInit() {
    this.load();
  }

  ngOnDestroy() {
    this.renderer2.removeClass(this.document.body, 'no-headroom');
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
    document.querySelector('.table-wrapper').scroll(0, 0);
  }

  addNewFiles() {
    const width = '80%';
    const height = '80%';
    const dialogRef = this.dialog.open(AdminFilesDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95%',
      maxHeight: '95%'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.load();
    });
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

  chooseFile(url: any, file: any) {
    window.opener.CKEDITOR.tools.callFunction( this.ckFuncNum, url,
      function() {
        const dialog = this.getDialog();
        if (dialog.getName() === 'image') {
          const element = dialog.getContentElement('advanced', 'linkId');
          if (element && file.file_export.filemime[0].value !== 'image/svg+xml') {
            element.setValue('fid-' + file.fid);
          }
        } else if (dialog.getName() === 'link') {
          const element = dialog.getContentElement('advanced', 'advId');
          if (element) {
            element.setValue('fid-' + file.fid);
          }
        }
      });
    window.close();
  }

}
