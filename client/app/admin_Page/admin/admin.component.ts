import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthServices } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../shared/models/user.model';
import { Direccion } from '../../shared/models/directions.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from '../../shared/models/roles.model';
import { RoleSolConsumo } from '../../shared/models/rolesol_consumo.mode';
import { DialogDeleteUserComponent } from 'client/app/dialogs/dialog-delete-user/dialog-delete-user.component';
import { DialogDeleteDirComponent } from 'client/app/dialogs/dialog-delete-dir/dialog-delete-dir.component';
import { SolicitudCompraService } from 'client/app/services/solicitudcompra.service';
//import { ConsoleReporter } from 'jasmine';



export interface DialogData {
  name: string;
  IdUser : string;
}



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

  users: User[] = [];
  direcciones: Direccion[] = [];
  isLoading = true;
  animal: string;
  name: string;
  isViewListUsr: boolean = true;
  isEditingUsr:boolean = false;
  UserEdit:User;
  NameUser:string;
  IdUser:number;
  ListAllDireccions:Direccion[];
  ListDirecciones:Direccion[];
  SelectedDir:Direccion = new Direccion();
  SelectDirAsoc:Direccion = new Direccion();
  ListRoles:Role[];
  ListRolesConsumo:RoleSolConsumo[];

  isAddDir:boolean = true;
  isDeleteDir:boolean = true;

  isCreateDir: boolean = false;
  isViewListDir: boolean = true;
  isEditingDir: boolean = false;
  namedir:string;
  newName:string;
  NameDirView:Direccion;
  selectedfilterDireccion: Direccion = new Direccion();

  updateUsrDataGeneral: FormGroup;
  IdUsr = new FormControl();
  Name = new FormControl('',[
    Validators.minLength(2),
    Validators.maxLength(30),
    Validators.pattern('[a-zA-Z0-9_-\\s]*')
  ]);
  username = new FormControl('', [
    Validators.minLength(2),
    Validators.maxLength(30),
    Validators.pattern('[a-zA-Z0-9_-\\s]*')
  ]);
  email = new FormControl('', [
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  password = new FormControl('', [Validators.minLength(6)]);
  tel = new FormControl('',[
    Validators.maxLength(10),
    Validators.minLength(10)
  ]);
  ext = new FormControl(0,[ 
    Validators.maxLength(4),
    Validators.minLength(4)
  ]);
  puesto = new FormControl('', [
    Validators.required
  ]);
  rolesolped = new FormControl(0, [
    Validators.required
  ]);
  rolesolconsumo = new FormControl(0, [
    Validators.required
  ]);

  constructor(private formBuilder: FormBuilder,
              public auth: AuthServices,
              public solicitudComp: SolicitudCompraService,
              public toast: ToastComponent,
              private userService: UserService,
              public dialog: MatDialog,
              public solicitudComp: SolicitudCompraService,) { }

  ngOnInit() {
    this.getUsers();
    this.getDirecciones();
    this.GetAllDirecciones();
    this.getAllRoleSolPed();
    this.getAllRoleSolConsumoInterno();
    this.updateUsrDataGeneral = this.formBuilder.group({
      IdUsr:0,
      Name: this.Name,
      username: this.username,
      email: this.email,
      password: this.password,
      tel: this.tel, 
      ext: this.ext,
      puesto: this.puesto,
      rolesolped: this.rolesolped,
      rolesolconsumo: this.rolesolconsumo
    });
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data
        //console.log(data);
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
      },
      () => this.isLoading = false
    );
  }

  getDirecciones(){
    this.userService.alldirection().subscribe(data=>{
      //console.log(data);
      this.direcciones = data;
    }, error=>{
      console.log(error);
        if(error.status == 403 || error.status == 404){
          this.toast.setMessage(
            error.message,
            "danger"
          );
          this.auth.logout();
        }
    });
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(DialogDeleteUserComponent, {
      width: '500px',
      data: {name: user.NombreCompleto , IdUser: user.IdUsuario}
    });
    dialogRef.afterClosed().subscribe(result => {
      //console.log(`No esta indefinida la variable, le dieron en si ${result}`);
          if(result == undefined){
              console.log("le dieron que no");
          }else{
            console.log(`No esta indefinida la variable, le dieron en si ${result}`);
            this.userService.deleteUser(user).subscribe(
              data => console.log("Se Elimino el Usuario correctamente"),//this.toast.setMessage('Se Elimino el Usuario correctamente.', 'success'),
              error => {
                console.log(error);
                if(error.status == 403 || error.status == 404){
                  this.toast.setMessage(
                    error.message,
                    "danger"
                  );
                  this.auth.logout();
                }
              },
              () => this.getUsers()
            );
              
          }
      
    });
    // if (window.confirm('Are you sure you want to delete ' + user.NombreCompleto + '?')) {
    //   // this.userService.deleteUser(user).subscribe(
    //   //   data => this.toast.setMessage('user deleted successfully.', 'success'),
    //   //   error => console.log(error),
    //   //   () => this.getUsers()
    //   // );
    // }
  }

  UpdateUser(user:User){
    console.log("Este es el Usuario que se actualizara---->" + 
    user.IdUsuario + "    " + user.NombreCompleto);
    this.IdUser = user.IdUsuario;
    this.UserEdit = user;
    this.NameUser = user.NombreCompleto;
    this.GetDirectionsForUserSelected(this.IdUser);
    console.log(this.UserEdit.NombreCompleto);
    this.isViewListUsr = false;
    this.isEditingUsr = true;
    
  }

  CancelEdit(){
    this.isViewListUsr = true;
    this.isEditingUsr = false;
    this.toast.setMessage('Se cancelo la edicion del Usuario.', 'warning');
    this.updateUsrDataGeneral.reset();
  }

  GetAllDirecciones(){
    //console.log("Estas son todas las direcciones");
    this.userService.alldirection().subscribe(data =>{
      //console.log(data);
      this.ListAllDireccions = data;
    },
    error =>{
      console.log("ERRORRRRR----" + error);
      console.log(error);
                if(error.status == 403 || error.status == 404){
                  this.toast.setMessage(
                    error.message,
                    "danger"
                  );
                  this.auth.logout();
                }
    })
  }
  
  GetDirectionsForUserSelected(User:number){
    //console.log("Direcciones por USER");
    //console.log(User);
    this.userService.getalldirforuser(User).subscribe(data=>{
      //console.log(data);
      this.ListDirecciones = data;
    }, error =>{
      if(error.status == 403 || error.status == 404){
        this.toast.setMessage(
          error.message,
          "danger"
        );
        this.auth.logout();
      }
    });
  }

  SelectedDireccion(){
    if(this.SelectedDir != undefined && this.UserEdit.IdRole != 1){
      this.isAddDir = false;
    }else{
      this.isAddDir = true;
      this.toast.setMessage('Un usuario Solicitante no puede tener mas de una Direccion asociada.', 'warning');
    }
    //console.log(this.SelectedDir.IdDireccion);
  }

  SelectedFilterDireccion(){
    console.log(this.selectedfilterDireccion);
    this.userService.filterUserDirections(this.selectedfilterDireccion.IdDireccion).subscribe(data=>{
      //console.log(data);
      this.users = data;
    }, error=>{
      if(error.status == 403 || error.status == 404){
        this.toast.setMessage(
          error.message,
          "danger"
        );
        this.auth.logout();
      }
      //this.toast(err, "danger");
    })
  }

  deleteFilterUsers(){
    this.selectedfilterDireccion = undefined;
    this.getUsers();
  }

  SelectedDirAsoc(){
    if(this.SelectDirAsoc != undefined && this.UserEdit.IdRole != 1){
      this.isDeleteDir = false;
    }else{
      this.isDeleteDir = true;
      this.toast.setMessage('No se puede Eliminar la Direccion, es usuario Solicitante', 'warning');
    }
    //console.log(this.SelectDirAsoc.IdDireccion);
  }

  AddDirForUser(){
    //console.log("Este es el Id de la direccion "+this.SelectedDir.IdDireccion + "  Nombre:  " + this.SelectedDir.Nombre);
    //console.log("Id de Usuario-->" + this.IdUser);
    this.userService.addDirectionForUser(this.IdUser,this.SelectedDir.IdDireccion).subscribe( data=>{
      //console.log(data);
      this.toast.setMessage('Se actualizo Correctamente el Usuario.', 'success');
      this.getUsers();
      this.GetAllDirecciones();
    }, error=>{
      //console.log("Dentro del metodo para agregar una direccion a un usuario")
      //console.log(error)

      if(error.status == 403 || error.status == 404){
        this.toast.setMessage(
          error.message,
          "danger"
        );
        this.auth.logout();
      }
      this.toast.setMessage('Error al actualizar, '+ error.error , 'danger');
    })
  }

  DeleteDirForUser(){
    //console.log("Este es el id de la direccion" + this.SelectDirAsoc.IdDireccion);
    //console.log("Este es el id del usuario--->" + this.IdUser);
    this.userService.deleteDirForUser(this.IdUser,this.SelectDirAsoc.IdDireccion).subscribe(
      data=>{
        //console.log(data);
        this.toast.setMessage('Se elimino la Direccion', 'success');
        this.getUsers();
        this.GetAllDirecciones();
        this.GetDirectionsForUserSelected(this.IdUser);
      }, error=>{
        if(error.status == 403 || error.status == 404){
          this.toast.setMessage(
            error.message,
            "danger"
          );
          this.auth.logout();
        }
        this.toast.setMessage('Error al actualizar.'+ error , 'danger');
      }
    )
  }

  getAllRoleSolPed(){
    this.userService.allrole().subscribe(
      data =>{this.ListRoles = data},
      error =>{
        if(error.status == 403 || error.status == 404){
          this.toast.setMessage(
            error.message,
            "danger"
          );
          this.auth.logout();
        }
        console.log("error al recuperar los tipos de roles");
      } 
    );
  }

  getAllRoleSolConsumoInterno(){
    this.userService.getAllroleSolConsumo().subscribe(data=>{
      this.ListRolesConsumo = data;
    }, error=>{
      if(error.status == 403 || error.status == 404){
        this.toast.setMessage(
          error.message,
          "danger"
        );
        this.auth.logout();
      }
    })
  }
  
  UpdateUsrData(){
    this.updateUsrDataGeneral.value.IdUsr = this.UserEdit.IdUsuario;
    // console.log("Dentro del metodo para actualizar los valores generales , este es el Usuario a actualizar--->" + this.updateUsrDataGeneral.value.IdUsr);
    // console.log(this.updateUsrDataGeneral.value.IdUsr);
    // console.log("Nombre usuario---->" + this.updateUsrDataGeneral.value.Name);
    // console.log("username--->" + this.updateUsrDataGeneral.value.username);
    // console.log("email--->" + this.updateUsrDataGeneral.value.email);
    // console.log("password--->"+ this.updateUsrDataGeneral.value.password);
    // console.log("tel--->"+ this.updateUsrDataGeneral.value.tel);
    // console.log("ext--->" + this.updateUsrDataGeneral.value.ext);
    // console.log("puesto--->" + this.updateUsrDataGeneral.value.puesto);
    // console.log("RoleSelected---->" + this.updateUsrDataGeneral.value.rolesolped);
    // console.log("Role Consumo Interno --->   " + this.updateUsrDataGeneral.value.rolesolconsumo);
    //console.log(this.updateUsrDataGeneral.value);

    if(this.updateUsrDataGeneral.value.Name == '' &&
      this.updateUsrDataGeneral.value.username == '' &&
      this.updateUsrDataGeneral.value.email == '' &&
      this.updateUsrDataGeneral.value.password == '' &&
      this.updateUsrDataGeneral.value.tel == 0 && 
      this.updateUsrDataGeneral.value.ext == 0 && 
      this.updateUsrDataGeneral.value.puesto == '' &&
      this.updateUsrDataGeneral.value.rolesolped == 0 &&
      this.updateUsrDataGeneral.value.rolesolconsumo == 0
      ){
      this.toast.setMessage('No se puede actualizar al Usuario con valores vacios' , 'warning');
    }else{
      this.userService.UpdateUser(this.updateUsrDataGeneral.value).subscribe(data =>{
        //console.log(data);
        this.toast.setMessage('Se actualizo Correctamente el Usuario.', 'success');
        this.updateUsrDataGeneral.reset();
        //this.GetAllDirecciones();
        this.getAllRoleSolPed();
        this.getAllRoleSolConsumoInterno();
        this.getUsers();
      }, 
      error=>{
        if(error.status == 403 || error.status == 404){
          this.toast.setMessage(
            error.message,
            "danger"
          );
          this.auth.logout();
        }
        this.toast.setMessage('Error al actualizar.'+ error , 'danger');
      });
  
    }


    
  }


//-------------------------------------------------------------------------------TAB DIRECCION --------------------------------------------
  addNewDir(){
    this.isCreateDir = true;
    this.isViewListDir = false;
    this.namedir = "";
  }

  NewDir(){
    console.log("metodo para crear una nueva direccion en la base de datos");
    this.userService.createNewDireccion(this.namedir).subscribe(data=>{
      //console.log(data);
      if(data == 1){
        this.toast.setMessage('Se creo correctamente la Direccion o Sub-Direccion', 'success');
        this.isCreateDir = false;
        this.isViewListDir = true;
        this.getDirecciones();
      }else{
        this.toast.setMessage(data, 'warning');
      }
    }, error=>{
      if(error.status == 403 || error.status == 404){
        this.toast.setMessage(
          error.message,
          "danger"
        );
        this.auth.logout();
      }
      this.toast.setMessage('Error al actualizar.'+ error , 'danger');
    })
  }

  CancelNewDir(){
    this.isCreateDir = false;
    this.isViewListDir = true;
  }

  UpdateDir(dir:Direccion){
    this.NameDirView = dir;
    this.isEditingDir = true;
    this.isViewListDir = false;
  }

  SaveEditing(){
    //console.log(this.newName);
    //console.log(this.NameDirView);
    this.userService.updateDIreccion(this.NameDirView.IdDireccion, this.newName).subscribe(
    data=>{
     // console.log(data);
      if(data==1){
        this.toast.setMessage('Se actualizo correctamente la Direccion o Sub-Direccion', 'success');
        this.isEditingDir = false;
        this.isViewListDir = true;
        this.newName = '';
        this.getDirecciones();
      }
    },error=>{
      if(error.status == 403 || error.status == 404){
        this.toast.setMessage(
          error.message,
          "danger"
        );
        this.auth.logout();
      }
      this.toast.setMessage('Error al actualizar.'+ error , 'danger');
    })
    
  }

  CancelEditing(){
    this.isEditingDir = false;
    this.isViewListDir = true;
    this.ngOnInit();
  }

  deleteDir(dir:Direccion){
    const dialogdeletedir = this.dialog.open(DialogDeleteDirComponent, {
      width: '500px',
      data: {name: dir.Nombre , IdDir: dir.IdDireccion}
    });
    dialogdeletedir.afterClosed().subscribe(result => {
      //console.log(`No esta indefinida la variable, le dieron en si ${result}`);
          if(result == undefined){
              console.log("le dieron que no no manches");
          }else{
            console.log(`No esta indefinida la variable, le dieron en si ${result}`);
            //console.log(result.IdDir);
            this.userService.delelteDireccion(result.IdDir).subscribe(data =>{
              //console.log(data);
              if(data == 1 ){
                this.toast.setMessage('Se elimino la Direccion', 'success');
                this.getDirecciones();
              }else{
                this.toast.setMessage('Error al actualizar.', 'danger');
              }
            }, error=>{
              if(error.status == 403 || error.status == 404){
                this.toast.setMessage(
                  error.message,
                  "danger"
                );
                this.auth.logout();
              }
              console.log("ocurrio un error al eliminar la direccion" + error);
            })
          }
    });
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
}


// @Component({
//   selector: 'app-admindialog',
//   templateUrl: './admin.component.dialogdelete.html',
// })
// export class DialogDataExampleDialog {

//   constructor(public dialogRef: MatDialogRef<DialogDataExampleDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData,
//     public toast: ToastComponent) {}

//   onNoClick(): void {
//     this.dialogRef.close();
//     console.log("le dimos que no");
//     this.toast.setMessage('Operacion de cancelacion cancelada.', 'warning');
//   }
  
// }

// @Component({
//   selector: 'app-admindialogdeletedir',
//   templateUrl: './admin.component.dialogdeletedir.html',
// })
// export class DialogDeleteDir{
//   constructor(public dialogdeletedir: MatDialogRef<DialogDeleteDir>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData,
    //public toast: ToastComponent) {}
    
//   onCancelClick():void{
//     this.dialogdeletedir.close();
//     console.log("se cancelo la eliminacion de la direccion");
//     this.toast.setMessage('Operacion de eliminacion cancelada.', 'warning');
//   }
// }