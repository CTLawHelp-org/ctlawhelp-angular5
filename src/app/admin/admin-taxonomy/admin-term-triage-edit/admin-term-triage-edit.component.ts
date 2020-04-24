import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ITreeOptions, TREE_ACTIONS } from 'angular-tree-component';

@Component({
  selector: 'app-admin-term-triage-edit',
  templateUrl: './admin-term-triage-edit.component.html',
  styleUrls: ['./admin-term-triage-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminTermTriageEditComponent implements OnInit {
  @Input() term;
  @Output() output = new EventEmitter();
  @ViewChild('triageForm', { static: false }) triageForm: ElementRef;
  public working = true;
  public term_en: any;
  public term_es: any;
  public variables: any;
  public triage = [];
  public triage_options: ITreeOptions = {
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
  @ViewChild('tree', { static: false }) tree;
  public parentTerm = [];

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
      'field_public_term_file': [],
    };
    this.term_es = {
      'name': [{'value': ''}],
      'description': [{'value': ''}],
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
      // spanish
      this.term_es['name'] = this.term.term_export.i18n['es']['name'];
      this.term_es['description'] = this.term.term_export.i18n['es']['description'].length > 0
        ? this.term.term_export.i18n['es']['description'] : [{'value': ''}];
    } else {
      this.setupNew();
    }
    this.working = false;
  }

  setupNew() {
    this.apiService.getTriage().subscribe( result => {
      this.triage = result['triage'];
    });
  }

  isParent(id: string): boolean {
    let output = false;
    if (this.parentTerm.length > 0 && this.parentTerm[0]['tid'] === id) {
      output = true;
    }
    return output;
  }

  setParent(term: any) {
    this.parentTerm = [term];
  }

  cancelEdit() {
    this.output.next(false);
  }

  saveTerm() {
    if (this.triageForm['valid']) {
      this.working = true;
      const data_en = this.term_en;
      data_en['_links'] = {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/nsmi'}};
      const data_es = this.term_es;
      data_es['_links'] = {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/nsmi'}};
      // check required
      if (data_es.name[0].value.length < 1 && data_en.name[0].value.length > 0) {
        data_es.name[0].value = data_en.name[0].value;
      }
      if (data_en.name[0].value.length < 1 && data_es.name[0].value.length > 0) {
        data_en.name[0].value = data_es.name[0].value;
      }
      if (this.term.new) {
        // set parent
        data_en.parent = [{
          target_id: this.parentTerm[0]['tid']
        }];
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
