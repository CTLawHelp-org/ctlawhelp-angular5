import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BLOCK_FORM, BLOCK_FORM_LAYOUT } from '../../admin-models/block-form.model';
import { DynamicFormControlModel, DynamicFormLayout, DynamicFormService, DynamicInputModel } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { DOCUMENT } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { forkJoin } from 'rxjs/observable/forkJoin';

declare var CKEDITOR: any;

@Component({
  selector: 'app-admin-node-block',
  templateUrl: './admin-node-block.component.html',
  styleUrls: ['./admin-node-block.component.scss']
})
export class AdminNodeBlockComponent implements OnInit, OnDestroy {
  @Input() curNode;
  private subscription: any;
  public working = true;
  public formModel: DynamicFormControlModel[] = BLOCK_FORM;
  public formGroup: FormGroup;
  public formLayout: DynamicFormLayout = BLOCK_FORM_LAYOUT;
  public changes = {};
  public node = [];
  private lang_form: any;
  private type_form: any;
  public variables: any;
  public node_ref_en = [];
  public node_ref_es = [];
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
    const en_form = this.formService.findById('english', this.formModel) as DynamicInputModel;
    const es_form = this.formService.findById('spanish', this.formModel) as DynamicInputModel;
    const en_ref_form = this.formService.findById('node_ref_en', this.formModel) as DynamicInputModel;
    const es_ref_form = this.formService.findById('node_ref_es', this.formModel) as DynamicInputModel;

    this.lang_form.valueUpdates.subscribe(value => {
      if (value === 'en') {
        en_form.hidden = false;
        es_form.hidden = true;
      } else if (value === 'es') {
        en_form.hidden = true;
        es_form.hidden = false;
      } else if (value === 'both') {
        en_form.hidden = false;
        es_form.hidden = false;
      }
    });

    this.type_form.valueUpdates.subscribe(value => {
      if (value === '') {
        en_ref_form.hidden = true;
        es_ref_form.hidden = true;
      } else if (value === '685') {
        en_ref_form.hidden = false;
        es_ref_form.hidden = false;
      }
    });

    this.firstLoad();

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
    const b_obs = this.apiService.getBlockTypes();
    const i_obs = this.apiService.getIcons();
    forkJoin([b_obs, i_obs]).subscribe( results => {
      if (self.type_form['options'].length < 1) {
        self.type_form['options'].push({
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
      if (self.icons.length < 1) {
        self.icons.push({
          label: 'None',
          value: ''
        });
        results[1].forEach(function (item) {
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
        this.variables.adminTitle = 'Adding Block';
        this.resetModel();
      } else {
        const title = this.node[0].title.replace(/&#(\d+);/g, function(match, dec) {
          return String.fromCharCode(dec);
        });
        this.variables.adminTitle = 'Editing Block: ' + title;
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
      setTimeout( () => {
        CKEDITOR.replace('body_en', {
          language: 'en',
          toolbar: toolbar,
          allowedContent: true,
          height: 200,
          filebrowserImageBrowseUrl: '/admin/filebrowser/images',
          filebrowserLinkBrowseUrl: '/admin/filebrowser/all'
        });
        CKEDITOR.replace('body_es', {
          language: 'en',
          toolbar: toolbar,
          allowedContent: true,
          height: 200,
          filebrowserImageBrowseUrl: '/admin/filebrowser/images',
          filebrowserLinkBrowseUrl: '/admin/filebrowser/all'
        });
      });
    }
  }

  setupNew() {
    this.lang_form.valueUpdates.next('en');
    this.changes['lang'] = 'en';
    this.type_form.valueUpdates.next('');
    const style_form = this.formService.findById('style', this.formModel) as DynamicInputModel;
    style_form.valueUpdates.next('');
    const image = this.formService.findById('image', this.formModel) as DynamicInputModel;
    image.valueUpdates.next([]);
  }

  setupForm() {
    // lang status
    if (this.node[0].node_export.field_lang_status.length > 0) {
      this.lang_form.valueUpdates.next(this.node[0].node_export.field_lang_status[0].value);
    }
    // block type
    if (this.node[0].node_export.field_block_type.length > 0) {
      this.type_form.valueUpdates.next(this.node[0].node_export.field_block_type[0].target_id);
    } else {
      this.type_form.valueUpdates.next('');
    }
    // style
    const style_form = this.formService.findById('style', this.formModel) as DynamicInputModel;
    if (this.node[0].node_export.field_style.length > 0) {
      style_form.valueUpdates.next(this.node[0].node_export.field_style[0].value);
    } else {
      style_form.valueUpdates.next('');
    }
    // icon
    if (this.node[0].node_export.field_icon.length > 0) {
      this.selectedIcon = this.node[0].node_export.field_icon[0].target_id;
    }
    // english
    const title_en = this.formService.findById('title_en', this.formModel) as DynamicInputModel;
    title_en.valueUpdates.next(this.node[0].node_export.title[0].value);
    const body_en = this.formService.findById('body_en', this.formModel) as DynamicInputModel;
    if (this.node[0].node_export.body.length > 0) {
      body_en.valueUpdates.next(this.node[0].node_export.body[0].value);
    } else {
      body_en.valueUpdates.next('');
    }
    // link_en
    const link_en = this.formService.findById('link_en', this.formModel) as DynamicInputModel;
    if (this.node[0].node_export.field_link.length > 0) {
      link_en.valueUpdates.next(this.node[0].node_export.field_link[0].value);
    } else {
      link_en.valueUpdates.next('');
    }
    // node ref en
    if (this.node[0].node_export.field_nodes.length > 0) {
      this.node_ref_en = this.node[0].node_export.field_nodes;
    }
    // spanish
    if (typeof this.node[0].node_export.i18n.es !== 'undefined') {
      const title_es = this.formService.findById('title_es', this.formModel) as DynamicInputModel;
      title_es.valueUpdates.next(this.node[0].node_export.i18n.es.title[0].value);
      const body_es = this.formService.findById('body_es', this.formModel) as DynamicInputModel;
      if (this.node[0].node_export.i18n.es.body.length > 0) {
        body_es.valueUpdates.next(this.node[0].node_export.i18n.es.body[0].value);
      } else {
        body_es.valueUpdates.next('');
      }
      // link_es
      const link_es = this.formService.findById('link_es', this.formModel) as DynamicInputModel;
      if (this.node[0].node_export.i18n.es.field_link.length > 0) {
        link_es.valueUpdates.next(this.node[0].node_export.i18n.es.field_link[0].value);
      } else {
        link_es.valueUpdates.next('');
      }
      // node ref es
      if (this.node[0].node_export.i18n.es.field_nodes.length > 0) {
        this.node_ref_es = this.node[0].node_export.i18n.es.field_nodes;
      }
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
        _links: {type: {href: environment.apiUrl + '/rest/type/node/block'}}
      };
      this.setupData(data);
      const data_es = {
        _links: {type: {href: environment.apiUrl + '/rest/type/node/block'}}
      };
      this.setupDataES(data_es);
      if (this.node[0].new) {
        // new node
        this.apiService.createNode(data, this.variableService.token).subscribe(results => {
          const nid = results.nid[0].value;
          this.apiService.updateNodeES(nid, data_es, this.variableService.token).subscribe(results_es => {
            this.router.navigate(['admin/content/blocks']);
          });
        });
      } else if (Object.keys(this.changes).length > 0) {
        // prev node
        const nid = this.node[0].node_export.nid[0].value;
        this.apiService.updateNode(nid, data, this.variableService.token).subscribe(results => {
          this.apiService.updateNodeES(nid, data_es, this.variableService.token).subscribe(results_es => {
            this.router.navigate(['admin/content/blocks']);
          });
        });
      } else {
        this.router.navigate(['admin/content/blocks']);
      }
    }
  }

  setupData(data: any) {
    // lang status
    if (typeof this.changes['lang'] !== 'undefined') {
      data.field_lang_status = [{value: this.changes['lang']}];
    }
    // block type
    if (typeof this.changes['type'] !== 'undefined') {
      if (this.changes['type'] !== '') {
        data.field_block_type = [{target_id: this.changes['type']}];
      } else {
        data.field_block_type = [];
      }
    }
    // style
    if (typeof this.changes['style'] !== 'undefined') {
      if (this.changes['style'] !== '') {
        data.field_style = [{value: this.changes['style']}];
      } else {
        data.field_style = [];
      }
    }
    // icon
    if (this.selectedIcon && this.selectedIcon !== '') {
      data.field_icon = [{target_id: this.selectedIcon}];
    } else {
      data.field_icon = [];
    }
    // title_en
    if (typeof this.changes['title_en'] !== 'undefined') {
      data.title = [{value: this.changes['title_en']}];
    }
    // body_en
    if (CKEDITOR.instances.body_en.getData().length > 0) {
      this.changes['body_en'] = CKEDITOR.instances.body_en.getData();
      data.body = [{value: CKEDITOR.instances.body_en.getData(), format: 'full_html'}];
    }
    // link_en
    if (typeof this.changes['link_en'] !== 'undefined') {
      if (this.changes['link_en'] !== '') {
        data.field_link = [{value: this.changes['link_en']}];
      } else {
        data.field_link = [];
      }
    }
    // node_ref_en
    const node_ref = [];
    this.node_ref_en.forEach(function (item) {
      node_ref.push({
        target_id: item.target_id,
        value: ''
      });
    });
    data.field_nodes = node_ref;
    // images field_private_image
    if (typeof this.changes['image'] !== 'undefined') {
      const objs = [];
      this.changes['image'].forEach(function (file) {
        objs.push({target_id: file.target_id, alt: file.alt});
      });
      data.field_private_image = objs;
    }
  }

  setupDataES(data: any) {
    // title_es
    if (typeof this.changes['title_es'] !== 'undefined') {
      data.title = [{value: this.changes['title_es']}];
    }
    // body_es
    if (CKEDITOR.instances.body_es.getData().length > 0) {
      this.changes['body_es'] = CKEDITOR.instances.body_es.getData();
      data.body = [{value: CKEDITOR.instances.body_es.getData(), format: 'full_html'}];
    }
    // link_es
    if (typeof this.changes['link_es'] !== 'undefined') {
      if (this.changes['link_es'] !== '') {
        data.field_link = [{value: this.changes['link_es']}];
      } else {
        data.field_link = [];
      }
    }
    // node_ref_es
    const node_ref = [];
    this.node_ref_es.forEach(function (item) {
      node_ref.push({
        target_id: item.target_id,
        value: ''
      });
    });
    data.field_nodes = node_ref;
  }

  onChange(event: any) {
    this.changes[event.model.id] = event.model.value;
  }

}
