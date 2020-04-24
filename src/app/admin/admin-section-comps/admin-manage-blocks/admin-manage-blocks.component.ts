import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../admin-utils/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminBlocksEditorDialogComponent } from '../../admin-utils/admin-blocks-editor/admin-blocks-editor.component';

@Component({
  selector: 'app-admin-manage-blocks',
  templateUrl: './admin-manage-blocks.component.html',
  styleUrls: ['./admin-manage-blocks.component.scss']
})
export class AdminManageBlocksComponent implements OnInit {
  public working = true;
  public variables: any;
  public blocks = [];
  public id: any;

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.variables.adminTitle = 'Manage Block Setups';
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadBlocks();
  }

  loadBlocks() {
    this.apiService.getBlocksAdmin('all', 'all', 'all').subscribe( result => {
      this.blocks = result;
      this.working = false;
      if (this.id) {
        const self = this;
        let found = false;
        this.blocks.forEach(function (item) {
          if (item.tid === self.id) {
            found = true;
            self.variables.currentBlocksSrc = item;
          }
        });
        if (found) {
          this.openBlocks();
        }
      }
    });
  }

  isManaged(item: any): boolean {
    let output = false;
    if (item.term_export.field_term_managed && item.term_export.field_term_managed[0].value === '1') {
      output = true;
    }
    return output;
  }

  isEnabled(item: any): boolean {
    let output = false;
    if (item.term_export.field_status && item.term_export.field_status[0].value === '1') {
      output = true;
    }
    return output;
  }

  editBlocks(src: any) {
    this.setupBlocks(src, src.term_export.field_block_setup);
    const width = '100%';
    const height = '100%';
    const dialogRef = this.dialog.open(AdminBlocksEditorDialogComponent, {
      width: width,
      height: height,
      maxWidth: '100%',
      maxHeight: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadBlocks();
    });
  }

  openBlocks() {
    const width = '100%';
    const height = '100%';
    const dialogRef = this.dialog.open(AdminBlocksEditorDialogComponent, {
      width: width,
      height: height,
      maxWidth: '100%',
      maxHeight: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['admin/blocks']);
    });
  }

  newBlock() {
    this.variableService.currentBlocksSrc = {new: true};
    this.variableService.currentBlocks = [];
    const width = '100%';
    const height = '100%';
    const dialogRef = this.dialog.open(AdminBlocksEditorDialogComponent, {
      width: width,
      height: height,
      maxWidth: '100%',
      maxHeight: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadBlocks();
    });
  }

  setupBlocks(src: any, items: any) {
    this.variableService.currentBlocksSrc = src;
    this.variableService.currentBlocks = items;
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
        this.loadBlocks();
      });
    }
  }

}
