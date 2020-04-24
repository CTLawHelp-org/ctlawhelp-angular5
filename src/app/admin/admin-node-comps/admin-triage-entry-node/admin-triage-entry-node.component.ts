import { Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariableService } from '../../../services/variable.service';
import { ApiService } from '../../../services/api.service';
import { DOCUMENT } from '@angular/common';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { environment } from '../../../../environments/environment';

declare var CKEDITOR: any;

@Component({
  selector: 'app-admin-triage-entry-node',
  templateUrl: './admin-triage-entry-node.component.html',
  styleUrls: ['./admin-triage-entry-node.component.scss']
})
export class AdminTriageEntryNodeComponent implements OnInit {
  @Input() curNode;
  @ViewChild('triageForm', { static: false }) triageForm: ElementRef;
  public working = true;
  public id: string;
  public variables: any;
  public node = [];
  public triage_node: any;
  public triage_node_es: any;
  public icons = [];
  public selected_icon: string;

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
    this.triage_node = {
      'title': [{'value': ''}],
      'body': [{'value': '', 'format': 'full_html'}],
      'status': [{'value': '1'}],
      'field_lang_status': [{'value': 'en'}],
      'field_display_title': [{'value': ''}],
      'field_icon': [],
    };
    this.triage_node_es = {
      'title': [{'value': ''}],
      'body': [{'value': '', 'format': 'full_html'}],
      'field_display_title': [{'value': ''}],
    };
    if (this.curNode && this.curNode.length > 0) {
      this.node = this.curNode;
      this.id = this.curNode[0].new ? 'new' : this.curNode[0].nid;
      const obv_array = [this.apiService.getIcons()];
      forkJoin(obv_array).subscribe( data => {
        if (this.icons.length < 1) {
          self.icons.push({
            label: 'None',
            value: ''
          });
          data[0].forEach(function (item) {
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
      this.variables.adminTitle = 'Editing Triage Entry';
      this.triage_node['status'] = this.node[0].node_export['status'];
      this.triage_node['field_lang_status'] = this.node[0].node_export['field_lang_status'];
      this.triage_node['field_icon'] = this.node[0].node_export['field_icon'];
      this.selected_icon = this.triage_node['field_icon'].length > 0 ? this.triage_node['field_icon'][0]['target_id'] : '';
      // english
      this.triage_node['title'] = this.node[0].node_export['title'];
      this.triage_node['body'] = this.node[0].node_export['body'].length > 0
        ? this.node[0].node_export['body'] : [{'value': '', 'format': 'full_html'}];
      this.triage_node['field_display_title'] = this.node[0].node_export['field_display_title'].length > 0
        ? this.node[0].node_export['field_display_title'] : [{ value: ''}];
      // spanish
      this.triage_node_es['title'] = this.node[0].node_export.i18n.es['title'];
      this.triage_node_es['body'] = this.node[0].node_export.i18n.es['body'].length > 0
        ? this.node[0].node_export.i18n.es['body'] : [{'value': '', 'format': 'full_html'}];
      this.triage_node_es['field_display_title'] = this.node[0].node_export.i18n.es['field_display_title'].length > 0
        ? this.node[0].node_export.i18n.es['field_display_title'] : [{ value: ''}];
    } else {
      this.variables.adminTitle = 'Adding Triage Entry';
    }
    this.working = false;
  }

  saveNode() {
    if (this.triageForm['valid']) {
      this.working = true;
      const data_en = this.triage_node;
      data_en.body = [{value: CKEDITOR.instances.segbody_en.getData(), format: 'full_html'}];
      data_en['_links'] = {type: {href: environment.apiUrl + '/rest/type/node/triage_entry'}};
      const data_es = this.triage_node_es;
      data_es.body = [{value: CKEDITOR.instances.segbody_es.getData(), format: 'full_html'}];
      data_es['_links'] = {type: {href: environment.apiUrl + '/rest/type/node/triage_entry'}};
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
              this.router.navigate(['/admin/content/browse/triage_entry']);
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
              this.router.navigate(['/admin/content/browse/triage_entry']);
            }
          });
        });
      }
    }
  }

}
