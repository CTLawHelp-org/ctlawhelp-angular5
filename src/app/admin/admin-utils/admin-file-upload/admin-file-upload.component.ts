import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { environment } from '../../../../environments/environment';
import { Subject } from 'rxjs/internal/Subject';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface FileObj {
  filename: string;
  thumbnail: string;
  type: string;
  nid: string;
}

declare var qq: any;
declare var CKEDITOR: any;

@Component({
  selector: 'app-admin-file-upload',
  templateUrl: './admin-file-upload.component.html',
  styleUrls: ['./admin-file-upload.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminFileUploadComponent implements OnInit {
  @Input() value;
  @Input() type;
  @Input() standalone;
  public rows = [];
  private file_type = 'file';
  public working = false;
  public variables: any;
  public lastMoved: number;
  public isBrowser: boolean;

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    private renderer2: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document,
    public dialog: MatDialog,
  ) {
    this.variables = variableService;
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser && !document.getElementById('fine-uploader-script')) {
      const fp = this.renderer2.createElement('script');
      fp.id = 'fine-uploader-script';
      fp.src = 'https://cdnjs.cloudflare.com/ajax/libs/file-uploader/5.16.2/fine-uploader.min.js';
      this.renderer2.appendChild(this.document.body, fp);
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      // template
      const tp = this.renderer2.createElement('script');
      tp.type = 'text/template';
      if ((this.type === 'photos' || this.type === 'slider') && !document.getElementById('qq-template-photos')) {
        tp.id = 'qq-template-photos';
        tp.text = '<div class="qq-uploader-selector qq-uploader" qq-drop-area-text="Drop files here">\n' +
          '            <div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container">\n' +
          '                <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ' +
          'class="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar"></div>\n' +
          '            </div>\n' +
          '            <div class="qq-upload-drop-area-selector qq-upload-drop-area" qq-hide-dropzone>\n' +
          '                <span class="qq-upload-drop-area-text-selector"></span>\n' +
          '            </div>\n' +
          '            <div class="buttons">\n' +
          '                <div class="qq-upload-button-selector qq-upload-button margin-right-lg">\n' +
          '                    <div>Select files</div>\n' +
          '                </div>\n' +
          '                <button type="button" id="trigger-photos" class="btn btn-primary qq-upload-button margin-right-lg">\n' +
          '                    Upload\n' +
          '                </button>\n' +
          '                <button type="button" id="trigger-add" class="btn btn-primary qq-upload-button">\n' +
          '                    Add Existing\n' +
          '                </button>\n' +
          '            </div>\n' +
          '            <span class="qq-drop-processing-selector qq-drop-processing">\n' +
          '                <span>Processing dropped files...</span>\n' +
          '                <span class="qq-drop-processing-spinner-selector qq-drop-processing-spinner"></span>\n' +
          '            </span>\n' +
          '            <ul class="qq-upload-list-selector qq-upload-list" aria-live="polite" aria-relevant="additions removals">\n' +
          '                <li>\n' +
          '                    <div class="qq-progress-bar-container-selector">\n' +
          '                        <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ' +
          'class="qq-progress-bar-selector qq-progress-bar"></div>\n' +
          '                    </div>\n' +
          '                    <span class="qq-upload-spinner-selector qq-upload-spinner"></span>\n' +
          '                    <img class="qq-thumbnail-selector" qq-max-size="100" qq-server-scale>\n' +
          '                    <span class="qq-upload-file-selector qq-upload-file"></span>\n' +
          '                    <span class="qq-edit-filename-icon-selector qq-edit-filename-icon" aria-label="Edit filename"></span>\n' +
          '                    <input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text">\n' +
          '                    <span class="qq-upload-size-selector qq-upload-size"></span>\n' +
          '                    <button type="button" class="qq-btn qq-upload-cancel-selector qq-upload-cancel">Cancel</button>\n' +
          '                    <button type="button" class="qq-btn qq-upload-retry-selector qq-upload-retry">Retry</button>\n' +
          '                    <button type="button" class="qq-btn qq-upload-delete-selector qq-upload-delete">Delete</button>\n' +
          '                    <span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>\n' +
          '                </li>\n' +
          '            </ul>\n' +
          '\n' +
          '            <dialog class="qq-alert-dialog-selector">\n' +
          '                <div class="qq-dialog-message-selector"></div>\n' +
          '                <div class="qq-dialog-buttons">\n' +
          '                    <button type="button" class="qq-cancel-button-selector">Close</button>\n' +
          '                </div>\n' +
          '            </dialog>\n' +
          '\n' +
          '            <dialog class="qq-confirm-dialog-selector">\n' +
          '                <div class="qq-dialog-message-selector"></div>\n' +
          '                <div class="qq-dialog-buttons">\n' +
          '                    <button type="button" class="qq-cancel-button-selector">No</button>\n' +
          '                    <button type="button" class="qq-ok-button-selector">Yes</button>\n' +
          '                </div>\n' +
          '            </dialog>\n' +
          '\n' +
          '            <dialog class="qq-prompt-dialog-selector">\n' +
          '                <div class="qq-dialog-message-selector"></div>\n' +
          '                <input type="text">\n' +
          '                <div class="qq-dialog-buttons">\n' +
          '                    <button type="button" class="qq-cancel-button-selector">Cancel</button>\n' +
          '                    <button type="button" class="qq-ok-button-selector">Ok</button>\n' +
          '                </div>\n' +
          '            </dialog>\n' +
          '        </div>';
      } else if (this.type === 'files' && !document.getElementById('qq-template-files')) {
        tp.id = 'qq-template-files';
        tp.text = '<div class="qq-uploader-selector qq-uploader" qq-drop-area-text="Drop files here">\n' +
          '            <div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container">\n' +
          '                <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ' +
          'class="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar"></div>\n' +
          '            </div>\n' +
          '            <div class="qq-upload-drop-area-selector qq-upload-drop-area" qq-hide-dropzone>\n' +
          '                <span class="qq-upload-drop-area-text-selector"></span>\n' +
          '            </div>\n' +
          '            <div class="buttons">\n' +
          '                <div class="qq-upload-button-selector qq-upload-button margin-right-lg">\n' +
          '                    <div>Select files</div>\n' +
          '                </div>\n' +
          '                <button type="button" id="trigger-files" class="btn btn-primary qq-upload-button">\n' +
          '                    Upload\n' +
          '                </button>\n' +
          '            </div>\n' +
          '            <span class="qq-drop-processing-selector qq-drop-processing">\n' +
          '                <span>Processing dropped files...</span>\n' +
          '                <span class="qq-drop-processing-spinner-selector qq-drop-processing-spinner"></span>\n' +
          '            </span>\n' +
          '            <ul class="qq-upload-list-selector qq-upload-list" aria-live="polite" aria-relevant="additions removals">\n' +
          '                <li>\n' +
          '                    <div class="qq-progress-bar-container-selector">\n' +
          '                        <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ' +
          'class="qq-progress-bar-selector qq-progress-bar"></div>\n' +
          '                    </div>\n' +
          '                    <span class="qq-upload-spinner-selector qq-upload-spinner"></span>\n' +
          '                    <img class="qq-thumbnail-selector" qq-max-size="100" qq-server-scale>\n' +
          '                    <span class="qq-upload-file-selector qq-upload-file"></span>\n' +
          '                    <span class="qq-edit-filename-icon-selector qq-edit-filename-icon" aria-label="Edit filename"></span>\n' +
          '                    <input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text">\n' +
          '                    <span class="qq-upload-size-selector qq-upload-size"></span>\n' +
          '                    <button type="button" class="qq-btn qq-upload-cancel-selector qq-upload-cancel">Cancel</button>\n' +
          '                    <button type="button" class="qq-btn qq-upload-retry-selector qq-upload-retry">Retry</button>\n' +
          '                    <button type="button" class="qq-btn qq-upload-delete-selector qq-upload-delete">Delete</button>\n' +
          '                    <span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>\n' +
          '                </li>\n' +
          '            </ul>\n' +
          '\n' +
          '            <dialog class="qq-alert-dialog-selector">\n' +
          '                <div class="qq-dialog-message-selector"></div>\n' +
          '                <div class="qq-dialog-buttons">\n' +
          '                    <button type="button" class="qq-cancel-button-selector">Close</button>\n' +
          '                </div>\n' +
          '            </dialog>\n' +
          '\n' +
          '            <dialog class="qq-confirm-dialog-selector">\n' +
          '                <div class="qq-dialog-message-selector"></div>\n' +
          '                <div class="qq-dialog-buttons">\n' +
          '                    <button type="button" class="qq-cancel-button-selector">No</button>\n' +
          '                    <button type="button" class="qq-ok-button-selector">Yes</button>\n' +
          '                </div>\n' +
          '            </dialog>\n' +
          '\n' +
          '            <dialog class="qq-prompt-dialog-selector">\n' +
          '                <div class="qq-dialog-message-selector"></div>\n' +
          '                <input type="text">\n' +
          '                <div class="qq-dialog-buttons">\n' +
          '                    <button type="button" class="qq-cancel-button-selector">Cancel</button>\n' +
          '                    <button type="button" class="qq-ok-button-selector">Ok</button>\n' +
          '                </div>\n' +
          '            </dialog>\n' +
          '        </div>';
      }
      this.renderer2.appendChild(this.document.body, tp);
      this.setupFP();
      this.setupCK();
      this.rows = JSON.parse(JSON.stringify(this.value));
    }
  }

  setupCK() {
    if (this.type === 'slider' && this.value.length > 0) {
      const self = this;
      this.value.forEach(function (i, index) {
        self.addCK(i.target_id);
      });
    }
  }

  setupFP() {
    const self = this;
    if (typeof qq === 'undefined') {
      setTimeout( () => {
        this.setupFP();
      });
    } else {
      setTimeout( () => {
        if (this.type === 'photos' || this.type === 'slider') {
          self.file_type = 'image';
          const manualUploader = new qq.FineUploader({
            element: document.getElementById('fine-uploader-photos'),
            template: 'qq-template-photos',
            autoUpload: false
          });
          // upload
          qq(document.getElementById('trigger-photos')).attach('click', function() {
            const files = manualUploader.getUploads({
              status: qq.status.SUBMITTED
            });
            self.uploadFiles(files, manualUploader).subscribe( result => {
              self.createMedia(result).subscribe( data => {
                result.forEach(function (item) {
                  self.value.push({
                    target_id: item['fid'][0].value,
                    thumbnail2x: item['uri'][0]['value'],
                    alt: ''
                  });
                });
                files.forEach(function (item) {
                  manualUploader.cancel(item.id);
                });
                manualUploader.clearStoredFiles();
                self.working = false;
              });
            });
          });
          // add existing
          qq(document.getElementById('trigger-add')).attach('click', function() {
            self.addFiles();
          });
        } else if (this.type === 'files') {
          const manualUploader = new qq.FineUploader({
            element: document.getElementById('fine-uploader-files'),
            template: 'qq-template-files',
            autoUpload: false
          });

          qq(document.getElementById('trigger-files')).attach('click', function() {
            const files = manualUploader.getUploads({
              status: qq.status.SUBMITTED
            });
            self.uploadFiles(files, manualUploader).subscribe( result => {
              self.createMedia(result).subscribe( data => {
                result.forEach(function (item) {
                  self.value.push({
                    target_id: item['fid'][0].value,
                    filename: item['filename'][0].value,
                    display: '0',
                    description: ''
                  });
                });
                files.forEach(function (item) {
                  manualUploader.cancel(item.id);
                });
                manualUploader.clearStoredFiles();
                self.rows = JSON.parse(JSON.stringify(self.value));
                self.working = false;
              });
            });
          });
        }
      });
    }
  }

  addCK(index: number) {
    if (typeof CKEDITOR === 'undefined') {
      setTimeout( () => {
        this.addCK(index);
      });
    } else {
      const toolbar = [
        {
          name: 'basicstyles',
          items: ['Bold', 'Italic', 'Strike', 'Underline']
        },
        {name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
        {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
        {name: 'tools', items: ['SpellChecker']},
        {
          name: 'styles',
          items: ['PasteText', 'PasteFromWord', 'RemoveFormat']
        },
        {name: 'document', items: ['Source', 'Maximize']}
      ];
      setTimeout( () => {
        // extra options
        if (!this.document.getElementById('ck-extras')) {
          const ck_opt = this.renderer2.createElement('script');
          ck_opt.text = 'CKEDITOR.dtd.$removeEmpty[\'span\'] = false;';
          ck_opt.id = 'ck-extras';
          this.renderer2.appendChild(this.document.body, ck_opt);
        }
        try {
          CKEDITOR.replace('bc' + index, {
            language: 'en',
            toolbar: toolbar,
            allowedContent: true,
            height: 100,
          });
        } catch {}
      });
    }
  }

  setDisplay(form: any, index: any) {
    if (form.checked) {
      this.value[index].display = '1';
    } else {
      this.value[index].display = '0';
    }
  }

  updateFileDesc(index: any, value: any) {
    this.value[index].description = value;
  }

  updateIndex(event: any, value: any) {
    this.lastMoved = event.currentIndex;
    this.variables.dropFnc(event, value);
  }

  moveUp(index: number) {
    this.cleanCK();
    this.value.splice(index - 1, 0, this.value.splice(index, 1)[0]);
    this.rows = JSON.parse(JSON.stringify(this.value));
    this.setupCK();
  }

  moveDown(index: number) {
    this.cleanCK();
    this.value.splice(index + 1, 0, this.value.splice(index, 1)[0]);
    this.rows = JSON.parse(JSON.stringify(this.value));
    this.setupCK();
  }

  remove(index: number) {
    this.cleanCK();
    this.value.splice(index, 1);
    this.rows = JSON.parse(JSON.stringify(this.value));
    this.setupCK();
  }

  cleanCK() {
    if (this.type === 'slider' && this.value.length > 0) {
      this.value.forEach(function (i, index) {
        CKEDITOR.instances['bc' + i.target_id].destroy();
      });
    }
  }

  addFiles(): void {
    const width = '90%';
    const height = '90%';
    const dialogRef = this.dialog.open(AdminFileUploadDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95%',
      maxHeight: '95%',
      data: { type: 'images' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        const self = this;
        result.forEach(function (item) {
          self.value.push({
            target_id: item.fid,
            filename: item.filename,
            description: '',
            display: '0',
            src: item.file_export,
            thumbnail2x: typeof item.file_export.thumbnail !== 'undefined' ? item.file_export.thumbnail : '',
            alt: ''
          });
        });
      }
    });
  }

  uploadFiles(items: any, manualUploader: any): Observable<any> {
    const self = this;
    const obs = [];
    if (items.length > 0) {
      this.working = true;
      items.forEach(function(file) {
        const data = {
          filename: file['name'],
          data: manualUploader.getFile(file['id'])
        };
        obs.push(self.apiService.saveFile(data, self.file_type, self.variableService.token));
      });
    }
    return forkJoin(obs);
  }

  createMedia(items: any): Observable<any> {
    const self = this;
    const obs = [];
    if (items.length > 0 && this.standalone) {
      items.forEach(function(file) {
        const data = {
          'name': [{value: file['filename'][0].value}]
        };
        if (self.file_type === 'image') {
          data['field_media_image'] = [{target_id: file['fid'][0].value}];
        } else if (self.file_type === 'file') {
          data['field_media_file'] = [{target_id: file['fid'][0].value}];
        }
        data['_links'] = {type: {href: environment.apiUrl + '/rest/type/media/' + self.file_type}};
        obs.push(self.apiService.createMedia(data, self.variableService.token));
      });
    }
    return forkJoin(obs);
  }

}

@Component({
  selector: 'app-admin-file-upload-dialog',
  templateUrl: './admin-file-upload.dialog.html',
  styleUrls: ['./admin-file-upload.dialog.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminFileUploadDialogComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['select', 'thumbnail', 'filename'];
  public dataSource: any;
  public selection = new SelectionModel<FileObj>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public search = '';
  public loading = true;
  public variables: any;
  public total_count = 0;
  public type = 'all';

  constructor(
    public dialogRef: MatDialogRef<AdminFileUploadDialogComponent>,
    private apiService: ApiService,
    private variableService: VariableService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.type = this.data.type;
    this.variables = this.variableService;
  }

  ngAfterViewInit() {
    this.loadFiles();
  }

  loadFiles() {
    this.apiService.getFilesAdmin().subscribe( results => {
      this.total_count = results.length;
      this.dataSource = new MatTableDataSource<FileObj>(results);
      this.dataSource.filterPredicate = (item, filter) => this.contentFilter(item, filter);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.filterContent();
      this.loading = false;
    });
  }

  loadingPage(event: any) {
    document.querySelector('.mat-dialog-content').scroll(0, 0);
  }

  clearSelection() {
    this.selection.clear();
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

  onNoClick(): void {
    this.dialogRef.close([]);
  }

  addFiles(): void {
    this.dialogRef.close(this.selection.selected);
  }

}
