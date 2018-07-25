import { BrowserModule, BrowserTransferStateModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { Angulartics2Module } from 'angulartics2';
import { MetaModule } from '@ngx-meta/core';
import { PrebootModule } from 'preboot';
import { HeadroomModule } from '@ctrl/ngx-headroom';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './modules/app.routing.module';
import { ApiService } from './services/api.service';
import { VariableService } from './services/variable.service';
import { HomeComponent } from './home/home.component';
import { TriageDialogComponent } from './triage/triage-dialog/triage-dialog.component';
import { ShareDialogComponent } from './core/share/share.component';
import { TriageSaveDialogComponent } from './triage/triage-save/triage-save.component';
import { PdfDownloadDialogComponent } from './core/pdf-download/pdf-download.component';
import { ContentListDialogComponent } from './core/content-list/content-list.component';
import { AdminLabelEditorDialogComponent } from './admin/admin-label-editor/admin-label-editor.component';
import { AdminBlocksEditorDialogComponent } from './admin/admin-blocks-editor/admin-blocks-editor.component';
import { DndModule } from 'ng2-dnd';
import { SharedModule } from './modules/app.shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  entryComponents: [
    TriageDialogComponent,
    ShareDialogComponent,
    TriageSaveDialogComponent,
    PdfDownloadDialogComponent,
    ContentListDialogComponent,
    AdminLabelEditorDialogComponent,
    AdminBlocksEditorDialogComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: environment.appId}),
    BrowserTransferStateModule,
    PrebootModule.withConfig({ appRoot: 'app-root', buffer: false }),
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    HttpClientXsrfModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics], {
      pageTracking: {
        autoTrackVirtualPages: false
      }
    }),
    MetaModule.forRoot(),
    DndModule.forRoot(),
    HeadroomModule,
    AppRoutingModule,
  ],
  providers: [
    ApiService,
    VariableService,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
