import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { VariableService } from '../../services/variable.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class LoginFormComponent implements OnInit {
  @ViewChild('loginForm', { static: true }) loginForm: ElementRef;
  public username = '';
  public password = '';
  public working = false;
  public success = true;

  constructor(
    private apiService: ApiService,
    private variableService: VariableService
  ) {}

  ngOnInit() {
  }

  login() {
    if (this.loginForm['valid']) {
      this.working = true;
      this.success = true;
      this.apiService.loginService({name: this.username, pass: this.password}).subscribe( result => {
        this.variableService.token = typeof result['csrf_token'] !== 'undefined' ? result['csrf_token'] : '';
        this.variableService.getUserAccount().subscribe( res => {
          if (!res) {
            this.working = false;
            this.success = false;
          }
        });
      }, error => {
        this.working = false;
        this.success = false;
      });
    }
  }

}
