import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-term-node-order',
  templateUrl: './admin-term-node-order.component.html',
  styleUrls: ['./admin-term-node-order.component.scss']
})
export class AdminTermNodeOrderComponent implements OnInit {
  @Input() term;
  @Output() output = new EventEmitter();
  public nodes = [];
  public all_nodes = [];

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
  ) {}

  ngOnInit() {
    if (this.term) {
      this.nodes = this.term.term_export.field_node_order;
      this.loadNodes();
    }
  }

  loadNodes() {
    this.apiService.getAdminNSMIContent(this.term.term_export.tid[0].value).subscribe( result => {
      const self = this;
      const node_array = [];
      if (this.term.term_export.field_node_order.length > 0) {
        this.term.term_export.field_node_order.forEach(function (item) {
          result.forEach(function (node) {
            node.status = node.node_export.status[0].value === '1';
            if (item.target_id === node.nid) {
              item.name = node.title;
              item.src = node;
              item.status = node.status;
              node_array.push(item);
              node.hide = true;
            }
          });
        });
        this.nodes = node_array;
      } else {
        result.forEach(function (node) {
          node.status = node.node_export.status[0].value === '1';
        });
      }
      this.all_nodes = result;
    });
  }

  cancelOrder() {
    this.output.next(false);
  }

  saveOrder() {
    const order = [];
    this.nodes.forEach(function (item) {
      order.push({target_id: item.target_id});
    });
    const data = {
      field_node_order: order,
      _links: {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/' + this.term.term_export.vid[0].target_id}}
    };
    this.apiService.updateTerm(this.term.term_export.tid[0].value, data, this.variableService.token).subscribe( result => {
      this.output.next(true);
    });
  }

  removeFromList(index: number) {
    const obj = this.nodes.splice(index, 1);
    this.all_nodes.forEach(function (item) {
      if (item.nid === obj[0].target_id) {
        item.hide = false;
      }
    });
  }

  addToList(term: any) {
    term.target_id = term.nid;
    term.name = term.title;
    term.status = term.status;
    term.hide = true;
    this.nodes.push(term);
  }

}
