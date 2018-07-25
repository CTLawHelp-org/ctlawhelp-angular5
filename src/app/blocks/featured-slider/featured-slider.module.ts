import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/app.material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NguCarouselModule } from '@ngu/carousel';

import { FeaturedSliderComponent } from './featured-slider.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    NguCarouselModule
  ],
  declarations: [
    FeaturedSliderComponent
  ],
  exports: [
    FeaturedSliderComponent
  ]
})
export class FeaturedSliderModule { }
