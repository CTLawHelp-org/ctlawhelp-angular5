import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-term-menu-edit',
  templateUrl: './admin-term-menu-edit.component.html',
  styleUrls: ['./admin-term-menu-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminTermMenuEditComponent implements OnInit {
  @Input() term;
  @Output() output = new EventEmitter();
  @ViewChild('menuForm', { static: false }) menuForm: ElementRef;
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
      'field_status': [{'value': '1'}],
      'field_link': [{'value': ''}],
    };
    this.term_es = {
      'name': [{'value': ''}],
    };
    this.doneLoading();
  }

  doneLoading() {
    if (!this.term.new) {
      this.term_en['name'] = this.term.term_export['name'];
      this.term_en['field_status'] = this.term.term_export['field_status'];
      this.term_en['field_link'] = this.term.term_export['field_link'].length > 0 ? this.term.term_export['field_link'] : [{ value: ''}];
      this.term_es['name'] = this.term.term_export.i18n['es']['name'];
    } else {
      this.term_en['field_status'] = [{value: '1'}];
    }
    this.working = false;
  }

  cancelEdit() {
    this.output.next(false);
  }

  saveTerm() {
    if (this.menuForm['valid']) {
      this.working = true;
      const data_en = this.term_en;
      data_en['_links'] = {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/section'}};
      const data_es = this.term_es;
      data_es['_links'] = {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/section'}};
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

  isPublished() {
    if (this.term_en['field_status'][0]['value'] === '1') {
      return true;
    } else {
      return false;
    }
  }

  setStatus(form: any) {
    if (form.checked) {
      this.term_en['field_status'][0]['value'] = '1';
    } else {
      this.term_en['field_status'][0]['value'] = '0';
    }
  }

}
