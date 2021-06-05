import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthServices} from './auth.service';

@Injectable()
export class AuthGuardLogin implements CanActivate {

  constructor(public auth: AuthServices, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot) {
    if(this.auth.loggedIn){
      return true;
    }
    else{
      return this.router.parseUrl("/notfound");
    }
  }

}
