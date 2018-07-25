import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VariableService } from './variable.service';

@Injectable()
export class CanActivateGuard implements CanActivate {
  constructor(private variableService: VariableService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    return this.variableService.hasAuth();
  }
}
