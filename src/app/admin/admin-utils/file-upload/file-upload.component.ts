import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FileUploadComponent implements OnInit {
  @Input() value;
  @Input() type;
  @Input() history;
  @ViewChild('nameFilter') nameFilter: ElementRef;
  public rows = [];

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
  ) {}

  ngOnInit() {
    this.rows = JSON.parse(JSON.stringify(this.value));
  }

  updateTextFilter(event: any, field: string) {
    const val = event.target.value.toLowerCase();
    const temp = this.rows.filter(function(d) {
      return d[field].toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
  }

  clearFilter(input: any) {
    if (input['value']) {
      this.resetFilters();
      this.rows = JSON.parse(JSON.stringify(this.value));
    }
  }

  resetFilters() {
    this.nameFilter.nativeElement.value = '';
  }

  remove(index: number) {
    this.value.splice(index, 1);
    this.rows = JSON.parse(JSON.stringify(this.value));
    this.history[this.type] = this.value;
  }

  updateMove(event: any) {
    this.history[this.type] = this.value;
  }

  myUploader(event: any) {
    const self = this;
    if (this.value && event.files.length > 0) {
      const obs = [];
      event.files.forEach(function(file) {
        const data = {
          filename: file['name'],
          data: file
        };
        obs.push(self.apiService.saveFile(data, self.type, self.variableService.token));
      });
      forkJoin(obs).subscribe( result => {
        result.forEach(function (item) {
          self.value.push({
            target_id: item['fid'][0].value,
            url: item['uri'][0].value,
            desktop: item['uri'][0].value,
            filename: item['filename'][0].value
          });
        });
        this.rows = JSON.parse(JSON.stringify(this.value));
        this.history[this.type] = this.value;
      });
    }
  }

}
