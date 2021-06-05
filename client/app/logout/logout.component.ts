import { Component, OnInit } from '@angular/core';
import { AuthServices } from '../services/auth.service';
/// <reference path="../../node_modules/@types/gapi/index.d.ts" />
declare var gapi: any;

@Component({
  selector: 'app-logout',
  template: ''
})
export class LogoutComponent implements OnInit {

  constructor(private auth: AuthServices) { }

  ngOnInit() {
    this.auth.logout();
  }

}
