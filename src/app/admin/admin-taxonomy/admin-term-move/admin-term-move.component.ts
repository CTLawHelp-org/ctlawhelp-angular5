import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ITreeOptions, TREE_ACTIONS } from 'angular-tree-component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-term-move',
  templateUrl: './admin-term-move.component.html',
  styleUrls: ['./admin-term-move.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminTermMoveComponent implements OnInit {
  @Input() term;
  @Output() output = new EventEmitter();
  @ViewChild('triageForm', { static: false }) triageForm: ElementRef;
  public working = true;
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
    this.apiService.getTriage().subscribe( result => {
      this.triage = result['triage'];
      this.working = false;
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
      const parent = this.parentTerm.length > 0 ? [{ target_id: this.parentTerm[0]['tid']}] : [];
      const data_en = {
        'parent': parent,
        '_links': { type: { href: environment.apiUrl + '/rest/type/taxonomy_term/nsmi'}}
      };
      const tid = this.term.term_export.tid[0].value;
      this.apiService.updateTerm(tid, data_en, this.variableService.token).subscribe(results => {
        this.output.next(true);
      });
    }
  }

}
