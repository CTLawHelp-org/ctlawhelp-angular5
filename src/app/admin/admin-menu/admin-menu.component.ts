import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../admin-utils/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {
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
  public activeTermID: string;
  public menu = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.variables.adminTitle = 'Manage Menu';
    this.loadMenu();
  }

  loadMenu() {
    this.apiService.getAdminMenu().subscribe( result => {
      this.menu = result;
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

  resetAll() {
    this.reorder.active = false;
    this.reorder.src = [];
    this.edit.active = false;
    this.edit.src = [];
    this.activeTermID = '';
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
        this.working = true;
        if (term.term_export.field_term_managed && term.term_export.field_term_managed.length > 0
          && term.term_export.field_term_managed[0].value === '1') {
          this.working = false;
        } else {
          this.apiService.deleteTerm(term.tid, this.variables.token).subscribe( results => {
            this.loadMenu();
          });
        }
      }
    });
  }

  closePanel(src: any, event: any) {
    src.active = false;
    src.src = [];
    this.activeTermID = '';
    if (event) {
      this.working = true;
      this.loadMenu();
    }
  }

  isManaged(term: any): boolean {
    let output = false;
    if (term.term_export.field_term_managed && term.term_export.field_term_managed.length > 0
      && term.term_export.field_term_managed[0].value === '1') {
      output = true;
    }
    return output;
  }

  isActive(term: any): boolean {
    let output = false;
    if (term.term_export.field_status && term.term_export.field_status.length > 0
      && term.term_export.field_status[0].value === '1') {
      output = true;
    }
    return output;
  }

}
