import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { NguCarousel } from '@ngu/carousel';
import { isPlatformBrowser } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { VariableService } from '../../services/variable.service';

@Component({
  selector: 'app-featured-slider',
  templateUrl: './featured-slider.component.html',
  styleUrls: ['./featured-slider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FeaturedSliderComponent implements OnInit {
  public slider: NguCarousel;
  public isBrowser: any;
  public media: any;
  public variables: any;
  public working = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private breakpointObserver: BreakpointObserver,
    private variableService: VariableService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.media = breakpointObserver;
    this.variables = variableService;
  }

  ngOnInit() {
    this.slider = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 1000,
      interval: 15000,
      point: {
        visible: true,
        pointStyles: `
          .ngucarouselPoint {
            list-style-type: none;
            text-align: center;
            padding: 8px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
          }
          .ngucarouselPoint li {
            display: inline-block;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.55);
            padding: 4px;
            margin: 0 6px;
            transition: .4s ease all;
            cursor:pointer;
          }
          .ngucarouselPoint li.active {
              background: #002087;
              transform: scale(1.9);
          }`
      },
      load: 2,
      loop: true,
      touch: true
    };
    this.working = false;
  }

}
