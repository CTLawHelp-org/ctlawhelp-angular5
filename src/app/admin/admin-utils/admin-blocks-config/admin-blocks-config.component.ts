import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../../services/variable.service';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ITreeOptions, TREE_ACTIONS } from 'angular-tree-component';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

export class BlockConfig {
  id = '';
  columns = 1;
  data = {
    id: '',
    columns: [
      {
        value: 100,
        nodes: []
      }
    ],
    class: '',
    status: '1'
  };
}

export class BlockNode {
  target_id: string;
  value = [{
    pos: ['', '0', '0']
  }];
  name: string;
  display = 'all';
  class = '';
  flex = 100;
  msrc = '';
}

@Component({
  selector: 'app-admin-blocks-config',
  templateUrl: './admin-blocks-config.component.html',
  styleUrls: ['./admin-blocks-config.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminBlocksConfigComponent implements OnInit {
  public variables: any;
  public blocks = [];
  public cur_setup: any;
  public cur_obj: any;
  public new_config = new BlockConfig();
  public working = true;
  public currentIndex = 1;
  @Output() success = new EventEmitter();
  public nsmi = [];
  public nsmi_options: ITreeOptions = {
    useCheckbox: true,
    useTriState: false
  };
  @ViewChild('tree', { static: false }) tree;

  constructor(
    private variableService: VariableService,
    private apiService: ApiService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    const conn = forkJoin([this.apiService.getContentAdmin('block'), this.apiService.getNSMI()]).subscribe( result => {
      this.blocks = result[0];
      this.nsmi = result[1]['nsmi'];
      this.load();
      conn.unsubscribe();
    });
  }

  load() {
    // new
    if (this.variables.currentBlocksSrc.new) {
      this.variables.currentBlocksSrc.term_export = {
        name: [{value: ''}],
        description: [{value: ''}],
        field_status: [{value: '1'}],
        field_block_source: [],
        field_block_taxonomy_source: [],
        field_config: [],
        field_term_managed: []
      };
      this.variables.currentBlocksSrc.editing = true;
      this.variables.currentBlocksSrc.source = 'node';
      this.variables.currentBlocksSrc.source_type = '';
      this.currentIndex = 0;
    } else {
      if (this.variables.currentBlocksSrc.term_export.field_block_manual_source
        && this.variables.currentBlocksSrc.term_export.field_block_manual_source.length > 0) {
        if (this.variables.currentBlocksSrc.term_export.field_block_manual_source[0]['value'] === 'node-tid') {
          this.variables.currentBlocksSrc.source = 'node';
          this.variables.currentBlocksSrc.source_type = 'taxonomy';
        }
      } else if (this.variables.currentBlocksSrc.term_export.field_block_source
        && this.variables.currentBlocksSrc.term_export.field_block_source.length > 0) {
        this.variables.currentBlocksSrc.source = 'node';
        this.variables.currentBlocksSrc.source_type = 'node';
      } else if (this.variables.currentBlocksSrc.term_export.field_block_taxonomy_source
        && this.variables.currentBlocksSrc.term_export.field_block_taxonomy_source.length > 0) {
        this.variables.currentBlocksSrc.source = 'taxonomy';
        this.variables.currentBlocksSrc.source_type = '';
      }
    }
    this.cur_setup = this.variables.processBlock([this.variables.currentBlocksSrc]);
    this.working = false;
    setTimeout( () => {
      this.setupNSMI();
    });
  }

  setupNSMI() {
    const self = this;
    if (this.variables.currentBlocksSrc.term_export.field_block_taxonomy_source
      && this.variables.currentBlocksSrc.term_export.field_block_taxonomy_source.length > 0) {
      this.variables.currentBlocksSrc.term_export.field_block_taxonomy_source.forEach(function (item) {
        const cnode = self.tree.treeModel.getNodeById(item.target_id);
        cnode.ensureVisible();
        cnode.setIsSelected(true);
      });
    }
  }

  showTree(): boolean {
    return this.variables.currentBlocksSrc.source === 'taxonomy' ||
      (this.variables.currentBlocksSrc.source === 'node' && this.variables.currentBlocksSrc.source_type === 'taxonomy');
  }

  tabChange(event: any) {
    if (event.index === 2 && this.cur_setup.length > 0) {
      this.cur_setup.forEach(function (item) {
        item.columns.forEach(function (col) {
          if (col.nodes.length > 0) {
            col.nodes.forEach(function (node) {
              node.value[0]['class'] = node.class ? node.class : '';
              node.value[0]['flex'] = node.flex ? node.flex : 100;
              if (node.display === 'desktop') {
                node.desktop = true;
                node.mobile = false;
              } else if (node.display === 'mobile') {
                node.mobile = true;
                node.desktop = false;
              } else if (node.display === 'all') {
                node.mobile = false;
                node.desktop = false;
              }
            });
          }
        });
      });
    }
  }

  addNewConfig() {
    const self = this;
    this.new_config.data.id = this.new_config.id;
    if (this.new_config.columns > 1) {
      const fl = Math.round(100 / this.new_config.columns);
      this.new_config.data.columns[0].value = fl;
      for (let i = 1; i < this.new_config.columns; i++) {
        self.new_config.data.columns.push({
          value: fl,
          nodes: []
        });
      }
    }
    this.cur_setup.push(this.new_config.data);
    this.new_config = new BlockConfig();
  }

  addNode(setup: any, config: any, node: any) {
    if (node.result.length > 0) {
      node.result.forEach(function (i) {
        const obj = new BlockNode();
        obj.name = i.title;
        obj.target_id = i.nid;
        if (i.node_export.field_manual_source && i.node_export.field_manual_source.length > 0) {
          obj.value[0]['msrc'] = i.node_export.field_manual_source[0].value;
          obj['msrc'] = i.node_export.field_manual_source[0].value;
        }
        obj.value[0].pos[0] = setup.id;
        config.nodes.push(obj);
      });
    }
  }

  saveChanges(): void {
    const setup = JSON.parse(JSON.stringify(this.cur_setup));
    const config = [];
    const nodes = [];
    setup.forEach(function (item) {
      const nitem = {
        id: item.id,
        columns: [],
        class: item.class ? item.class : '',
        status: item.status ? item.status : '1'
      };
      item.columns.forEach(function (col, index) {
        col.nodes.forEach(function (n, idx) {
          const nnode = {
            target_id: n.target_id,
            value: ''
          };
          const nobj = {
            pos: [item.id, index, idx],
            class: n.class
          };
          if (n.msrc) {
            nobj['msrc'] = n.msrc;
          }
          if (n.flex) {
            nobj['flex'] = n.flex;
          }
          if (n.display === 'desktop') {
            nobj['desktop'] = true;
          } else if (n.display === 'mobile') {
            nobj['mobile'] = true;
          }
          nnode.value = JSON.stringify([nobj]);
          nodes.push(nnode);
        });
        col.class = col.class ? col.class : '';
        col.nodes = [];
      });
      nitem.columns = item.columns;
      config.push(nitem);
    });
    this.working = true;
    const data = {
      name: this.variables.currentBlocksSrc.term_export.name,
      description: this.variables.currentBlocksSrc.term_export.description,
      field_status: this.variables.currentBlocksSrc.term_export.field_status,
      field_block_source: this.variables.currentBlocksSrc.term_export.field_block_source,
      field_config: [{value: JSON.stringify(config)}],
      field_block_setup: nodes,
      _links: {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/blocks'}}
    };
    // nsmi
    if (typeof this.tree !== 'undefined') {
      const selectedNodes = [];
      Object.entries(this.tree.treeModel.selectedLeafNodeIds).forEach(([key, value]) => {
        if (value === true) {
          selectedNodes.push({
            target_id: key
          });
        }
      });
      data['field_block_taxonomy_source'] = selectedNodes;
    }
    if (this.variables.currentBlocksSrc.source === 'node' && this.variables.currentBlocksSrc.source_type === 'taxonomy') {
      data['field_block_manual_source'] = [{value: 'node-tid'}];
    }
    // Save
    if (this.variables.currentBlocksSrc.new) {
      this.apiService.createTerm(data, this.variables.token).subscribe(results => {
        this.success.next();
      });
    } else {
      const tid = this.variables.currentBlocksSrc.term_export.tid[0].value;
      this.apiService.updateTerm(tid, data, this.variables.token).subscribe(results => {
        this.success.next();
      });
    }
  }

  closeConfig() {
    this.success.next();
  }

  addSource(src: any) {
    src.push({target_id: ''});
  }

  isManaged(src: any): boolean {
    let output = false;
    if (src.term_export.field_term_managed.length > 0 && src.term_export.field_term_managed[0].value === '1') {
      output = true;
    }
    return output;
  }

  isEnabled(src: any): boolean {
    let output = false;
    if (src.term_export.field_status && src.term_export.field_status[0].value === '1') {
      output = true;
    }
    return output;
  }

  setStatus(event: any) {
    if (event.checked) {
      this.variables.currentBlocksSrc.term_export.field_status[0].value = '1';
    } else {
      this.variables.currentBlocksSrc.term_export.field_status[0].value = '0';
    }
  }

  confirmDelete(index: number) {
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
        this.variables.removeArray(index, this.cur_setup);
      }
    });
  }

}
