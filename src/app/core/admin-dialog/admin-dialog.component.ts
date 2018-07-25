import { Component, Input, OnInit } from '@angular/core';
import { AdminLabelEditorDialogComponent } from '../../admin/admin-label-editor/admin-label-editor.component';
import { MatDialog } from '@angular/material';
import { AdminBlocksEditorDialogComponent } from '../../admin/admin-blocks-editor/admin-blocks-editor.component';

@Component({
  selector: 'app-admin-dialog',
  templateUrl: './admin-dialog.component.html',
  styleUrls: ['./admin-dialog.component.scss']
})
export class AdminDialogComponent implements OnInit {
  @Input() type;

  constructor(
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
  }

  editLabels() {
    const width = '80vw';
    const height = '80vh';
    const dialogRef = this.dialog.open(AdminLabelEditorDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95vw',
      maxHeight: '95vh',
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  editBlocks() {
    const width = '80vw';
    const height = '80vh';
    const dialogRef = this.dialog.open(AdminBlocksEditorDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95vw',
      maxHeight: '95vh',
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

}
