import { NgModule } from '@angular/core';
import { AdminDashComponent } from '../admin-dash/admin-dash.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminLabelsComponent } from '../admin-labels/admin-labels.component';
import { AdminBlocksComponent } from '../admin-content-lists/admin-blocks/admin-blocks.component';
import { AdminContentComponent } from '../admin-content/admin-content.component';
import { VariableService } from '../../services/variable.service';
import { CanActivateGuard } from '../../services/app.activate-guard.service';
import { AdminManageBlocksComponent } from '../admin-manage-blocks/admin-manage-blocks.component';
import { AdminTriageEntriesComponent } from '../admin-content-lists/admin-triage-entries/admin-triage-entries.component';
import { AdminNsmiComponent } from '../admin-nsmi/admin-nsmi.component';
import { AdminPagesComponent } from '../admin-content-lists/admin-pages/admin-pages.component';
import { AdminTriageComponent } from '../admin-triage/admin-triage.component';
import { AdminFilebrowserComponent } from '../admin-filebrowser/admin-filebrowser.component';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
import { AdminSegmentsComponent } from '../admin-content-lists/admin-segments/admin-segments.component';

const routes: Routes = [
  { path: '', component: AdminDashComponent, children: [
      { path: 'labels', component: AdminLabelsComponent },
      { path: 'nsmi', component: AdminNsmiComponent },
      { path: 'triage', component: AdminTriageComponent },
      { path: 'filebrowser', component: AdminFilebrowserComponent },
      { path: 'filebrowser/:id', component: AdminFilebrowserComponent },
      { path: 'content/pages', component: AdminPagesComponent },
      { path: 'content/blocks', component: AdminBlocksComponent },
      { path: 'content/segments', component: AdminSegmentsComponent },
      { path: 'menu', component: AdminMenuComponent },
      { path: 'blocks', component: AdminManageBlocksComponent },
      { path: 'content/triage-entries', component: AdminTriageEntriesComponent },
      { path: 'content/edit/:id', component: AdminContentComponent },
      { path: 'content/new/:id', component: AdminContentComponent },
      { path: '', redirectTo: 'content/pages', pathMatch: 'full' }
    ], canActivate: [CanActivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    CanActivateGuard,
    VariableService
  ],
})
export class AdminRouterRouting {}
