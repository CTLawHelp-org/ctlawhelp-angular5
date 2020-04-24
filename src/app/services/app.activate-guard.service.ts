import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VariableService } from './variable.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class CanActivateGuard implements CanActivate {
  constructor(private variableService: VariableService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    return this.variableService.hasAuth().pipe( tap(val => {
      if (!val) {
        this.router.navigate(['/']);
      }
    }));
  }
}

@Injectable()
export class CanActivateAdmin implements CanActivate {
  constructor(private variableService: VariableService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    return this.variableService.hasAdminAuth().pipe( tap(val => {
      if (!val) {
        this.router.navigate(['/admin']);
      }
    }));
  }
}

@Injectable()
export class CanActivateEditor implements CanActivate {
  constructor(private variableService: VariableService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    return this.variableService.hasEditorAuth().pipe( tap(val => {
      if (!val) {
        this.router.navigate(['/admin']);
      }
    }));
  }
}
