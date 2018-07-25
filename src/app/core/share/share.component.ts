import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShareComponent implements OnInit {
  @Input() curNode;
  public variables: any;
  public isBrowser: any;
  public media: any;

  constructor(
    private variableService: VariableService,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
  }

  openShare(): void {
    let width = '80vw';
    let height = '30vh';
    if (this.isBrowser) {
      if (this.media.isMatched('(min-width: 960px)')) {
        width = '400px';
        height = '240px';
      }
    }
    const dialogRef = this.dialog.open(ShareDialogComponent, {
      width: width,
      height: height,
      maxWidth: '80vw',
      maxHeight: '60vh',
      data: { node: this.curNode }
    });
  }

}

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share.dialog.html',
})
export class ShareDialogComponent {
  public node = [];
  public variables: any;
  public extlink = '';

  constructor(
    public dialogRef: MatDialogRef<ShareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private variableService: VariableService,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.variables = this.variableService;
    this.node = data.node;
    if (isPlatformBrowser(this.platformId)) {
      this.extlink = window.location.href;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  viewClick() {
    this.dialogRef.close(true);
  }

}
