import { Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariableService } from '../../../services/variable.service';
import { ApiService } from '../../../services/api.service';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

declare var CKEDITOR: any;

@Component({
  selector: 'app-admin-block-node',
  templateUrl: './admin-block-node.component.html',
  styleUrls: ['./admin-block-node.component.scss']
})
export class AdminBlockNodeComponent implements OnInit {
  @Input() curNode;
  @ViewChild('blockForm', { static: false }) blockForm: ElementRef;
  public working = true;
  public id: string;
  private subscription: any;
  public variables: any;
  public node = [];
  public block_node: any;
  public block_node_es: any;
  public icons = [];
  public selected_icon: string;
  public block_type = [];
  public selected_type: string;
  public block_style = [
    { label: 'Choose Style', value: '' },
    { label: 'Drop Shadow', value: 'drop' },
    { label: 'Alert', value: 'alert' },
    { label: 'Home Large', value: 'home_lg' },
    { label: 'Home Small', value: 'home_sm' }
  ];
  public selected_style: string;
  public settings = {
    'value': ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private variableService: VariableService,
    private apiService: ApiService,
    private renderer2: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.load();
  }

  load() {
    const self = this;
    this.node = [];
    this.block_node = {
      'title': [{'value': ''}],
      'body': [{'value': '', 'format': 'full_html'}],
      'status': [{'value': '1'}],
      'field_lang_status': [{'value': 'en'}],
      'field_nodes': [],
      'field_style': [{'value': ''}],
      'field_block_type': [],
      'field_icon': [],
      'field_link': [{'value': ''}],
      'field_settings': [{'value': ''}],
      'field_private_image': [],
    };
    this.block_node_es = {
      'title': [{'value': ''}],
      'body': [{'value': '', 'format': 'full_html'}],
      'field_nodes': [],
      'field_link': [{'value': ''}],
    };
    if (this.curNode && this.curNode.length > 0) {
      this.node = this.curNode;
      this.id = this.curNode[0].new ? 'new' : this.curNode[0].nid;
      const obv_array = [this.apiService.getBlockTypes(), this.apiService.getIcons()];
      forkJoin(obv_array).subscribe( data => {
        if (this.block_type.length < 1) {
          this.block_type.push({
            label: 'Choose Type',
            value: ''
          });
          data[0].forEach(function (item) {
            self.block_type.push({
              label: item.name,
              value: item.tid
            });
          });
        }
        if (this.icons.length < 1) {
          self.icons.push({
            label: 'None',
            value: ''
          });
          data[1].forEach(function (item) {
            self.icons.push({
              label: item.name,
              value: item.tid,
              url: item.term_export.field_public_term_file.length > 0 ? item.term_export.field_public_term_file[0].url : ''
            });
          });
        }
        this.doneLoading();
      });
    } else {
      this.router.navigate(['/admin']);
    }
  }

  doneLoading() {
    if (this.id !== 'new' && this.node.length > 0) {
      this.variables.adminTitle = 'Editing Block';
      this.block_node['status'] = this.node[0].node_export['status'];
      this.block_node['field_lang_status'] = this.node[0].node_export['field_lang_status'];
      this.block_node['field_style'] = this.node[0].node_export['field_style'];
      this.selected_style = this.block_node['field_style'].length > 0 ? this.block_node['field_style'][0]['value'] : '';
      this.block_node['field_block_type'] = this.node[0].node_export['field_block_type'];
      this.selected_type = this.block_node['field_block_type'].length > 0 ? this.block_node['field_block_type'][0]['target_id'] : '';
      this.block_node['field_icon'] = this.node[0].node_export['field_icon'];
      this.selected_icon = this.block_node['field_icon'].length > 0 ? this.block_node['field_icon'][0]['target_id'] : '';
      this.block_node['field_settings'] = this.node[0].node_export['field_settings'];
      this.settings['value'] = this.block_node['field_settings'].length > 0 ? this.block_node['field_settings'][0]['value'] : '';
      this.block_node['field_private_image'] = this.node[0].node_export['field_private_image'];
      // english
      this.block_node['title'] = this.node[0].node_export['title'];
      this.block_node['body'] = this.node[0].node_export['body'].length > 0
        ? this.node[0].node_export['body'] : [{'value': '', 'format': 'full_html'}];
      this.block_node['field_link'] = this.node[0].node_export['field_link'].length > 0
        ? this.node[0].node_export['field_link'] : [{'value': ''}];
      this.block_node['field_nodes'] = this.node[0].node_export['field_nodes'];
      // spanish
      this.block_node_es['title'] = this.node[0].node_export.i18n.es['title'];
      this.block_node_es['body'] = this.node[0].node_export.i18n.es['body'].length > 0
        ? this.node[0].node_export.i18n.es['body'] : [{'value': '', 'format': 'full_html'}];
      this.block_node_es['field_link'] = this.node[0].node_export.i18n.es['field_link'].length > 0
        ? this.node[0].node_export.i18n.es['field_link'] : [{'value': ''}];
      this.block_node_es['field_nodes'] = this.node[0].node_export.i18n.es['field_nodes'];
    } else {
      this.variables.adminTitle = 'Adding Block';
    }
    this.working = false;
  }

  saveNode() {
    if (this.blockForm['valid']) {
      this.working = true;
      const data_en = this.block_node;
      data_en.body = [{value: CKEDITOR.instances.blockbody_en.getData(), format: 'full_html'}];
      data_en['_links'] = {type: {href: environment.apiUrl + '/rest/type/node/block'}};
      const data_es = this.block_node_es;
      data_es.body = [{value: CKEDITOR.instances.blockbody_es.getData(), format: 'full_html'}];
      data_es['_links'] = {type: {href: environment.apiUrl + '/rest/type/node/block'}};
      // settings
      data_en['field_settings'] = [{ value: JSON.stringify(this.settings['value'])}];
      // check required
      if (data_es.title[0].value.length < 1 && data_en.title[0].value.length > 0) {
        data_es.title[0].value = data_en.title[0].value;
      }
      if (data_en.title[0].value.length < 1 && data_es.title[0].value.length > 0) {
        data_en.title[0].value = data_es.title[0].value;
      }
      if (this.id === 'new') {
        // new node
        this.apiService.createNode(data_en, this.variableService.token).subscribe(results => {
          const nid = results.nid[0].value;
          this.apiService.updateNodeES(nid, data_es, this.variableService.token).subscribe(results_es => {
            if (this.variables.previousUrl !== '' && results.status[0].value) {
              window.open(this.variables.previousUrl, '_self');
            } else {
              this.router.navigate(['/admin/content/browse/block']);
            }
          });
        });
      } else {
        // prev node
        this.apiService.updateNode(this.id, data_en, this.variableService.token).subscribe(results => {
          this.apiService.updateNodeES(this.id, data_es, this.variableService.token).subscribe(results_es => {
            if (this.variables.previousUrl !== '' && results.status[0].value) {
              window.open(this.variables.previousUrl, '_self');
            } else {
              this.router.navigate(['/admin/content/browse/block']);
            }
          });
        });
      }
    }
  }

}
