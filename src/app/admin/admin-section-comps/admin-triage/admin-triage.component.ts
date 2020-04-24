import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ITreeOptions, TREE_ACTIONS } from 'angular-tree-component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';

import { isPlatformBrowser } from '@angular/common';
import { ConfirmDialogComponent } from '../../admin-utils/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Location, DOCUMENT } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-triage',
  templateUrl: './admin-triage.component.html',
  styleUrls: ['./admin-triage.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminTriageComponent implements OnInit, OnDestroy {
  public working = true;
  public variables: any;
  public id: any;
  public reorder = {
    active: false,
    src: {}
  };
  public edit = {
    active: false,
    src: {}
  };
  public redirect = {
    active: false,
    src: {}
  };
  public entries = {
    active: false,
    src: {}
  };
  public move = {
    active: false,
    src: {}
  };
  public activeTermID: string;
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
  @ViewChild('tree', { static: true }) tree;
  private subscription: any;
  public export_working = false;
  public export_link = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document,
    public dialog: MatDialog,
    private location: Location,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      if (!document.getElementById('ck-script')) {
        const ck = this.renderer2.createElement('script');
        ck.src = 'https://cdn.ckeditor.com/4.10.0/full/ckeditor.js';
        ck.id = 'ck-script';
        this.renderer2.appendChild(this.document.body, ck);
      }
    }
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.variables.adminTitle = 'Manage Triage';
    this.loadTriage();

    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        // this.processTriage();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadTriage() {
    this.apiService.getAdminTriage().subscribe( result => {
      this.triage = result['triage'];
      this.working = false;
      this.processTriage();
    });
  }

  processTriage() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.variables.isNumeric(this.id)) {
      setTimeout( () => {
        const someNode = this.tree.treeModel.getNodeById(this.id);
        if (someNode) {
          someNode.setActiveAndVisible();
          this.termEntries(someNode.data);
        }
      });
    }
  }

  reorderTerms(term: any) {
    this.resetAll();
    setTimeout( () => {
      this.reorder.src = term;
      this.reorder.active = true;
      this.activeTermID = term.tid;
      // window.scrollTo(0, 0);
    });
  }

  addTerm() {
    this.resetAll();
    setTimeout( () => {
      this.edit.src = { new: true };
      this.edit.active = true;
      // window.scrollTo(0, 0);
    });
  }

  editTerm(term: any) {
    this.resetAll();
    setTimeout( () => {
      this.edit.src = JSON.parse(JSON.stringify(term));
      this.edit.active = true;
      this.activeTermID = term.tid;
      // window.scrollTo(0, 0);
    });
  }

  redirectTerm(term: any) {
    this.resetAll();
    setTimeout( () => {
      this.redirect.src = JSON.parse(JSON.stringify(term));
      this.redirect.active = true;
      this.activeTermID = term.tid;
      // window.scrollTo(0, 0);
    });
  }

  moveTerm(term: any) {
    this.resetAll();
    setTimeout( () => {
      this.move.src = JSON.parse(JSON.stringify(term));
      this.move.active = true;
      this.activeTermID = term.tid;
      // window.scrollTo(0, 0);
    });
  }

  termEntries(term: any) {
    this.resetAll();
    setTimeout( () => {
      this.entries.src = JSON.parse(JSON.stringify(term));
      this.entries.active = true;
      this.activeTermID = term.tid;
      this.id = term.tid;
      this.location.go('/admin/triage/' + this.id);
      // window.scrollTo(0, 0);
    });
  }

  closePanel(src: any, event: any) {
    src.active = false;
    src.src = [];
    this.activeTermID = '';
    if (this.id) {
      this.location.go('/admin/triage');
      this.id = null;
    }
    if (event) {
      this.working = true;
      this.loadTriage();
    }
  }

  resetAll() {
    this.reorder.active = false;
    this.reorder.src = [];
    this.edit.active = false;
    this.edit.src = [];
    this.redirect.active = false;
    this.redirect.src = [];
    this.entries.active = false;
    this.entries.src = [];
    this.move.active = false;
    this.move.src = [];
    this.activeTermID = '';
  }

  getViewLink(term: any): string {
    const output = [];
    output.push(term.id);
    const someNode = this.tree.treeModel.getNodeById(term.id);
    this.getMap(output, someNode);
    const url = output.reverse().join('-');
    return '/en/saved/legal-help/0/' + url;
  }

  getMap(array: any, node: any) {
    if (node.parent && node.parent.level > 0) {
      array.push(node.parent.id);
      this.getMap(array, node.parent);
    }
  }

  collpaseAll() {
    this.tree.treeModel.collapseAll();
  }

  expandAll() {
    this.tree.treeModel.expandAll();
  }

  confirmDelete(term: any) {
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
        this.deleteSelection(term);
      }
    });
  }

  deleteSelection(term: any) {
    if (term) {
      this.working = true;
      this.apiService.deleteTerm(term.tid, this.variables.token).subscribe( result => {
        this.loadTriage();
      });
    }
  }

  exportTriage() {
    this.export_working = true;
    this.apiService.getTriageExport().subscribe( result => {
      this.export_link = environment.apiUrl + '/triage-full-export.csv';
      this.export_working = false;
    });
  }

  exportStats() {
    this.export_working = true;
    this.apiService.getTriageStatsExport().subscribe( result => {
      this.export_link = environment.apiUrl + '/triage-stats-full-export.csv';
      this.export_working = false;
    });
  }

}
