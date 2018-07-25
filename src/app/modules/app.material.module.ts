import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatSelectModule,
  MatMenuModule,
  MatCheckboxModule,
  MatRadioModule,
  MatDialogModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatInputModule,
} from '@angular/material';

import { PlatformModule } from '@angular/cdk/platform';
import { ObserversModule } from '@angular/cdk/observers';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  exports: [
    PlatformModule,
    ObserversModule,
    LayoutModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDialogModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatInputModule,
  ]
})
export class MaterialModule { }
