import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { makeStateKey, TransferState } from '@angular/platform-browser';

const FOOTER_BLOCKS = makeStateKey('footer_blocks');

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit {
  public variables: any;
  private connection: any;
  public working = true;
  public block_setup = [];

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    private state: TransferState,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    const _blocks = this.state.get(FOOTER_BLOCKS, null as any);
    if (_blocks !== null) {
      this.block_setup = this.variables.processBlock(_blocks);
      this.doneLoading();
    } else {
      this.connection = this.apiService.getBlocks('all', 'footer', 'all').subscribe( result => {
        this.state.set(FOOTER_BLOCKS, result as any);
        this.block_setup = this.variables.processBlock(result);
        this.doneLoading();
      });
    }
  }

  doneLoading() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.working = false;
    this.cdr.detectChanges();
  }

}
