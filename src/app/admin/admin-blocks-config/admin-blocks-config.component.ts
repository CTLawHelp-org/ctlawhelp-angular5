import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-blocks-config',
  templateUrl: './admin-blocks-config.component.html',
  styleUrls: ['./admin-blocks-config.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminBlocksConfigComponent implements OnInit {
  public variables: any;
  public blocks = [];
  public currblocks = {
    content_top: [],
    left: [],
    right: [],
    content_bottom: [],
  };
  public showBlockList = false;
  public blockSrc: any;
  public working = true;
  public currentIndex = 0;
  @Output() success = new EventEmitter();

  constructor(
    private variableService: VariableService,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    const conn = this.apiService.getContentAdmin('block').subscribe( result => {
      this.blocks = result;
      // new
      if (this.variables.currentBlocksSrc.new) {
        this.variables.currentBlocksSrc.term_export = {
          name: [{value: ''}],
          description: [{value: ''}],
          field_status: [{value: '1'}],
          field_block_source: [],
          field_block_taxonomy_source: []
        };
        this.variables.currentBlocksSrc.editing = true;
        this.currentIndex = 1;
      } else {
        if (this.variables.currentBlocksSrc.term_export.field_block_source
          && this.variables.currentBlocksSrc.term_export.field_block_source.length > 0) {
          this.variables.currentBlocksSrc.source = 'node';
        } else if (this.variables.currentBlocksSrc.term_export.field_block_taxonomy_source
          && this.variables.currentBlocksSrc.term_export.field_block_taxonomy_source.length > 0) {
          this.variables.currentBlocksSrc.source = 'taxonomy';
        }
      }
      this.setupBlocks(this.variables.currentBlocks);
      this.working = false;
      conn.unsubscribe();
    });
  }

  setupBlocks(items: any) {
    const self = this;
    items.forEach(function (item) {
      if (!item.processed) {
        item.value = item.value.split(',');
        item.processed = true;
      }
      self.blocks.forEach(function (block) {
        if (item.target_id === block.nid) {
          self.currblocks[item.value[0]][item.value[1]] = block;
        }
      });
    });
  }

  addSource(src: any) {
    src.push({target_id: ''});
  }

  isManaged(src: any): boolean {
    let output = false;
    if (src.term_export.field_term_managed && src.term_export.field_term_managed[0].value === '1') {
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

  addBlocksTo(src: any) {
    this.showBlockList = true;
    this.blockSrc = src;
  }

  addBlockTo(block: any, src: any) {
    src.push(block);
  }

  addTo($event: any, src: any) {
    if ($event) {
      src.push($event.dragData);
    }
  }

  closeConfig() {
    this.success.next();
  }

  saveBlocks() {
    this.working = true;
    const data = {
      name: [{value: this.variables.currentBlocksSrc.term_export.name[0].value}],
      description: [{value: this.variables.currentBlocksSrc.term_export.description[0].value}],
      field_status: [{value: this.variables.currentBlocksSrc.term_export.field_status[0].value}],
      _links: {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/blocks'}}
    };
    if (this.variables.currentBlocksSrc.term_export.field_block_source
      && this.variables.currentBlocksSrc.term_export.field_block_source.length > 0) {
      data['field_block_source'] = this.variables.currentBlocksSrc.term_export.field_block_source;
    } else if (this.variables.currentBlocksSrc.term_export.field_block_taxonomy_source
      && this.variables.currentBlocksSrc.term_export.field_block_taxonomy_source.length > 0) {
      data['field_block_taxonomy_source'] = this.variables.currentBlocksSrc.term_export.field_block_taxonomy_source;
    }
    const barray = [];
    // left
    this.currblocks['left'].forEach(function (item, index) {
      barray.push({
        target_id: item.target_id,
        value: 'left,' + index
      });
    });
    // content_top
    this.currblocks['content_top'].forEach(function (item, index) {
      barray.push({
        target_id: item.target_id,
        value: 'content_top,' + index
      });
    });
    // content_bottom
    this.currblocks['content_bottom'].forEach(function (item, index) {
      barray.push({
        target_id: item.target_id,
        value: 'content_bottom,' + index
      });
    });
    // right
    this.currblocks['right'].forEach(function (item, index) {
      barray.push({
        target_id: item.target_id,
        value: 'right,' + index
      });
    });
    data['field_block_setup'] = barray;
    if (this.variables.currentBlocksSrc.new) {
      this.apiService.createTerm(data, this.variables.token).subscribe( result => {
        this.success.next();
      });
    } else {
      this.apiService.updateTerm(this.variables.currentBlocksSrc.tid, data, this.variables.token).subscribe( result => {
        this.success.next();
      });
    }
  }

}
