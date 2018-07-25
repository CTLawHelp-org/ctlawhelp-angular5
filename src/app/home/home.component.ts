import {
  Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation
} from '@angular/core';

import { ApiService } from '../services/api.service';
import { VariableService } from '../services/variable.service';
import { isPlatformBrowser } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconRegistry } from '@angular/material';
import { DOCUMENT, DomSanitizer, makeStateKey, TransferState } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Angulartics2 } from 'angulartics2';
import { MetaService } from '@ngx-meta/core';

const HOME_BLOCKS = makeStateKey('home_blocks');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  private connection: any;
  public working = true;
  public title = 'Free Legal Information';
  public variables: any;
  public isBrowser: any;
  public media: any;
  public hasBlocks = false;
  public blocks = {
    content_top: [],
    left: [],
    right: [],
    content_bottom: [],
  };

  constructor(
    private apiService: ApiService,
    private variableService: VariableService,
    @Inject(PLATFORM_ID) private platformId,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private angulartics2: Angulartics2,
    private meta: MetaService,
    @Inject(DOCUMENT) private document: any,
    private state: TransferState,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.media = breakpointObserver;
  }

  ngOnInit() {
    this.variables = this.variableService;
    this.variableService.setPageTitle(this.title);
    this.meta.setTag('og:title', this.title);
    this.meta.setTag('og:url', this.document.location.href);
    const _blocks = this.state.get(HOME_BLOCKS, null as any);
    if (_blocks !== null) {
      this.setupBlocks(_blocks, _blocks.term_export.field_block_setup);
      this.doneLoading();
    } else {
      this.apiService.getBlocks('all', 'home', 'all').subscribe( result => {
        this.state.set(HOME_BLOCKS, result[0] as any);
        this.setupBlocks(result[0], result[0].term_export.field_block_setup);
        this.doneLoading();
      });
    }
  }

  doneLoading() {
    this.angulartics2.pageTrack.next({ path: this.router.url });
    this.working = false;
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

  setFlex(index: number): number {
    let output = 32;
    if (index > 2) {
      output = 100;
    }
    return output;
  }

}
