import { SharedModule } from '../../modules/app.shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriageResultsComponent } from './triage-results.component';

@NgModule({
  declarations: [TriageResultsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: TriageResultsComponent, pathMatch: 'full'}
    ])
  ]
})
export class TriageResultsModule {}
