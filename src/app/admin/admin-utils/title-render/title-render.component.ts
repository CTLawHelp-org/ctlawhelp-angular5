import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-title-render',
  template: `<a routerLink="/admin/content/edit/{{nid}}" class="button margin-right"><mat-icon class="svg admin-xs">edit</mat-icon></a>
  <span>{{value}}</span>`,
  styles: [``]
})
export class TitleRenderComponent implements ICellRendererAngularComp {
  params: any;
  value: any = null;
  nid: any = null;

  agInit(params: any): void {
    this.params = params;
    this.nid = this.params.data.nid;
    this.value = this.params.value.replace(/&#(\d+);/g, function(match, dec) {
      return String.fromCharCode(dec);
    });
  }

  refresh(params: any): boolean {
    this.params = params;
    this.value = this.params.value;
    return true;
  }
}
