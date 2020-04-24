import {
  Component,
  ElementRef,
  Inject, Input,
  OnInit,
  PLATFORM_ID,
  Renderer2, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariableService } from '../../../services/variable.service';
import { ApiService } from '../../../services/api.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ITreeOptions, TREE_ACTIONS } from 'angular-tree-component';
import { ContentListDialogComponent } from '../../../core/content-list/content-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

declare var CKEDITOR: any;

@Component({
  selector: 'app-admin-page-node',
  templateUrl: './admin-page-node.component.html',
  styleUrls: ['./admin-page-node.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminPageNodeComponent implements OnInit {
  @Input() curNode;
  @ViewChild('pageForm', { static: false }) pageForm: ElementRef;
  @ViewChild('enPanel', { static: false }) enPanel: MatExpansionPanel;
  @ViewChild('esPanel', { static: false }) esPanel: MatExpansionPanel;
  private subscription: any;
  public working = true;
  public id: string;
  public variables: any;
  public node = [];
  public page_node: any;
  public page_node_es: any;
  public page_type = [];
  public selected_type: string;
  public reporting = [];
  public selected_reports = [];
  public icons = [];
  public selected_icon: string;
  public nsmi = [];
  public nsmi_options: ITreeOptions = {
    useCheckbox: true,
    actionMapping: {
      mouse: {
        dblClick: (tree, node, $event) => {
          if (node.hasChildren) {
            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          }
        }
      }
    }
  };
  public mainNSMI = {};
  @ViewChild('tree', { static: false }) tree;
  public showSummaryEN = false;
  public showSummaryES = false;
  public path_error_en = false;
  public path_error_es = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private variableService: VariableService,
    private apiService: ApiService,
    private renderer2: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.load();
  }

  load() {
    const self = this;
    this.node = [];
    this.page_node = {
      'title': [{'value': ''}],
      'body': [{'value': '', 'summary': '', 'format': 'full_html'}],
      'status': [{'value': '1'}],
      'field_copyright': [{'value': ''}],
      'field_icon': [],
      'field_lang_status': [{'value': 'en'}],
      'field_nsmi': [],
      'field_type': [{'target_id': '9'}],
      'field_reporting': [],
      'field_segments': [],
      'field_segment_settings': [{'value': ''}],
      'field_path': [{'value': ''}],
      'field_old_path': [{'value': ''}],
      'field_meta_desc': [{'value': ''}],
      'field_meta_text': [{'value': ''}],
      'field_meta_title': [{'value': ''}],
      'field_private_file': [],
      'field_private_image': [],
    };
    this.page_node_es = {
      'title': [{'value': ''}],
      'body': [{'value': '', 'summary': '', 'format': 'full_html'}],
      'field_copyright': [{'value': ''}],
      'field_segments': [],
      'field_path': [{'value': ''}],
      'field_old_path': [{'value': ''}],
      'field_meta_desc': [{'value': ''}],
      'field_meta_text': [{'value': ''}],
      'field_meta_title': [{'value': ''}],
    };
    if (this.curNode && this.curNode.length > 0) {
      this.node = this.curNode;
      this.id = this.curNode[0].new ? 'new' : this.curNode[0].nid;
      const obv_array = [this.apiService.getPageTypes(), this.apiService.getReporting(),
        this.apiService.getIcons(), this.apiService.getNSMI()];
      this.subscription = forkJoin(obv_array).subscribe( data => {
        if (this.page_type.length < 1) {
          this.page_type.push({
            label: 'Choose Type',
            value: ''
          });
          data[0].forEach(function (item) {
            self.page_type.push({
              label: item.name,
              value: item.tid
            });
          });
        }
        if (this.reporting.length < 1) {
          data[1].forEach(function (item) {
            self.reporting.push({
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
          data[2].forEach(function (item) {
            self.icons.push({
              label: item.name,
              value: item.tid,
              url: item.term_export.field_public_term_file.length > 0 ? item.term_export.field_public_term_file[0].url : ''
            });
          });
        }
        this.nsmi = data[3]['nsmi'];
        this.doneLoading();
      });
    } else {
      this.router.navigate(['/admin']);
    }
  }

  doneLoading() {
    const self = this;
    if (this.id !== 'new' && this.node.length > 0) {
      this.variables.adminTitle = 'Editing Page';
      this.page_node['status'] = this.node[0].node_export['status'];
      this.page_node['field_lang_status'] = this.node[0].node_export['field_lang_status'];
      this.page_node['field_private_file'] = this.node[0].node_export['field_private_file'];
      this.page_node['field_private_image'] = this.node[0].node_export['field_private_image'];
      this.page_node['field_icon'] = this.node[0].node_export['field_icon'];
      this.selected_icon = this.page_node['field_icon'].length > 0 ? this.page_node['field_icon'][0]['target_id'] : '';
      this.page_node['field_type'] = this.node[0].node_export['field_type'];
      this.selected_type = this.page_node['field_type'].length > 0 ? this.page_node['field_type'][0]['target_id'] : '';
      this.page_node['field_reporting'] = this.node[0].node_export['field_reporting'];
      this.selected_reports = [];
      if (this.page_node['field_reporting'].length > 0) {
        this.page_node['field_reporting'].forEach(function (item) {
          self.selected_reports.push(item.target_id);
        });
      }
      // english
      this.page_node['title'] = this.node[0].node_export['title'];
      this.page_node['body'] = this.node[0].node_export['body'].length > 0
        ? this.node[0].node_export['body'] : [{'value': '', 'summary': '', 'format': 'full_html'}];
      if (this.page_node['body'][0]['summary'] && this.page_node['body'][0]['summary'].length > 0) {
        this.showSummaryEN = true;
      }
      this.page_node['field_copyright'] = this.node[0].node_export['field_copyright'].length > 0
        ? this.node[0].node_export['field_copyright'] : [{'value': ''}];
      this.page_node['field_segments'] = this.node[0].node_export['field_segments'];
      this.page_node['field_segment_settings'] = this.node[0].node_export['field_segment_settings'].length > 0
        ? JSON.parse(this.node[0].node_export['field_segment_settings'][0]['value']) : {};
      this.page_node['field_path'] = this.node[0].node_export['field_path'].length > 0
        ? this.node[0].node_export['field_path'] : [{'value': ''}];
      this.page_node['field_old_path'] = this.node[0].node_export['field_old_path'];
      this.page_node['field_meta_desc'] = this.node[0].node_export['field_meta_desc'].length > 0
        ? this.node[0].node_export['field_meta_desc'] : [{'value': ''}];
      this.page_node['field_meta_text'] = this.node[0].node_export['field_meta_text'].length > 0
        ? this.node[0].node_export['field_meta_text'] : [{'value': ''}];
      this.page_node['field_meta_title'] = this.node[0].node_export['field_meta_title'].length > 0
        ? this.node[0].node_export['field_meta_title'] : [{'value': ''}];
      // spanish
      this.page_node_es['title'] = this.node[0].node_export.i18n.es['title'];
      this.page_node_es['body'] = this.node[0].node_export.i18n.es['body'].length > 0
        ? this.node[0].node_export.i18n.es['body'] : [{'value': '', 'summary': '', 'format': 'full_html'}];
      if (this.page_node_es['body'][0]['summary'] && this.page_node_es['body'][0]['summary'].length > 0) {
        this.showSummaryES = true;
      }
      this.page_node_es['field_copyright'] = this.node[0].node_export.i18n.es['field_copyright'].length > 0
        ? this.node[0].node_export.i18n.es['field_copyright'] : [{'value': ''}];
      this.page_node_es['field_segments'] = this.node[0].node_export.i18n.es['field_segments'];
      this.page_node_es['field_segment_settings'] = this.node[0].node_export.i18n.es['field_segment_settings'].length > 0
        ? JSON.parse(this.node[0].node_export.i18n.es['field_segment_settings'][0]['value']) : {};
      this.page_node_es['field_path'] = this.node[0].node_export.i18n.es['field_path'].length > 0
        ? this.node[0].node_export.i18n.es['field_path'] : [{'value': ''}];
      this.page_node_es['field_old_path'] = this.node[0].node_export.i18n.es['field_old_path'];
      this.page_node_es['field_meta_desc'] = this.node[0].node_export.i18n.es['field_meta_desc'].length > 0
        ? this.node[0].node_export.i18n.es['field_meta_desc'] : [{'value': ''}];
      this.page_node_es['field_meta_text'] = this.node[0].node_export.i18n.es['field_meta_text'].length > 0
        ? this.node[0].node_export.i18n.es['field_meta_text'] : [{'value': ''}];
      this.page_node_es['field_meta_title'] = this.node[0].node_export.i18n.es['field_meta_title'].length > 0
        ? this.node[0].node_export.i18n.es['field_meta_title'] : [{'value': ''}];
    } else {
      this.selected_type = '9';
      this.variables.adminTitle = 'Adding Page';
    }
    this.working = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    setTimeout( () => {
      this.setupNSMI();
    });
  }

  setupNSMI() {
    const self = this;
    if (this.node[0].node_export.field_nsmi && this.node[0].node_export.field_nsmi.length > 0) {
      this.mainNSMI = this.node[0].node_export.field_nsmi[0];
      this.node[0].node_export.field_nsmi.forEach(function (item) {
        const cnode = self.tree.treeModel.getNodeById(item.target_id);
        cnode.ensureVisible();
        cnode.setIsSelected(true);
      });
    }
  }

  isMain(id: string): boolean {
    let output = false;
    if (this.mainNSMI['target_id'] === id) {
      output = true;
    }
    return output;
  }

  setMain(term: any) {
    this.mainNSMI = term;
    this.mainNSMI['target_id'] = term.tid;
  }

  checkPath(): Observable<any> {
    let output = false;
    const self = this;
    const sub = new Subject();
    this.apiService.getAdminPaths().subscribe( results => {
      let dupe_en = false;
      let dupe_es = false;
      results.forEach(function (i) {
        if (self.page_node['field_path'][0]['value'] !== '' && i.path === self.page_node['field_path'][0]['value'] && i.nid !== self.id) {
          output = true;
          dupe_en = true;
        }
        if (self.page_node_es['field_path'][0]['value'] !== '' && i.path === self.page_node_es['field_path'][0]['value']
          && i.nid !== self.id) {
          output = true;
          dupe_es = true;
        }
      });
      if (dupe_en) {
        this.pageForm['controls']['path_en'].setErrors({'dupe': true});
        this.path_error_en = true;
        this.enPanel.open();
      } else {
        this.pageForm['controls']['path_en'].setErrors(null);
        this.path_error_en = false;
      }
      if (dupe_es) {
        this.pageForm['controls']['path_es'].setErrors({'dupe': true});
        this.path_error_es = true;
        this.esPanel.open();
      } else {
        this.pageForm['controls']['path_es'].setErrors(null);
        this.path_error_es = false;
      }
      this.variables.returnService(sub, output);
    });
    return sub.asObservable();
  }

  saveNode() {
    this.checkPath().subscribe( result => {
      if (!result && this.pageForm['valid']) {
        this.working = true;
        const data_en = this.page_node;
        data_en.body = [{value: CKEDITOR.instances.pagebody_en.getData(), summary: CKEDITOR.instances.pagesum_en.getData()
          , format: 'full_html'}];
        data_en['_links'] = {type: {href: environment.apiUrl + '/rest/type/node/page'}};
        // nsmi
        const selectedNodes = [];
        const mTid = typeof this.mainNSMI['target_id'] !== 'undefined' ? this.mainNSMI['target_id'] : '';
        Object.entries(this.tree.treeModel.selectedLeafNodeIds).forEach(([key, value]) => {
          if (value === true) {
            if (key === mTid) {
              selectedNodes.unshift({
                target_id: key
              });
            } else {
              selectedNodes.push({
                target_id: key
              });
            }
          }
        });
        data_en.field_nsmi = selectedNodes;
        const data_es = this.page_node_es;
        data_es.body = [{value: CKEDITOR.instances.pagebody_es.getData(), summary: CKEDITOR.instances.pagesum_es.getData()
          , format: 'full_html'}];
        data_es['_links'] = {type: {href: environment.apiUrl + '/rest/type/node/page'}};
        // check required
        if (data_es.title[0].value.length < 1 && data_en.title[0].value.length > 0) {
          data_es.title[0].value = data_en.title[0].value;
        }
        if (data_en.title[0].value.length < 1 && data_es.title[0].value.length > 0) {
          data_en.title[0].value = data_es.title[0].value;
        }
        // segment settings
        data_en.field_segment_settings = [{value: JSON.stringify(data_en.field_segment_settings)}];
        data_es.field_segment_settings = [{value: JSON.stringify(data_es.field_segment_settings)}];
        if (this.id === 'new') {
          // new node
          this.apiService.createNode(data_en, this.variableService.token).subscribe(results => {
            const nid = results.nid[0].value;
            this.apiService.updateNodeES(nid, data_es, this.variableService.token).subscribe(results_es => {
              if (this.variables.previousUrl !== '' && results.status[0].value) {
                window.open(this.variables.previousUrl, '_self');
              } else {
                this.router.navigate(['/node/', nid]);
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
                this.router.navigate(['/node/', this.id]);
              }
            });
          });
        }
      }
    });
  }

  previewNode(): void {
    const item = {
      'node_export': JSON.parse(JSON.stringify(this.page_node))
    };
    item['node_export']['type'] = [{'target_id': 'page'}];
    item['node_export']['body'] = [{value: CKEDITOR.instances.pagebody_en.getData(), summary: CKEDITOR.instances.pagesum_en.getData()
      , format: 'full_html'}];
    item['node_export']['i18n'] = {
      'es': JSON.parse(JSON.stringify(this.page_node_es))
    };
    item['node_export']['i18n']['es']['body'] = [{value: CKEDITOR.instances.pagebody_es.getData(),
      summary: CKEDITOR.instances.pagesum_es.getData(), format: 'full_html'}];
    item['node_export']['field_segment_settings'] = [{value: this.page_node['field_segment_settings']}];
    item['node_export']['i18n']['es']['field_segment_settings'] = [{value: this.page_node_es['field_segment_settings']}];
    const dialogRef = this.dialog.open(ContentListDialogComponent, {
      width: this.page_node.field_type[0].target_id === '6' ? '90%' : '900px',
      height: '90%',
      maxWidth: '95%',
      maxHeight: '95%',
      data: { node: item }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

}
