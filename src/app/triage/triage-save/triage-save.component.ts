import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { isPlatformBrowser, PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-triage-save',
  templateUrl: './triage-save.component.html',
  styleUrls: ['./triage-save.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TriageSaveComponent implements OnInit {
  @Input() issue;
  @Input() status;
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

  openSave(): void {
    let width = '80vw';
    let height = '30vh';
    if (this.isBrowser) {
      if (this.media.isMatched('(min-width: 960px)')) {
        width = '600px';
        height = '200px';
      }
    }
    const dialogRef = this.dialog.open(TriageSaveDialogComponent, {
      width: width,
      height: height,
      maxWidth: '80vw',
      maxHeight: '60vh',
      data: { issue: this.issue, status: this.status }
    });
  }

}

@Component({
  selector: 'app-triage-save-dialog',
  templateUrl: './triage-save.dialog.html',
})
export class TriageSaveDialogComponent {
  public issue = [];
  public status = [];
  public base_url: any;
  public url = '';
  public variables: any;

  constructor(
    public dialogRef: MatDialogRef<TriageSaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private variableService: VariableService,
    @Inject(PLATFORM_ID) private platformId,
    private platformLocation: PlatformLocation
  ) {
    this.variables = this.variableService;
    this.issue = [data.issue];
    this.status = data.status;
    this.base_url = this.platformLocation;
    this.setupUrl();
  }

  setupUrl() {
    let status = this.status.join('-');
    if (status.length === 0) {
      status = '0';
    }
    const issues = [];
    this.issue[0].issues.forEach(function (i) {
      issues.push(i.tid);
    });
    const issues_url = issues.join('-');
    this.url = this.base_url.location.origin + '/' + this.variables.lang + '/saved/legal-help/' + status + '/' + issues_url;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  viewClick() {
    this.dialogRef.close(true);
  }

}
