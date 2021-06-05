import { Component, OnInit } from '@angular/core';
import { ToastComponent } from '../../shared/toast/toast.component';

import {AuthServices} from '../../services/auth.service';
import { Area } from '../../shared/models/areas.model';
import { DirAuth } from '../../shared/models/dirauth.model';
import { DirAuthService } from '../../services/dirauth.service';
import { Solicitud } from '../../shared/models/solicitud.model';
import { Role } from '../../shared/models/roles.model';

@Component({
  selector: 'app-dirauth',
  templateUrl: './dirauth.component.html',
  styleUrls: ['./dirauth.component.css']
})
export class DirauthComponent implements OnInit {
  isLoading = true;
  ListAreas:Area[];
  SelectArea: Area | undefined;
  ListStatus:Role[];
  Selectrole:Role;
  ListDirAuth:DirAuth[];

  constructor(
    public dirauthserv:DirAuthService,
    public toast: ToastComponent,
    private auth: AuthServices
  ) { }

  ngOnInit() {
    this.allDirections();
    this.ListDireccioneswidthExeptionAuth();
  }

  allDirections(){
    console.log("Todas las Direcciones");
    this.dirauthserv.getall_Direcciones().subscribe(data=>{
      console.log(data);
      this.ListAreas = data;
    }, error=>{
      console.log(error);
        if(error.status == 403 || error.status == 404){
          this.toast.setMessage(
            error.message,
            "danger"
          );
          this.auth.logout();
        }
        console.log("Error al recuperar las direcciones");
    }, ()=>{
      this.isLoading = false;
    });
  }

  selectedDireccion(){
    console.log(this.SelectArea);
    this.allStatusRole();
  }

  allStatusRole(){
    console.log("dentro del metodo para recuperar los status de los rooles");
    this.dirauthserv.getall_RoleAuth().subscribe(data=>{
      console.log(data);
      this.ListStatus = data;
    }, error=>{
      console.log(error);
        if(error.status == 403 || error.status == 404){
          this.toast.setMessage(
            error.message,
            "danger"
          );
          this.auth.logout();
        }
      console.log("error al recuperar la infromacion de los Status de los roles" + error);
    })
  }

  ExcluirAuth(){
    console.log(this.SelectArea);
    console.log(this.Selectrole);
    console.log(this.Selectrole.IdRole);
    this.dirauthserv.insertExeptionAuth(this.SelectArea.IdDireccion, this.Selectrole.IdRole)
    .subscribe(data=>{
      console.log(data);
      if(data == 1){
        this.toast.setMessage('Se guardo correctamente la excepcion para la Direccion seleccionada', 'success');
      }else{
        this.toast.setMessage('Ocurrio un error al guardar la excepcion, por favor intenta mas tarde.', 'warning');
      }
      this.allDirections();
      this.ListDireccioneswidthExeptionAuth();
    },error=>{
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


  ListDireccioneswidthExeptionAuth(){
    console.log("entrando al metodo para recuperar lista de DIrecciones con excepcion");
    this.dirauthserv.listdiretionsexeptionauth().subscribe(data=>{
      console.log("-----------------------------------");
      console.log(data);
      this.ListDirAuth = data;
    }, error=>{
      console.log(error);
        if(error.status == 403 || error.status == 404){
          this.toast.setMessage(
            error.message,
            "danger"
          );
          this.auth.logout();
        }
      console.log("recuperando la lista de las excepciones de autorizacion por direccion");
    })
  }



  deleteExcept(dirauth){
    console.log(dirauth);
    console.log(dirauth.IdDirauth);
    this.dirauthserv.deleteexcepctionrole(dirauth.IdDirauth).subscribe(data=>{
      if(data == 1){
        this.toast.setMessage('Se elimino correctamente la excepcion para esta Direccion.', 'success');
      }else{
        this.toast.setMessage('Error al eliminar la excepcion para la Direccion', 'warning');
      }
      this.allDirections();
      this.ListDireccioneswidthExeptionAuth();
    }, error=>{
      console.log(error);
        if(error.status == 403 || error.status == 404){
          this.toast.setMessage(
            error.message,
            "danger"
          );
          this.auth.logout();
        }
      console.log("error al elminiar el valor de la base --->" + error);
    })
  }

}
