import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { SelectFilterComponent } from '../../admin-utils/select-filter/select-filter.component';
import { ConfirmDialogComponent } from '../../admin-utils/confirm-dialog/confirm-dialog.component';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { TitleRenderPageComponent } from '../../admin-utils/title-render-page/title-render-page.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-pages',
  templateUrl: './admin-pages.component.html',
  styleUrls: ['./admin-pages.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminPagesComponent implements OnInit, AfterViewInit {
  public working = true;
  public pages = [];
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
        'titleRenderer': TitleRenderPageComponent,
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
    this.variables.adminTitle = 'Pages';
    const n_obs = this.apiService.getContentAdmin('page');
    const t_obs = this.apiService.getPageTypes();
    const conn = forkJoin([n_obs, t_obs]).subscribe( result => {
      this.pages = result[0];
      const types = [{value: ''}];
      result[1].forEach(function (item) {
        types.push({ value: item.name.toLowerCase() });
      });
      const lang = [
        {value: ''},
        {value: 'en'},
        {value: 'es'},
        {value: 'both'}
      ];
      const status = [
        {value: ''},
        {value: 'enabled'},
        {value: 'disabled'}
      ];
      const core = [
        {value: ''},
        {value: 'yes'},
        {value: 'no'}
      ];
      this.columns = [
        {
          headerName: 'Title',
          field: 'title',
          width: 450,
          minWidth: 350,
          filter: 'agTextColumnFilter',
          suppressMenu: true,
          floatingFilterComponentParams: { suppressFilterButton: true },
          cellRenderer: 'titleRenderer',
          checkboxSelection: true,
        },
        {
          headerName: 'Path',
          width: 200,
          valueGetter: this.getPath,
          suppressMenu: true,
          filter: 'agTextColumnFilter',
          floatingFilterComponentParams: { suppressFilterButton: true },
        },
        {
          headerName: 'Type',
          width: 150,
          minWidth: 150,
          valueGetter: this.getType,
          suppressMenu: true,
          floatingFilterComponent: 'selectFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            opts: types
          },
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
        /*{
          headerName: 'Core',
          width: 100,
          maxWidth: 100,
          minWidth: 100,
          valueGetter: this.getManaged,
          suppressMenu: true,
          floatingFilterComponent: 'selectFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            opts: core
          },
        },*/
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

  getStatus(params: any): any {
    return params.data.status_label;
  }

  getType(params: any): any {
    if (params.data.node_export.field_type && params.data.node_export.field_type.length > 0) {
      return params.data.node_export.field_type[0].name;
    } else {
      return '';
    }
  }

  getPath(params: any): any {
    if (params.data.node_export.field_path && params.data.node_export.field_path.length > 0) {
      return params.data.node_export.field_path[0].value;
    } else {
      return '';
    }
  }

  getLang(params: any): any {
    return params.data.node_export.field_lang_status[0].value;
  }

  getManaged(params: any): any {
    if (params.data.node_export.field_managed && params.data.node_export.field_managed[0].value === '1') {
      return 'Yes';
    } else {
      return 'No';
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
      _links: {type: {href: environment.apiUrl + '/rest/type/node/page'}}
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
      _links: {type: {href: environment.apiUrl + '/rest/type/node/page'}}
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
      if (item.data.node_export.field_managed && item.data.node_export.field_managed[0].value !== '1') {
        obs.push(self.apiService.deleteNode(item.data.nid, self.variables.token));
      }
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
