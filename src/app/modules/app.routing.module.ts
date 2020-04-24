import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';

const appRoutes: Routes = [
  { path: 'admin', loadChildren: () => import('../admin/admin-router/admin-router.module').then(m => m.AdminRouterModule) },
  {
    path: 'en',
    data: { message: 'en' },
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'legal-help', loadChildren: () => import('../triage/triage-landing/triage-landing.module').then(m => m.TriageLandingModule) },
      { path: 'legal-help/view/:id', loadChildren: () => import('../triage/triage-landing/triage-landing.module').then(m => m.TriageLandingModule) },
      { path: 'legal-help/results', loadChildren: () => import('../triage/triage-results/triage-results.module').then(m => m.TriageResultsModule) },
      { path: 'legal-help/results/:id', loadChildren: () => import('../triage/triage-results/triage-results.module').then(m => m.TriageResultsModule) },
      { path: 'saved/legal-help/:status/:id', loadChildren: () => import('../triage/triage-load/triage-load.module').then(m => m.TriageLoadModule) },
      { path: 'get-help', redirectTo: '/en/legal-help', pathMatch: 'full' },
      { path: 'self-help', loadChildren: () => import('../api-router/api-router.module').then(m => m.ApiRouterModule) },
      { path: 'self-help/:id', loadChildren: () => import('../self-help/self-help.module').then(m => m.SelfHelpModule) },
      { path: 'self-help/:id/:cat', loadChildren: () => import('../self-help/self-help.module').then(m => m.SelfHelpModule) },
      { path: 'node/:id', loadChildren: () => import('../api-router/api-router.module').then(m => m.ApiRouterModule) },
      { path: 'min/view/:id', loadChildren: () => import('../min-router/min-router.module').then(m => m.MinRouterModule) },
      { path: 'search', loadChildren: () => import('../search/search.module').then(m => m.SearchModule) },
      { path: 'search/:id', loadChildren: () => import('../search/search.module').then(m => m.SearchModule) },
      { path: 'login', loadChildren: () => import('../login/login.module').then(m => m.LoginModule) },
      { path: '**', loadChildren: () => import('../api-router/api-router.module').then(m => m.ApiRouterModule) }
    ]
  },
  {
    path: 'es',
    data: { message: 'es' },
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'legal-help', loadChildren: () => import('../triage/triage-landing/triage-landing.module').then(m => m.TriageLandingModule) },
      { path: 'legal-help/view/:id', loadChildren: () => import('../triage/triage-landing/triage-landing.module').then(m => m.TriageLandingModule) },
      { path: 'legal-help/results', loadChildren: () => import('../triage/triage-results/triage-results.module').then(m => m.TriageResultsModule) },
      { path: 'legal-help/results/:id', loadChildren: () => import('../triage/triage-results/triage-results.module').then(m => m.TriageResultsModule) },
      { path: 'saved/legal-help/:status/:id', loadChildren: () => import('../triage/triage-load/triage-load.module').then(m => m.TriageLoadModule) },
      { path: 'get-help', redirectTo: '/es/legal-help', pathMatch: 'full' },
      { path: 'self-help', loadChildren: () => import('../api-router/api-router.module').then(m => m.ApiRouterModule) },
      { path: 'self-help/:id', loadChildren: () => import('../self-help/self-help.module').then(m => m.SelfHelpModule) },
      { path: 'self-help/:id/:cat', loadChildren: () => import('../self-help/self-help.module').then(m => m.SelfHelpModule) },
      { path: 'node/:id', loadChildren: () => import('../api-router/api-router.module').then(m => m.ApiRouterModule) },
      { path: 'min/view/:id', loadChildren: () => import('../min-router/min-router.module').then(m => m.MinRouterModule) },
      { path: 'search', loadChildren: () => import('../search/search.module').then(m => m.SearchModule) },
      { path: 'search/:id', loadChildren: () => import('../search/search.module').then(m => m.SearchModule) },
      { path: 'login', loadChildren: () => import('../login/login.module').then(m => m.LoginModule) },
      { path: '**', loadChildren: () => import('../api-router/api-router.module').then(m => m.ApiRouterModule) }
    ]
  },
  // redirects
  { path: '', redirectTo: '/en/home', pathMatch: 'full' },
  { path: 'node/:id', redirectTo: '/en/node/:id', pathMatch: 'full' },
  { path: 'min/view/:id', redirectTo: '/en/min/view/:id', pathMatch: 'full' },
  { path: 'search', redirectTo: '/en/search', pathMatch: 'full' },
  { path: 'search/:id', redirectTo: '/en/search/:id', pathMatch: 'full' },
  { path: 'login', redirectTo: '/en/login', pathMatch: 'full' },
  { path: 'self-help/:id', redirectTo: '/en/self-help/:id', pathMatch: 'full' },
  { path: 'self-help/:id/:cat', redirectTo: '/en/self-help/:id/:cat', pathMatch: 'full' },
  { path: 'legal-help/view/:id', redirectTo: '/en/legal-help/view/:id', pathMatch: 'full' },
  { path: 'legal-help/results/:id', redirectTo: '/en/legal-help/results/:id', pathMatch: 'full' },
  { path: 'get-help', redirectTo: '/en/legal-help', pathMatch: 'full' },
  // api router
  { path: '**', loadChildren: () => import('../api-router/api-router.module').then(m => m.ApiRouterModule) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false, initialNavigation: 'enabled', scrollPositionRestoration: 'enabled' }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
