import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input, OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api.service';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { isPlatformBrowser } from '@angular/common';

const STATE_KEY = makeStateKey;
declare var Swiper: any;

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BlockComponent implements OnInit, OnDestroy {
  @Input() nid;
  private connection: any;
  private langsub: any;
  private authsub: any;
  private locsub: any;
  private statsub: any;
  private issuesub: any;
  public working = false;
  public variables: any;
  public node = [];
  public adminUrl: string;
  public style = false;
  public classes = '';
  public appId = environment.appId;
  private user_status: any;
  public user_issues: any;
  private user_loc: any;
  private settings = [];
  public hide = false;
  public isBrowser: boolean;
  public swiperLoaded = false;

  constructor(
    private variableService: VariableService,
    private apiService: ApiService,
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId,
    private cdr: ChangeDetectorRef,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.variables = this.variableService;
    const _node = this.state.get(STATE_KEY(this.nid), null as any);
    if (_node !== null) {
      this.node = _node;
      this.doneLoading();
    } else {
      this.working = true;
      this.connection = this.apiService.getNode(this.nid).subscribe(results => {
        if (results.length > 0) {
          this.node = results;
          this.state.set(STATE_KEY(this.nid), this.node as any);
          this.doneLoading();
        }
      });
    }

    this.langsub = this.variableService.langSubject.subscribe(result => {
      this.cdr.detectChanges();
    });

    this.authsub = this.variableService.authSubject.subscribe(result => {
      this.cdr.detectChanges();
    });

    this.locsub = this.variableService.locationSubject.subscribe(result => {
      this.user_loc = result;
      if (this.settings.length > 2) {
        this.updateSettings();
      }
    });

    this.statsub = this.variableService.statusSubject.subscribe(result => {
      this.user_status = result;
      if (this.settings.length > 2) {
        this.updateSettings();
      }
    });

    this.issuesub = this.variableService.issuesSubject.subscribe(result => {
      this.user_issues = result;
      if (this.settings.length > 2) {
        this.updateSettings();
      }
    });
  }

  ngOnDestroy() {
    if (this.connection) {
      this.connection.unsubscribe();
    }
    if (this.langsub) {
      this.langsub.unsubscribe();
    }
    if (this.authsub) {
      this.authsub.unsubscribe();
    }
    if (this.locsub) {
      this.locsub.unsubscribe();
    }
    if (this.statsub) {
      this.statsub.unsubscribe();
    }
    if (this.issuesub) {
      this.issuesub.unsubscribe();
    }
  }

  doneLoading() {
    const self = this;
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.adminUrl = '/admin/content/edit/' + this.node[0].nid;
    if (this.isBrowser && this.node[0].node_export.field_block_type.length > 0
      && this.node[0].node_export.field_block_type[0].target_id === '744') {
      this.setupSwiper();
    }
    if (this.node[0].node_export.field_style && this.node[0].node_export.field_style.length > 0) {
      this.style = true;
      if (this.node[0].node_export.field_style[0].value === 'drop') {
        this.classes = 'mat-elevation-z2 border-radius';
      }
      if (this.node[0].node_export.field_style[0].value === 'alert') {
        this.classes = 'mat-elevation-z2 alert border-lg border-radius';
      }
      if (this.node[0].node_export.field_style[0].value === 'home_lg') {
        this.classes = 'border-radius-lg mat-elevation-z2 primary bg home-wrapper';
      }
      if (this.node[0].node_export.field_style[0].value === 'home_sm') {
        this.classes = 'border-radius-lg mat-elevation-z2 backg1 bg home-wrapper';
      }
    }
    // block settings
    this.settings = this.node[0].node_export.field_settings.length > 0 ? JSON.parse(this.node[0].node_export.field_settings[0].value) : [];
    this.variables.sortByKey(this.settings, 'cond', true);
    if (this.settings.length > 2) {
      this.procSettings();
    } else {
      this.working = false;
      this.cdr.detectChanges();
    }
  }

  procSettings() {
    const status_obs = this.variableService.getStatus();
    const loc_obs = this.variableService.getLocation();
    const issue_obs = this.variableService.getIssues();
    const conn = forkJoin([status_obs, loc_obs, issue_obs]).subscribe( result => {
      this.user_status = result[0];
      this.user_loc = result[1];
      this.user_issues = result[2];
      this.updateSettings();
      conn.unsubscribe();
    });
  }

  updateSettings() {
    const self = this;
    this.hide = true;
    let showSetting = 'and';
    const showArray = [];
    let hideSetting = 'and';
    const hideArray = [];
    let proc = false;
    this.settings.forEach(function(c) {
      if (c.cond === 'show') {
        if (c.type === 'locations' || c.type === 'triage_status' || c.type === 'triage_issue') {
          proc = true;
        }
        if ((c.targets.length > 0 || c.cities.length > 0) && self.hasMatch(c)) {
          showArray.push(false);
        } else if (c.type !== 'setting') {
          showArray.push(true);
        }
        if (c.type === 'setting' && c.targets.length > 0) {
          showSetting = c.targets[0];
        }
      } else if (c.cond === 'hide') {
        if (c.type === 'locations' || c.type === 'triage_status' || c.type === 'triage_issue') {
          proc = true;
        }
        if (c.type !== 'setting' && (c.targets.length > 0 || c.cities.length > 0) && self.hasMatch(c)) {
          hideArray.push(true);
        } else if (c.type !== 'setting') {
          hideArray.push(false);
        }
        if (c.type === 'setting' && c.targets.length > 0) {
          hideSetting = c.targets[0];
        }
      }
    });
    if (showArray.indexOf(false) !== -1 || hideArray.indexOf(false) !== -1) {
      // process show
      if (showSetting === 'and' && showArray.indexOf(true) === -1) {
        this.hide = false;
      } else if (showSetting === 'or' && showArray.indexOf(false) !== -1) {
        this.hide = false;
      }
      // process hide
      if (hideSetting === 'and' && hideArray.length > 0) {
        this.hide = hideArray.indexOf(false) !== -1;
      } else if (hideSetting === 'or' && hideArray.length > 0) {
        this.hide = hideArray.indexOf(true) !== -1;
      }
    } else if (!proc) { // no settings
      this.hide = false;
    }
    this.working = false;
    this.cdr.detectChanges();
  }

  hasMatch(cond): boolean {
    if (typeof cond === 'undefined') {
      return false;
    }
    const self = this;
    let loc = false;
    let output = false;
    if (cond.targets.length > 0) {
      cond.targets.forEach(function(i) {
        if (cond.type === 'locations') {
          loc = true;
          if (i.name.toLowerCase() === self.user_loc.county) {
            output = true;
          }
        } else if (cond.type === 'triage_status') {
          if (self.user_status.indexOf(i.target_id) !== -1) {
            output = true;
          }
        } else if (cond.type === 'triage_issue' && self.user_issues.length > 0) {
          self.user_issues.forEach(function (ui) {
            if (ui.issues[ui.issues.length - 1].tid === i.target_id) {
              output = true;
            }
          });
        }
      });
    }
    if (cond.cities && cond.cities.length > 0) {
      cond.cities.forEach(function(i) {
        loc = true;
        if (i === self.user_loc.city) {
          output = true;
        }
      });
    }

    return output;
  }

  returnClass(item: any): string {
    if (typeof item === 'undefined' || !this.showBlock(this.node[0])) {
      return '';
    }
    return 'block';
  }

  showBlock(item: any): boolean {
    if (this.hide) {
      return false;
    }
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

  setupSwiper() {
    if (typeof Swiper === 'undefined') {
      setTimeout( () => {
        this.setupSwiper();
      });
    } else {
      setTimeout( () => {
        const mySwiper = new Swiper ('.swiper-container-slider', {
          loop: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        });
        this.swiperLoaded = true;
        this.cdr.detectChanges();
      });
    }
  }

}
