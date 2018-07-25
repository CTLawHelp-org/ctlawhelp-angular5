import { Component, OnInit } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-labels',
  templateUrl: './admin-labels.component.html',
  styleUrls: ['./admin-labels.component.scss']
})
export class AdminLabelsComponent implements OnInit {
  public working = true;
  public variables: any;
  public labels = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.variables.adminTitle = 'Manage Labels';
    this.loadLabels();
  }

  loadLabels() {
    const self = this;
    this.apiService.getVars().subscribe( result => {
      result['vars'].forEach(function (item) {
        const obj = {
          id: item.name,
          src: item,
          orig: JSON.parse(JSON.stringify(item))
        };
        self.labels.push(obj);
      });
    });
    this.working = false;
  }

  resetItem(item: any) {
    item.src = JSON.parse(JSON.stringify(item.orig));
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
