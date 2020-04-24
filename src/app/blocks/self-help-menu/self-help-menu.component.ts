import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { makeStateKey, TransferState } from '@angular/platform-browser';

const SELF_HELP_MENU = makeStateKey('self_help_menu');

@Component({
  selector: 'app-self-help-menu',
  templateUrl: './self-help-menu.component.html',
  styleUrls: ['./self-help-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SelfHelpMenuComponent implements OnInit, OnDestroy {
  private connection: any;
  private langsub: any;
  public working = true;
  public variables: any;
  public nsmi = [];

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    private state: TransferState,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.variables = this.variableService;
    const _nsmi = this.state.get(SELF_HELP_MENU, null as any);
    if (_nsmi !== null) {
      this.nsmi = _nsmi;
      this.doneLoading();
    } else {
      this.connection = this.apiService.getNSMI().subscribe(results => {
        this.nsmi = results.nsmi;
        this.state.set(SELF_HELP_MENU, this.nsmi as any);
        this.doneLoading();
      });
    }

    this.langsub = this.variableService.langSubject.subscribe(result => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.langsub) {
      this.langsub.unsubscribe();
    }
  }

  doneLoading() {
    this.working = false;
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.cdr.detectChanges();
  }

}
