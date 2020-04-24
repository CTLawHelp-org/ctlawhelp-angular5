import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { VariableService } from '../services/variable.service';
import { ApiService } from '../services/api.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { forkJoin } from 'rxjs';
import { isPlatformBrowser, Location, DOCUMENT } from '@angular/common';
import { Model } from './search.model';
import { Angulartics2 } from 'angulartics2';
import { DomSanitizer, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit, OnDestroy {
  private subscription: any;
  private connection: any;
  private varsub: any;
  private langsub: any;
  public working = true;
  public variables: any;
  public media: any;
  public id: string;
  public searches = [];
  public currentIdx = 0;
  private minScore = 12;
  private triage_num = 5;
  public block_setup = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private variableService: VariableService,
    private apiService: ApiService,
    private breakpointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId,
    private location: Location,
    private angulartics2: Angulartics2,
    private meta: Meta,
    @Inject(DOCUMENT) private document: any,
    private cdr: ChangeDetectorRef,
  ) {
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.variableService.setPageTitle('Search Results');
    this.meta.updateTag({ name: 'og:title', content: 'Search Results'});
    this.meta.updateTag({ name: 'og:url', content: this.document.location.href});

    if (this.variableService.varDone) {
      this.firstLoad();
    } else {
      this.varsub = this.variableService.varSubject.subscribe( () => {
        this.firstLoad();
      });
    }

    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.working = true;
        if (this.route.snapshot.paramMap.get('id')) {
          this.loadResults(this.route.snapshot.paramMap.get('id'));
        } else if (typeof this.route.snapshot.queryParams.keyword !== 'undefined') {
          this.loadResults(this.route.snapshot.queryParams.keyword.split('+').join(' '));
        }
      }
    });

    // Language change
    this.langsub = this.variables.langSubject.subscribe( result => {
      const url = '/' + this.variables.lang + '/search';
      this.router.navigateByUrl(url);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.varsub) {
      this.varsub.unsubscribe();
    }
    if (this.langsub) {
      this.langsub.unsubscribe();
    }
    if (this.connection) {
      this.connection.unsubscribe();
    }
  }

  firstLoad() {
    const block_page = this.apiService.getBlocks('all', 'search', 'all');
    const search_obs = this.variableService.lang === 'en' ? this.variableService.getSearch() : this.variableService.getSearchES();
    this.connection = forkJoin([search_obs, block_page]).subscribe(results => {
      // minScore
      const ms = this.variables.returnNumber(this.variables.site_vars['search_min_score']['description__value']);
      this.minScore = parseInt(ms[0], 10);
      // triage_num
      const tn = this.variables.returnNumber(this.variables.site_vars['search_page_triage_num']['description__value']);
      this.triage_num = parseInt(tn[0], 10);
      this.searches = results[0];
      if (results[1].length > 0) {
        this.variables.currentBlockSetup = results[1];
        this.block_setup = this.variables.processBlock(results[1]);
      }
      if (this.route.snapshot.paramMap.get('id')) {
        this.loadResults(this.route.snapshot.paramMap.get('id'));
      } else if (typeof this.route.snapshot.queryParams.keyword !== 'undefined') {
        this.loadResults(this.route.snapshot.queryParams.keyword.split('+').join(' '));
      } else if (this.searches.length > 0) {
        this.loadResults(this.searches[0].key);
      } else {
        this.working = false;
        this.cdr.detectChanges();
      }
    });
  }

  print() {
    if (isPlatformBrowser(this.platformId)) {
      window.print();
    }
  }

  loadResults(key: string) {
    const self = this;
    this.id = key;
    let found = false;
    let s_index = 0;
    this.searches.forEach(function(i, index) {
      if (i.key === self.id) {
        found = true;
        s_index = index;
      }
    });
    if (!found) {
      this.grabResults(this.id, null);
    } else {
      this.grabResults(this.id, s_index);
    }
  }

  grabResults(key: string, prev_index: number) {
    const search_obs = this.variables.lang === 'en' ? this.apiService.getSearch(key) : this.apiService.getSearchES(key);
    const spell_obs = this.apiService.getSpelling(key);
    const triage_search_obs = this.variables.lang === 'en' ? this.apiService.getTriageSearch(key) : this.apiService.getTriageSearchES(key);
    const conn = forkJoin([search_obs, spell_obs, triage_search_obs]).subscribe(results => {
      const obj = new Model();
      obj.key = key;
      // Spelling
      if (results[1].length > 0) {
        obj.spelling = results[1];
        const new_key = obj.key.split(' ');
        results[1].forEach(function(i) {
          const idx = new_key.indexOf(i.word);
          new_key[idx] = i.suggestions[0];
        });
        obj.new_key = new_key.join(' ');
      }
      // Search Results
      const s_array = [];
      results[0].forEach(function(i) {
        if (i.type === 'page') {
          if (obj.search.pages.length < 10 && s_array.indexOf(i.nid) === -1) {
            obj.search.pages.push(i);
            s_array.push(i.nid);
          } else if (s_array.indexOf(i.nid) === -1) {
            obj.search.overflow.push(i);
            s_array.push(i.nid);
          }
        } else if (i.type === 'segment' && obj.search.segments.length < 2) {
          obj.search.segments.push(i);
        }
      });
      // Triage Search Results
      if (results[2].length > 0) {
        const self = this;
        results[2].forEach(function (i) {
          const score = parseFloat(i.relevance);
          if (obj.search.triage.length < self.triage_num && score > self.minScore) {
            obj.search.triage.push(i);
          }
        });
      }
      conn.unsubscribe();
      if (prev_index === null) {
        this.searches.push(obj);
        this.currentIdx = this.searches.length - 1;
        this.setSearch();
        this.processSearch(this.searches[this.searches.length - 1]);
      } else {
        this.currentIdx = prev_index;
        this.searches[prev_index] = obj;
        this.processSearch(this.searches[prev_index]);
      }
      // set page view
      this.angulartics2.pageTrack.next({ path: this.router.url });
      this.cdr.detectChanges();
    });
  }

  setSearch() {
    const prev = [];
    this.searches.forEach(function(i) {
      const n_obj = new Model();
      n_obj.key = i.key;
      prev.push(n_obj);
    });
    if (this.variables.lang === 'en') {
      this.variableService.setSearch(prev).subscribe(() => {});
    } else {
      this.variableService.setSearchES(prev).subscribe(() => {});
    }
  }

  processSearch(obj: any) {
    const array = [];
    obj.search.pages.forEach(function(i) {
      if (array.indexOf(i.nid) === -1) {
        array.push(i.nid);
      }
    });
    if (obj.search.segments.length > 0) {
      array.push(obj.search.segments[0].nid);
    }
    if (obj.search.overflow.length > 0) {
      obj.show_overflow_btn = true;
    }
    if (array.length > 0) {
      const con = this.apiService.getNode(array.join('+')).subscribe(result => {
        if (result.length > 0) {
          result.forEach(function(i) {
            if (obj.search.segments.length > 0) {
              if (i.nid === obj.search.segments[0].nid) {
                obj.search.segments[0].node_export = i.node_export;
              }
            }
            obj.search.pages.forEach(function(src) {
              if (src.nid === i.nid) {
                src.node_export = i.node_export;
                src.link = i.node_export.field_path.length > 0 ? '/' + i.node_export.field_path[0].value : '/node/' + i.nid;
              }
            });
          });
        }
        con.unsubscribe();
        obj.processed = true;
        this.working = false;
        this.cdr.detectChanges();
      });
    } else {
      obj.processed = true;
      this.working = false;
      this.cdr.detectChanges();
    }
  }

  processOverflow(obj: any) {
    if (obj.search.overflow) {
      obj.overflow_loading = true;
      const array = [];
      let count = 0;
      obj.search.overflow.forEach(function(i) {
        if (obj.search.proc_overflow.indexOf(i.nid) === -1 && count <= 10) {
          obj.search.proc_overflow.push(i.nid);
          array.push(i.nid);
          count++;
        }
      });
      if (array.length > 0) {
        const con = this.apiService.getNode(array.join('+')).subscribe(result => {
          if (result.length > 0) {
            result.forEach(function(i) {
              if (obj.search.overflow.length > 0) {
                obj.search.overflow.forEach(function(src) {
                  if (src.nid === i.nid) {
                    src.node_export = i.node_export;
                    src.link = i.node_export.field_path.length > 0 ? '/' + i.node_export.field_path[0].value : '/node/' + i.nid;
                  }
                });
              }
            });
          }
          con.unsubscribe();
          obj.show_overflow = true;
          obj.overflow_loading = false;
          if (obj.search.overflow.length === obj.search.proc_overflow.length) {
            obj.show_overflow_btn = false;
          }
          this.cdr.detectChanges();
        });
      }
    }
  }

  tabChange(event: any) {
    const new_url = '/' + this.variables.lang + '/search/' + this.searches[event.index].key;
    this.location.go(new_url);
    if (!this.searches[event.index].processed) {
      this.working = true;
      this.loadResults(this.searches[event.index].key);
    }
  }

  remove(index: number) {
    this.searches.splice(index, 1);
    const new_url = '/' + this.variables.lang + '/search/' + this.searches[this.searches.length - 1].key;
    this.location.go(new_url);
    this.setSearch();
    if (!this.searches[this.searches.length - 1].processed) {
      this.working = true;
      this.loadResults(this.searches[this.searches.length - 1].key);
    }
  }

  show(item: any): boolean {
    if (typeof item === 'undefined' || typeof item.node_export === 'undefined') {
      return false;
    }
    let output = false;
    const lang_status = item.node_export.field_lang_status.length > 0 ? item.node_export.field_lang_status[0].value : 'both';
    if ((this.variables.lang === lang_status || lang_status === 'both') && !item.hide) {
      output = true;
    } else {
      output = false;
    }
    return output;
  }

  showSeg(item: any): boolean {
    let output = false;
    const score = parseFloat(item.relevance);
    if (score > this.minScore) {
      output = true;
    }
    return output;
  }

}
