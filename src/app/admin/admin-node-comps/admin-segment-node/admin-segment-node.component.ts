import {
  Component,
  ElementRef, EventEmitter,
  Inject,
  Input,
  OnInit, Output,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariableService } from '../../../services/variable.service';
import { ApiService } from '../../../services/api.service';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../../environments/environment';

declare var CKEDITOR: any;

@Component({
  selector: 'app-admin-segment-node',
  templateUrl: './admin-segment-node.component.html',
  styleUrls: ['./admin-segment-node.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminSegmentNodeComponent implements OnInit {
  @Input() curNode;
  @Input() inDialog = false;
  @Output() output = new EventEmitter();
  @ViewChild('segmentForm', { static: false }) segmentForm: ElementRef;
  public working = true;
  public id: string;
  public variables: any;
  public node = [];
  public segment_node: any;
  public segment_node_es: any;

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
    this.node = [];
    this.segment_node = {
      'title': [{'value': ''}],
      'body': [{'value': '', 'summary': '', 'format': 'full_html'}],
      'status': [{'value': '1'}],
      'field_lang_status': [{'value': 'en'}],
      'field_node_reference': [],
      'field_meta_text': [{'value': ''}],
    };
    this.segment_node_es = {
      'title': [{'value': ''}],
      'body': [{'value': '', 'summary': '', 'format': 'full_html'}],
      'field_node_reference': [],
      'field_meta_text': [{'value': ''}],
    };
    if (this.curNode && this.curNode.length > 0) {
      this.node = this.curNode;
      this.id = this.curNode[0].new ? 'new' : this.curNode[0].nid;
      this.doneLoading();
    } else {
      this.router.navigate(['/admin']);
    }
  }

  doneLoading() {
    if (this.id !== 'new' && this.node.length > 0) {
      if (!this.inDialog) {
        this.variables.adminTitle = 'Editing Segment';
      }
      this.segment_node['status'] = this.node[0].node_export['status'];
      this.segment_node['field_lang_status'] = this.node[0].node_export['field_lang_status'];
      // english
      this.segment_node['title'] = this.node[0].node_export['title'];
      this.segment_node['body'] = this.node[0].node_export['body'].length > 0
        ? this.node[0].node_export['body'] : [{'value': '', 'format': 'full_html'}];
      this.segment_node['field_meta_text'] = this.node[0].node_export['field_meta_text'].length > 0
        ? this.node[0].node_export['field_meta_text'] : [{'value': ''}];
      this.segment_node['field_node_reference'] = this.node[0].node_export['field_node_reference'];
      // spanish
      this.segment_node_es['title'] = this.node[0].node_export.i18n.es['title'];
      this.segment_node_es['body'] = this.node[0].node_export.i18n.es['body'].length > 0
        ? this.node[0].node_export.i18n.es['body'] : [{'value': '', 'format': 'full_html'}];
      this.segment_node_es['field_meta_text'] = this.node[0].node_export.i18n.es['field_meta_text'].length > 0
        ? this.node[0].node_export.i18n.es['field_meta_text'] : [{'value': ''}];
      this.segment_node_es['field_node_reference'] = this.node[0].node_export.i18n.es['field_node_reference'];
    } else if (!this.inDialog) {
      this.variables.adminTitle = 'Adding Segment';
    }
    this.working = false;
  }

  saveNode() {
    if (this.segmentForm['valid']) {
      this.working = true;
      const data_en = this.segment_node;
      data_en.body = [{value: CKEDITOR.instances.segbody_en.getData(), format: 'full_html'}];
      data_en['_links'] = {type: {href: environment.apiUrl + '/rest/type/node/segment'}};
      const data_es = this.segment_node_es;
      data_es.body = [{value: CKEDITOR.instances.segbody_es.getData(), format: 'full_html'}];
      data_es['_links'] = {type: {href: environment.apiUrl + '/rest/type/node/segment'}};
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
            if (this.inDialog) {
              this.output.next(results);
            } else if (this.variables.previousUrl !== '' && results.status[0].value) {
              window.open(this.variables.previousUrl, '_self');
            } else {
              this.router.navigate(['/admin/content/browse/segment']);
            }
          });
        });
      } else {
        // prev node
        this.apiService.updateNode(this.id, data_en, this.variableService.token).subscribe(results => {
          this.apiService.updateNodeES(this.id, data_es, this.variableService.token).subscribe(results_es => {
            if (this.inDialog) {
              this.output.next(results);
            } else if (this.variables.previousUrl !== '' && results.status[0].value) {
              window.open(this.variables.previousUrl, '_self');
            } else {
              this.router.navigate(['/admin/content/browse/segment']);
            }
          });
        });
      }
    }
  }

}
