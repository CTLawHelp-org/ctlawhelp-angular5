import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VariableService } from '../../services/variable.service';

@Component({
  selector: 'app-admin-dialog',
  templateUrl: './admin-dialog.component.html',
  styleUrls: ['./admin-dialog.component.scss']
})
export class AdminDialogComponent implements OnInit {
  public variables: any;

  constructor(
    public dialog: MatDialog,
    private variableService: VariableService,
  ) {
    this.variables = variableService;
  }

  ngOnInit() {}

  blockInfo() {
    const width = '50%';
    const height = '50%';
    const dialogRef = this.dialog.open(AdminDialogDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95%',
      maxHeight: '95%',
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

}

@Component({
  selector: 'app-admin-dialog-dialog',
  templateUrl: './admin-dialog.dialog.html',
})
export class AdminDialogDialogComponent {
  public variables: any;

  constructor(
    public dialogRef: MatDialogRef<AdminDialogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private variableService: VariableService,
  ) {
    this.variables = this.variableService;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
