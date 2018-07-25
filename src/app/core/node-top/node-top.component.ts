import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { environment } from '../../../environments/environment';
import { VariableService } from '../../services/variable.service';
import { ApiService } from '../../services/api.service';
import { DomSanitizer, makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

const NSMI = makeStateKey('nsmi');

@Component({
  selector: 'app-node-top',
  templateUrl: './node-top.component.html',
  styleUrls: ['./node-top.component.scss']
})
export class NodeTopComponent implements OnInit {
  @Input() curNode;
  public variables: any;
  public adminUrl: string;
  public media: any;
  public working = true;
  private connection: any;
  public nsmi = [];
  public nsmi_term: any;
  public nsmi_subterm: any;
  public isBrowser: any;

  constructor(
    private variableService: VariableService,
    private apiService: ApiService,
    private breakpointObserver: BreakpointObserver,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId,
    private state: TransferState,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.adminUrl = environment.adminUrl + '/admin/content/edit/' + this.curNode[0].nid;
    // page node crumb
    if (this.curNode[0].node_export.type[0].target_id === 'page') {
      const _nsmi = this.state.get(NSMI, null as any);
      if (_nsmi !== null) {
        this.nsmi = _nsmi;
        this.working = false;
      } else {
        this.connection = this.apiService.getNSMI().subscribe(results => {
          this.nsmi = results.nsmi;
          this.state.set(NSMI, this.nsmi as any);
          this.doneLoading();
        });
      }
    } else {
      this.working = false;
    }
  }

  doneLoading() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.working = false;
  }

  setupIcon(item: any): string {
    if (item.node_export.field_type && item.node_export.field_type.length > 0 && item.node_export.field_type[0].target_id === '9') {
      return '';
    }
    let icon = '';
    if (item.node_export.field_icon && item.node_export.field_icon.length > 0) {
      icon = 'tid' + item.node_export.field_icon[0].target_id;
    } else if (item.node_export.field_type && item.node_export.field_type.length > 0) {
      icon = 'tid' + item.node_export.field_type[0].target_id;
    }
    return icon;
  }

  showCrumb(): boolean {
    let output = false;
    if (this.curNode[0].node_export.type[0].target_id === 'page'
      && this.curNode[0].node_export.field_nsmi.length > 0
      && this.nsmiCrumb(this.curNode[0].node_export.field_nsmi[0].target_id)) {
      output = true;
    }
    return output;
  }

  nsmiCrumb(tid: string): boolean {
    const self = this;
    let output = false;
    this.nsmi.forEach(function (i) {
      if (i.tid === tid) {
        self.nsmi_term = i;
        output = true;
      } else if (i.children.length > 0) {
        i.children.forEach(function (c) {
          if (c.tid === tid) {
            self.nsmi_term = i;
            self.nsmi_subterm = c;
            output = true;
          }
        });
      }
    });
    return output;
  }

  print() {
    if (this.isBrowser) {
      window.print();
    }
  }

}
