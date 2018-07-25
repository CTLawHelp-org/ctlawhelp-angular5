import { Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-admin-filebrowser',
  templateUrl: './admin-filebrowser.component.html',
  styleUrls: ['./admin-filebrowser.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminFilebrowserComponent implements OnInit, OnDestroy {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('filenameFilter') filenameFilter: ElementRef;
  @ViewChild('filemimeFilter') filemimeFilter: ElementRef;
  public working = true;
  public variables: any;
  public files = [];
  public rows = [];
  public all = true;
  private ckFuncNum: string;

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.renderer2.addClass(this.document.body, 'no-headroom');
    if (this.route.snapshot.queryParams && this.route.snapshot.queryParams.CKEditorFuncNum) {
      this.ckFuncNum = this.route.snapshot.queryParams.CKEditorFuncNum;
    }
    if (this.route.snapshot.paramMap.get('id') && this.route.snapshot.paramMap.get('id') === 'images') {
      this.all = false;
    }
    this.apiService.getFilesAdmin().subscribe( results => {
      this.files = results;
      this.rows = results;
      this.working = false;
    });
  }

  ngOnDestroy() {
    this.renderer2.removeClass(this.document.body, 'no-headroom');
  }

  updateTextFilter(event: any, field: string) {
    const val = event.target.value.toLowerCase();
    const temp = this.rows.filter(function(d) {
      return d.file_export[field][0].value.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
  }

  clearFilter(input: any) {
    if (input['value']) {
      this.resetFilters();
      this.rows = JSON.parse(JSON.stringify(this.files));
    }
  }

  resetFilters() {
    this.filenameFilter.nativeElement.value = '';
    this.filemimeFilter.nativeElement.value = '';
  }

  chooseFile(url: any, file: any) {
    window.opener.CKEDITOR.tools.callFunction( this.ckFuncNum, url,
      function() {
        const dialog = this.getDialog();
        if (dialog.getName() === 'image') {
          const element = dialog.getContentElement('advanced', 'linkId');
          if (element) {
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
