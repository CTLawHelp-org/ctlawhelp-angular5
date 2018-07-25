import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { DynamicFormControlModel, DynamicFormLayout, DynamicFormService, DynamicInputModel } from '@ng-dynamic-forms/core';
import { SEGMENT_FORM, SEGMENT_FORM_LAYOUT } from '../../admin-models/segment-form.model';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

declare var CKEDITOR: any;

@Component({
  selector: 'app-admin-node-segment',
  templateUrl: './admin-node-segment.component.html',
  styleUrls: ['./admin-node-segment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminNodeSegmentComponent implements OnInit {
  @Input() curNode;
  public working = true;
  public formModel: DynamicFormControlModel[] = SEGMENT_FORM;
  public formGroup: FormGroup;
  public formLayout: DynamicFormLayout = SEGMENT_FORM_LAYOUT;
  public changes = {};
  public node = [];
  private lang_form: any;
  public variables: any;
  public node_ref_en = [];
  public node_ref_es = [];
  @Output() output = new EventEmitter();

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

    this.load();
  }

  load() {
    if (this.curNode.length > 0) {
      this.node = this.curNode;
      this.resetModel();
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
        CKEDITOR.replace('sbody_en', {
          language: 'en',
          toolbar: toolbar,
          allowedContent: true,
          height: 200,
          filebrowserImageBrowseUrl: '/admin/filebrowser/images',
          filebrowserLinkBrowseUrl: '/admin/filebrowser/all'
        });
        CKEDITOR.replace('sbody_es', {
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
  }

  setupForm() {
    // lang status
    if (this.node[0].node_export.field_lang_status.length > 0) {
      this.lang_form.valueUpdates.next(this.node[0].node_export.field_lang_status[0].value);
    }
    // english
    const title_en = this.formService.findById('title_en', this.formModel) as DynamicInputModel;
    title_en.valueUpdates.next(this.node[0].node_export.title[0].value);
    const body_en = this.formService.findById('sbody_en', this.formModel) as DynamicInputModel;
    if (this.node[0].node_export.body.length > 0) {
      body_en.valueUpdates.next(this.node[0].node_export.body[0].value);
    } else {
      body_en.valueUpdates.next('');
    }
    // node ref en
    if (this.node[0].node_export.field_node_reference.length > 0) {
      this.node_ref_en = this.node[0].node_export.field_node_reference;
    }
    // spanish
    if (typeof this.node[0].node_export.i18n.es !== 'undefined') {
      const title_es = this.formService.findById('title_es', this.formModel) as DynamicInputModel;
      title_es.valueUpdates.next(this.node[0].node_export.i18n.es.title[0].value);
      const body_es = this.formService.findById('sbody_es', this.formModel) as DynamicInputModel;
      if (this.node[0].node_export.i18n.es.body.length > 0) {
        body_es.valueUpdates.next(this.node[0].node_export.i18n.es.body[0].value);
      } else {
        body_es.valueUpdates.next('');
      }
      // node ref es
      if (this.node[0].node_export.i18n.es.field_node_reference.length > 0) {
        this.node_ref_es = this.node[0].node_export.i18n.es.field_node_reference;
      }
    }
  }

  saveNode() {
    if (this.formGroup.valid) {
      this.working = true;
      const data = {
        _links: {type: {href: environment.apiUrl + '/rest/type/node/segment'}}
      };
      this.setupData(data);
      const data_es = {
        _links: {type: {href: environment.apiUrl + '/rest/type/node/segment'}}
      };
      this.setupDataES(data_es);
      if (this.node[0].new) {
        // new node
        this.apiService.createNode(data, this.variableService.token).subscribe(results => {
          const nid = results.nid[0].value;
          this.node[0].nid = nid;
          this.apiService.updateNodeES(nid, data_es, this.variableService.token).subscribe(results_es => {
            this.output.next();
          });
        });
      } else if (Object.keys(this.changes).length > 0) {
        // prev node
        const nid = this.node[0].node_export.nid[0].value;
        this.apiService.updateNode(nid, data, this.variableService.token).subscribe(results => {
          this.apiService.updateNodeES(nid, data_es, this.variableService.token).subscribe(results_es => {
            this.output.next();
          });
        });
      } else {
        this.output.next();
      }
    }
  }

  setupData(data: any) {
    // lang status
    if (typeof this.changes['lang'] !== 'undefined') {
      data.field_lang_status = [{value: this.changes['lang']}];
    }
    // title_en
    if (typeof this.changes['title_en'] !== 'undefined') {
      data.title = [{value: this.changes['title_en']}];
    } else if (this.node[0].new && typeof this.changes['title_es'] !== 'undefined') {
      data.title = [{value: this.changes['title_es']}];
    }
    // body_en
    let b_val = '';
    if (CKEDITOR.instances.sbody_en.getData().length > 0) {
      b_val = CKEDITOR.instances.sbody_en.getData();
    }
    this.changes['sbody_en'] = b_val;
    data.body = [{value: b_val, format: 'full_html'}];
    // node_ref_en
    const node_ref = [];
    this.node_ref_en.forEach(function (item) {
      node_ref.push({
        target_id: item.target_id
      });
    });
    data.field_node_reference = node_ref;
  }

  setupDataES(data: any) {
    // title_es
    if (typeof this.changes['title_es'] !== 'undefined') {
      data.title = [{value: this.changes['title_es']}];
    } else if (this.node[0].new && typeof this.changes['title_en'] !== 'undefined') {
      data.title = [{value: this.changes['title_en']}];
    }
    // body_es
    let b_val = '';
    if (CKEDITOR.instances.sbody_es.getData().length > 0) {
      b_val = CKEDITOR.instances.sbody_es.getData();
    }
    this.changes['sbody_es'] = b_val;
    data.body = [{value: b_val, format: 'full_html'}];
    // node_ref_es
    const node_ref = [];
    this.node_ref_es.forEach(function (item) {
      node_ref.push({
        target_id: item.target_id
      });
    });
    data.field_node_reference = node_ref;
  }

  onChange(event: any) {
    this.changes[event.model.id] = event.model.value;
  }

}
