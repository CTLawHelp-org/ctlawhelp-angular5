import {
  Component, ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  @ViewChild('nsmiForm', { static: false }) nsmiForm: ElementRef;
  public working = true;
  public term_en: any;
  public term_es: any;
  public variables: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    if (typeof this.term.i18n !== 'undefined') {
      this.term.term_export.i18n = this.term.i18n;
    }
    this.term_en = {
      'name': [{'value': ''}],
      'description': [{'value': ''}],
      'field_more_info': [{'value': '', 'format': 'full_html'}],
      'field_public_term_file': [],
      'field_term_alias': []
    };
    this.term_es = {
      'name': [{'value': ''}],
      'description': [{'value': ''}],
      'field_more_info': [{'value': ''}],
      'field_term_alias': []
    };
    this.doneLoading();
  }

  doneLoading() {
    if (!this.term.new) {
      this.term_en['field_public_term_file'] = this.term.term_export['field_public_term_file'];
      // english
      this.term_en['name'] = this.term.term_export['name'];
      this.term_en['description'] = this.term.term_export['description'].length > 0
        ? this.term.term_export['description'] : [{'value': ''}];
      this.term_en['field_more_info'] = this.term.term_export['field_more_info'].length > 0
        ? this.term.term_export['field_more_info'] : [{'value': '', 'format': 'full_html'}];
      this.term_en['field_term_alias'] = this.term.term_export['field_term_alias'];
      // spanish
      this.term_es['name'] = this.term.term_export.i18n['es']['name'];
      this.term_es['description'] = this.term.term_export.i18n['es']['description'].length > 0
        ? this.term.term_export.i18n['es']['description'] : [{'value': ''}];
      this.term_es['field_more_info'] = this.term.term_export.i18n['es']['field_more_info'].length > 0
        ? this.term.term_export.i18n['es']['field_more_info'] : [{'value': '', 'format': 'full_html'}];
      this.term_es['field_term_alias'] = this.term.term_export.i18n['es']['field_term_alias'];
    }
    this.working = false;
  }

  cancelEdit() {
    this.output.next(false);
  }

  saveTerm() {
    if (this.nsmiForm['valid']) {
      this.working = true;
      const data_en = this.term_en;
      data_en['field_more_info'] = [{value: CKEDITOR.instances.info_en.getData(), format: 'full_html'}];
      data_en['_links'] = {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/nsmi'}};
      const data_es = this.term_es;
      data_es['field_more_info'] = [{value: CKEDITOR.instances.info_es.getData(), format: 'full_html'}];
      data_es['_links'] = {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/nsmi'}};
      // check required
      if (data_es.name[0].value.length < 1 && data_en.name[0].value.length > 0) {
        data_es.name[0].value = data_en.name[0].value;
      }
      if (data_en.name[0].value.length < 1 && data_es.name[0].value.length > 0) {
        data_en.name[0].value = data_es.name[0].value;
      }
      if (this.term.new) {
        this.apiService.createTerm(data_en, this.variableService.token).subscribe(results => {
          const tid = results.tid[0].value;
          this.apiService.updateTermES(tid, data_es, this.variableService.token).subscribe(results_es => {
            this.output.next(true);
          });
        });
      } else {
        const tid = this.term.term_export.tid[0].value;
        this.apiService.updateTerm(tid, data_en, this.variableService.token).subscribe(results => {
          this.apiService.updateTermES(tid, data_es, this.variableService.token).subscribe(results_es => {
            this.output.next(true);
          });
        });
      }
    }
  }

}
