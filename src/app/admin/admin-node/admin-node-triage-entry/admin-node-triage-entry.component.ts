import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormControlModel, DynamicFormLayout, DynamicFormService, DynamicInputModel } from '@ng-dynamic-forms/core';
import { TRIAGE_ENTRY_FORM, TRIAGE_ENTRY_FORM_LAYOUT } from '../../admin-models/triage-entry-form.model';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

declare var CKEDITOR: any;

@Component({
  selector: 'app-admin-node-triage-entry',
  templateUrl: './admin-node-triage-entry.component.html',
  styleUrls: ['./admin-node-triage-entry.component.scss']
})
export class AdminNodeTriageEntryComponent implements OnInit, OnDestroy {
  @Input() curNode;
  private subscription: any;
  public working = true;
  public formModel: DynamicFormControlModel[] = TRIAGE_ENTRY_FORM;
  public formGroup: FormGroup;
  public formLayout: DynamicFormLayout = TRIAGE_ENTRY_FORM_LAYOUT;
  public changes = {};
  public node = [];
  public icons = [];
  public selectedIcon: any;
  private lang_form: any;
  private icon_form: any;
  public variables: any;

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
    this.icon_form = this.formService.findById('icon', this.formModel) as DynamicInputModel;
    const en_form = this.formService.findById('english', this.formModel) as DynamicInputModel;
    const es_form = this.formService.findById('spanish', this.formModel) as DynamicInputModel;

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
    this.apiService.getIcons().subscribe( results => {
      if (self.icons.length < 1) {
        self.icons.push({
          label: 'None',
          value: ''
        });
        results.forEach(function (item) {
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
        this.variables.adminTitle = 'Adding Triage Entry';
        this.resetModel();
      } else {
        const title = this.node[0].title.replace(/&#(\d+);/g, function(match, dec) {
          return String.fromCharCode(dec);
        });
        this.variables.adminTitle = 'Editing Triage Entry: ' + title;
        this.resetModel();
      }
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
    this.node[0].node_export.status = [{value: '1'}];
    this.lang_form.valueUpdates.next('en');
    this.changes['lang'] = 'en';
    this.icon_form.valueUpdates.next('');
  }

  setupForm() {
    // lang status
    if (this.node[0].node_export.field_lang_status.length > 0) {
      this.lang_form.valueUpdates.next(this.node[0].node_export.field_lang_status[0].value);
    }
    // icon
    if (this.node[0].node_export.field_icon.length > 0) {
      const icon = this.formService.findById('icon', this.formModel) as DynamicInputModel;
      icon.valueUpdates.next(this.node[0].node_export.field_icon[0].target_id);
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
    // display title
    const display_title_en = this.formService.findById('display_title_en', this.formModel) as DynamicInputModel;
    if (this.node[0].node_export.field_display_title.length > 0) {
      display_title_en.valueUpdates.next(this.node[0].node_export.field_display_title[0].value);
    } else {
      display_title_en.valueUpdates.next('');
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
    }
    // display title
    const display_title_es = this.formService.findById('display_title_es', this.formModel) as DynamicInputModel;
    if (this.node[0].node_export.i18n.es.field_display_title.length > 0) {
      display_title_es.valueUpdates.next(this.node[0].node_export.i18n.es.field_display_title[0].value);
    } else {
      display_title_es.valueUpdates.next('');
    }
  }

  saveNode() {
    if (this.formGroup.valid) {
      this.working = true;
      const data = {
        _links: {type: {href: environment.apiUrl + '/rest/type/node/triage_entry'}}
      };
      this.setupData(data);
      const data_es = {
        _links: {type: {href: environment.apiUrl + '/rest/type/node/triage_entry'}}
      };
      this.setupDataES(data_es);
      if (this.node[0].new) {
        // new node
        this.apiService.createNode(data, this.variableService.token).subscribe(results => {
          const nid = results.nid[0].value;
          this.apiService.updateNodeES(nid, data_es, this.variableService.token).subscribe(results_es => {
            this.router.navigate(['admin/content/triage-entries']);
          });
        });
      } else if (Object.keys(this.changes).length > 0) {
        // prev node
        const nid = this.node[0].node_export.nid[0].value;
        this.apiService.updateNode(nid, data, this.variableService.token).subscribe(results => {
          this.apiService.updateNodeES(nid, data_es, this.variableService.token).subscribe(results_es => {
            this.router.navigate(['admin/content/triage-entries']);
          });
        });
      } else {
        this.router.navigate(['admin/content/triage-entries']);
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
    // display_title_en
    if (typeof this.changes['display_title_en'] !== 'undefined') {
      data.field_display_title = [{value: this.changes['display_title_en']}];
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
    // display_title_es
    if (typeof this.changes['display_title_es'] !== 'undefined') {
      data.field_display_title = [{value: this.changes['display_title_es']}];
    }
  }

  onChange(event: any) {
    this.changes[event.model.id] = event.model.value;
  }

}
