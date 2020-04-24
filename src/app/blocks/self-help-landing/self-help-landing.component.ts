import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';
import { makeStateKey, TransferState } from '@angular/platform-browser';

const SELF_HELP_SM = makeStateKey('self_help_sm');

@Component({
  selector: 'app-self-help-landing',
  templateUrl: './self-help-landing.component.html',
  styleUrls: ['./self-help-landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SelfHelpLandingComponent implements OnInit, OnDestroy {
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
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    const _nsmi = this.state.get(SELF_HELP_SM, null as any);
    if (_nsmi !== null) {
      this.nsmi = _nsmi;
      this.doneLoading();
    } else {
      this.connection = this.apiService.getNSMI().subscribe(results => {
        this.nsmi = results.nsmi;
        this.state.set(SELF_HELP_SM, this.nsmi as any);
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
