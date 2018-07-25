import { Component, OnInit } from '@angular/core';
import { VariableService } from '../../../services/variable.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent implements OnInit {
  public variables: any;

  constructor(
    private variableService: VariableService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
