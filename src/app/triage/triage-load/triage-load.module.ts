import { SharedModule } from '../../modules/app.shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriageLoadComponent } from './triage-load.component';

@NgModule({
  declarations: [TriageLoadComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: TriageLoadComponent, pathMatch: 'full'}
    ])
  ]
})
export class TriageLoadModule {}
