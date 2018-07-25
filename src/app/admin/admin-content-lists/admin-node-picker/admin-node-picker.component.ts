import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { VariableService } from '../../../services/variable.service';
import { GridOptions } from 'ag-grid';
import { ApiService } from '../../../services/api.service';
import { TitleRenderListComponent } from '../../admin-utils/title-render-list/title-render-list.component';
import { SelectFilterComponent } from '../../admin-utils/select-filter/select-filter.component';

@Component({
  selector: 'app-admin-node-picker',
  templateUrl: './admin-node-picker.component.html',
  styleUrls: ['./admin-node-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminNodePickerComponent implements OnInit {
  @Input() src;
  @Input() type;
  @Output() output = new EventEmitter();

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  addContent(type: string): void {
    const width = '95vw';
    const height = '80vh';
    const dialogRef = this.dialog.open(AdminNodePickerDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: { type: type }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.length > 0) {
        const self = this;
        result.forEach(function (item) {
          item.data.src = item.data.node_export;
          self.src.push(item.data);
        });
        this.output.next();
      }
    });
  }

}

@Component({
  selector: 'app-admin-node-picker-dialog',
  templateUrl: './admin-node-picker.dialog.html',
})
export class AdminNodePickerDialogComponent implements OnInit {
  public gridOptions: GridOptions;
  public columns = [];
  public nodes = [];
  public selection = [];
  public working = true;
  public variables: any;
  @ViewChild('agGrid') agGrid;

  constructor(
    public dialogRef: MatDialogRef<AdminNodePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private variableService: VariableService,
    private apiService: ApiService,
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
        'titleRenderer': TitleRenderListComponent,
        'selectFilter': SelectFilterComponent
      }
    };
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.load();
  }

  onNoClick(): void {
    this.dialogRef.close([]);
  }

  addNodes(): void {
    this.dialogRef.close(this.selection);
  }

  load() {
    const conn = this.apiService.getContentAdmin(this.data.type).subscribe( result => {
      this.nodes = result;
      const types = [{value: ''}];
      const types_tmp = [];
      this.nodes.forEach(function (item) {
        if (item.node_export.field_type && item.node_export.field_type.length > 0
          && types_tmp.indexOf(item.node_export.field_type[0].name.toLowerCase()) === -1) {
          types_tmp.push(item.node_export.field_type[0].name.toLowerCase());
        } else if (types_tmp.indexOf(item.node_export.type[0].target_id) === -1) {
          types_tmp.push(item.node_export.type[0].target_id);
        }
      });
      types_tmp.forEach(function (item) {
        types.push({
          value: item
        });
      });
      this.columns = [
        {
          headerName: 'Title',
          field: 'title',
          width: 450,
          minWidth: 350,
          filter: 'agTextColumnFilter',
          suppressMenu: true,
          checkboxSelection: true,
          floatingFilterComponentParams: { suppressFilterButton: true },
          cellRenderer: 'titleRenderer',
        },
        {
          headerName: 'Type',
          width: 125,
          maxWidth: 125,
          minWidth: 125,
          valueGetter: this.getType,
          suppressMenu: true,
          floatingFilterComponent: 'selectFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            opts: types
          },
        },
        {
          headerName: 'Language',
          width: 125,
          maxWidth: 125,
          minWidth: 125,
          valueGetter: this.getLang,
          suppressMenu: true,
          floatingFilterComponentParams: { suppressFilterButton: true },
        },
        {
          headerName: 'NID',
          width: 90,
          maxWidth: 90,
          minWidth: 90,
          valueGetter: this.getNid,
          suppressMenu: true,
          floatingFilterComponentParams: { suppressFilterButton: true },
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

  getType(params: any): any {
    if (params.data.node_export.field_type && params.data.node_export.field_type.length > 0) {
      return params.data.node_export.field_type[0].name.toLowerCase();
    } else {
      return params.data.node_export.type[0].target_id;
    }
  }

  getLang(params: any): any {
    return params.data.node_export.field_lang_status[0].value;
  }

  onSelectionChanged(event) {
    this.selection = event.api.getSelectedNodes();
  }

}
