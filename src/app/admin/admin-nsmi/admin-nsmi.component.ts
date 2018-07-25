import { Component, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITreeOptions, TREE_ACTIONS } from 'angular-tree-component';
import { DOCUMENT } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { ConfirmDialogComponent } from '../admin-utils/confirm-dialog/confirm-dialog.component';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-admin-nsmi',
  templateUrl: './admin-nsmi.component.html',
  styleUrls: ['./admin-nsmi.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminNsmiComponent implements OnInit {
  public working = true;
  public variables: any;
  public reorder = {
    active: false,
    src: {}
  };
  public edit = {
    active: false,
    src: {}
  };
  public order = {
    active: false,
    src: {}
  };
  public activeTermID: string;
  public nsmi = [];
  public nsmi_options: ITreeOptions = {
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
  @ViewChild('tree') tree;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document,
    public dialog: MatDialog,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const ck = this.renderer2.createElement('script');
      ck.src = 'https://cdn.ckeditor.com/4.8.0/full/ckeditor.js';
      this.renderer2.appendChild(this.document.body, ck);
    }
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.variables.adminTitle = 'Manage NSMI';
    this.loadNSMI();
  }

  loadNSMI() {
    this.apiService.getAdminNSMI().subscribe( result => {
      this.nsmi = result['nsmi'];
    });
    this.working = false;
  }

  reorderTerms(term: any) {
    this.resetAll();
    setTimeout( () => {
      this.reorder.src = term;
      this.reorder.active = true;
      this.activeTermID = term.tid;
      window.scrollTo(0, 0);
    });
  }

  addTerm() {
    this.resetAll();
    setTimeout( () => {
      this.edit.src = { new: true };
      this.edit.active = true;
      window.scrollTo(0, 0);
    });
  }

  editTerm(term: any) {
    this.resetAll();
    setTimeout( () => {
      this.edit.src = JSON.parse(JSON.stringify(term));
      this.edit.active = true;
      this.activeTermID = term.tid;
      window.scrollTo(0, 0);
    });
  }

  orderTerm(term: any) {
    this.resetAll();
    setTimeout( () => {
      this.order.src = JSON.parse(JSON.stringify(term));
      this.order.active = true;
      this.activeTermID = term.tid;
      window.scrollTo(0, 0);
    });
  }

  closePanel(src: any, event: any) {
    src.active = false;
    src.src = [];
    this.activeTermID = '';
    if (event) {
      this.working = true;
      this.loadNSMI();
    }
  }

  resetAll() {
    this.reorder.active = false;
    this.reorder.src = [];
    this.edit.active = false;
    this.edit.src = [];
    this.order.active = false;
    this.order.src = [];
    this.activeTermID = '';
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
        this.loadNSMI();
      });
    }
  }

}
