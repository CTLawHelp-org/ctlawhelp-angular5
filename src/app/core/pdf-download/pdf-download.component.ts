import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { ApiService } from '../../services/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatIconRegistry } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Angulartics2 } from 'angulartics2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-pdf-download',
  templateUrl: './pdf-download.component.html',
  styleUrls: ['./pdf-download.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PdfDownloadComponent implements OnInit {
  @Input() curNode;
  public media: any;

  constructor(
    private variableService: VariableService,
    private apiService: ApiService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private angulartics2: Angulartics2
  ) {
    this.media = breakpointObserver;
  }

  ngOnInit() {}

  genPDF() {
    // stats
    const props = {};
    props['category'] = 'content';
    props['value'] = 1;
    // analytics for field_reporting
    if (this.curNode[0].node_export.field_reporting && this.curNode[0].node_export.field_reporting.length > 0) {
      const output = [];
      this.curNode[0].node_export.field_reporting.forEach(function (i) {
        output.push(i.name);
      });
      props['dimension1'] = output.join(';');
    }
    // analytics for field_nsmi
    if (this.curNode[0].node_export.field_nsmi && this.curNode[0].node_export.field_nsmi.length > 0) {
      const output = [];
      this.curNode[0].node_export.field_nsmi.forEach(function (i) {
        output.push(i.target_id);
      });
      props['dimension2'] = output.join(';');
    }
    // analytics for field_type
    if (this.curNode[0].node_export.field_type && this.curNode[0].node_export.field_type.length > 0) {
      props['dimension3'] = this.curNode[0].node_export.field_type[0].name;
    }
    // analytics for Page content ID
    if (this.curNode[0].node_export.type[0].target_id === 'page') {
      props['dimension4'] = this.curNode[0].node_export.nid[0].value;
    }
    this.angulartics2.eventTrack.next({
      action: 'viewPDF',
      properties: props
    });
    let width = '80vw';
    let height = '200px';
    if (this.media.isMatched('(min-width: 960px)')) {
      width = '400px';
      height = '220px';
    }
    const dialogRef = this.dialog.open(PdfDownloadDialogComponent, {
      width: width,
      height: height,
      maxWidth: '80vw',
      maxHeight: '220px',
      data: { node: this.curNode }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

}

@Component({
  selector: 'app-pdf-download-dialog',
  templateUrl: './pdf-download.dialog.html',
})
export class PdfDownloadDialogComponent {
  public node = [];
  public variables: any;
  public working = true;
  public link: string;

  constructor(
    public dialogRef: MatDialogRef<PdfDownloadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private variableService: VariableService,
    private apiService: ApiService,
  ) {
    this.variables = this.variableService;
    this.node = data.node;
    if (environment.production) {
      this.apiService.genPDF(this.node[0].nid, this.node[0].node_export.changed[0].value, this.variableService.lang).subscribe(results => {
        this.link = results;
        this.working = false;
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
