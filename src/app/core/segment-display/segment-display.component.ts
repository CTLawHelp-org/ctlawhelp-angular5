import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-segment-display',
  templateUrl: './segment-display.component.html',
  styleUrls: ['./segment-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SegmentDisplayComponent implements OnInit, OnDestroy {
  @Input() src;
  private langsub: any;
  private authsub: any;
  public variables: any;
  public adminUrl: string;

  constructor(
    private variableService: VariableService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.adminUrl = '/admin/content/edit/';
    if (this.src.nid) {
      this.processSegment();
    } else if (this.src.target_id) {
      this.src.nid = this.src.target_id;
      this.src.node_export.i18n = this.src.i18n;
      this.processSegment();
    }

    this.langsub = this.variableService.langSubject.subscribe(result => {
      this.cdr.detectChanges();
    });

    this.authsub = this.variableService.authSubject.subscribe(result => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.langsub) {
      this.langsub.unsubscribe();
    }
    if (this.authsub) {
      this.authsub.unsubscribe();
    }
  }

  processSegment() {
    const parent = this.apiService.getParent(this.src.nid).subscribe(result => {
      if (result.length > 0) {
        this.src.parent = result[0];
        if (result[0].node_export.field_path.length > 0) {
          this.src.parent.link = result[0].node_export.field_path[0].value;
        } else if (result[0].node_export.field_old_path.length > 0 && this.useOld(result[0].node_export.field_old_path[0].value)) {
          this.src.parent.link = result[0].node_export.field_old_path[0].value;
        } else {
          this.src.parent.link = 'node/' + result[0].nid;
        }
      }
      this.src.processed = true;
      this.cdr.detectChanges();
      parent.unsubscribe();
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
