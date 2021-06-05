import { Component, OnInit,ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';


//models
import { Direccion } from '../../shared/models/directions.model';
import { ToastComponent } from '../../shared/toast/toast.component';

//services
import { AuthServices } from '../../services/auth.service';
import { SolicitudCompraService } from '../../services/solicitudcompra.service';
import { SolicitudConsumoService } from '../../services/solicitudconsumo.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  ListDirforUser:Direccion[];
  SelectedDir:Direccion;

  constructor(
    public auth: AuthServices,
    public solicitudComp:SolicitudCompraService,
    public toast: ToastComponent,
    public solicitudConsum: SolicitudConsumoService) {
 
  }

  ngOnInit() {
    this.auth.currentUser.IdUsuario
    this.getDireccionesforUser(this.auth.currentUser.IdUsuario);
  }


  getDireccionesforUser(IdUser:number){
    console.log("Este es el id de el Usuario------>   " + IdUser);
    this.solicitudComp.getAllDirectionsForUser(IdUser).subscribe(
      data=>{
        console.log(data);
        this.ListDirforUser = data;
      },
      err=>{
        console.log("error al recuperar las diferentes Direcciones del Usuario    " + err);
      }
    )
  }

  SelectedDireccion(){
    console.log("Esta es la direccion Seleccionada ----------" + this.SelectedDir);
    if(this.auth.isJefeAreaConsumoInt){
      console.log("Quiere decir que es jefe de area de una direccion es espesifico y aparte tiene el mismo rol de jefe para Consumo Interno");
      this.AllSolConsumoInternoforDirectionAuth(this.auth.currentUser.IdRoleConsumoInterno, this.SelectedDir.IdDireccion,10);
    }else if(this.auth.isAlmacenistaConsumoInt){
      console.log("quiere decir que es como personal de compras y en la Sol de consumo interno tiene el Role de Almacenista");
      this.AllSolConsumoInternoforDirectionAuth(this.auth.currentUser.IdRoleConsumoInterno, this.SelectedDir.IdDireccion, 11);
    }
  }



  AllSolConsumoInternoforDirectionAuth(IdRoleConsumo:number, IdDireccion:number,IdStatusSolConsumo:number){
    console.log("metodo para recuperar las solicitudes consumo interno por direccion y autorizacion");
    console.log(this.auth.currentUser);
    console.log(IdRoleConsumo);
    console.log(IdDireccion);
    console.log(IdStatusSolConsumo);
    this.solicitudConsum.getAllSolicituConsumoIntforDir_Status_Role(IdRoleConsumo,IdDireccion,IdStatusSolConsumo).subscribe(data=>{
      console.log(data);
    }, err=>{
      console.log(err);
    });
  }


  
}

