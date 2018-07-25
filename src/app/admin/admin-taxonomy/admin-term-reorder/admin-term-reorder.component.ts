import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment';
import { VariableService } from '../../../services/variable.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-admin-term-reorder',
  templateUrl: './admin-term-reorder.component.html',
  styleUrls: ['./admin-term-reorder.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminTermReorderComponent implements OnInit {
  @Input() terms;
  @Output() output = new EventEmitter();
  public saved_terms = [];

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
  ) {}

  ngOnInit() {
    this.saved_terms = JSON.parse(JSON.stringify(this.terms));
  }

  resetOrder() {
    this.terms = JSON.parse(JSON.stringify(this.saved_terms));
  }

  cancelOrder() {
    this.output.next(false);
  }

  saveOrder() {
    const self = this;
    const obs = [];
    this.terms.forEach(function (item, index) {
      const weight = parseInt(item.term_export.weight[0].value, 10);
      if (weight !== index) {
        const data = {
          weight: [{value: index}],
          _links: {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/' + item.term_export.vid[0].target_id}}
        };
        obs.push(self.apiService.updateTerm(item.term_export.tid[0].value, data, self.variableService.token));
      }
    });
    forkJoin(obs).subscribe( results => {
      this.output.next(true);
    });
  }

}
