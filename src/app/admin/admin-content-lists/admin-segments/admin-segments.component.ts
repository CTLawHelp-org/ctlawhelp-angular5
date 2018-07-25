import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TitleRenderComponent } from '../../admin-utils/title-render/title-render.component';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../admin-utils/confirm-dialog/confirm-dialog.component';
import { environment } from '../../../../environments/environment';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { GridOptions } from 'ag-grid';
import { SelectFilterComponent } from '../../admin-utils/select-filter/select-filter.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-admin-segments',
  templateUrl: './admin-segments.component.html',
  styleUrls: ['./admin-segments.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminSegmentsComponent implements OnInit, AfterViewInit {
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
    this.variables.adminTitle = 'Segments';
    const n_obs = this.apiService.getContentAdmin('segment');
    const o_obs = this.apiService.getAdminOrphans();
    const conn = forkJoin([n_obs, o_obs]).subscribe( result => {
      // process nodes
      if (result[1].length > 0) {
        result[0].forEach(function (i) {
          let found = false;
          result[1].forEach(function (o) {
            if (i.nid === o.nid) {
              found = true;
            }
          });
          if (found) {
            i.orphan_status = 'Yes';
          } else {
            i.orphan_status = 'No';
          }
        });
      }
      this.nodes = result[0];
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
      const orphan = [
        {value: ''},
        {value: 'yes'},
        {value: 'no'}
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
        {
          headerName: 'Orphan',
          width: 125,
          maxWidth: 125,
          minWidth: 125,
          valueGetter: this.getOrphan,
          suppressMenu: true,
          cellClass: this.getOrphan,
          floatingFilterComponent: 'selectFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            opts: orphan
          },
        }
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

  getOrphan(params: any): any {
    return params.data.orphan_status;
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
      _links: {type: {href: environment.apiUrl + '/rest/type/node/segment'}}
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
      _links: {type: {href: environment.apiUrl + '/rest/type/node/segment'}}
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
