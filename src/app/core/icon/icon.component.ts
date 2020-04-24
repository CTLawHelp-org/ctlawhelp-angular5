import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { VariableService } from '../../services/variable.service';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnInit {
  @Input() svgIcon;
  @Input() svgClass;
  public isBrowser: boolean;
  public variables: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private variableService: VariableService,
    private cdr: ChangeDetectorRef,
  ) {
    this.variables = this.variableService;
  }

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    const conn = this.variableService.iconSubject.subscribe( () => {
      this.cdr.detectChanges();
      conn.unsubscribe();
    });
  }

}
