import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { environment } from '../../../../environments/environment';
import { DynamicFormControlModel, DynamicFormLayout, DynamicFormService, DynamicInputModel } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MENU_FORM, MENU_FORM_LAYOUT } from '../../admin-models/menu-form.model';

@Component({
  selector: 'app-admin-term-menu-edit',
  templateUrl: './admin-term-menu-edit.component.html',
  styleUrls: ['./admin-term-menu-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminTermMenuEditComponent implements OnInit {
  @Input() term;
  @Output() output = new EventEmitter();
  public working = true;
  public formModel: DynamicFormControlModel[] = MENU_FORM;
  public formGroup: FormGroup;
  public formLayout: DynamicFormLayout = MENU_FORM_LAYOUT;
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
      this.setupForm();
    } else {
      this.setupNew();
    }
    this.working = false;
    this.formGroup = this.formService.createFormGroup(this.formModel);
  }

  setupNew() {
    this.term.term_export = {
      field_status: [{value: '1'}]
    };
  }

  setupForm() {
    // english
    const title_en = this.formService.findById('title_en', this.formModel) as DynamicInputModel;
    title_en.valueUpdates.next(this.term.term_export.name[0].value);
    // spanish
    const title_es = this.formService.findById('title_es', this.formModel) as DynamicInputModel;
    title_es.valueUpdates.next(this.term.term_export.i18n.es.name[0].value);
    // link
    if (this.term.term_export.field_link && this.term.term_export.field_link.length > 0) {
      const link = this.formService.findById('link', this.formModel) as DynamicInputModel;
      link.valueUpdates.next(this.term.term_export.field_link[0].value);
    }
  }

  cancelEdit() {
    this.output.next(false);
  }

  saveTerm() {
    if (this.formGroup.valid) {
      this.working = true;
      const data = {
        _links: {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/section'}}
      };
      this.setupData(data);
      const data_es = {
        _links: {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/section'}}
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
    // link
    if (typeof this.changes['link'] !== 'undefined') {
      data.field_link = [{value: this.changes['link']}];
    }
    // status
    data.field_status = [{value: this.term.term_export.field_status[0].value}];
  }

  setupDataES(data: any) {
    // title_es
    if (typeof this.changes['title_es'] !== 'undefined') {
      data.name = [{value: this.changes['title_es']}];
    }
  }

  onChange(event: any) {
    this.changes[event.model.id] = event.model.value;
  }

  isPublished() {
    if (this.term.term_export.field_status[0].value === '1') {
      return true;
    } else {
      return false;
    }
  }

  setStatus(form: any) {
    if (form.checked) {
      this.term.term_export.field_status[0].value = '1';
      this.changes['status'] = '1';
    } else {
      this.term.term_export.field_status[0].value = '0';
      this.changes['status'] = '0';
    }
  }

}
