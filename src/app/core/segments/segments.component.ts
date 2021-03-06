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
import { isPlatformBrowser, Location } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SegmentsComponent implements OnInit, OnDestroy {
  @Input() src;
  @Input() settings;
  @Input() type;
  @Input() dialog = false;
  private langsub: any;
  private authsub: any;
  public variables: any;
  public curitem: any;
  public curIndex = 0;
  public isBrowser: any;
  public media: any;
  public loc: any;
  public adminUrl = '/admin/content/edit/';

  constructor(
    private variableService: VariableService,
    @Inject(PLATFORM_ID) private platformId,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private location: Location,
    private cdr: ChangeDetectorRef,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.media = breakpointObserver;
    this.loc = location;
  }

  ngOnInit() {
    this.variables = this.variableService;
    if (this.src.length > 0) {
      if (this.route.snapshot.queryParams && this.route.snapshot.queryParams['s'] !== undefined) {
        this.curIndex = parseInt(this.route.snapshot.queryParams['s'], 10);
        this.curitem = this.src[this.curIndex];
      } else {
        this.curitem = this.src[0];
      }
    }
    if (this.settings.length > 0) {
      if (typeof this.settings[0]['value'] === 'string') {
        this.settings[0]['value'] = JSON.parse(this.settings[0]['value']);
      }
    } else {
      this.settings = [{value: {}}];
    }
    this.doneLoading();

    this.langsub = this.variableService.langSubject.subscribe(result => {
      this.cdr.detectChanges();
    });

    this.authsub = this.variableService.authSubject.subscribe(result => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.langsub) {
      this.langsub.unsubscribe();
    }
    if (this.authsub) {
      this.authsub.unsubscribe();
    }
  }

  doneLoading() {
    this.cdr.detectChanges();
  }

  showTitle(target: string): boolean {
    return this.settings.length > 0 && this.settings[0]['value'][target] ? !this.settings[0]['value'][target]['hidetitle'] : true;
  }

  scroll() {
    if (this.isBrowser) {
      const element = document.getElementById('guide');
      setTimeout (() => {
        if (!this.media.isMatched('(min-width: 960px)')) {
          element.scrollIntoView();
          window.scrollBy(0, -64);
        } else {
          window.scrollTo(0, 0);
        }
      });
    }
  }

  showSeg(seg: any): boolean {
    let output = true;
    if (seg.src.field_lang_status[0].value !== 'both' && seg.src.field_lang_status[0].value !== this.variables.lang) {
      output = false;
    }
    return output;
  }

  prevIndex(index: number): number {
    return index - 1 < 0 ? this.src.length - 1 : index - 1;
  }

  nextIndex(index: number): number {
    return index === this.src.length - 1 ? 0 : index + 1;
  }

  prevItem(index: number) {
    const idx = index - 1 < 0 ? this.src.length - 1 : index - 1;
    this.curIndex = idx;
    this.curitem = this.src[idx];
    this.scroll();
  }

  nextItem(index: number) {
    const idx = index === this.src.length - 1 ? 0 : index + 1;
    this.curIndex = idx;
    this.curitem = this.src[idx];
    this.scroll();
  }

  chooseItem(index: number, event) {
    event.preventDefault();
    this.curIndex = index;
    this.curitem = this.src[index];
    this.scroll();
  }

  complete(index: number) {
    this.src[index].done = !this.src[index].done;
  }

}
