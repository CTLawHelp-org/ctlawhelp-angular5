import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { GridOptions } from 'ag-grid';
import { TitleRenderComponent } from '../../admin-utils/title-render/title-render.component';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { MatDialog } from '@angular/material';
import { AdminNodePickerDialogComponent } from '../admin-node-picker/admin-node-picker.component';
import { ConfirmDialogComponent } from '../../admin-utils/confirm-dialog/confirm-dialog.component';
import { SelectFilterComponent } from '../../admin-utils/select-filter/select-filter.component';

@Component({
  selector: 'app-admin-blocks',
  templateUrl: './admin-blocks.component.html',
  styleUrls: ['./admin-blocks.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminBlocksComponent implements OnInit, AfterViewInit {
  public working = true;
  public blocks = [];
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
    this.variables.adminTitle = 'Blocks';
    const conn = this.apiService.getContentAdmin('block').subscribe( result => {
      this.blocks = result;
      const lang = [
        {value: ''},
        {value: 'en'},
        {value: 'es'},
        {value: 'both'}
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
