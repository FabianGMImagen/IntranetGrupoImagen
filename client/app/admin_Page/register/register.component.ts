import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { ToastComponent } from '../../shared/toast/toast.component';

import { Role } from '../../shared/models/roles.model';
import { Direccion } from '../../shared/models/directions.model';
import { RoleSolConsumo } from '../../shared/models/rolesol_consumo.mode';
import { AuthServices } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {


  registerForm: FormGroup;
  name = new FormControl('',[
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30),
    Validators.pattern('[a-zA-Z0-9_-\\s]*'),
    Validators.pattern('/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g')
  ]);
  username = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30),
    Validators.pattern('[a-zA-Z0-9_-\\s]*')
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);
  role = new FormControl(0, [
    Validators.required
  ]);
  roleconsumo = new FormControl(0, [
    Validators.required
  ]);
  direc = new FormControl('',[
    Validators.required
  ]);
  tel = new FormControl(0, [
    Validators.required,
    Validators.maxLength(10),
    Validators.minLength(10)
  ]);
  ext = new FormControl(0, [
    Validators.required, 
    Validators.maxLength(4),
    Validators.minLength(4)
  ]);
  puesto = new FormControl('', [
    Validators.required
  ]);

  ListRoles:Role[];
  ListDireccions:Direccion[];
  ListRolesConsumo:RoleSolConsumo[];

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public toast: ToastComponent,
              private userService: UserService,
              private auth: AuthServices
              ) { }
      Token:string;

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role,
      roleconsumo: this.roleconsumo,
      direc: this.direc,
      tel: this.tel, 
      ext: this.ext,
      puesto: this.puesto
    });

    this.getAllRole();
    this.getRoleConsumoInterno();
    this.getAllDireccion();
  }


  getAllRole(){
    this.userService.allrole().subscribe(
      data =>this.ListRoles = data,
      error =>{
        console.log(error);
        if(error.status == 403 || error.status == 404){
          this.toast.setMessage(
            error.message,
            "danger"
          );
          this.auth.logout();
        }
      }
    );
  }

  getRoleConsumoInterno(){

    this.userService.getAllroleSolConsumo().subscribe(data=>{
      this.ListRolesConsumo = data;
    }, err=>{
      console.log(err);
      if(err.status == 403 || err.status == 404){
        this.toast.setMessage(
          err.message,
          "danger"
        );
        this.auth.logout();
      }
    });
  }

  getAllDireccion(){
    this.userService.alldirection().subscribe(
      data => this.ListDireccions = data,
      error =>{
        console.log(error);
        if(error.status == 403 || error.status == 404){
          this.toast.setMessage(
            error.message,
            "danger"
          );
          this.auth.logout();
        }
      }
    );
  }




  setClassUsername() {
    return { 'has-danger': !this.username.pristine && !this.username.valid };
  }

  setClassEmail() {
    return { 'has-danger': !this.email.pristine && !this.email.valid };
  }

  setClassPassword() {
    return { 'has-danger': !this.password.pristine && !this.password.valid };
  }

  
  

  register() {
    console.log("Este es el nombre de el usuario-->" + this.registerForm.value.name);
    console.log("Este es el Nombre de usuaro---->" + this.registerForm.value.username); 
    console.log("Su Email---->" + this.registerForm.value.email);
    console.log("La contraseña---->" + this.registerForm.value.password);
    console.log("Este es el id de el rol----->" + this.registerForm.value.role);
    console.log("Este es el id de la Direccion --->" + this.registerForm.value.direc);
    console.log("Este es el numero de telefono para el USR --->" + this.registerForm.value.tel);
    console.log("Esta es la extencion de el Usuario-->" + this.registerForm.value.ext);
    console.log("Este es el puesto para el USR-->" + this.registerForm.value.puesto);
    console.log("Est es el valor para Role Consumo interno --> " + this.registerForm.value.roleconsumo);



    this.userService.register(this.registerForm.value).subscribe(
      res => {
        this.toast.setMessage('you successfully registered!', 'success');
        //this.router.navigate(['/login']);
        this.registerForm.reset();
      },
      error =>{
        console.log(error);
        if(error.status == 403 || error.status == 404){
          this.toast.setMessage(
            error.message,
            "danger"
          );
          this.auth.logout();
        }
      }
    );
  }
}
