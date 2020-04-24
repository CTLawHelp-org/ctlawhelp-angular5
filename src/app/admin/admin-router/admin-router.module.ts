import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashComponent } from '../admin-section-comps/admin-dash/admin-dash.component';
import { AdminRouterRouting } from './admin-router.routing';
import { AdminLabelsComponent } from '../admin-section-comps/admin-labels/admin-labels.component';
import { AdminContentComponent } from '../admin-section-comps/admin-content/admin-content.component';
import { AdminLoaderComponent } from '../admin-utils/admin-loader/admin-loader.component';
import {
  AdminNodePickerComponent,
  AdminNodePickerDialogComponent
} from '../admin-content-lists/admin-node-picker/admin-node-picker.component';
import { AdminLabelEditorDialogComponent } from '../admin-utils/admin-label-editor/admin-label-editor.component';
import { AdminManageBlocksComponent } from '../admin-section-comps/admin-manage-blocks/admin-manage-blocks.component';
import { ConfirmDialogComponent } from '../admin-utils/confirm-dialog/confirm-dialog.component';
import { AdminNsmiComponent } from '../admin-section-comps/admin-nsmi/admin-nsmi.component';
import { TreeModule } from 'angular-tree-component';
import { AdminTermReorderComponent } from '../admin-taxonomy/admin-term-reorder/admin-term-reorder.component';
import { AdminTermNsmiEditComponent } from '../admin-taxonomy/admin-term-nsmi-edit/admin-term-nsmi-edit.component';
import { AdminTermNodeOrderComponent } from '../admin-taxonomy/admin-term-node-order/admin-term-node-order.component';
import { AdminTriageComponent } from '../admin-section-comps/admin-triage/admin-triage.component';
import { AdminTermTriageEditComponent } from '../admin-taxonomy/admin-term-triage-edit/admin-term-triage-edit.component';
import {
  AdminTermTriageEntriesComponent
} from '../admin-taxonomy/admin-term-triage-entries/admin-term-triage-entries.component';
import { AdminFilebrowserComponent } from '../admin-section-comps/admin-filebrowser/admin-filebrowser.component';
import { AdminMenuComponent } from '../admin-section-comps/admin-menu/admin-menu.component';
import { AdminTermMenuEditComponent } from '../admin-taxonomy/admin-term-menu-edit/admin-term-menu-edit.component';
import { AdminTriageOverviewComponent } from '../admin-section-comps/admin-triage-overview/admin-triage-overview.component';
import { SharedModule } from '../../modules/app.shared.module';
import { AdminFilesComponent, AdminFilesDialogComponent } from '../admin-section-comps/admin-files/admin-files.component';
import { AdminTermTriageRedirectComponent } from '../admin-taxonomy/admin-term-triage-redirect/admin-term-triage-redirect.component';
import { StatusSettingsComponent, StatusSettingsDialogComponent } from '../admin-utils/status-settings/status-settings.component';
import { AdminSettingsComponent } from '../admin-section-comps/admin-settings/admin-settings.component';
import { AdminContentBrowserComponent } from '../admin-content-lists/admin-content-browser/admin-content-browser.component';
import { AdminFileUploadComponent, AdminFileUploadDialogComponent } from '../admin-utils/admin-file-upload/admin-file-upload.component';
import { AdminTextEditorComponent } from '../admin-utils/admin-text-editor/admin-text-editor.component';
import { AdminPageNodeComponent } from '../admin-node-comps/admin-page-node/admin-page-node.component';
import { AdminMultiInputComponent } from '../admin-utils/admin-multi-input/admin-multi-input.component';
import { AdminSegmentRefComponent, AdminSegmentRefDialogComponent } from '../admin-utils/admin-segment-ref/admin-segment-ref.component';
import { AdminSegmentNodeComponent } from '../admin-node-comps/admin-segment-node/admin-segment-node.component';
import { AdminNodeRefComponent } from '../admin-utils/admin-node-ref/admin-node-ref.component';
import { AdminBlockNodeComponent } from '../admin-node-comps/admin-block-node/admin-block-node.component';
import { AdminTriageEntryNodeComponent } from '../admin-node-comps/admin-triage-entry-node/admin-triage-entry-node.component';
import { AdminBlocksConfigComponent } from '../admin-utils/admin-blocks-config/admin-blocks-config.component';
import { AdminBlocksEditorDialogComponent } from '../admin-utils/admin-blocks-editor/admin-blocks-editor.component';
import { AdminTermMoveComponent } from '../admin-taxonomy/admin-term-move/admin-term-move.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TreeModule.forRoot(),
    AdminRouterRouting,
  ],
  declarations: [
    AdminDashComponent,
    AdminLabelsComponent,
    AdminContentComponent,
    AdminLoaderComponent,
    AdminNodePickerComponent,
    AdminNodePickerDialogComponent,
    AdminLabelEditorDialogComponent,
    AdminBlocksConfigComponent,
    AdminBlocksEditorDialogComponent,
    AdminManageBlocksComponent,
    ConfirmDialogComponent,
    AdminNsmiComponent,
    AdminTermReorderComponent,
    AdminTermNsmiEditComponent,
    AdminTermNodeOrderComponent,
    AdminTriageComponent,
    AdminTermTriageEditComponent,
    AdminTermTriageEntriesComponent,
    AdminFilebrowserComponent,
    AdminMenuComponent,
    AdminTermMenuEditComponent,
    AdminTriageOverviewComponent,
    AdminFilesComponent,
    AdminTermTriageRedirectComponent,
    StatusSettingsComponent,
    StatusSettingsDialogComponent,
    AdminSettingsComponent,
    AdminContentBrowserComponent,
    AdminFilesDialogComponent,
    AdminFileUploadComponent,
    AdminTextEditorComponent,
    AdminPageNodeComponent,
    AdminMultiInputComponent,
    AdminSegmentRefComponent,
    AdminSegmentNodeComponent,
    AdminSegmentRefDialogComponent,
    AdminNodeRefComponent,
    AdminBlockNodeComponent,
    AdminTriageEntryNodeComponent,
    AdminFileUploadDialogComponent,
    AdminTermMoveComponent,
  ],
  entryComponents: [
    AdminNodePickerDialogComponent,
    AdminLabelEditorDialogComponent,
    AdminBlocksEditorDialogComponent,
    ConfirmDialogComponent,
    StatusSettingsDialogComponent,
    AdminFilesDialogComponent,
    AdminSegmentRefDialogComponent,
    AdminFileUploadDialogComponent,
  ]
})
export class AdminRouterModule {}
