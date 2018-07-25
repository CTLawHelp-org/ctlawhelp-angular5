import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-title-render',
  template: `<a routerLink="/admin/content/edit/{{nid}}" class="button"><mat-icon class="svg admin-xs">edit</mat-icon></a>
    <a routerLink="/en/{{link}}" class="button margin-left margin-right"><mat-icon class="svg admin-xs">remove_red_eye</mat-icon></a>
    <span>{{value}}</span>`,
  styles: [``]
})
export class TitleRenderPageComponent implements ICellRendererAngularComp {
  params: any;
  value: any = null;
  nid: any = null;
  lang: any = null;
  link: any = null;

  agInit(params: any): void {
    this.params = params;
    this.nid = this.params.data.nid;
    if (this.params.data.node_export.field_lang_status[0].value === 'es') {
      this.lang = 'es';
    } else {
      this.lang = 'en';
    }
    this.value = this.params.value.replace(/&#(\d+);/g, function(match, dec) {
      return String.fromCharCode(dec);
    });
    // link
    if (this.params.data.node_export.field_path.length > 0) {
      this.link = this.params.data.node_export.field_path[0].value;
    } else if (this.params.data.node_export.field_old_path.length > 0) {
      this.link = this.params.data.node_export.field_old_path[0].value;
    } else {
      this.link = 'node/' + this.params.data.node_export.nid[0].value;
    }
  }

  refresh(params: any): boolean {
    this.params = params;
    this.value = this.params.value;
    return true;
  }
}
