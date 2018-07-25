import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';

@Component({
  selector: 'app-article-credit',
  templateUrl: './article-credit.component.html',
  styleUrls: ['./article-credit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArticleCreditComponent implements OnInit {
  private connection: any;
  public variables: any;
  public node = [];

  constructor(
    private apiService: ApiService,
    private variableService: VariableService
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.connection = this.apiService.getNode('770').subscribe(data => {
      this.node = data;
      this.connection.unsubscribe();
    });
  }

}
