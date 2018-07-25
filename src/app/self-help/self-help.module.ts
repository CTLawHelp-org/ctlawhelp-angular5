import { SharedModule } from '../modules/app.shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SelfHelpComponent } from './self-help.component';

@NgModule({
  declarations: [SelfHelpComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SelfHelpComponent, pathMatch: 'full'}
    ])
  ]
})
export class SelfHelpModule {}
