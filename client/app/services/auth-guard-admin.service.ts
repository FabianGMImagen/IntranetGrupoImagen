import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthServices} from './auth.service';

@Injectable()
export class AuthGuardAdmin implements CanActivate {

  constructor(public auth: AuthServices, private router: Router) {}

  canActivate() {
    if(this.auth.loggedIn && this.auth.isAdminApp){
      return true;
    }
    else{
      return this.router.parseUrl("/notfound");
    }
  }

}
