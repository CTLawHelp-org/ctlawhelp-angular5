import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api.service';
import { makeStateKey, TransferState } from '@angular/platform-browser';

const STATE_KEY = makeStateKey;

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlockComponent implements OnInit {
  @Input() nid;
  private connection: any;
  public working = true;
  public variables: any;
  public node = [];
  public adminUrl: string;
  public style = false;
  public classes = '';
  public appId = environment.appId;

  constructor(
    private variableService: VariableService,
    private apiService: ApiService,
    private state: TransferState,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    const _node = this.state.get(STATE_KEY(this.nid), null as any);
    if (_node !== null) {
      this.node = _node;
      this.doneLoading();
    } else {
      this.connection = this.apiService.getNode(this.nid).subscribe(results => {
        this.node = results;
        this.state.set(STATE_KEY(this.nid), this.node as any);
        this.doneLoading();
      });
    }
  }

  doneLoading() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.adminUrl = '/admin/content/edit/' + this.node[0].nid;
    if (this.node[0].node_export.field_style && this.node[0].node_export.field_style.length > 0) {
      this.style = true;
      if (this.node[0].node_export.field_style[0].value === 'drop') {
        this.classes = 'mat-elevation-z2 pad whitebg bg border-radius';
      }
      if (this.node[0].node_export.field_style[0].value === 'alert') {
        this.classes = 'mat-elevation-z2 pad alert border-lg border-radius';
      }
      if (this.node[0].node_export.field_style[0].value === 'home_lg') {
        this.classes = 'border-radius-lg mat-elevation-z2 primary bg home-wrapper';
      }
      if (this.node[0].node_export.field_style[0].value === 'home_sm') {
        this.classes = 'border-radius-lg mat-elevation-z2 backg1 bg home-wrapper';
      }
    }
    this.working = false;
  }

  showBlock(item: any): boolean {
    let output = false;
    if ((this.variables.lang === item.node_export.field_lang_status[0].value) || item.node_export.field_lang_status[0].value === 'both') {
      output = true;
    }
    return output;
  }

  show(item: any): boolean {
    let output = false;
    if ((this.variables.lang === item.src.field_lang_status[0].value) || item.src.field_lang_status[0].value === 'both') {
      output = true;
    }
    return output;
  }

}
