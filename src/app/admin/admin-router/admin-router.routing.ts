import { NgModule } from '@angular/core';
import { AdminDashComponent } from '../admin-section-comps/admin-dash/admin-dash.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminLabelsComponent } from '../admin-section-comps/admin-labels/admin-labels.component';
import { AdminContentComponent } from '../admin-section-comps/admin-content/admin-content.component';
import { CanActivateAdmin, CanActivateEditor, CanActivateGuard } from '../../services/app.activate-guard.service';
import { AdminManageBlocksComponent } from '../admin-section-comps/admin-manage-blocks/admin-manage-blocks.component';
import { AdminNsmiComponent } from '../admin-section-comps/admin-nsmi/admin-nsmi.component';
import { AdminTriageComponent } from '../admin-section-comps/admin-triage/admin-triage.component';
import { AdminFilebrowserComponent } from '../admin-section-comps/admin-filebrowser/admin-filebrowser.component';
import { AdminMenuComponent } from '../admin-section-comps/admin-menu/admin-menu.component';
import { AdminTriageOverviewComponent } from '../admin-section-comps/admin-triage-overview/admin-triage-overview.component';
import { AdminFilesComponent } from '../admin-section-comps/admin-files/admin-files.component';
import { AdminSettingsComponent } from '../admin-section-comps/admin-settings/admin-settings.component';
import { AdminContentBrowserComponent } from '../admin-content-lists/admin-content-browser/admin-content-browser.component';

const routes: Routes = [
  { path: '', component: AdminDashComponent, children: [
      { path: 'labels', component: AdminLabelsComponent, canActivate: [CanActivateAdmin] },
      { path: 'settings', component: AdminSettingsComponent, canActivate: [CanActivateAdmin] },
      { path: 'nsmi', component: AdminNsmiComponent, canActivate: [CanActivateAdmin] },
      { path: 'triage', component: AdminTriageComponent, canActivate: [CanActivateAdmin] },
      { path: 'triage/:id', component: AdminTriageComponent, canActivate: [CanActivateAdmin] },
      { path: 'triage-overview', component: AdminTriageOverviewComponent, canActivate: [CanActivateAdmin] },
      { path: 'files', component: AdminFilesComponent, canActivate: [CanActivateAdmin] },
      { path: 'filebrowser', component: AdminFilebrowserComponent, canActivate: [CanActivateAdmin] },
      { path: 'filebrowser/:id', component: AdminFilebrowserComponent, canActivate: [CanActivateAdmin] },
      { path: 'menu', component: AdminMenuComponent, canActivate: [CanActivateAdmin] },
      { path: 'blocks', component: AdminManageBlocksComponent, canActivate: [CanActivateAdmin] },
      { path: 'blocks/:id', component: AdminManageBlocksComponent, canActivate: [CanActivateAdmin] },
      { path: 'content/edit/:id', component: AdminContentComponent, canActivate: [CanActivateEditor] },
      { path: 'content/new/:id', component: AdminContentComponent, canActivate: [CanActivateEditor] },
      { path: 'content/browse/:id', component: AdminContentBrowserComponent, canActivate: [CanActivateGuard] },
      { path: '', redirectTo: 'content/browse/page', pathMatch: 'full' },
      { path: 'content/pages', redirectTo: 'content/browse/page', pathMatch: 'full' },
      { path: 'content/blocks', redirectTo: 'content/browse/block', pathMatch: 'full' },
      { path: 'content/segments', redirectTo: 'content/browse/segment', pathMatch: 'full' },
      { path: 'content/triage-entries', redirectTo: 'content/browse/triage_entry', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    CanActivateGuard,
    CanActivateAdmin,
    CanActivateEditor
  ],
})
export class AdminRouterRouting {}
