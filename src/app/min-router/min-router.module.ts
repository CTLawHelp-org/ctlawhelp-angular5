import { SharedModule } from '../modules/app.shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MinRouterComponent } from './min-router.component';

@NgModule({
  declarations: [MinRouterComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: MinRouterComponent, pathMatch: 'full'}
    ])
  ]
})
export class MinRouterModule {}
