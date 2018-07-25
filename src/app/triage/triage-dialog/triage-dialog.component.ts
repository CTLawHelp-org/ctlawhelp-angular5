import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-triage-dialog',
  templateUrl: './triage-dialog.component.html',
  styleUrls: ['./triage-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TriageDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TriageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
