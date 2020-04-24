import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { VariableService } from '../../services/variable.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lang-select',
  templateUrl: './lang-select.component.html',
  styleUrls: ['./lang-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class LangSelectComponent implements OnInit {
  private langsub: any;
  public variables: any;
  public working = false;
  public newUrl: string;
  public isBrowser: boolean;

  constructor(
    private variableService: VariableService,
    private router: Router,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.variables.lang === 'en') {
      this.newUrl = '/es/' + this.router.url.substring(4);
    } else if (this.variables.lang === 'es') {
      this.newUrl = '/en/' + this.router.url.substring(4);
    }

    this.langsub = this.variableService.langSubject.subscribe(result => {
      this.cdr.detectChanges();
    });
  }

  changeLang(val: string) {
    this.working = true;
    this.variables.lang = val;
    const new_url = '/' + this.variables.lang + '/' + this.router.url.substring(4);
    this.location.go(new_url);
    this.variableService.setLanguage(this.variables.lang).subscribe(() => {
      this.working = false;
      this.cdr.detectChanges();
    }, () => {
      this.working = false;
      this.cdr.detectChanges();
    });
  }

}
