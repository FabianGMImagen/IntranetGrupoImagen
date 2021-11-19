import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthServices } from '../services/auth.service';
import { ToastComponent } from '../shared/toast/toast.component';


/// <reference path="../../node_modules/@types/gapi/index.d.ts" />
declare var gapi: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  idleState = 'No iniciado';
  timedOut = false;
  lastPing?: Date = null;




  private name: string;
  loginForm: FormGroup;

  email = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

 


  //private loggedIn: boolean;

  constructor(private auth: AuthServices,
              private formBuilder: FormBuilder,
              private router: Router,
              public toast: ToastComponent) {
               }

  ngOnInit() {
    // const timer = JSON.parse(localStorage.getItem('time'));
    // if(timer && (Date.now() > timer)){
    //     this.auth.logout();
    //     this.router.navigate(['/login'])
    // }
  
    if (this.auth.loggedIn) {
      this.router.navigate(['/']);
    }
    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password
    });

    //fragmento de codigo de social
    //this.authService.authState.subscribe((user) => {
      //this.user = user;
      //this.loggedIn = (user != null);
    //});
  }

  

  setClassEmail() {
    return { 'has-danger': !this.email.pristine && !this.email.valid };
  }

  setClassPassword() {
    
    return { 'has-danger': !this.password.pristine && !this.password.valid };
  }

  login() {
    this.auth.login(this.loginForm.value).subscribe(
      res => this.router.navigate(['/']),
      error => this.toast.setMessage('invalid email or password!', 'danger')
    );
    
  }




  //login Con API de Gmail
  /*onSignIn() {

    var auth2 = gapi.auth2.getAuthInstance();

    auth2.signIn().then(()=>{
      this.name =  auth2.currentUser.get().getBasicProfile().getImageUrl();
      var BasicProfile =  auth2.currentUser.get().getBasicProfile();
     
      // console.log("fafsda" + BasicProfile);
       /*console.log("getName=" + BasicProfile.getName());
       console.log("NagetImageUrlme=" + BasicProfile.getImageUrl());
       console.log("getEmail=" + BasicProfile.getEmail());
       console.log("getId=" + BasicProfile.getId());
     
      this.username = BasicProfile.getName();
      this.imageUrl = BasicProfile.getImageUrl();
      this.mail = BasicProfile.getEmail();

      this.auth.loginG(this.mail,this.username,this.imageUrl);
      
    });
    
  }*/

  /*signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
          
       
          console.log('User signed out.' );
          
    });
      
          /*this.username = "";
          this.imageUrl = "";
          this.mail = "";
      
    console.log('User signed out. 87979879' +this.username );
    
  
}*/


/*signInWithGoogle(): void {
  this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
}*/

}
