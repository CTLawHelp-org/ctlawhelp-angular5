import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VariableService } from '../../../services/variable.service';
import { ApiService } from '../../../services/api.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-status-settings',
  templateUrl: './status-settings.component.html',
  styleUrls: ['./status-settings.component.scss']
})
export class StatusSettingsComponent implements OnInit {
  @Input() item;
  @Input() src;
  public variables: any;
  public showSetting = 'and';
  public hideSetting = 'or';

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private variableService: VariableService,
  ) { }

  ngOnInit() {
    this.variables = this.variableService;
    if (typeof this.item.value === 'string') {
      if (this.item.value !== '') {
        this.item.value = JSON.parse(this.item.value);
      } else {
        this.item.value = [];
      }
    }
    if (this.src === 'block') {
      if (!this.hasCondition('show', 'setting', this.item)) {
        this.item.value.push({
          type: 'setting',
          cond: 'show',
          targets: ['and'],
          cities: []
        });
      } else {
        this.showSetting = this.returnValue('show', this.item);
      }
      if (!this.hasCondition('hide', 'setting', this.item)) {
        this.item.value.push({
          type: 'setting',
          cond: 'hide',
          targets: ['or'],
          cities: []
        });
      } else {
        this.hideSetting = this.returnValue('hide', this.item);
      }
    }
  }

  returnValue(cond: string, entry: any): string {
    let output = 'and';
    if (entry['value'] && entry['value'].length > 0) {
      entry['value'].forEach(function (item) {
        if (item['cond'] === cond && 'setting' === item['type'] && item['targets'].length > 0) {
          output = item['targets'][0];
        }
      });
    }
    return output;
  }

  setValue(value: string, cond: string, entry: any) {
    if (entry['value'] && entry['value'].length > 0) {
      entry['value'].forEach(function (item) {
        if (item['cond'] === cond && 'setting' === item['type'] && item['targets'].length > 0) {
          item['targets'][0] = value;
        }
      });
    }
  }

  selChange(cond: string) {
    if (cond === 'show') {
      this.setValue(this.showSetting, 'show', this.item);
    } else if (cond === 'hide') {
      this.setValue(this.hideSetting, 'hide', this.item);
    }
  }

  hasCondition(cond: string, type: string, entry: any): boolean {
    let output = false;
    if (entry['value'] && entry['value'].length > 0) {
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
    const dialogRef = this.dialog.open(StatusSettingsDialogComponent, {
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

}

@Component({
  selector: 'app-status-settings-dialog',
  templateUrl: './status-settings.dialog.html',
})
export class StatusSettingsDialogComponent implements OnInit {
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
    public dialogRef: MatDialogRef<StatusSettingsDialogComponent>,
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
    } else if (this.type === 'triage_issue') {
      this.postLoad();
      this.working = false;
    }
  }

  postLoad() {
    if (this.entry['value'] && this.entry['value'].length > 0) {
      const self = this;
      this.entry['value'].forEach(function (item) {
        if (self.cond === item.cond && self.type === item.type) {
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
    } else if (this.type === 'triage_issue') {
      obj.targets = this.targets;
    }
    if (this.entry['value'] && this.entry['value'].length > 0) {
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
