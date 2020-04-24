import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, makeStateKey, Meta, Title, TransferState } from '@angular/platform-browser';
import { ApiService } from './api.service';
import { Observable ,  Subject ,  forkJoin } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { isPlatformBrowser } from '@angular/common';

const SITE_VARS = makeStateKey('site_vars');
const LANG = makeStateKey('lang');
const PAGE_ICONS = makeStateKey('page_icons');
const BULK_ICONS = makeStateKey('bulk_icons');
const NSMI_ICONS = makeStateKey('nsmi_icons');

@Injectable({
  providedIn: 'root'
})
export class VariableService {
  public site_title: string;
  public site_vars = {};
  public lang = 'en';
  public auth = false;
  public adminAuth = false;
  public editorAuth = false;
  public token: string;
  public adminTitle: string;
  public labelEdit = false;
  public labelComp: string;
  public labelMap = {};
  public currentBlocks = [];
  public currentBlocksSrc: any;
  public currentBlockSetup = [];
  public working = true;
  public varDone = false;
  public authDone = false;
  public authSubject = new Subject();
  public adminAuthSubject = new Subject();
  public editorAuthSubject = new Subject();
  public isBrowser: any;
  public langSubject = new Subject();
  public varSubject = new Subject();
  public iconSubject = new Subject();
  public issuesSubject = new Subject();
  public locationSubject = new Subject();
  public statusSubject = new Subject();
  public getlocSubject = new Subject();
  public scrollSubject = new Subject();
  public previousUrl = '';
  public currentUrl = '';

  constructor(
    private titleService: Title,
    private apiService: ApiService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId,
    private meta: Meta,
    private state: TransferState,
  ) {
    // set defaults
    this.site_title = 'CTLawHelp.org';
    this.isBrowser = isPlatformBrowser(platformId);
    const self = this;

    const _site_vars = this.state.get(SITE_VARS, null as any);
    const _lang = this.state.get(LANG, null as any);
    if (_site_vars !== null && _lang !== null) {
      this.site_vars = _site_vars;
      this.lang = _lang;
      this.doneLoading();
    } else {
      this.apiService.getVars().subscribe( results => {
        // Site variables
        results['vars'].forEach(function(i) {
          self.site_vars[i.name] = i;
        });
        this.state.set(SITE_VARS, this.site_vars as any);
        if (this.isBrowser) {
          const lang = sessionStorage.getItem('lang');
          if (lang !== null) {
            this.lang = lang;
          } else {
            this.lang = 'en';
          }
        } else {
          this.lang = 'en';
        }
        this.state.set(LANG, this.lang as any);
        this.doneLoading();
      });
    }
  }

  doneLoading() {
    this.site_title = this.site_vars['site_title']['desc'];
    // site wide meta tags
    this.meta.updateTag({ name: 'og:site_name', content: this.site_title});
    this.meta.updateTag({ name: 'twitter:card', content: 'summary'});
    this.varDone = true;
    this.varSubject.next();
    if (this.isBrowser) {
      this.apiService.getLoginStatus().subscribe( result => {
        if (result === 1) {
          this.apiService.getUser().subscribe( data => {
            this.token = data;
            this.getUserAccount();
          });
        }
      });
    } else {
      this.authDone = true;
      this.authSubject.next(this.auth);
      this.adminAuthSubject.next(this.adminAuth);
      this.editorAuthSubject.next(this.editorAuth);
    }
    this.getIcons();
  }

  getIcons() {
    const self = this;
    const _page_icons = this.state.get(PAGE_ICONS, null as any);
    const _bulk_icons = this.state.get(BULK_ICONS, null as any);
    const _nsmi_icons = this.state.get(NSMI_ICONS, null as any);
    if (_page_icons !== null && _bulk_icons !== null && _nsmi_icons !== null) {
      _page_icons.forEach(function(i) {
        if (i.term_export.field_public_term_file.length > 0) {
          self.iconRegistry.addSvgIcon(
            'tid' + i.tid,
            self.sanitizer.bypassSecurityTrustResourceUrl(i.term_export.field_public_term_file[0].url));
        }
      });
      _bulk_icons.forEach(function(i) {
        if (i.term_export.field_public_term_file.length > 0) {
          self.iconRegistry.addSvgIcon(
            'tid' + i.tid,
            self.sanitizer.bypassSecurityTrustResourceUrl(i.term_export.field_public_term_file[0].url));
        }
      });
      _nsmi_icons.forEach(function(i) {
        if (i.term_export.field_public_term_file.length > 0) {
          self.iconRegistry.addSvgIcon(
            'tid' + i.tid,
            self.sanitizer.bypassSecurityTrustResourceUrl(i.term_export.field_public_term_file[0].url));
        }
      });
      this.working = false;
      this.iconSubject.next();
    } else {
      const types = this.apiService.getPageTypes();
      const icons = this.apiService.getIcons();
      const nsmi = this.apiService.getNSMI();
      forkJoin([types, icons, nsmi]).subscribe( results => {
        this.state.set(PAGE_ICONS, results[0] as any);
        this.state.set(BULK_ICONS, results[1] as any);
        this.state.set(NSMI_ICONS, results[2]['nsmi'] as any);
        // Page type icons
        results[0].forEach(function(i) {
          if (i.term_export.field_public_term_file.length > 0) {
            self.iconRegistry.addSvgIcon(
              'tid' + i.tid,
              self.sanitizer.bypassSecurityTrustResourceUrl(i.term_export.field_public_term_file[0].url));
          }
        });
        // Bulk Icons
        results[1].forEach(function(i) {
          if (i.term_export.field_public_term_file.length > 0) {
            self.iconRegistry.addSvgIcon(
              'tid' + i.tid,
              self.sanitizer.bypassSecurityTrustResourceUrl(i.term_export.field_public_term_file[0].url));
          }
        });
        // NSMI Icons
        results[2]['nsmi'].forEach(function(i) {
          if (i.term_export.field_public_term_file.length > 0) {
            self.iconRegistry.addSvgIcon(
              'tid' + i.tid,
              self.sanitizer.bypassSecurityTrustResourceUrl(i.term_export.field_public_term_file[0].url));
          }
        });
        this.working = false;
        this.iconSubject.next();
      });
    }
  }

  getUserAccount(): Observable<any> {
    const self = this;
    const sub = new Subject();
    this.apiService.getAccount().subscribe( results => {
      this.returnService(sub, true);
      this.auth = true;
      this.apiService.auth = true;
      if (results[0].user_export.roles.length > 0) {
        results[0].user_export.roles.forEach(function (i) {
          if (i.target_id === 'administrator') {
            self.adminAuth = true;
            self.editorAuth = true;
          } else if (i.target_id === 'content_editor') {
            self.editorAuth = true;
          }
        });
      }
      this.authDone = true;
      this.authSubject.next(this.auth);
      this.adminAuthSubject.next(this.adminAuth);
      this.editorAuthSubject.next(this.editorAuth);
    }, error => {
      this.returnService(sub, false);
    });
    return sub.asObservable();
  }

  hasAuth(): Observable<any> {
    if (this.authDone) {
      const sub = new Subject();
      this.returnService(sub, this.auth);
      return sub.asObservable();
    } else {
      return this.authSubject.asObservable();
    }
  }

  hasAdminAuth(): Observable<any> {
    if (this.authDone) {
      const sub = new Subject();
      this.returnService(sub, this.adminAuth);
      return sub.asObservable();
    } else {
      return this.adminAuthSubject.asObservable();
    }
  }

  hasEditorAuth(): Observable<any> {
    if (this.authDone) {
      const sub = new Subject();
      this.returnService(sub, this.editorAuth);
      return sub.asObservable();
    } else {
      return this.editorAuthSubject.asObservable();
    }
  }

  returnService(subject: Subject<any>, value: any) {
    setTimeout (() => {
      subject.next(value);
      subject.complete();
    });
  }

  // HTML Title / Meta
  setPageTitle(title: string) {
    this.titleService.setTitle(title + ' | ' + this.site_title);
  }

  // Language
  setLanguage(opt: string): Observable<any> {
    const sub = new Subject();
    if (this.isBrowser) {
      sessionStorage.setItem('lang', opt);
    }
    setTimeout (() => {
      this.langSubject.next(this.lang);
      sub.next();
      sub.complete();
    });
    this.state.set(LANG, this.lang as any);
    return sub;
  }

  // User Status
  setStatus(status: any): Observable<any> {
    const sub = new Subject();
    if (this.isBrowser) {
      sessionStorage.setItem('status', JSON.stringify(status));
    }
    setTimeout (() => {
      this.statusSubject.next(status);
      sub.next();
      sub.complete();
    });
    return sub;
  }

  getStatus(): Observable<any> {
    const sub = new Subject();
    let data = [];
    if (this.isBrowser) {
      const val = sessionStorage.getItem('status');
      if (val !== null) {
        data = JSON.parse(val);
      }
    }
    setTimeout (() => {
      sub.next(data);
      sub.complete();
    });
    return sub;
  }

  // User Issues
  setIssues(issue: any): Observable<any> {
    const sub = new Subject();
    if (this.isBrowser) {
      const data = JSON.stringify(issue);
      sessionStorage.setItem('issues', data);
    }
    setTimeout (() => {
      this.issuesSubject.next(issue);
      sub.next();
      sub.complete();
    });
    return sub;
  }

  getIssues(): Observable<any> {
    const sub = new Subject();
    let data = [];
    if (this.isBrowser) {
      const val = sessionStorage.getItem('issues');
      if (val !== null) {
        data = JSON.parse(val);
      }
    }
    setTimeout (() => {
      sub.next(data);
      sub.complete();
    });
    return sub;
  }

  // User In State
  setState(state: boolean): Observable<any> {
    const sub = new Subject();
    if (this.isBrowser) {
      sessionStorage.setItem('state', JSON.stringify(state));
    }
    setTimeout (() => {
      sub.next();
      sub.complete();
    });
    return sub;
  }

  getState(): Observable<any> {
    const sub = new Subject();
    let data = false;
    if (this.isBrowser) {
      const val = sessionStorage.getItem('state');
      if (val === 'true') {
        data = true;
      }
    }
    setTimeout (() => {
      sub.next(data);
      sub.complete();
    });
    return sub;
  }

  // User Location
  setLocation(loc: any): Observable<any> {
    const sub = new Subject();
    if (this.isBrowser) {
      sessionStorage.setItem('location', JSON.stringify(loc));
    }
    setTimeout (() => {
      this.locationSubject.next(loc);
      sub.next();
      sub.complete();
    });
    return sub;
  }

  getLocation(): Observable<any> {
    const sub = new Subject();
    let data = {
      zipcode: '',
      city: '',
      county: ''
    };
    if (this.isBrowser) {
      const val = sessionStorage.getItem('location');
      if (val !== null) {
        data = JSON.parse(val);
      }
    }
    setTimeout (() => {
      sub.next(data);
      sub.complete();
    });
    return sub;
  }

  // Get Location
  setGetLoc(loc: boolean): Observable<any> {
    const sub = new Subject();
    if (this.isBrowser) {
      sessionStorage.setItem('getloc', JSON.stringify(loc));
    }
    setTimeout (() => {
      this.getlocSubject.next(loc);
      sub.next();
      sub.complete();
    });
    return sub;
  }

  getGetLoc(): Observable<any> {
    const sub = new Subject();
    let data = false;
    if (this.isBrowser) {
      const val = sessionStorage.getItem('getloc');
      if (val === 'true') {
        data = true;
      }
    }
    setTimeout (() => {
      sub.next(data);
      sub.complete();
    });
    return sub;
  }

  // Searches
  setSearch(search: any): Observable<any> {
    const sub = new Subject();
    if (this.isBrowser) {
      sessionStorage.setItem('search', JSON.stringify(search));
    }
    setTimeout (() => {
      sub.next();
      sub.complete();
    });
    return sub;
  }

  getSearch(): Observable<any> {
    const sub = new Subject();
    let data = [];
    if (this.isBrowser) {
      const val = sessionStorage.getItem('search');
      if (val !== null) {
        data = JSON.parse(val);
      }
    }
    setTimeout (() => {
      sub.next(data);
      sub.complete();
    });
    return sub;
  }

  setSearchES(search: any): Observable<any> {
    const sub = new Subject();
    if (this.isBrowser) {
      sessionStorage.setItem('search_es', JSON.stringify(search));
    }
    setTimeout (() => {
      sub.next();
      sub.complete();
    });
    return sub;
  }

  getSearchES(): Observable<any> {
    const sub = new Subject();
    let data = [];
    if (this.isBrowser) {
      const val = sessionStorage.getItem('search_es');
      if (val !== null) {
        data = JSON.parse(val);
      }
    }
    setTimeout (() => {
      sub.next(data);
      sub.complete();
    });
    return sub;
  }

  // Block System
  processBlock(data: any): any {
    let output = [];
    if (data.length > 0 && data[0].term_export && data[0].term_export.field_config.length > 0) {
      output = JSON.parse(data[0].term_export.field_config[0].value);
      const block_nodes = data[0].term_export.field_block_setup;
      const nids = [];
      block_nodes.forEach(function (item) {
        // setup values
        if (typeof item.value === 'string') {
          item.value = JSON.parse(item.value);
        }
        // setup position values
        if (typeof item.value[0]['pos'] === 'string') {
          item.value[0]['pos'] = item.value[0]['pos'].split(',');
        }
        // setup mobile / desktop
        if (item.value[0]['mobile']) {
          item.mobile = true;
          item.display = 'mobile';
        } else if (item.value[0]['desktop']) {
          item.desktop = true;
          item.display = 'desktop';
        } else {
          item.display = 'all';
        }
        // admin helpers
        if (item.value[0]['class']) {
          item.class = item.value[0]['class'];
        }
        if (item.value[0]['flex']) {
          item.flex = item.value[0]['flex'];
        }
        if (item.value[0]['msrc']) {
          item.msrc = item.value[0]['msrc'];
        }
        if (nids.indexOf(item.target_id) === -1) {
          nids.push(item.target_id);
        }
        output.forEach(function (block) {
          if (item.value[0]['pos'][0] === block.id) {
            block.columns[item.value[0]['pos'][1]].nodes[item.value[0]['pos'][2]] = item;
          }
        });
      });
    }
    return output;
  }

  // Drag / Drop
  dropFnc(ev, arr) {
    if (ev.previousIndex !== ev.currentIndex) {
      this.arrayMove(arr, ev.previousIndex, ev.currentIndex);
    }
  }

  // Util Functions
  trackByNid(index, item) {
    return item.nid;
  }

  trackByTarget(index, item) {
    return item.target_id;
  }

  trackByTid(index, item) {
    return item.tid;
  }

  trackByFid(index, item) {
    return item.fid;
  }

  arrayMove(arr, old_index, new_index) {
    while (old_index < 0) {
      old_index += arr.length;
    }
    while (new_index < 0) {
      new_index += arr.length;
    }
    if (new_index >= arr.length) {
      let k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  }

  moveUpArray(index: number, array: any) {
    array.splice(index - 1, 0, array.splice(index, 1)[0]);
  }

  moveDownArray(index: number, array: any) {
    array.splice(index + 1, 0, array.splice(index, 1)[0]);
  }

  removeArray(index: number, array: any) {
    array.splice(index, 1);
  }

  isNumeric(value: any): boolean {
    return !isNaN(value - parseFloat(value));
  }

  returnNumber(value: any): number {
    return value.match(/\d+/);
  }

  sortByKey(array, key, reverse = false): any {
    if (typeof array === 'undefined') {
      return false;
    }
    return array.sort(function(a, b) {
      const x = a[key]; const y = b[key];
      if (reverse) {
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
      } else {
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      }
    });
  }

  searchTree(element, id): any {
    if (element.id === id) {
      return element;
    } else if (element.children != null){
      const self = this;
      let i;
      let result = null;
      for (i = 0; result == null && i < element.children.length; i++) {
        result = self.searchTree(element.children[i], id);
      }
      return result;
    }
    return null;
  }

  // Admin util
  setField(event: any, node: any, field: any) {
    if (event.value) {
      node[field] = [{'target_id': event.value}];
    } else {
      node[field] = [];
    }
  }

  setMutltiField(event: any, node: any, field: any) {
    node[field] = [];
    event.value.forEach(function (i) {
      node[field].push({target_id: i});
    });
  }

  setValue(event: any, node: any, field: any) {
    if (event.value) {
      node[field] = [{'value': event.value}];
    } else {
      node[field] = [];
    }
  }

  toggleField(event: any, field: any) {
    if (event.checked) {
      field.push({'target_id': event.source.value});
    } else {
      field.forEach(function (item, index) {
        if (item['target_id'] === event.source.value) {
          field.splice(index, 1);
        }
      });
    }
  }

  hasValue(value: any, field: any): boolean {
    let output = false;
    if (value && field.length > 0) {
      field.forEach(function (item) {
        if (item['target_id'] === value) {
          output = true;
        }
      });
    }
    return output;
  }

  isPublished(node: any): boolean {
    if (node && node.status[0].value === '1') {
      return true;
    } else {
      return false;
    }
  }

  setPubStatus(form: any, node: any) {
    if (form.checked) {
      node.status[0].value = '1';
    } else {
      node.status[0].value = '0';
    }
  }

  returnIconLabel(array: any[], target: string): string {
    let output = '';
    array.forEach(function (item) {
      if (item.value === target) {
        output = item.label;
      }
    });
    return output;
  }

}
