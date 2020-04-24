import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation
} from '@angular/core';

import { ApiService } from '../services/api.service';
import { VariableService } from '../services/variable.service';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { makeStateKey, Meta, TransferState } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Angulartics2 } from 'angulartics2';

const HOME_BLOCKS = makeStateKey('home_blocks');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  private connection: any;
  public working = true;
  public title = 'Free Legal Information';
  public variables: any;
  public isBrowser: any;
  public media: any;
  public block_setup = [];

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    @Inject(PLATFORM_ID) private platformId,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private angulartics2: Angulartics2,
    private meta: Meta,
    @Inject(DOCUMENT) private document: any,
    private state: TransferState,
    private cdr: ChangeDetectorRef,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.variableService.setPageTitle(this.title);
    this.meta.updateTag({ name: 'og:title', content: this.title});
    this.meta.updateTag({ name: 'og:url', content: this.document.location.href});
    const _blocks = this.state.get(HOME_BLOCKS, null as any);
    if (_blocks !== null) {
      this.variables.currentBlockSetup = _blocks;
      this.block_setup = this.variables.processBlock(_blocks);
      this.doneLoading();
    } else {
      this.connection = this.apiService.getBlocks('all', 'home', 'all').subscribe( result => {
        this.variables.currentBlockSetup = result;
        this.state.set(HOME_BLOCKS, result as any);
        this.block_setup = this.variables.processBlock(result);
        this.doneLoading();
      });
    }
  }

  doneLoading() {
    this.angulartics2.pageTrack.next({ path: this.router.url });
    if (this.connection) {
      this.connection.unsubscribe();
    }
    this.working = false;
    this.cdr.detectChanges();
  }

}
