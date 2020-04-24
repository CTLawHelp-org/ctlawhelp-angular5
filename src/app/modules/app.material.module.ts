import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { PlatformModule } from '@angular/cdk/platform';
import { ObserversModule } from '@angular/cdk/observers';
import { LayoutModule } from '@angular/cdk/layout';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
    DragDropModule,
    MatSliderModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatExpansionModule,
  ]
})
export class MaterialModule { }
