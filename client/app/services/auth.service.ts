import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';

import { UserService } from './user.service';
import { User } from '../shared/models/user.model';

import 'rxjs/add/operator/map';
/// <reference path="../../node_modules/@types/gapi/index.d.ts" />
declare var gapi: any;



@Injectable()
export class AuthServices {
  loggedIn = false;
  isAdminApp = false;
  isAdmin = false;
  isDirArea = false;
  isJefeArea = false;
  isStandardUser = false;
  isCompras = false;
  isComprador = false;
  isCheckPresupuesto = false;
  isJefeAreaConsumoInt = false;
  isAlmacenistaConsumoInt = false;
  isIntercambios = false;
  // private expiresAt: number;

  currentUser: User = new User();
  
  constructor(private userService: UserService,
              private router: Router,
              private jwtHelper: JwtHelperService,
              ) {
        
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = this.decodeUserFromToken(token);
      this.setCurrentUser(decodedUser);
    }

  }

  login(emailAndPassword) {
    console.log(emailAndPassword);
    return this.userService.login(emailAndPassword).map(
      res => {
        localStorage.setItem('token', res.token);
        const decodedUser = this.decodeUserFromToken(res.token);
        
        this.setCurrentUser(decodedUser);
        return this.loggedIn;
      });
  }



  logout() {
    localStorage.removeItem('token');
    this.loggedIn = false;
    this.isIntercambios = false;
    this.isCheckPresupuesto = false;
    this.isJefeAreaConsumoInt = false;
    this.isAlmacenistaConsumoInt = false;
    this.isCompras = false;
    this.isAdminApp = false;
    this.isAdmin = false;
    this.isDirArea = false;
    this.isJefeArea = false;
    this.isStandardUser = false;
    this.currentUser = new User();
    this.router.navigate(['/login']);
    
  }



  decodeUserFromToken(token) {
    return this.jwtHelper.decodeToken(token).sub;
  }

  setCurrentUser(decodedUser) {
    this.loggedIn = true;
    this.currentUser.IdUsuario = decodedUser.IdUsuario;
    this.currentUser.LoginName = decodedUser.LoginName;
    this.currentUser.IdRole = decodedUser.IdRole;
    this.currentUser.Email = decodedUser.Email;
    this.currentUser.IdRoleConsumoInterno = decodedUser.IdRoleConsumoInterno;
    //this.currentUser.IdDireccion = decodedUser.IdDireccion;
    this.currentUser.NombreCompleto = decodedUser.NombreCompleto;
    
    decodedUser.IdRoleConsumoInterno === 3 ? this.isAlmacenistaConsumoInt = true : this.isAlmacenistaConsumoInt = false;
    decodedUser.IdRoleConsumoInterno === 2 ? this.isJefeAreaConsumoInt = true : this.isJefeAreaConsumoInt = false;

    decodedUser.IdRole === 9 ? this.isIntercambios = true : this.isIntercambios = false;
    decodedUser.IdRole === 8 ? this.isCheckPresupuesto = true : this.isCheckPresupuesto = false;
    decodedUser.IdRole === 7 ? this.isComprador = true : this.isComprador = false;
    decodedUser.IdRole === 6 ? this.isCompras = true : this.isCompras = false;
    decodedUser.IdRole === 5 ? this.isAdminApp = true : this.isAdminApp = false;
    decodedUser.IdRole === 4 ? this.isAdmin = true : this.isAdmin = false;
    decodedUser.IdRole === 3 ? this.isDirArea = true : this.isDirArea = false;
    decodedUser.IdRole === 2 ? this.isJefeArea = true : this.isJefeArea = false;
    decodedUser.IdRole === 1 ? this.isStandardUser = true : this.isStandardUser = false;
    delete decodedUser.IdRole;
  }


  


}
