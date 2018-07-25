import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { VariableService } from '../../services/variable.service';

@Component({
  selector: 'app-admin-blocks-editor',
  templateUrl: './admin-blocks-editor.component.html',
  styleUrls: ['./admin-blocks-editor.component.scss']
})
export class AdminBlocksEditorDialogComponent implements OnInit {
  public variables: any;

  constructor(
    private variableService: VariableService,
    public dialogRef: MatDialogRef<AdminBlocksEditorDialogComponent>,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
  }

  onNoClick(): void {
    this.dialogRef.close([]);
  }

}
