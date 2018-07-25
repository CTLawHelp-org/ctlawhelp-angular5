import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { DynamicFormControlModel, DynamicFormLayout, DynamicFormService, DynamicInputModel } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { NSMI_FORM, NSMI_FORM_LAYOUT } from '../../admin-models/nsmi-form.model';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';

declare var CKEDITOR: any;

@Component({
  selector: 'app-admin-term-nsmi-edit',
  templateUrl: './admin-term-nsmi-edit.component.html',
  styleUrls: ['./admin-term-nsmi-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminTermNsmiEditComponent implements OnInit {
  @Input() term;
  @Output() output = new EventEmitter();
  private subscription: any;
  public working = true;
  public formModel: DynamicFormControlModel[] = NSMI_FORM;
  public formGroup: FormGroup;
  public formLayout: DynamicFormLayout = NSMI_FORM_LAYOUT;
  public parentForm: any;
  public changes = {};
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
    this.parentForm = this.formService.findById('parent', this.formModel) as DynamicInputModel;
    if (typeof this.term.i18n !== 'undefined') {
      this.term.term_export.i18n = this.term.i18n;
    }
    this.resetModel();
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
    if (!this.term.new) {
      this.parentForm.hidden = true;
      this.setupForm();
    } else {
      this.setupNew();
    }
    this.working = false;
    this.formGroup = this.formService.createFormGroup(this.formModel);
    // ckeditor setup
    if (isPlatformBrowser(this.platformId)) {
      this.setupCK();
    }
  }

  setupNew() {
    if (this.parentForm['options'].length < 1) {
      this.apiService.getAdminNSMI().subscribe( result => {
        const opts = [{
          value: '',
          label: 'Choose Parent Term'
        }];
        result['nsmi'].forEach(function (item) {
          opts.push({
            value: item.tid,
            label: item.name
          });
        });
        this.parentForm['options'] = opts;
      });
    }
    this.parentForm.hidden = false;
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
        {name: 'paragraph', items: ['BulletedList', 'NumberedList']},
        {name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
        {name: 'links', items: ['Link', 'Unlink']},
        {name: 'tools', items: ['SpellChecker']},
        {
          name: 'styles',
          items: ['Format', 'FontSize', 'TextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat']
        },
        {name: 'forms', items: ['Outdent', 'Indent']},
        {name: 'clipboard', items: ['Undo', 'Redo']},
        {name: 'document', items: ['Source', 'Maximize']}
      ];
      setTimeout( () => {
        CKEDITOR.replace('more_info_en', {
          language: 'en',
          toolbar: toolbar,
          allowedContent: true,
          height: 150,
        });
        CKEDITOR.replace('more_info_es', {
          language: 'en',
          toolbar: toolbar,
          allowedContent: true,
          height: 150,
        });
      });
    }
  }

  setupForm() {
    // english
    const title_en = this.formService.findById('title_en', this.formModel) as DynamicInputModel;
    title_en.valueUpdates.next(this.term.term_export.name[0].value);
    const desc_en = this.formService.findById('desc_en', this.formModel) as DynamicInputModel;
    if (this.term.term_export.description.length > 0) {
      desc_en.valueUpdates.next(this.term.term_export.description[0].value);
    } else {
      desc_en.valueUpdates.next('');
    }
    const more_info_en = this.formService.findById('more_info_en', this.formModel) as DynamicInputModel;
    if (this.term.term_export.field_more_info.length > 0) {
      more_info_en.valueUpdates.next(this.term.term_export.field_more_info[0].value);
    }
    // spanish
    const title_es = this.formService.findById('title_es', this.formModel) as DynamicInputModel;
    title_es.valueUpdates.next(this.term.term_export.i18n.es.name[0].value);
    const desc_es = this.formService.findById('desc_es', this.formModel) as DynamicInputModel;
    if (this.term.term_export.i18n.es.description.length > 0) {
      desc_es.valueUpdates.next(this.term.term_export.i18n.es.description[0].value);
    } else {
      desc_es.valueUpdates.next('');
    }
    const more_info_es = this.formService.findById('more_info_es', this.formModel) as DynamicInputModel;
    if (this.term.term_export.i18n.es.field_more_info.length > 0) {
      more_info_es.valueUpdates.next(this.term.term_export.i18n.es.field_more_info[0].value);
    }
    // icon
    const icon = this.formService.findById('file', this.formModel) as DynamicInputModel;
    if (this.term.term_export.field_public_term_file.length > 0) {
      icon.valueUpdates.next(this.term.term_export.field_public_term_file);
    } else {
      icon.valueUpdates.next([]);
    }
  }

  cancelEdit() {
    this.output.next(false);
  }

  saveTerm() {
    if (this.formGroup.valid) {
      this.working = true;
      const data = {
        _links: {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/nsmi'}}
      };
      this.setupData(data);
      const data_es = {
        _links: {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/nsmi'}}
      };
      this.setupDataES(data_es);
      if (this.term.new) {
        this.apiService.createTerm(data, this.variableService.token).subscribe(results => {
          const tid = results.tid[0].value;
          this.apiService.updateTermES(tid, data_es, this.variableService.token).subscribe(results_es => {
            this.output.next(true);
          });
        });
      } else if (Object.keys(this.changes).length > 0) {
        const tid = this.term.term_export.tid[0].value;
        this.apiService.updateTerm(tid, data, this.variableService.token).subscribe(results => {
          this.apiService.updateTermES(tid, data_es, this.variableService.token).subscribe(results_es => {
            this.output.next(true);
          });
        });
      } else {
        this.output.next(false);
      }
    }
  }

  setupData(data: any) {
    // title_en
    if (typeof this.changes['title_en'] !== 'undefined') {
      data.name = [{value: this.changes['title_en']}];
    }
    // desc_en
    if (typeof this.changes['desc_en'] !== 'undefined') {
      data.description = [{value: this.changes['desc_en'], format: 'full_html'}];
    }
    // more_info_en
    if (CKEDITOR.instances.more_info_en.getData().length > 0) {
      this.changes['more_info_en'] = CKEDITOR.instances.more_info_en.getData();
      data.field_more_info = [{value: CKEDITOR.instances.more_info_en.getData(), format: 'full_html'}];
    } else {
      this.changes['more_info_en'] = '';
      data.field_more_info = [{value: '', format: 'full_html'}];
    }
    // icon field_public_term_file
    if (typeof this.changes['file'] !== 'undefined') {
      const objs = [];
      this.changes['file'].forEach(function (file) {
        objs.push({target_id: file.target_id});
      });
      data.field_public_term_file = objs;
    }
    // parent
    if (typeof this.changes['parent'] !== 'undefined') {
      data.parent = [{target_id: this.changes['parent']}];
    }
  }

  setupDataES(data: any) {
    // title_es
    if (typeof this.changes['title_es'] !== 'undefined') {
      data.name = [{value: this.changes['title_es']}];
    }
    // desc_es
    if (typeof this.changes['desc_es'] !== 'undefined') {
      data.description = [{value: this.changes['desc_es'], format: 'full_html'}];
    }
    // more_info_es
    if (CKEDITOR.instances.more_info_es.getData().length > 0) {
      this.changes['more_info_es'] = CKEDITOR.instances.more_info_es.getData();
      data.field_more_info = [{value: CKEDITOR.instances.more_info_es.getData(), format: 'full_html'}];
    } else {
      this.changes['more_info_es'] = '';
      data.field_more_info = [{value: '', format: 'full_html'}];
    }
  }

  onChange(event: any) {
    this.changes[event.model.id] = event.model.value;
  }

}
