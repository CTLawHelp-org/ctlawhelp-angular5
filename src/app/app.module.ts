import { BrowserModule, BrowserTransferStateModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Angulartics2Module } from 'angulartics2';
import { PrebootModule } from 'preboot';
import { HeadroomModule } from '@ctrl/ngx-headroom';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './modules/app.routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './modules/app.shared.module';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: environment.appId}),
    BrowserTransferStateModule,
    PrebootModule.withConfig({ appRoot: 'app-root', buffer: false }),
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    HttpClientXsrfModule,
    Angulartics2Module.forRoot({
      pageTracking: {
        autoTrackVirtualPages: false
      }
    }),
    HeadroomModule,
    AppRoutingModule,
    TransferHttpCacheModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
