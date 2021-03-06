import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject, OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { VariableService } from '../../services/variable.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SearchBarComponent implements OnInit, OnDestroy {
  private langsub: any;
  public variables: any;
  public keyword: any;
  public isBrowser: boolean;

  @Output() success = new EventEmitter();

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private variableService: VariableService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId,
    private cdr: ChangeDetectorRef,
  ) {
    this.variables = this.variableService;
  }

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.langsub = this.variableService.langSubject.subscribe(result => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.langsub) {
      this.langsub.unsubscribe();
    }
  }

  search() {
    if (this.keyword && this.keyword !== '') {
      this.success.next();
      this.router.navigate(['/' + this.variables.lang + '/search', this.keyword]);
    }
  }

}
