import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { TitleRenderComponent } from '../../admin-utils/title-render/title-render.component';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ConfirmDialogComponent } from '../../admin-utils/confirm-dialog/confirm-dialog.component';
import { SelectFilterComponent } from '../../admin-utils/select-filter/select-filter.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-triage-entries',
  templateUrl: './admin-triage-entries.component.html',
  styleUrls: ['./admin-triage-entries.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminTriageEntriesComponent implements OnInit, AfterViewInit {
  public working = true;
  public nodes = [];
  public gridOptions: GridOptions;
  public columns = [];
  public variables: any;
  @ViewChild('agGrid') agGrid;

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    private router: Router,
    public dialog: MatDialog,
  ) {
    this.gridOptions = <GridOptions>{
      floatingFilter: true,
      enableFilter: true,
      enableSorting: true,
      rowSelection: 'multiple',
      rowHeight: 50,
      headerHeight: 50,
      floatingFiltersHeight: 50,
      enableColResize: true,
      frameworkComponents: {
        'titleRenderer': TitleRenderComponent,
        'selectFilter': SelectFilterComponent
      }
    };
  }

  ngOnInit() {
    this.variables = this.variableService;
  }

  ngAfterViewInit() {
    this.load();
  }

  load() {
    this.variables.adminTitle = 'Triage Entries';
    const conn = this.apiService.getContentAdmin('triage_entry').subscribe( result => {
      this.nodes = result;
      const status = [
        {value: ''},
        {value: 'enabled'},
        {value: 'disabled'}
      ];
      const lang = [
        {value: ''},
        {value: 'en'},
        {value: 'es'},
        {value: 'both'}
      ];
      this.columns = [
        {
          headerName: 'Title',
          field: 'title',
          width: 350,
          minWidth: 350,
          filter: 'agTextColumnFilter',
          suppressMenu: true,
          floatingFilterComponentParams: { suppressFilterButton: true },
          cellRenderer: 'titleRenderer',
          checkboxSelection: true,
        },
        {
          headerName: 'Display Title',
          width: 350,
          valueGetter: this.getDisplayTitle,
          suppressMenu: true,
          filter: 'agTextColumnFilter',
          floatingFilterComponentParams: { suppressFilterButton: true },
        },
        {
          headerName: 'Status',
          width: 125,
          maxWidth: 125,
          minWidth: 125,
          valueGetter: this.getStatus,
          suppressMenu: true,
          cellClass: this.getStatus,
          floatingFilterComponent: 'selectFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            opts: status
          },
        },
        {
          headerName: 'NID',
          width: 110,
          maxWidth: 110,
          minWidth: 110,
          valueGetter: this.getNid,
          suppressMenu: true,
          floatingFilterComponentParams: { suppressFilterButton: true },
        },
        {
          headerName: 'Language',
          width: 125,
          maxWidth: 125,
          minWidth: 125,
          valueGetter: this.getLang,
          suppressMenu: true,
          cellClass: this.getLang,
          floatingFilterComponent: 'selectFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            opts: lang
          },
        },
      ];
      this.working = false;
      this.agGrid.api.sizeColumnsToFit();
      this.agGrid.api.doLayout();
      conn.unsubscribe();
    });
  }

  getNid(params: any): any {
    return params.data.node_export.nid[0].value;
  }

  getLang(params: any): any {
    return params.data.node_export.field_lang_status[0].value;
  }

  getStatus(params: any): any {
    return params.data.status_label;
  }

  getDisplayTitle(params: any): any {
    if (params.data.node_export.field_display_title && params.data.node_export.field_display_title.length > 0) {
      return params.data.node_export.field_display_title[0].value;
    } else {
      return '';
    }
  }

  clearSelection() {
    this.agGrid.api.deselectAll();
  }

  unpubSelection() {
    this.working = true;
    const selection = this.agGrid.api.getSelectedNodes();
    const obs = [];
    const self = this;
    const data = {
      status: [{value: '0'}],
      _links: {type: {href: environment.apiUrl + '/rest/type/node/triage_entry'}}
    };
    selection.forEach(function (item) {
      obs.push(self.apiService.updateNode(item.data.nid, data, self.variables.token));
    });
    if (obs.length > 0) {
      forkJoin(obs).subscribe( result => {
        this.load();
      });
    } else {
      this.working = false;
    }
  }

  pubSelection() {
    this.working = true;
    const selection = this.agGrid.api.getSelectedNodes();
    const obs = [];
    const self = this;
    const data = {
      status: [{value: '1'}],
      _links: {type: {href: environment.apiUrl + '/rest/type/node/triage_entry'}}
    };
    selection.forEach(function (item) {
      obs.push(self.apiService.updateNode(item.data.nid, data, self.variables.token));
    });
    if (obs.length > 0) {
      forkJoin(obs).subscribe( result => {
        this.load();
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
    const selection = this.agGrid.api.getSelectedNodes();
    const obs = [];
    const self = this;
    selection.forEach(function (item) {
      obs.push(self.apiService.deleteNode(item.data.nid, self.variables.token));
    });
    if (obs.length > 0) {
      forkJoin(obs).subscribe( result => {
        this.load();
      });
    } else {
      this.working = false;
    }
  }

}
