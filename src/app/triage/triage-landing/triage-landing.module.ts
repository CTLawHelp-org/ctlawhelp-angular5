import { SharedModule } from '../../modules/app.shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriageLandingComponent } from './triage-landing.component';

@NgModule({
  declarations: [TriageLandingComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: TriageLandingComponent, pathMatch: 'full'}
    ])
  ]
})
export class TriageLandingModule {}
