import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { VariableService } from '../services/variable.service';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  public variables: any;
  public isBrowser: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private variableService: VariableService,
    private apiService: ApiService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.variables = this.variableService;
  }

  logout() {
    this.apiService.logoutService().subscribe( result => {
      if (this.isBrowser) {
        window.location.reload();
      }
    });
  }

}
