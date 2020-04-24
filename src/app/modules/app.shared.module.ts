import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './app.material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FragmentPolyfillModule } from '../directives/fragment-polyfill.module';
import { RouterModule } from '@angular/router';
import { NodeComponent } from '../core/node/node.component';
import { SelfHelpMenuComponent } from '../blocks/self-help-menu/self-help-menu.component';
import { SideMenuComponent } from '../core/side-menu/side-menu.component';
import { BlockComponent } from '../core/block/block.component';
import { SegmentsComponent } from '../core/segments/segments.component';
import { SafeHtmlPipe } from '../directives/safe-html.pipe';
import { TriageSummaryComponent } from '../triage/triage-summary/triage-summary.component';
import { SelfHelpContentComponent } from '../blocks/self-help-content/self-help-content.component';
import { LangSelectComponent } from '../core/lang-select/lang-select.component';
import { TriageInputComponent } from '../triage/triage-input/triage-input.component';
import { HighlightDirective } from '../directives/highlight.directive';
import { MenuComponent } from '../core/menu/menu.component';
import { FooterComponent } from '../core/footer/footer.component';
import { SelfHelpLandingComponent } from '../blocks/self-help-landing/self-help-landing.component';
import { SearchBarComponent } from '../core/search-bar/search-bar.component';
import { TriageSaveComponent, TriageSaveDialogComponent } from '../triage/triage-save/triage-save.component';
import { ShareComponent, ShareDialogComponent } from '../core/share/share.component';
import { TriageLocationComponent } from '../triage/triage-location/triage-location.component';
import { TriageDialogComponent } from '../triage/triage-dialog/triage-dialog.component';
import { PdfDownloadComponent, PdfDownloadDialogComponent } from '../core/pdf-download/pdf-download.component';
import { ContentListComponent, ContentListDialogComponent } from '../core/content-list/content-list.component';
import { IconComponent } from '../core/icon/icon.component';
import { LabelComponent } from '../core/label/label.component';
import { NodeTopComponent } from '../core/node-top/node-top.component';
import { LoaderComponent } from '../core/loader/loader.component';
import { SegmentDisplayComponent } from '../core/segment-display/segment-display.component';
import { AdminDialogComponent, AdminDialogDialogComponent } from '../core/admin-dialog/admin-dialog.component';
import { SelfHelpLandingLgComponent } from '../blocks/self-help-landing-lg/self-help-landing-lg.component';
import { TriageSearchBarComponent } from '../core/triage-search-bar/triage-search-bar.component';
import { AdminLabelEditorDialogComponent } from '../admin/admin-utils/admin-label-editor/admin-label-editor.component';
import { LoginFormComponent } from '../core/login-form/login-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    FragmentPolyfillModule.forRoot({smooth: true}),
    RouterModule,
  ],
  declarations: [
    MenuComponent,
    TriageInputComponent,
    FooterComponent,
    HighlightDirective,
    SearchBarComponent,
    LangSelectComponent,
    NodeComponent,
    SafeHtmlPipe,
    SideMenuComponent,
    TriageSummaryComponent,
    BlockComponent,
    SelfHelpLandingComponent,
    SelfHelpMenuComponent,
    SelfHelpContentComponent,
    SegmentsComponent,
    TriageLocationComponent,
    TriageDialogComponent,
    ShareComponent,
    ShareDialogComponent,
    TriageSaveComponent,
    TriageSaveDialogComponent,
    LoaderComponent,
    PdfDownloadComponent,
    PdfDownloadDialogComponent,
    ContentListComponent,
    ContentListDialogComponent,
    SegmentDisplayComponent,
    IconComponent,
    LabelComponent,
    NodeTopComponent,
    AdminDialogComponent,
    AdminDialogDialogComponent,
    SelfHelpLandingLgComponent,
    TriageSearchBarComponent,
    LoginFormComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    FragmentPolyfillModule,
    MenuComponent,
    TriageInputComponent,
    FooterComponent,
    HighlightDirective,
    SearchBarComponent,
    LangSelectComponent,
    NodeComponent,
    SafeHtmlPipe,
    SideMenuComponent,
    TriageSummaryComponent,
    BlockComponent,
    SelfHelpLandingComponent,
    SelfHelpMenuComponent,
    SelfHelpContentComponent,
    SegmentsComponent,
    TriageLocationComponent,
    TriageDialogComponent,
    ShareComponent,
    ShareDialogComponent,
    TriageSaveComponent,
    TriageSaveDialogComponent,
    LoaderComponent,
    PdfDownloadComponent,
    PdfDownloadDialogComponent,
    ContentListComponent,
    ContentListDialogComponent,
    SegmentDisplayComponent,
    IconComponent,
    LabelComponent,
    NodeTopComponent,
    AdminDialogComponent,
    AdminDialogDialogComponent,
    SelfHelpLandingLgComponent,
    TriageSearchBarComponent,
    LoginFormComponent,
  ],
  entryComponents: [
    TriageDialogComponent,
    ShareDialogComponent,
    TriageSaveDialogComponent,
    PdfDownloadDialogComponent,
    ContentListDialogComponent,
    AdminLabelEditorDialogComponent,
    AdminDialogDialogComponent,
  ]
})
export class SharedModule {}
