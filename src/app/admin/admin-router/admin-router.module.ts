import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../modules/app.material.module';
import { CommonModule } from '@angular/common';
import { AdminDashComponent } from '../admin-dash/admin-dash.component';
import { AdminRouterRouting } from './admin-router.routing';
import { AdminLabelsComponent } from '../admin-labels/admin-labels.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { AdminBlocksComponent } from '../admin-content-lists/admin-blocks/admin-blocks.component';
import { TitleRenderComponent } from '../admin-utils/title-render/title-render.component';
import { AdminContentComponent } from '../admin-content/admin-content.component';
import { DynamicFormsPrimeNGUIModule } from '@ng-dynamic-forms/ui-primeng';
import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { AdminNodeBlockComponent } from '../admin-node/admin-node-block/admin-node-block.component';
import { AdminLoaderComponent } from '../admin-loader/admin-loader.component';
import { DndModule } from 'ng2-dnd';
import { AdminFormNodeRefComponent } from '../admin-node/admin-form-node-ref/admin-form-node-ref.component';
import {
  AdminNodePickerComponent,
  AdminNodePickerDialogComponent
} from '../admin-content-lists/admin-node-picker/admin-node-picker.component';
import { TitleRenderListComponent } from '../admin-utils/title-render-list/title-render-list.component';
import { SelectFilterComponent } from '../admin-utils/select-filter/select-filter.component';
import { AdminLabelEditorDialogComponent } from '../admin-label-editor/admin-label-editor.component';
import { AdminBlocksEditorDialogComponent } from '../admin-blocks-editor/admin-blocks-editor.component';
import { AdminBlocksConfigComponent } from '../admin-blocks-config/admin-blocks-config.component';
import { AdminManageBlocksComponent } from '../admin-manage-blocks/admin-manage-blocks.component';
import { ConfirmDialogComponent } from '../admin-utils/confirm-dialog/confirm-dialog.component';
import { AdminTriageEntriesComponent } from '../admin-content-lists/admin-triage-entries/admin-triage-entries.component';
import { AdminNodeTriageEntryComponent } from '../admin-node/admin-node-triage-entry/admin-node-triage-entry.component';
import { AdminNsmiComponent } from '../admin-nsmi/admin-nsmi.component';
import { TreeModule } from 'angular-tree-component';
import { AdminTermReorderComponent } from '../admin-taxonomy/admin-term-reorder/admin-term-reorder.component';
import { AdminTermNsmiEditComponent } from '../admin-taxonomy/admin-term-nsmi-edit/admin-term-nsmi-edit.component';
import { AdminTermNodeOrderComponent } from '../admin-taxonomy/admin-term-node-order/admin-term-node-order.component';
import { FileUploadComponent } from '../admin-utils/file-upload/file-upload.component';
import { FileUploadModule } from 'primeng/primeng';
import { AdminPagesComponent } from '../admin-content-lists/admin-pages/admin-pages.component';
import { AdminNodePageComponent } from '../admin-node/admin-node-page/admin-node-page.component';
import {
  AdminFormSegmentRefComponent,
  AdminFormSegmentRefDialogComponent
} from '../admin-node/admin-form-segment-ref/admin-form-segment-ref.component';
import { AdminNodeSegmentComponent } from '../admin-node/admin-node-segment/admin-node-segment.component';
import { AdminTriageComponent } from '../admin-triage/admin-triage.component';
import {
  AdminFormNodeSettingsComponent,
  AdminFormNodeSettingsDialogComponent
} from '../admin-node/admin-form-node-settings/admin-form-node-settings.component';
import { AdminTermTriageEditComponent } from '../admin-taxonomy/admin-term-triage-edit/admin-term-triage-edit.component';
import {
  AdminTermTriageEntriesComponent,
  AdminTermTriageEntriesDialogComponent
} from '../admin-taxonomy/admin-term-triage-entries/admin-term-triage-entries.component';
import { MultiInputComponent } from '../admin-utils/multi-input/multi-input.component';
import { TitleRenderPageComponent } from '../admin-utils/title-render-page/title-render-page.component';
import { AdminFilebrowserComponent } from '../admin-filebrowser/admin-filebrowser.component';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
import { AdminTermMenuEditComponent } from '../admin-taxonomy/admin-term-menu-edit/admin-term-menu-edit.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AdminSegmentsComponent } from '../admin-content-lists/admin-segments/admin-segments.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormsCoreModule.forRoot(),
    DynamicFormsPrimeNGUIModule,
    TreeModule,
    AgGridModule.withComponents([TitleRenderComponent, TitleRenderPageComponent, TitleRenderListComponent, SelectFilterComponent]),
    DndModule.forRoot(),
    NgxDatatableModule,
    FileUploadModule,
    AdminRouterRouting,
  ],
  declarations: [
    AdminDashComponent,
    AdminLabelsComponent,
    AdminBlocksComponent,
    TitleRenderComponent,
    TitleRenderPageComponent,
    TitleRenderListComponent,
    AdminContentComponent,
    AdminNodeBlockComponent,
    AdminLoaderComponent,
    AdminFormNodeRefComponent,
    AdminNodePickerComponent,
    AdminNodePickerDialogComponent,
    SelectFilterComponent,
    AdminLabelEditorDialogComponent,
    AdminBlocksConfigComponent,
    AdminBlocksEditorDialogComponent,
    AdminManageBlocksComponent,
    ConfirmDialogComponent,
    AdminTriageEntriesComponent,
    AdminNodeTriageEntryComponent,
    AdminNsmiComponent,
    AdminTermReorderComponent,
    AdminTermNsmiEditComponent,
    AdminTermNodeOrderComponent,
    FileUploadComponent,
    AdminPagesComponent,
    AdminNodePageComponent,
    AdminFormSegmentRefComponent,
    AdminFormSegmentRefDialogComponent,
    AdminNodeSegmentComponent,
    AdminTriageComponent,
    AdminFormNodeSettingsComponent,
    AdminFormNodeSettingsDialogComponent,
    AdminTermTriageEditComponent,
    AdminTermTriageEntriesComponent,
    AdminTermTriageEntriesDialogComponent,
    MultiInputComponent,
    AdminFilebrowserComponent,
    AdminMenuComponent,
    AdminTermMenuEditComponent,
    AdminSegmentsComponent,
  ],
  entryComponents: [
    AdminNodePickerDialogComponent,
    AdminLabelEditorDialogComponent,
    AdminBlocksEditorDialogComponent,
    ConfirmDialogComponent,
    AdminFormSegmentRefDialogComponent,
    AdminFormNodeSettingsDialogComponent,
    AdminTermTriageEntriesDialogComponent,
  ]
})
export class AdminRouterModule {}
