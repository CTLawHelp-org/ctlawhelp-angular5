import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { DynamicFormControlModel, DynamicFormLayout, DynamicFormService, DynamicInputModel } from '@ng-dynamic-forms/core';
import { PAGE_FORM, PAGE_FORM_LAYOUT } from '../../admin-models/page-form.model';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ITreeOptions, TREE_ACTIONS } from 'angular-tree-component';

declare var CKEDITOR: any;

@Component({
  selector: 'app-admin-node-page',
  templateUrl: './admin-node-page.component.html',
  styleUrls: ['./admin-node-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminNodePageComponent implements OnInit, OnDestroy {
  @Input() curNode;
  private subscription: any;
  public working = true;
  public formModel: DynamicFormControlModel[] = PAGE_FORM;
  public formGroup: FormGroup;
  public formLayout: DynamicFormLayout = PAGE_FORM_LAYOUT;
  public changes = {};
  public node = [];
  private lang_form: any;
  private type_form: any;
  private reporting_form: any;
  public variables: any;
  public segments_en = [];
  public segments_es = [];
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
  public showSummaryEN = false;
  public showSummaryES = false;
  @ViewChild('tree') tree;
  public icons = [];
  public selectedIcon: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService,
    private formService: DynamicFormService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.lang_form = this.formService.findById('lang', this.formModel) as DynamicInputModel;
    this.type_form = this.formService.findById('type', this.formModel) as DynamicInputModel;
    this.reporting_form = this.formService.findById('reporting', this.formModel) as DynamicInputModel;
    const en_form = this.formService.findById('english', this.formModel) as DynamicInputModel;
    const es_form = this.formService.findById('spanish', this.formModel) as DynamicInputModel;
    const title_en = this.formService.findById('title_en', this.formModel) as DynamicInputModel;
    const title_es = this.formService.findById('title_es', this.formModel) as DynamicInputModel;

    this.lang_form.valueUpdates.subscribe(value => {
      if (value === 'en') {
        en_form.hidden = false;
        es_form.hidden = true;
        title_es.disabledUpdates.next(true);
        title_en.disabledUpdates.next(false);
      } else if (value === 'es') {
        en_form.hidden = true;
        es_form.hidden = false;
        title_es.disabledUpdates.next(false);
        title_en.disabledUpdates.next(true);
      } else if (value === 'both') {
        en_form.hidden = false;
        es_form.hidden = false;
        title_es.disabledUpdates.next(false);
        title_en.disabledUpdates.next(false);
      }
    });

    this.apiService.getNSMI().subscribe( result => {
      this.nsmi = result['nsmi'];
      this.firstLoad();
    });

    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.load();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  firstLoad() {
    const self = this;
    const t_obs = this.apiService.getPageTypes();
    const r_obs = this.apiService.getReporting();
    const i_obs = this.apiService.getIcons();
    forkJoin([t_obs, r_obs, i_obs]).subscribe( results => {
      if (this.type_form['options'].length < 1) {
        this.type_form['options'].push({
          label: 'Choose Type',
          value: ''
        });
        results[0].forEach(function (item) {
          self.type_form['options'].push({
            label: item.name,
            value: item.tid
          });
        });
      }
      if (this.reporting_form['options'].length < 1) {
        results[1].forEach(function (item) {
          self.reporting_form['options'].push({
            label: item.name,
            value: item.tid
          });
        });
      }
      if (self.icons.length < 1) {
        self.icons.push({
          label: 'None',
          value: ''
        });
        results[2].forEach(function (item) {
          self.icons.push({
            label: item.name,
            value: item.tid,
            url: item.term_export.field_public_term_file[0].url
          });
        });
      }
      this.load();
    });
  }

  load() {
    if (this.curNode.length > 0) {
      this.node = this.curNode;
      if (this.node[0].new) {
        this.variables.adminTitle = 'Adding Page';
        this.resetModel();
      } else {
        const title = this.node[0].title.replace(/&#(\d+);/g, function(match, dec) {
          return String.fromCharCode(dec);
        });
        this.variables.adminTitle = 'Editing Page: ' + title;
        this.resetModel();
      }
    }
  }

  resetModel() {
    this.formModel.forEach(function (model) {
      if (model['group'] && model['group'].length > 0) {
        model['group'].forEach(function (item) {
          item['value'] = null;
        });
      } else {
        model['value'] = null;
      }
    });
    this.doneLoading();
  }

  doneLoading() {
    if (this.node.length > 0) {
      if (this.node[0].new) {
        this.setupNew();
      } else {
        this.setupForm();
      }
    }
    this.working = false;
    this.formGroup = this.formService.createFormGroup(this.formModel);
    // ckeditor setup
    if (isPlatformBrowser(this.platformId)) {
      this.setupCK();
    }
  }

  setupNSMI() {
    const self = this;
    if (this.node[0].node_export.field_nsmi.length > 0) {
      this.mainNSMI = this.node[0].node_export.field_nsmi[0];
      this.node[0].node_export.field_nsmi.forEach(function (item) {
        const cnode = self.tree.treeModel.getNodeById(item.target_id);
        cnode.ensureVisible();
        cnode.setIsSelected(true);
      });
    }
  }

  isPublished() {
    if (this.node[0].node_export.status[0].value === '1') {
      return true;
    } else {
      return false;
    }
  }

  setStatus(form: any) {
    if (form.checked) {
      this.node[0].node_export.status[0].value = '1';
    } else {
      this.node[0].node_export.status[0].value = '0';
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

  setupCK() {
    if (typeof CKEDITOR === 'undefined') {
      setTimeout( () => {
        this.setupCK();
      });
    } else {
      const toolbar = [
        {
          name: 'basicstyles',
          items: ['Bold', 'Italic', 'Strike', 'Underline']
        },
        {name: 'paragraph', items: ['BulletedList', 'NumberedList', 'Blockquote']},
        {name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
        {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
        {name: 'tools', items: ['SpellChecker']},
        {
          name: 'styles',
          items: ['Format', 'FontSize', 'TextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat']
        },
        {name: 'insert', items: ['Image', 'Table', 'SpecialChar', 'Iframe']},
        {name: 'forms', items: ['Outdent', 'Indent']},
        {name: 'clipboard', items: ['Undo', 'Redo']},
        {name: 'document', items: ['Source', 'Maximize']}
      ];
      const toolbar_min = [
        {
          name: 'basicstyles',
          items: ['Bold', 'Italic', 'Strike', 'Underline']
        },
        {name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
        {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
        {name: 'tools', items: ['SpellChecker']},
        {
          name: 'styles',
          items: ['Format', 'FontSize', 'TextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat']
        },
        {name: 'document', items: ['Source', 'Maximize']}
      ];
      setTimeout( () => {
        CKEDITOR.replace('body_en', {
          language: 'en',
          toolbar: toolbar,
          allowedContent: true,
          height: 200,
          filebrowserImageBrowseUrl: '/admin/filebrowser/images',
          filebrowserLinkBrowseUrl: '/admin/filebrowser/all'
        });
        CKEDITOR.replace('summary_en', {
          language: 'en',
          toolbar: toolbar_min,
          allowedContent: true,
          height: 100,
        });
        CKEDITOR.replace('body_es', {
          language: 'en',
          toolbar: toolbar,
          allowedContent: true,
          height: 200,
          filebrowserImageBrowseUrl: '/admin/filebrowser/images',
          filebrowserLinkBrowseUrl: '/admin/filebrowser/all'
        });
        CKEDITOR.replace('summary_es', {
          language: 'en',
          toolbar: toolbar_min,
          allowedContent: true,
          height: 100,
        });
        if (!this.node[0].new) {
          this.setupNSMI();
        }
      });
    }
  }

  setupNew() {
    this.node[0].node_export.status = [{value: '1'}];
    this.lang_form.valueUpdates.next('en');
    this.changes['lang'] = 'en';
    this.type_form.valueUpdates.next('');
    // files
    const file = this.formService.findById('file', this.formModel) as DynamicInputModel;
    file.valueUpdates.next([]);
    // images
    const image = this.formService.findById('image', this.formModel) as DynamicInputModel;
    image.valueUpdates.next([]);
  }

  setupForm() {
    // lang status
    if (this.node[0].node_export.field_lang_status.length > 0) {
      this.lang_form.valueUpdates.next(this.node[0].node_export.field_lang_status[0].value);
    }
    // page type
    if (this.node[0].node_export.field_type.length > 0) {
      this.type_form.valueUpdates.next(this.node[0].node_export.field_type[0].target_id);
    } else {
      this.type_form.valueUpdates.next('');
    }
    // reporting
    if (this.node[0].node_export.field_reporting.length > 0) {
      const r_val = [];
      this.node[0].node_export.field_reporting.forEach(function (item) {
        r_val.push(item.target_id);
      });
      this.reporting_form.valueUpdates.next(r_val);
    } else {
      this.reporting_form.valueUpdates.next('');
    }
    // icon
    if (this.node[0].node_export.field_icon.length > 0) {
      this.selectedIcon = this.node[0].node_export.field_icon[0].target_id;
    }
    // english
    const title_en = this.formService.findById('title_en', this.formModel) as DynamicInputModel;
    title_en.valueUpdates.next(this.node[0].node_export.title[0].value);
    // body_en & summary_en
    const body_en = this.formService.findById('body_en', this.formModel) as DynamicInputModel;
    const summary_en = this.formService.findById('summary_en', this.formModel) as DynamicInputModel;
    if (this.node[0].node_export.body.length > 0) {
      body_en.valueUpdates.next(this.node[0].node_export.body[0].value);
      if (this.node[0].node_export.body[0].summary) {
        summary_en.valueUpdates.next(this.node[0].node_export.body[0].summary);
        if (this.node[0].node_export.body[0].summary !== '') {
          this.showSummaryEN = true;
        }
      }
    } else {
      body_en.valueUpdates.next('');
    }
    // copyright
    if (this.node[0].node_export.field_copyright.length > 0) {
      const copy_en = this.formService.findById('copy_en', this.formModel) as DynamicInputModel;
      copy_en.valueUpdates.next(this.node[0].node_export.field_copyright[0].value);
    }
    // segments en
    if (this.node[0].node_export.field_segments.length > 0) {
      this.segments_en = this.node[0].node_export.field_segments;
    }
    // spanish
    if (typeof this.node[0].node_export.i18n.es !== 'undefined') {
      const title_es = this.formService.findById('title_es', this.formModel) as DynamicInputModel;
      title_es.valueUpdates.next(this.node[0].node_export.i18n.es.title[0].value);
      // body_es & summary_es
      const body_es = this.formService.findById('body_es', this.formModel) as DynamicInputModel;
      const summary_es = this.formService.findById('summary_es', this.formModel) as DynamicInputModel;
      if (this.node[0].node_export.i18n.es.body.length > 0) {
        body_es.valueUpdates.next(this.node[0].node_export.i18n.es.body[0].value);
        if (this.node[0].node_export.i18n.es.body[0].summary) {
          summary_es.valueUpdates.next(this.node[0].node_export.i18n.es.body[0].summary);
          if (this.node[0].node_export.i18n.es.body[0].summary !== '') {
            this.showSummaryES = true;
          }
        }
      } else {
        body_es.valueUpdates.next('');
      }
      // copyright
      if (this.node[0].node_export.i18n.es.field_copyright.length > 0) {
        const copy_es = this.formService.findById('copy_es', this.formModel) as DynamicInputModel;
        copy_es.valueUpdates.next(this.node[0].node_export.i18n.es.field_copyright[0].value);
      }
      // segments es
      if (this.node[0].node_export.i18n.es.field_segments.length > 0) {
        this.segments_es = this.node[0].node_export.i18n.es.field_segments;
      }
    }
    // files
    const file = this.formService.findById('file', this.formModel) as DynamicInputModel;
    if (this.node[0].node_export.field_private_file.length > 0) {
      file.valueUpdates.next(this.node[0].node_export.field_private_file);
    } else {
      file.valueUpdates.next([]);
    }
    // images
    const image = this.formService.findById('image', this.formModel) as DynamicInputModel;
    if (this.node[0].node_export.field_private_image.length > 0) {
      image.valueUpdates.next(this.node[0].node_export.field_private_image);
    } else {
      image.valueUpdates.next([]);
    }
  }

  saveNode() {
    if (this.formGroup.valid) {
      this.working = true;
      const data = {
        _links: {type: {href: environment.apiUrl + '/rest/type/node/page'}}
      };
      this.setupData(data);
      const data_es = {
        _links: {type: {href: environment.apiUrl + '/rest/type/node/page'}}
      };
      this.setupDataES(data_es);
      if (this.node[0].new) {
        // new node
        this.apiService.createNode(data, this.variableService.token).subscribe(results => {
          const nid = results.nid[0].value;
          this.apiService.updateNodeES(nid, data_es, this.variableService.token).subscribe(results_es => {
            this.router.navigate(['admin/content/pages']);
          });
        });
      } else if (Object.keys(this.changes).length > 0) {
        // prev node
        const nid = this.node[0].node_export.nid[0].value;
        this.apiService.updateNode(nid, data, this.variableService.token).subscribe(results => {
          this.apiService.updateNodeES(nid, data_es, this.variableService.token).subscribe(results_es => {
            this.router.navigate(['admin/content/pages']);
          });
        });
      } else {
        this.router.navigate(['admin/content/pages']);
      }
    }
  }

  setupData(data: any) {
    // status
    data.status = [{value: this.node[0].node_export.status[0].value}];
    // lang status
    if (typeof this.changes['lang'] !== 'undefined') {
      data.field_lang_status = [{value: this.changes['lang']}];
    }
    // page type
    if (typeof this.changes['type'] !== 'undefined') {
      if (this.changes['type'] !== '') {
        data.field_type = [{target_id: this.changes['type']}];
      } else {
        data.field_type = [];
      }
    }
    // reporting
    if (typeof this.changes['reporting'] !== 'undefined') {
      const r_val = [];
      this.changes['reporting'].forEach(function (item) {
        r_val.push({target_id: item});
      });
      data.field_reporting = r_val;
    }
    // icon
    if (this.selectedIcon && this.selectedIcon !== '') {
      data.field_icon = [{target_id: this.selectedIcon}];
    } else {
      data.field_icon = [];
    }
    // copy_en
    if (typeof this.changes['copy_en'] !== 'undefined') {
      if (this.changes['copy_en'] !== '') {
        data.field_copyright = [{value: this.changes['copy_en']}];
      } else {
        data.field_copyright = [{value: ''}];
      }
    }
    // title_en
    if (typeof this.changes['title_en'] !== 'undefined') {
      data.title = [{value: this.changes['title_en']}];
    } else if (this.node[0].new && typeof this.changes['title_es'] !== 'undefined') {
      data.title = [{value: this.changes['title_es']}];
    }
    // body_en
    let b_val = '';
    if (CKEDITOR.instances.body_en.getData().length > 0) {
      b_val = CKEDITOR.instances.body_en.getData();
    }
    this.changes['body_en'] = b_val;
    // summary_en
    let s_val = '';
    if (CKEDITOR.instances.summary_en.getData().length > 0) {
      s_val = CKEDITOR.instances.summary_en.getData();
    }
    this.changes['summary_en'] = s_val;
    data.body = [{value: b_val, summary: s_val, format: 'full_html'}];
    // segments en
    const node_ref = [];
    this.segments_en.forEach(function (item) {
      node_ref.push({
        target_id: item.target_id,
        value: ''
      });
    });
    data.field_segments = node_ref;
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
    data.field_nsmi = selectedNodes;
    // files field_private_file
    if (typeof this.changes['file'] !== 'undefined') {
      const objs = [];
      this.changes['file'].forEach(function (file) {
        objs.push({target_id: file.target_id});
      });
      data.field_private_file = objs;
    }
    // images field_private_image
    if (typeof this.changes['image'] !== 'undefined') {
      const objs = [];
      this.changes['image'].forEach(function (file) {
        objs.push({target_id: file.target_id, alt: file.alt});
      });
      data.field_private_image = objs;
    }
    // meta_title_en
    if (typeof this.changes['meta_title_en'] !== 'undefined') {
      if (this.changes['meta_title_en'] !== '') {
        data.field_meta_title = [{value: this.changes['meta_title_en']}];
      } else {
        data.field_meta_title = [{value: ''}];
      }
    }
    // meta_desc_en
    if (typeof this.changes['meta_desc_en'] !== 'undefined') {
      if (this.changes['meta_desc_en'] !== '') {
        data.field_meta_desc = [{value: this.changes['meta_desc_en']}];
      } else {
        data.field_meta_desc = [{value: ''}];
      }
    }
    // path_en
    if (typeof this.changes['path_en'] !== 'undefined') {
      if (this.changes['path_en'] !== '') {
        data.field_path = [{value: this.changes['path_en']}];
      } else {
        data.field_path = [{value: ''}];
      }
    }
    // old_path_en
    if (typeof this.changes['old_path_en'] !== 'undefined') {
      const objs = [];
      this.changes['old_path_en'].forEach(function (item) {
        objs.push({value: item.value});
      });
      data.field_old_path = objs;
    }
    // meta_en
    if (typeof this.changes['meta_en'] !== 'undefined') {
      if (this.changes['meta_en'] !== '') {
        data.field_meta_text = [{value: this.changes['meta_en']}];
      } else {
        data.field_meta_text = [{value: ''}];
      }
    }
  }

  setupDataES(data: any) {
    // copy_es
    if (typeof this.changes['copy_es'] !== 'undefined') {
      if (this.changes['copy_es'] !== '') {
        data.field_copyright = [{value: this.changes['copy_es']}];
      } else {
        data.field_copyright = [{value: ''}];
      }
    }
    // title_es
    if (typeof this.changes['title_es'] !== 'undefined') {
      data.title = [{value: this.changes['title_es']}];
    } else if (this.node[0].new && typeof this.changes['title_en'] !== 'undefined') {
      data.title = [{value: this.changes['title_en']}];
    }
    // body_es
    let b_val = '';
    if (CKEDITOR.instances.body_es.getData().length > 0) {
      b_val = CKEDITOR.instances.body_es.getData();
    }
    this.changes['body_es'] = b_val;
    // summary_es
    let s_val = '';
    if (CKEDITOR.instances.summary_es.getData().length > 0) {
      s_val = CKEDITOR.instances.summary_es.getData();
    }
    this.changes['summary_es'] = s_val;
    data.body = [{value: b_val, summary: s_val, format: 'full_html'}];
    // segments es
    const node_ref = [];
    this.segments_es.forEach(function (item) {
      node_ref.push({
        target_id: item.target_id,
        value: ''
      });
    });
    data.field_segments = node_ref;
    // meta_title_es
    if (typeof this.changes['meta_title_es'] !== 'undefined') {
      if (this.changes['meta_title_es'] !== '') {
        data.field_meta_title = [{value: this.changes['meta_title_es']}];
      } else {
        data.field_meta_title = [{value: ''}];
      }
    }
    // meta_desc_es
    if (typeof this.changes['meta_desc_es'] !== 'undefined') {
      if (this.changes['meta_desc_es'] !== '') {
        data.field_meta_desc = [{value: this.changes['meta_desc_es']}];
      } else {
        data.field_meta_desc = [{value: ''}];
      }
    }
    // path_es
    if (typeof this.changes['path_es'] !== 'undefined') {
      if (this.changes['path_es'] !== '') {
        data.field_path = [{value: this.changes['path_es']}];
      } else {
        data.field_path = [{value: ''}];
      }
    }
    // old_path_es
    if (typeof this.changes['old_path_es'] !== 'undefined') {
      const objs = [];
      this.changes['old_path_es'].forEach(function (item) {
        objs.push({value: item.value});
      });
      data.field_old_path = objs;
    }
    // meta_es
    if (typeof this.changes['meta_es'] !== 'undefined') {
      if (this.changes['meta_es'] !== '') {
        data.field_meta_text = [{value: this.changes['meta_es']}];
      } else {
        data.field_meta_text = [{value: ''}];
      }
    }
  }

  onChange(event: any) {
    this.changes[event.model.id] = event.model.value;
  }

}
