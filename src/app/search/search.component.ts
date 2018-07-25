import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { VariableService } from '../services/variable.service';
import { ApiService } from '../services/api.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { isPlatformBrowser, Location } from '@angular/common';
import { Model } from './search.model';
import { Angulartics2 } from 'angulartics2';
import { MetaService } from '@ngx-meta/core';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit, OnDestroy {
  public working = true;
  public variables: any;
  public media: any;
  private subscription: any;
  private connection: any;
  private id: string;
  public searches = [];
  public currentIdx = 0;
  public hasBlocks = false;
  public blocks = {
    content_top: [],
    left: [],
    right: [],
    content_bottom: [],
  };
  private minScore = 13;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private variableService: VariableService,
    private apiService: ApiService,
    private breakpointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId,
    private location: Location,
    private angulartics2: Angulartics2,
    private meta: MetaService,
    @Inject(DOCUMENT) private document: any,
  ) {
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.variableService.setPageTitle('Search Results');
    this.meta.setTag('og:title', 'Search Results');
    this.meta.setTag('og:url', this.document.location.href);

    const block_page = this.apiService.getBlocks('all', 'search', 'all');
    const search_obs = this.variableService.getSearch();
    this.connection = forkJoin([search_obs, block_page]).subscribe(results => {
      this.connection.unsubscribe();
      this.searches = results[0];
      if (results[1].length > 0) {
        this.setupBlocks(results[1][0], results[1][0].term_export.field_block_setup);
      }
      if (this.route.snapshot.paramMap.get('id')) {
        this.loadResults(this.route.snapshot.paramMap.get('id'));
      } else if (typeof this.route.snapshot.queryParams.keyword !== 'undefined') {
        this.loadResults(this.route.snapshot.queryParams.keyword.split('+').join(' '));
      }
    });

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
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setupBlocks(src: any, items: any) {
    this.hasBlocks = true;
    const self = this;
    items.forEach(function (item) {
      if (!item.processed) {
        item.value = item.value.split(',');
        item.processed = true;
      }
      self.blocks[item.value[0]][item.value[1]] = item.target_id;
    });
    this.variableService.currentBlocksSrc = src;
    this.variableService.currentBlocks = items;
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
    const search_obs = this.apiService.getSearch(key);
    const spell_obs = this.apiService.getSpelling(key);
    const triage_search_obs = this.apiService.getTriageSearch(key);
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
      results[0].forEach(function(i) {
        if (i.type === 'page') {
          if (obj.search.pages.length < 10) {
            obj.search.pages.push(i);
          } else {
            obj.search.overflow.push(i);
          }
        } else if (i.type === 'segment') {
          obj.search.segments.push(i);
        }
      });
      // Triage Search Results
      if (results[2].length > 0) {
        const self = this;
        results[2].forEach(function (i) {
          const score = parseFloat(i.relevance);
          if (obj.search.triage.length < 3 && score > self.minScore) {
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
    });
  }

  setSearch() {
    const prev = [];
    this.searches.forEach(function(i) {
      const n_obj = new Model();
      n_obj.key = i.key;
      prev.push(n_obj);
    });
    this.variableService.setSearch(prev).subscribe(() => {});
  }

  processSearch(obj: any) {
    const array = [];
    obj.search.pages.forEach(function(i) {
      array.push(i.nid);
    });
    if (obj.search.segments.length > 0) {
      array.push(obj.search.segments[0].nid);
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
      });
    } else {
      obj.processed = true;
      this.working = false;
    }
  }

  processOverflow(obj: any) {
    if (obj.search.overflow) {
      obj.overflow_loading = true;
      const array = [];
      obj.search.overflow.forEach(function(i) {
        array.push(i.nid);
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
    let output = false;
    const lang_status = item.node_export.field_lang_status[0].value;
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
