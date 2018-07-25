import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';

const appRoutes: Routes = [
  {
    path: 'en',
    data: { message: 'en' },
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'legal-help', loadChildren: '../triage/triage-landing/triage-landing.module#TriageLandingModule' },
      { path: 'legal-help/view/:id', loadChildren: '../triage/triage-landing/triage-landing.module#TriageLandingModule' },
      { path: 'legal-help/results', loadChildren: '../triage/triage-results/triage-results.module#TriageResultsModule' },
      { path: 'legal-help/results/:id', loadChildren: '../triage/triage-results/triage-results.module#TriageResultsModule' },
      { path: 'saved/legal-help/:status/:id', loadChildren: '../triage/triage-load/triage-load.module#TriageLoadModule' },
      { path: 'get-help', redirectTo: '/en/legal-help', pathMatch: 'full' },
      { path: 'self-help', loadChildren: '../api-router/api-router.module#ApiRouterModule' },
      { path: 'self-help/:id', loadChildren: '../self-help/self-help.module#SelfHelpModule' },
      { path: 'self-help/:id/:cat', loadChildren: '../self-help/self-help.module#SelfHelpModule' },
      { path: 'node/:id', loadChildren: '../api-router/api-router.module#ApiRouterModule' },
      { path: 'min/view/:id', loadChildren: '../min-router/min-router.module#MinRouterModule' },
      { path: 'search', loadChildren: '../search/search.module#SearchModule' },
      { path: 'search/:id', loadChildren: '../search/search.module#SearchModule' },
      { path: '**', loadChildren: '../api-router/api-router.module#ApiRouterModule' }
    ]
  },
  {
    path: 'es',
    data: { message: 'es' },
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'legal-help', loadChildren: '../triage/triage-landing/triage-landing.module#TriageLandingModule' },
      { path: 'legal-help/view/:id', loadChildren: '../triage/triage-landing/triage-landing.module#TriageLandingModule' },
      { path: 'legal-help/results', loadChildren: '../triage/triage-results/triage-results.module#TriageResultsModule' },
      { path: 'legal-help/results/:id', loadChildren: '../triage/triage-results/triage-results.module#TriageResultsModule' },
      { path: 'saved/legal-help/:status/:id', loadChildren: '../triage/triage-load/triage-load.module#TriageLoadModule' },
      { path: 'get-help', redirectTo: '/es/legal-help', pathMatch: 'full' },
      { path: 'self-help', loadChildren: '../api-router/api-router.module#ApiRouterModule' },
      { path: 'self-help/:id', loadChildren: '../self-help/self-help.module#SelfHelpModule' },
      { path: 'self-help/:id/:cat', loadChildren: '../self-help/self-help.module#SelfHelpModule' },
      { path: 'node/:id', loadChildren: '../api-router/api-router.module#ApiRouterModule' },
      { path: 'min/view/:id', loadChildren: '../min-router/min-router.module#MinRouterModule' },
      { path: 'search', loadChildren: '../search/search.module#SearchModule' },
      { path: 'search/:id', loadChildren: '../search/search.module#SearchModule' },
      { path: '**', loadChildren: '../api-router/api-router.module#ApiRouterModule' }
    ]
  },
  { path: 'admin', loadChildren: 'app/admin/admin-router/admin-router.module#AdminRouterModule' },
  { path: '', redirectTo: '/en/home', pathMatch: 'full' },
  { path: 'node/:id', redirectTo: '/en/node/:id', pathMatch: 'full' },
  { path: 'min/view/:id', redirectTo: '/en/min/view/:id', pathMatch: 'full' },
  { path: 'search', redirectTo: '/en/search', pathMatch: 'full' },
  { path: 'search/:id', redirectTo: '/en/search/:id', pathMatch: 'full' },
  { path: 'self-help/:id', redirectTo: '/en/self-help/:id', pathMatch: 'full' },
  { path: 'self-help/:id/:cat', redirectTo: '/en/self-help/:id/:cat', pathMatch: 'full' },
  { path: 'legal-help/view/:id', redirectTo: '/en/legal-help/view/:id', pathMatch: 'full' },
  { path: 'legal-help/results/:id', redirectTo: '/en/legal-help/results/:id', pathMatch: 'full' },
  { path: 'get-help', redirectTo: '/en/legal-help', pathMatch: 'full' },
  { path: '**', loadChildren: '../api-router/api-router.module#ApiRouterModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false, initialNavigation: 'enabled' }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
