import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../../services/variable.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-segment-ref',
  templateUrl: './admin-segment-ref.component.html',
  styleUrls: ['./admin-segment-ref.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminSegmentRefComponent implements OnInit {
  @Input() value;
  @Input() altvalue;
  @Input() settings;
  @Input() nodeTypes;
  @Input() lang;
  @Input() label;
  public variables: any;
  public lastMoved: number;

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private variableService: VariableService,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
  }

  isHidden(target: string): boolean {
    return this.settings[target] ? this.settings[target]['hidetitle'] : false;
  }

  markHidden(target: string, value: any) {
    if (this.settings[target]) {
      this.settings[target]['hidetitle'] = value.checked;
    } else {
      this.settings[target] = {
        'hidetitle': value.checked
      };
    }
  }

  updateIndex(event: any, value: any) {
    this.lastMoved = event.currentIndex;
    this.variables.dropFnc(event, value);
  }

  newSegment() {
    const node = {
      new: true
    };
    const width = '95%';
    const height = '95%';
    const dialogRef = this.dialog.open(AdminSegmentRefDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95%',
      maxHeight: '95%',
      data: { node: node },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.getNodeAdmin(result['nid'][0]['value']).subscribe( out => {
          out[0]['src'] = out[0].node_export;
          out[0]['target_id'] = out[0].node_export.nid[0].value;
          this.value.push(out[0]);
        });
      }
    });
  }

  editSegment(node: any, index: number): void {
    const width = '95%';
    const height = '95%';
    this.apiService.getNodeAdmin(node.target_id).subscribe( out => {
      const dialogRef = this.dialog.open(AdminSegmentRefDialogComponent, {
        width: width,
        height: height,
        maxWidth: '95%',
        maxHeight: '95%',
        data: { node: out[0] },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.apiService.getNodeAdmin(result['nid'][0]['value']).subscribe( out_up => {
            out_up[0]['src'] = out_up[0].node_export;
            out_up[0]['target_id'] = out_up[0].node_export.nid[0].value;
            this.value[index] = out_up[0];
          });
        }
      });
    });
  }

}

@Component({
  selector: 'app-admin-segment-ref-dialog',
  templateUrl: './admin-segment-ref.dialog.html'
})
export class AdminSegmentRefDialogComponent {
  public variables: any;
  public node = [];
  public dialogTitle = 'Editing Segment';

  constructor(
    private variableService: VariableService,
    public dialogRef: MatDialogRef<AdminSegmentRefDialogComponent>,
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

  closeDialog(event: any): void {
    this.dialogRef.close(event);
  }
}
