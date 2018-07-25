import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VariableService } from '../../services/variable.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-popular-articles',
  templateUrl: './popular-articles.component.html',
  styleUrls: ['./popular-articles.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopularArticlesComponent implements OnInit {
  private connection: any;
  public working = true;
  public variables: any;
  public articles = [];

  constructor(
    private apiService: ApiService,
    private variableService: VariableService
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.connection = this.apiService.getPopArticles().subscribe(results => {
      this.articles = results;
      this.doneLoading();
    });
  }

  doneLoading() {
    this.working = false;
    if (this.connection) {
      this.connection.unsubscribe();
    }
  }

  show(item: any): boolean {
    let output = false;
    if ((this.variables.lang === item.lang) || item.lang === 'both') {
      output = true;
    }
    return output;
  }

}
