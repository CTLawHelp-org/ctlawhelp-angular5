import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../../services/variable.service';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-admin-form-segment-ref',
  templateUrl: './admin-form-segment-ref.component.html',
})
export class AdminFormSegmentRefComponent implements OnInit {
  @Input() src;
  @Input() type;
  @Input() history;

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
  ) { }

  ngOnInit() {}

  updateHistory() {
    this.history[this.type] = this.src;
  }

  addTo(event: any) {
    if (event) {
      let found = false;
      this.src.forEach(function (item) {
        if (item.target_id === event.dragData.target_id) {
          found = true;
        }
      });
      if (!found) {
        this.src.push(event.dragData);
        this.history[this.type] = this.src;
      }
    }
  }

  newSegment() {
    const node = {
      new: true
    };
    const width = '95vw';
    const height = '80vh';
    const dialogRef = this.dialog.open(AdminFormSegmentRefDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: { node: node }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.getNodeAdmin(result[0].nid).subscribe( out => {
          out[0]['src'] = out[0].node_export;
          out[0]['target_id'] = out[0].node_export.nid[0].value;
          this.src.push(out[0]);
          this.history[this.type] = this.src;
        });
      }
    });
  }

  editSegment(node: any, index: number): void {
    const width = '95vw';
    const height = '80vh';
    this.apiService.getNodeAdmin(node.target_id).subscribe( out => {
      const dialogRef = this.dialog.open(AdminFormSegmentRefDialogComponent, {
        width: width,
        height: height,
        maxWidth: '95vw',
        maxHeight: '95vh',
        data: { node: out[0] }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.apiService.getNodeAdmin(result[0].node_export.nid[0].value).subscribe( out_up => {
            out_up[0]['src'] = out_up[0].node_export;
            out_up[0]['target_id'] = out_up[0].node_export.nid[0].value;
            this.src[index] = out_up[0];
            this.history[this.type] = this.src;
          });
        }
      });
    });
  }

}

@Component({
  selector: 'app-admin-form-segment-ref-dialog',
  templateUrl: './admin-form-segment-ref.dialog.html',
})
export class AdminFormSegmentRefDialogComponent {
  public variables: any;
  public node = [];
  public dialogTitle = 'Editing Segment';

  constructor(
    private variableService: VariableService,
    public dialogRef: MatDialogRef<AdminFormSegmentRefDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.variables = this.variableService;
    this.node = [data.node];
    if (this.node[0].new) {
      this.dialogTitle = 'New Segment';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close(this.node);
  }
}
