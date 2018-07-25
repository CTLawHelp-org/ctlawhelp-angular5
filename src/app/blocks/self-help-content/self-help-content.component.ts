import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { isPlatformBrowser } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-self-help-content',
  templateUrl: './self-help-content.component.html',
  styleUrls: ['./self-help-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelfHelpContentComponent implements OnInit {
  @Input() src;
  @Input() term;
  public variables: any;
  public isBrowser: any;
  public media: any;
  public adminUrl: string;
  public ordered = [];
  public content_en = [];
  public content_es = [];

  constructor(
    private variableService: VariableService,
    @Inject(PLATFORM_ID) private platformId,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.adminUrl = environment.adminUrl + '/content/proc/';
    const self = this;
    if (this.term.term_export.field_node_order.length > 0) {
      this.term.term_export.field_node_order.forEach(function (value) {
        self.src.forEach(function (value2) {
          if (value.target_id === value2.nid) {
            const val = JSON.parse(JSON.stringify(value2));
            val.hide = false;
            self.ordered.push(val);
            value2.hide = true;
          }
        });
      });
    }
    this.processContent();
  }

  processContent() {
    const self = this;
    this.src.forEach(function (item) {
      const lang_status = item.node_export.field_lang_status[0].value;
      if ((lang_status === 'en' || lang_status === 'both') && !item.hide) {
        self.content_en.push(item);
      }
      if ((lang_status === 'es' || lang_status === 'both') && !item.hide) {
        self.content_es.push(item);
      }
    });
  }

  show(item: any): boolean {
    let output = false;
    const lang_status = item.node_export.field_lang_status[0].value;
    if ((this.variables.lang === lang_status || lang_status === 'both') && !item.hide) {
      output = true;
    } else {
      output = false;
    }
    return output;
  }

}
