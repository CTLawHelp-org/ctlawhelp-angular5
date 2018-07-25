import { SharedModule } from '../modules/app.shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiRouterComponent } from './api-router.component';

@NgModule({
  declarations: [ApiRouterComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ApiRouterComponent, pathMatch: 'full'}
    ])
  ]
})
export class ApiRouterModule {}
