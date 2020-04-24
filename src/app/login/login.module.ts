import { SharedModule } from '../modules/app.shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: LoginComponent, pathMatch: 'full'}
    ])
  ]
})
export class LoginModule {}
