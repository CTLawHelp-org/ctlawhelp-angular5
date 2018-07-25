import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-segment-display',
  templateUrl: './segment-display.component.html',
  styleUrls: ['./segment-display.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SegmentDisplayComponent implements OnInit {
  @Input() src;
  public variables: any;
  public item: any;

  constructor(
    private variableService: VariableService,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.item = this.src;
    if (this.item.nid) {
      this.processSegment();
    } else if (this.item.target_id) {
      this.item.nid = this.item.target_id;
      this.item.node_export.i18n = this.item.i18n;
      this.processSegment();
    }
  }

  processSegment() {
    const parent = this.apiService.getParent(this.item.nid).subscribe(result => {
      if (result.length > 0) {
        this.item.parent = result[0];
        if (result[0].node_export.field_path.length > 0) {
          this.item.parent.link = result[0].node_export.field_path[0].value;
        } else if (result[0].node_export.field_old_path.length > 0 && this.useOld(result[0].node_export.field_old_path[0].value)) {
          this.item.parent.link = result[0].node_export.field_old_path[0].value;
        } else {
          this.item.parent.link = 'node/' + result[0].nid;
        }
      }
      parent.unsubscribe();
      this.item.processed = true;
    });
  }

  useOld(path: string): boolean {
    if (path.lastIndexOf('node/', 0) === 0) {
      return false;
    } else {
      return true;
    }
  }

  trimSeg(item: any): boolean {
    let output = false;
    if (item.value && item.value.length > 1200 && !item.full) {
      output = true;
    }
    return output;
  }

}
