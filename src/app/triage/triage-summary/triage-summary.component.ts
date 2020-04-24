import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { forkJoin } from 'rxjs';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconRegistry } from '@angular/material/icon';
import { isPlatformBrowser, Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Angulartics2 } from 'angulartics2';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-triage-summary',
  templateUrl: './triage-summary.component.html',
  styleUrls: ['./triage-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('entryAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':enter', [
          style({ opacity: 0 }),
          stagger(100, [
            animate('0.3s', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class TriageSummaryComponent implements OnInit, OnDestroy {
  @Input() idx;
  private connection: any;
  private statsub: any;
  private locsub: any;
  private getlocsub: any;
  private issuesub: any;
  public user_status: any;
  private user_loc: any;
  public working = true;
  private saved_issues = [];
  public issues = [];
  public saved_nids = [];
  public saved_nodes = [];
  public variables: any;
  private loc_set = false;
  public media: any;
  private set_idx: any;
  public currentIdx = 0;
  public show_loc = false;
  public block_setup = [];
  public hasBlocks = false;
  public blocks = {
    content_top: [],
    left: [],
    right: [],
    content_bottom: [],
  };

  constructor(
    private variableService: VariableService,
    private breakpointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId,
    private location: Location,
    private angulartics2: Angulartics2,
    private apiService: ApiService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.set_idx = this.idx;
    this.loadAll();

    this.issuesub = this.variableService.issuesSubject.subscribe(result => {
      this.working = true;
      this.doneUpdating(result);
    });

    this.locsub = this.variableService.locationSubject.subscribe(result => {
      this.working = true;
      this.user_loc = result;
      this.issues = [];
      this.doneUpdating([]);
      this.sendStats();
    });

    this.statsub = this.variableService.statusSubject.subscribe(result => {
      this.user_status = result;
    });

    this.getlocsub = this.variableService.getlocSubject.subscribe(result => {
      this.show_loc = !!result;
    });
  }

  ngOnDestroy() {
    if (this.issuesub) {
      this.issuesub.unsubscribe();
    }
    if (this.locsub) {
      this.locsub.unsubscribe();
    }
    if (this.statsub) {
      this.statsub.unsubscribe();
    }
    if (this.getlocsub) {
      this.getlocsub.unsubscribe();
    }
  }

  loadAll() {
    const status_obs = this.variableService.getStatus();
    const issues_obs = this.variableService.getIssues();
    const loc_obs = this.variableService.getLocation();
    const blocks = this.apiService.getBlocks('all', 'triage_entries', 'all');

    this.connection = forkJoin([status_obs, issues_obs, loc_obs, blocks]).subscribe(results => {
      this.user_status = results[0];
      this.issues = results[1];
      this.saved_issues = results[1];
      this.user_loc = results[2];
      if (results[3].length > 0) {
        this.block_setup = this.variables.processBlock(results[3]);
      }
      this.doneLoading();
      this.connection.unsubscribe();
    });
  }

  doneLoading() {
    if (this.issues.length > 0) {
      this.currentIdx = this.issues.length - 1;
      const self = this;
      const nodes = [];
      this.issues.forEach(function (i, index) {
        // icon setup
        if (i.issues[0].term_export.field_public_term_file.length > 0) {
          self.iconRegistry.addSvgIcon(
            'tid' + i.issues[0].term_export.tid[0].value,
            self.sanitizer.bypassSecurityTrustResourceUrl(i.issues[0].term_export.field_public_term_file[0].url));
        }
        i.issues[i.issues.length - 1].term_export.field_entry_settings.forEach(function (node) {
          if (self.saved_nids.indexOf(node.target_id) === -1) {
            self.saved_nids.push(node.target_id);
            nodes.push(node.target_id);
          }
        });
        if (i.issues[i.issues.length - 1].tid === self.set_idx) {
          self.currentIdx = index;
        }
      });
      if (nodes.length > 0) {
        this.apiService.getNode(nodes.join('+')).subscribe( result => {
          this.setupNodes(result);
        });
      }
    } else {
      this.working = false;
      this.variables.scrollSubject.next();
    }
  }

  setupNodes(nodes: any) {
    this.saved_nodes = this.saved_nodes.concat(nodes);
    const self = this;
    this.issues.forEach(function (i) {
      i.issues[i.issues.length - 1].term_export.field_entry_settings.forEach(function (node) {
        self.saved_nodes.forEach(function (item) {
          if (node.target_id === item.nid) {
            node.node_export = item.node_export;
            node.i18n = item.node_export.i18n;
          }
        });
      });
      self.processEntry(i);
    });
    this.sendStats();
    this.working = false;
    this.variables.scrollSubject.next();
  }

  doneUpdating(update: any) {
    if (update.length > 0) {
      this.issues = update;
      this.saved_issues = this.issues;
      this.set_idx = this.issues[this.issues.length - 1].issues[this.issues[this.issues.length - 1].issues.length - 1].tid;
      this.doneLoading();
    } else {
      this.issues = this.saved_issues;
      const self = this;
      this.issues.forEach(function (i) {
        self.processEntry(i);
      });
      this.working = false;
      this.variables.scrollSubject.next();
    }
  }

  sendStats() {
    if (this.issues.length > 0) {
      const last = this.issues[this.currentIdx].issues.length - 1;
      const content_dem = [];
      // issue
      const issue_dem = [];
      this.issues[this.currentIdx].issues.forEach(function (i, index) {
        issue_dem.push(i.tid);
        if (last === index) {
          // content
          i.term_export.field_entry_settings.forEach(function (entry) {
            if (entry.hide === false || typeof entry.hide === 'undefined') {
              content_dem.push(entry.target_id);
            }
          });
        }
      });
      // status
      const status_dem = [];
      this.user_status.forEach(function (i) {
        status_dem.push(i);
      });
      // location
      let loc_dem = [this.user_loc.county, this.user_loc.city, this.user_loc.zipcode];
      loc_dem = loc_dem.filter(n => n);
      // build and send
      const props = {};
      props['dimension5'] = issue_dem.join(';');
      props['dimension6'] = status_dem.join(';');
      props['dimension7'] = loc_dem.join(';');
      props['dimension8'] = content_dem.join(';');
      props['category'] = 'triage';
      props['value'] = 1;
      this.angulartics2.eventTrack.next({
        action: 'viewTriage',
        properties: props
      });
    }
  }

  setupLink(item: any): string {
    let link = '/en/';
    if (item.node_export.field_path.length > 0) {
      link = link + item.node_export.field_path[0].value;
    } else if (item.node_export.field_old_path.length > 0 && this.useOld(item.node_export.field_old_path[0].value)) {
      link = link + item.node_export.field_old_path[0].value;
    } else {
      link = link + '/node/' + item.node_export.nid[0].value;
    }
    return link;
  }

  setupLinkES(item: any): string {
    let link = '/es/';
    if (item.node_export.i18n.es.field_path.length > 0) {
      link = link + item.node_export.i18n.es.field_path[0].value;
    } else if (item.node_export.i18n.es.field_old_path.length > 0 && this.useOld(item.node_export.i18n.es.field_old_path[0].value)) {
      link = link + item.node_export.i18n.es.field_old_path[0].value;
    } else {
      link = link + '/node/' + item.node_export.nid[0].value;
    }
    return link;
  }

  useOld(path: string): boolean {
    if (path.lastIndexOf('node/', 0) === 0) {
      return false;
    } else {
      return true;
    }
  }

  tabChange(event: any) {
    const new_url = '/' + this.variables.lang + '/legal-help/results/' +
      this.issues[event.index].issues[this.issues[event.index].issues.length - 1].tid;
    this.set_idx = this.issues[event.index].issues[this.issues[event.index].issues.length - 1].tid;
    this.location.go(new_url);
  }

  print() {
    if (isPlatformBrowser(this.platformId)) {
      window.print();
    }
  }

  remove(index: number) {
    this.working = true;
    this.issues.splice(index, 1);
    this.currentIdx = this.issues.length - 1;
    this.loc_set = false;
    this.variableService.setIssues(this.issues).subscribe(results => {
      const new_url = '/' + this.variables.lang + '/legal-help/results/' +
        this.issues[this.issues.length - 1].issues[this.issues[this.issues.length - 1].issues.length - 1].tid;
      this.set_idx = this.issues[this.issues.length - 1].issues[this.issues[this.issues.length - 1].issues.length - 1].tid;
      this.location.go(new_url);
      this.working = false;
    });
  }

  hasStatus(tid: string): boolean {
    let output = false;
    if (typeof tid !== 'undefined' && this.user_status.indexOf(tid) !== -1) {
      output = true;
    }
    return output;
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
          if (i.name.toLowerCase() === self.user_loc.county) { // $filter('lowercase')(i.name)
            output = true;
          }
        } else if (cond.type === 'triage_status') {
          if (self.user_status.indexOf(i.target_id) !== -1) {
            output = true;
          }
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

    if (loc) {
      this.setLoc();
    }

    return output;
  }

  processEntry(entry: any): boolean {
    const self = this;
    if (typeof entry === 'undefined') {
      return false;
    }
    let output = !!entry.show;
    if (entry.issues.length > 0 && entry.issues[entry.issues.length - 1].term_export.field_entry_settings.length > 0) {
      entry.issues[entry.issues.length - 1].term_export.field_entry_settings.forEach(function(e) {
        if (typeof e.node_export === 'undefined') {
          e.hide = true;
        } else if (e.node_export.field_lang_status[0].value !== 'both'
          && e.node_export.field_lang_status[0].value !== self.variables.lang) {
          e.hide = true;
        }
        if (e.value !== '' && typeof e.value === 'string') {
          e.value = JSON.parse(e.value);
        }
        if (e.value !== '' && e.value.length > 0) {
          self.variables.sortByKey(e.value, 'cond', true);
          e.hide = false;
          e.value.forEach(function(c) {
            if (c.cond === 'show') {
              e.hide = true;
              if ((c.targets.length > 0 || c.cities.length > 0) && self.hasMatch(c)) {
                e.hide = false;
                e.show_type = c.type;
              }
            } else if (c.cond === 'hide') {
              if ((c.targets.length > 0 || c.cities.length > 0) && self.hasMatch(c)) {
                e.hide = true;
              }
            }
          });
        }
        if (!e.hide || typeof e.hide === 'undefined') {
          e.hide = false;
          output = true;
        }
      });
    }

    return output;
  }

  showEntry(entry: any): boolean {
    if (typeof entry === 'undefined') {
      return false;
    }
    let idx = 1;
    let output = !!entry.show;
    if (entry.issues.length > 0 && entry.issues[entry.issues.length - 1].term_export.field_entry_settings.length > 0) {
      entry.issues[entry.issues.length - 1].term_export.field_entry_settings.forEach(function(e) {
        if (!e.hide || typeof e.hide === 'undefined') {
          output = true;
          e.class_id = idx;
          idx++;
        }
      });
    }
    return output;
  }

  getClassID(entry: any): string {
    if (typeof entry === 'undefined' || typeof entry.class_id === 'undefined') {
      return '';
    }
    if (/^-?\d*[13579]$/.test(entry.class_id)) {
      return 'odd';
    }
    return '';
  }

  setLoc() {
    if (!this.loc_set) {
      this.loc_set = true;
      this.variableService.setGetLoc(true).subscribe(() => {});
    }
  }

}
