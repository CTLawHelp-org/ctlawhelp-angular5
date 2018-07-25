import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { VariableService } from '../../../services/variable.service';
import { ApiService } from '../../../services/api.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
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

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private variableService: VariableService,
  ) {}

  ngOnInit() {
    if (this.term.term_export.field_entry_settings.length > 0) {
      this.term.term_export.field_entry_settings.forEach(function (item) {
        if (typeof item.value === 'string') {
          if (item.value !== '') {
            item.value = JSON.parse(item.value);
          } else {
            item.value = [];
          }
        }
      });
      this.entries = JSON.parse(JSON.stringify(this.term.term_export.field_entry_settings));
    }
    this.working = false;
  }

  cancel() {
    this.output.next(false);
  }

  hasCondition(cond: string, type: string, entry: any): boolean {
    let output = false;
    if (entry['value'].length > 0) {
      entry['value'].forEach(function (item) {
        if (item['cond'] === cond && type === item['type']) {
          output = true;
        }
      });
    }
    return output;
  }

  addCondition(cond: string, type: string, entry: any) {
    const width = '50vw';
    const height = '60vh';
    const dialogRef = this.dialog.open(AdminTermTriageEntriesDialogComponent, {
      width: width,
      height: height,
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: { cond: cond, type: type, entry: entry }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  removeCondition(cond: string, type: string, entry: any) {
    if (entry['value'].length > 0) {
      entry['value'].forEach(function (item, index) {
        if (item['cond'] === cond && type === item['type']) {
          entry['value'].splice(index, 1);
        }
      });
    }
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
        value: JSON.stringify(item.value)
      });
    });
    data['field_entry_settings'] = field;
    const tid = this.term.term_export.tid[0].value;
    this.apiService.updateTerm(tid, data, this.variableService.token).subscribe(results => {
      this.output.next(true);
    });
  }

}

@Component({
  selector: 'app-admin-term-triage-entries-dialog',
  templateUrl: './admin-term-triage-entries.dialog.html',
})
export class AdminTermTriageEntriesDialogComponent implements OnInit {
  public variables: any;
  public working = true;
  public cities = [];
  public locations = [];
  public status = [];
  public entry = [];
  public cond: string;
  public type: string;
  public targets = [];
  public sel_cities = [];
  public selected: any;

  constructor(
    public dialogRef: MatDialogRef<AdminTermTriageEntriesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private variableService: VariableService,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.entry = this.data.entry;
    this.cond = this.data.cond;
    this.type = this.data.type;
    this.load();
  }

  load() {
    if (this.type === 'locations') {
      const l_obs = this.apiService.getTriageLocations();
      const c_obs = this.apiService.getCTLocations();
      forkJoin([l_obs, c_obs]).subscribe( results => {
        this.locations = results[0];
        this.cities = results[1].sort(function(a, b) {
          const x = a['city']; const y = b['city'];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        this.postLoad();
        this.working = false;
      });
    } else if (this.type === 'triage_status') {
      this.apiService.getTriageStatus().subscribe( result => {
        this.status = result;
        this.postLoad();
        this.working = false;
      });
    }
  }

  postLoad() {
    if (this.entry['value'].length > 0) {
      const self = this;
      this.entry['value'].forEach(function (item) {
        if (self.cond === item.cond) {
          self.targets = item.targets;
          self.sel_cities = item.cities;
        }
      });
    }
  }

  isChecked(item: any): boolean {
    let output = false;
    if (this.targets.length > 0) {
      this.targets.forEach(function (ent) {
        if (item.tid === ent.target_id) {
          output = true;
          item.checked = true;
        }
      });
    }
    return output;
  }

  addCity(item: any) {
    const val = item.toLowerCase();
    if (this.sel_cities.indexOf(val) === -1) {
      this.sel_cities.push(val);
    }
  }

  updateCheck(item: any) {
    item.checked = !item.checked;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveCond() {
    const obj = {
      type: this.type,
      cond: this.cond,
      targets: [],
      cities: this.sel_cities
    };
    if (this.type === 'triage_status') {
      this.status.forEach(function (item) {
        if (item.checked) {
          obj.targets.push({
            target_id: item.tid,
            name: item.name
          });
        }
      });
    } else if (this.type === 'locations') {
      this.locations.forEach(function (item) {
        if (item.checked) {
          obj.targets.push({
            target_id: item.tid,
            name: item.name
          });
        }
      });
    }
    if (this.entry['value'].length > 0) {
      let found = false;
      this.entry['value'].forEach(function (item) {
        if (item.cond === obj.cond && item.type === obj.type) {
          item.targets = obj.targets;
          item.cities = obj.cities;
          found = true;
        }
      });
      if (!found) {
        this.entry['value'].push(obj);
      }
    } else {
      this.entry['value'] = [obj];
    }
    this.dialogRef.close();
  }

}
