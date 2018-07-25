import { SharedModule } from '../modules/app.shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './search.component';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SearchComponent, pathMatch: 'full'}
    ])
  ]
})
export class SearchModule {}
