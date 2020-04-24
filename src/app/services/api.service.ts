import {throwError as observableThrowError,  Observable ,  Subject } from 'rxjs';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { catchError, map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const STATE_KEY = makeStateKey;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public auth: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private state: TransferState,
  ) {}

  getUser(): Observable<any> {
    const url = environment.apiUrl + '/rest/session/token';
    return this.getAuthTextService(url); // fix for parsing issue
  }

  getUser2(): Observable<any> {
    const url = environment.apiUrl + '/rest/session/token?=2';
    return this.getAuthTextService(url); // fix for parsing issue
  }

  getLoginStatus(): Observable<any> {
    const url = environment.apiUrl + '/user/login_status?_format=json';
    return this.getAuthService(url);
  }

  getAccount(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/userlanding?_format=json';
    return this.getAuthService(url);
  }

  getMenu(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/getmenu?_format=json';
    return this.getService(url);
  }

  getAdminMenu(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/admin/mainmenu?_format=json';
    return this.getAuthService(url);
  }

  getTriage(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/triagefull?_format=json';
    if (this.auth) {
      return this.getAuthService(url);
    } else {
      return this.getService(url);
    }
  }

  getTriageStatus(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/admin/taxonomy/triage_status?_format=json';
    return this.getAuthService(url);
  }

  getTriageLocations(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/admin/taxonomy/locations?_format=json';
    return this.getAuthService(url);
  }

  getAdminTriage(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/admin/triagefull?_format=json';
    return this.getAuthService(url);
  }

  getAdminNSMI(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/nsmi?_format=json&t=0';
    return this.getAuthService(url);
  }

  getAdminNSMIContent(id: string): Observable<any> {
    const url = environment.apiUrl + '/api/v1/admin/nsmicontent/' + id + '?_format=json';
    return this.getAuthService(url);
  }

  getNSMI(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/nsmi?_format=json';
    if (this.auth) {
      return this.getAuthService(url);
    } else {
      return this.getService(url);
    }
  }

  getNSMIContent(id: string): Observable<any> {
    const url = environment.apiUrl + '/api/v1/nsmicontent/' + id + '?_format=json';
    if (this.auth) {
      return this.getAuthService(url);
    } else {
      return this.getService(url);
    }
  }

  getNSMIContentNew(id: string): Observable<any> {
    const url = environment.apiUrl + '/api/v1/nsmic/' + id + '?_format=json';
    if (this.auth) {
      return this.getAuthService(url);
    } else {
      return this.getService(url);
    }
  }

  getAdminOrphans(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/admin/orphans?_format=json';
    return this.getAuthService(url);
  }

  getVars(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/getvars?_format=json';
    return this.getService(url);
  }

  getPaths(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/paths?_format=json';
    if (this.auth) {
      return this.getAuthService(url);
    } else {
      return this.getService(url);
    }
  }

  getOldPaths(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/oldpaths?_format=json';
    if (this.auth) {
      return this.getAuthService(url);
    } else {
      return this.getService(url);
    }
  }

  getTermPaths(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/termpaths?_format=json';
    if (this.auth) {
      return this.getAuthService(url);
    } else {
      return this.getService(url);
    }
  }

  getAdminPaths(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/admin/paths?_format=json';
    return this.getAuthService(url);
  }

  getPopArticles(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/populararticles?_format=json';
    return this.getService(url);
  }

  getIcons(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/alltaxonomy/icons?_format=json';
    return this.getService(url);
  }

  getReporting(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/alltaxonomy/reporting?_format=json';
    return this.getService(url);
  }

  getPageTypes(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/alltaxonomy/type?_format=json';
    return this.getService(url);
  }

  getBlockTypes(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/alltaxonomy/block_types?_format=json';
    return this.getService(url);
  }

  getBlocks(id: string, src: string, tid: string): Observable<any> {
    const url = environment.apiUrl + '/api/v1/blocks/' + id + '/' + src + '/' + tid + '?_format=json';
    if (this.auth) {
      return this.getAuthService(url);
    } else {
      return this.getService(url);
    }
  }

  getBlockSetup(id: string): Observable<any> {
    const url = environment.apiUrl + '/api/v1/getblocks/' + id + '?_format=json';
    if (this.auth) {
      return this.getAuthService(url);
    } else {
      return this.getService(url);
    }
  }

  getBlocksAdmin(id: string, src: string, tid: string): Observable<any> {
    const url = environment.apiUrl + '/api/v1/admin/blocks/' + id + '/' + src + '/' + tid + '?_format=json';
    return this.getAuthService(url);
  }

  getFilesAdmin(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/admin/files?_format=json';
    return this.getAuthService(url);
  }

  getTriageExport(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/admin/triageexport?_format=json';
    return this.getAuthService(url);
  }

  getTriageStatsExport(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/admin/triagestatsexport?_format=json';
    return this.getAuthService(url);
  }

  getNSMIExport(): Observable<any> {
    const url = environment.apiUrl + '/api/v1/admin/nsmiexport?_format=json';
    return this.getAuthService(url);
  }

  getNode(id: string): Observable<any> {
    const url = environment.apiUrl + '/api/v1/node/' + id + '?_format=json';
    if (this.auth) {
      return this.getAuthService(url);
    } else {
      return this.getService(url);
    }
  }

  getParent(id: string): Observable<any> {
    const url = environment.apiUrl + '/api/v1/parent/' + id + '?_format=json';
    if (this.auth) {
      return this.getAuthService(url);
    } else {
      return this.getService(url);
    }
  }

  getSearch(id: string): Observable<any> {
    const url = environment.apiUrl + '/api/v1/search/' + encodeURIComponent(id) + '?_format=json';
    if (this.auth) {
      return this.getAuthService(url);
    } else {
      return this.getService(url);
    }
  }

  getSearchES(id: string): Observable<any> {
    const url = environment.apiUrl + '/api/v1/search_es/' + encodeURIComponent(id) + '?_format=json';
    if (this.auth) {
      return this.getAuthService(url);
    } else {
      return this.getService(url);
    }
  }

  getTriageSearch(id: string): Observable<any> {
    const url = environment.apiUrl + '/api/v1/triagesearch/' + encodeURIComponent(id) + '?_format=json';
    if (this.auth) {
      return this.getAuthService(url);
    } else {
      return this.getService(url);
    }
  }

  getTriageSearchES(id: string): Observable<any> {
    const url = environment.apiUrl + '/api/v1/triagesearch_es/' + encodeURIComponent(id) + '?_format=json';
    if (this.auth) {
      return this.getAuthService(url);
    } else {
      return this.getService(url);
    }
  }

  getSpelling(id: string): Observable<any> {
    const url = environment.apiUrl + '/capi/spell/' + encodeURIComponent(id) + '?_format=json';
    return this.getService(url);
  }

  getCTLocations(): Observable<any> {
    const url = environment.apiUrl + '/CT-cities.json';
    return this.getService(url);
  }

  getCTZips(): Observable<any> {
    const url = environment.apiUrl + '/CT.json';
    return this.getService(url);
  }

  genPDF(id: string, date: string, lang: string): Observable<any> {
    const url = environment.apiUrl + '/capi/pdf/' + id + '/' + date + '/' + lang;
    return this.getService(url);
  }

  getNodeAdmin(id: string): Observable<any> {
    const url = environment.apiUrl + '/api/v1/admin/node/' + id + '?_format=json';
    return this.getAuthService(url);
  }

  getContentAdmin(id: string): Observable<any> {
    const url = environment.apiUrl + '/api/v1/admin/content/' + id + '?_format=json';
    return this.getAuthService(url);
  }

  getContentAdminNew(id: string, page = '0'): Observable<any> {
    const url = environment.apiUrl + '/api/v1/admin/getcontent/' + id + '?_format=json&page=' + page;
    return this.getAuthService(url);
  }

  createNode(param: any, token: string): Observable<any> {
    const url = environment.apiUrl + '/node?_format=hal_json';
    return this.postService(url, param, token);
  }

  updateNode(id: string, param: any, token: string): Observable<any> {
    const url = environment.apiUrl + '/node/' + id + '?_format=hal_json';
    return this.patchService(url, param, token);
  }

  updateNodeES(id: string, param: any, token: string): Observable<any> {
    const url = environment.apiUrl + '/es/node/' + id + '?_format=hal_json';
    return this.patchService(url, param, token);
  }

  deleteNode(id: string, token: string): Observable<any> {
    const url = environment.apiUrl + '/node/' + id + '?_format=hal_json';
    return this.deleteService(url, token);
  }

  createTerm(param: any, token: string): Observable<any> {
    const url = environment.apiUrl + '/taxonomy/term?_format=hal_json';
    return this.postService(url, param, token);
  }

  createMedia(param: any, token: string): Observable<any> {
    const url = environment.apiUrl + '/entity/media?_format=hal_json';
    return this.postService(url, param, token);
  }

  updateTerm(id: string, param: any, token: string): Observable<any> {
    const url = environment.apiUrl + '/taxonomy/term/' + id + '?_format=hal_json';
    return this.patchService(url, param, token);
  }

  updateTermES(id: string, param: any, token: string): Observable<any> {
    const url = environment.apiUrl + '/es/taxonomy/term/' + id + '?_format=hal_json';
    return this.patchService(url, param, token);
  }

  deleteTerm(id: string, token: string): Observable<any> {
    const url = environment.apiUrl + '/taxonomy/term/' + id + '?_format=hal_json';
    return this.deleteService(url, token);
  }

  deleteFile(id: string, token: string): Observable<any> {
    const url = environment.apiUrl + '/entity/file/' + id + '?_format=hal_json';
    return this.deleteService(url, token);
  }

  saveFile(param: any, type: string, token: string): Observable<any> {
    let url = environment.apiUrl;
    if (type === 'image') {
      url = url + '/file/upload/media/image/field_media_image?_format=hal_json';
    } else if (type === 'file') {
      url = url + '/file/upload/media/file/field_media_file?_format=hal_json';
    }
    const body = param.data;
    return this.http
      .post(url, body, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': 'file; filename="' + param.filename + '"',
          'X-CSRF-Token': token
        },
        withCredentials: true
      }).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getService(url: string): Observable<any> {
    const serverState = this.state.get(STATE_KEY(url), null as any);
    if (isPlatformBrowser(this.platformId)) {
      if (serverState) {
        const val = serverState;
        const sub = new Subject();
        this.returnService(sub, val);
        return sub.asObservable();
      } else {
        const sub = new Subject();
        this.http
          .get(url, {})
          .toPromise()
          .then((res: any) => {
            const val = res;
            this.state.set(STATE_KEY(url), val as any);
            this.returnService(sub, val);
          }, error => {
            this.returnService(sub, error);
          });
        return sub.asObservable();
      }
    } else {
      const sub = new Subject();
      this.http
        .get(url, {})
        .toPromise()
        .then((res: any) => {
          const val = res;
          this.state.set(STATE_KEY(url), val as any);
          this.returnService(sub, val);
        }, error => {
          this.returnService(sub, error);
        });
      return sub.asObservable();
    }
  }

  // Drupal token currently has issues parsing
  getAuthService(url: string): Observable<any> {
    return this.http
      .get(url, {
        withCredentials: true
      }).pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  getAuthTextService(url: string): Observable<any> {
    return this.http
      .get(url, {
        responseType: 'text',
        withCredentials: true
      }).pipe(
      map(this.extractText),
      catchError(this.handleError));
  }

  patchService(url: string, param: any, token: string): Observable<any> {
    const body = JSON.stringify(param);
    return this.http
      .patch(url, body, {
        headers: {
          'Content-Type': 'application/hal+json',
          'X-CSRF-Token': token
        },
        withCredentials: true
      }).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  postService(url: string, param: any, token: string): Observable<any> {
    const body = JSON.stringify(param);
    return this.http
      .post(url, param, {
        headers: {
          'Content-Type': 'application/hal+json',
          'X-CSRF-Token': token
        },
        withCredentials: true
      }).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  deleteService(url: string, token: string): Observable<any> {
    return this.http
      .delete(url, {
        headers: {
          'Content-Type': 'application/hal+json',
          'X-CSRF-Token': token
        },
        withCredentials: true
      }).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  loginService(param: any): Observable<any> {
    return this.http
      .post(environment.apiUrl + '/user/login?_format=json', param, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      }).pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  logoutService(): Observable<any> {
    return this.http
      .get(environment.apiUrl + '/user/logout', {
        withCredentials: true,
        responseType: 'text'
      }).pipe(
        map(this.extractText),
        catchError(this.handleError));
  }

  returnService(subject: Subject<any>, value: any) {
    setTimeout (() => {
      subject.next(value);
      subject.complete();
    });
  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  private extractText(res: any) {
    const body = res;
    return body || '';
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return observableThrowError(errMsg);
  }
}
