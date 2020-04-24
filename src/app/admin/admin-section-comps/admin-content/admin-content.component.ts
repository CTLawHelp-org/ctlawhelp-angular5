import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { VariableService } from '../../../services/variable.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-admin-content',
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminContentComponent implements OnInit, OnDestroy {
  public working = true;
  public variables: any;
  public id: any;
  public node = [];
  private subscription: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService,
  ) {}

  ngOnInit() {
    this.variables = this.variableService;
    this.load();

    this.subscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.working = true;
        this.node = [];
        this.load();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  load() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id !== '') {
      if (this.isNumeric(this.id)) {
        this.apiService.getNodeAdmin(this.id).subscribe( data => {
          this.node = data;
          this.working = false;
        });
      } else {
        this.node = [{
          new: true,
          node_export: {
            type: [{target_id: this.id}]
          }
        }];
        this.working = false;
      }
    }
  }

  isNumeric(value: any): boolean {
    return !isNaN(value - parseFloat(value));
  }

}
