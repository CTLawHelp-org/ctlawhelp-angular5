import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { ITreeOptions, TREE_ACTIONS } from 'angular-tree-component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { environment } from '../../../../environments/environment';
import { ConfirmDialogComponent } from '../../admin-utils/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-term-triage-redirect',
  templateUrl: './admin-term-triage-redirect.component.html',
  styleUrls: ['./admin-term-triage-redirect.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminTermTriageRedirectComponent implements OnInit {
  @Input() term;
  @Input() triage;
  @Output() output = new EventEmitter();
  public variables: any;
  public working = true;
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
  @ViewChild('tree', { static: true }) tree;
  public re_term = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.working = false;
    if (this.term.term_export.field_redirect && this.term.term_export.field_redirect.length > 0) {
      this.processRedirect();
    }
  }

  processRedirect() {
    const red = this.term.term_export.field_redirect[0].value.split(',');
    setTimeout( () => {
      const someNode = this.tree.treeModel.getNodeById(red[red.length - 1]);
      if (someNode) {
        this.re_term = [someNode];
        someNode.setActiveAndVisible();
      }
    });
  }

  isRedirect(term: any): boolean {
    if (this.re_term.length < 1) {
      return false;
    } else {
      return this.re_term[0].id === term.id;
    }
  }

  setRedirect(term: any) {
    this.re_term = [term];
  }

  cancelRedirect() {
    this.output.next(false);
  }

  saveTerm() {
    if (this.re_term.length > 0) {
      this.working = true;
      const data = {
        _links: {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/triage'}}
      };
      const output = [];
      output.push(this.re_term[0].id);
      const someNode = this.tree.treeModel.getNodeById(this.re_term[0].id);
      this.getMap(output, someNode);
      const red = output.reverse().join(',');
      data['field_redirect'] = [{'value': red}];
      const tid = this.term.term_export.tid[0].value;
      this.apiService.updateTerm(tid, data, this.variableService.token).subscribe(results => {
        this.output.next(true);
      });
    }
  }

  confirmClear() {
    const width = '250px';
    const height = '110px';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95vw',
      maxHeight: '95vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clearRedirect();
      }
    });
  }

  clearRedirect() {
    this.working = true;
    const data = {
      field_redirect: [{value: ''}],
      _links: {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/triage'}}
    };
    const tid = this.term.term_export.tid[0].value;
    this.apiService.updateTerm(tid, data, this.variableService.token).subscribe(results => {
      this.output.next(true);
    });
  }

  getMap(array: any, node: any) {
    if (node.parent && node.parent.level > 0) {
      array.push(node.parent.id);
      this.getMap(array, node.parent);
    }
  }

}
