import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { VariableService } from '../../services/variable.service';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-label-editor-dialog',
  templateUrl: './admin-label-editor.dialog.html',
})
export class AdminLabelEditorDialogComponent implements OnInit {
  public variables: any;
  public labels = [];

  constructor(
    private variableService: VariableService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AdminLabelEditorDialogComponent>,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    const self = this;
    if (this.variables.labelMap[this.variables.labelComp] && this.variables.labelMap[this.variables.labelComp].length > 0) {
      this.variables.labelMap[this.variables.labelComp].forEach(function (item) {
        const obj = {
          id: item,
          src: JSON.parse(JSON.stringify(self.variables.site_vars[item]))
        };
        self.labels.push(obj);
      });
    }
    if (this.variables.labelMap['root'] && this.variables.labelMap['root'].length > 0) {
      this.variables.labelMap['root'].forEach(function (item) {
        const obj = {
          id: item,
          src: JSON.parse(JSON.stringify(self.variables.site_vars[item]))
        };
        self.labels.push(obj);
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close([]);
  }

  resetItem(item: any) {
    item.src = JSON.parse(JSON.stringify(this.variables.site_vars[item.id]));
  }

  saveItem(item: any) {
    item.working = true;
    const data = {
      _links: {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/variables'}},
      description: [{value: item.src.desc, format: 'full_html'}]
    };
    this.apiService.updateTerm(item.src.tid, data, this.variables.token).subscribe( result => {
      data.description = [{value: item.src.es.desc, format: 'full_html'}];
      this.apiService.updateTermES(item.src.tid, data, this.variables.token).subscribe( result_es => {
        item.working = false;
      });
    });
  }
}
