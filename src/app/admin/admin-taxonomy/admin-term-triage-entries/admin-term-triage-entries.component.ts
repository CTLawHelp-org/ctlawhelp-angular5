import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../../services/variable.service';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-term-triage-entries',
  templateUrl: './admin-term-triage-entries.component.html',
  styleUrls: ['./admin-term-triage-entries.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminTermTriageEntriesComponent implements OnInit {
  @Input() term;
  @Output() output = new EventEmitter();
  public entries = [];
  public working = true;
  public variables: any;
  public lastMoved: number;

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    if (this.term.term_export.field_entry_settings.length > 0) {
      this.entries = JSON.parse(JSON.stringify(this.term.term_export.field_entry_settings));
    }
    this.working = false;
  }

  updateIndex(event: any, value: any) {
    this.lastMoved = event.currentIndex;
    this.variables.dropFnc(event, value);
  }

  cancel() {
    this.output.next(false);
  }

  saveTerm() {
    const data = {
      _links: {type: {href: environment.apiUrl + '/rest/type/taxonomy_term/triage'}}
    };
    const field = [];
    this.entries.forEach(function (item) {
      field.push({
        target_id: item.target_id,
        name: item.name,
        value: item.value ? JSON.stringify(item.value) : ''
      });
    });
    data['field_entry_settings'] = field;
    const tid = this.term.term_export.tid[0].value;
    this.apiService.updateTerm(tid, data, this.variableService.token).subscribe(results => {
      this.output.next(true);
    });
  }

}
