import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  @Input() svgIcon;
  @Input() svgClass;
  public isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId
  ) {}

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

}
