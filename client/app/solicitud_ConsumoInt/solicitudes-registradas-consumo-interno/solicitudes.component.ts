import { Component, OnInit,ViewChild } from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';


//models
import { Direccion } from '../../shared/models/directions.model';
import { SolicitudesConsumoIntRegistradas } from 'client/app/shared/models/sol_consumo_int_Registradas.model';
import { StatusConsumoInterno } from 'client/app/shared/models/status_sol_consumo.model';
import { UsrAuthSolConsumoInt } from 'client/app/shared/models/usrauth_sol_consum_int.mode';

//services
import { AuthServices } from '../../services/auth.service';
import { SolicitudCompraService } from '../../services/solicitudcompra.service';
import { SolicitudConsumoService } from '../../services/solicitudconsumo.service';
//components
import { ToastComponent } from '../../shared/toast/toast.component';
import { DialogDetalleSolConsumoInternoComponent } from 'client/app/dialogs/dialog-detalle-sol-consumo-interno/dialog-detalle-sol-consumo-interno.component';


@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css'],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})

export class SolicitudesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  ListDirforUser:Direccion[];
  SelectedDir:Direccion;

  columnsToDisplay = ["ID","FECHASOLICITUD","STATUSNAME","USERSOLICITANTE","EMPRESA"];
  ListSolConsumoReg: SolicitudesConsumoIntRegistradas[];
  datSource: MatTableDataSource<SolicitudesConsumoIntRegistradas>;
  ListStatus:StatusConsumoInterno[];
  SelectStatus:StatusConsumoInterno;
  UserAuth:UsrAuthSolConsumoInt;

  constructor(
    public auth: AuthServices,
    public solicitudComp:SolicitudCompraService,
    public toast: ToastComponent,
    public solicitudConsum: SolicitudConsumoService,
    public dialog: MatDialog,) {
 
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
    if(this.SelectedDir != undefined || this.SelectedDir != null){
      if(this.auth.isJefeAreaConsumoInt){
        //Quire decir que es jefe de area de una direccion y aparte tiene el mismo rol de jefe para Consumo Interno
        this.AllSolConsumoInternoforDirectionAuth(this.auth.currentUser.IdRoleConsumoInterno, this.SelectedDir.IdDireccion, 1);
        this.GetStatusforRole(this.auth.currentUser.IdRoleConsumoInterno);
      }else if(this.auth.isDirectorConsumoInt){
        //quiere decir que es director de direccion en consumo Interno");
        this.AllSolConsumoInternoforDirectionAuth(this.auth.currentUser.IdRoleConsumoInterno, this.SelectedDir.IdDireccion, 2);
        this.GetStatusforRole(this.auth.currentUser.IdRoleConsumoInterno);
      }else if(this.auth.isAlmacenistaConsumoInt){
        console.log("quiere decir que es como personal de compras y en la Sol de consumo interno tiene el Role de Almacenista");
        this.AllSolConsumoInternoforDirectionAuth(this.auth.currentUser.IdRoleConsumoInterno, this.SelectedDir.IdDireccion, 4);
        this.GetStatusforRole(this.auth.currentUser.IdRoleConsumoInterno);
      }

    }else{
      this.toast.setMessage("No seleccionaste ninguna Direccion", "warning");
    }
  }



  async AllSolConsumoInternoforDirectionAuth(IdRoleConsumo:number, IdDireccion:number, IdStatusSolConsumo:number){
    // console.log("método para recuperar las solicitudes consumo interno por direccion y autorización");
    // console.log(this.auth.currentUser);
    // console.log(IdRoleConsumo);
    // console.log(IdDireccion);
    // console.log(IdStatusSolConsumo);
    try {
      this.ListSolConsumoReg = await this.solicitudConsum.getAllSolicituConsumoIntforDir_Status_Role(IdRoleConsumo,IdDireccion,IdStatusSolConsumo);
      if(this.ListSolConsumoReg.length != 0){
        this.datSource = new MatTableDataSource(this.ListSolConsumoReg);
        this.datSource.paginator = this.paginator;
        this.datSource.sort = this.sort;
      }else{
        this.toast.setMessage("Aun no tienes ninguna Solicitud de Consumo Interno Pendiente", "warning");
      }
    } catch (error) {
      if (error.status == 403 || error.status == 404) {
        this.toast.setMessage(error.message, "danger");
        this.auth.logout();
      }
      this.toast.setMessage("AllSolConsumoInternoforDirectionAuth  :" + error.message, "danger");
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.datSource.filter = filterValue;
    if (this.datSource.paginator) {
      this.datSource.paginator.firstPage();
    }
  }

  getDetalleProductos(data: SolicitudesConsumoIntRegistradas){
    const dialogRef = this.dialog.open(DialogDetalleSolConsumoInternoComponent, {
      width: '2500px',
      data: {IdSol: data.ID, Status:data.IdStatusSolicitud},
      
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('El dialog de visualizacion de Productos fue cerrado por el user');
      console.log(result);
    });
  }

  async GetStatusforRole(IdRole:number){
    try {
      this.ListStatus = await this.solicitudConsum.getAllStatusforRoleConsumoInterno(IdRole);
      if(this.ListStatus.length == 0){
        this.toast.setMessage("Error ", "danger");
      }
    } catch (error) {
      if (error.status == 403 || error.status == 404) {
        this.toast.setMessage(error.message, "danger");
        this.auth.logout();
      }
      this.toast.setMessage("GetStatusforRole :" + error.message, "danger");
    }
  }

  async CambiaStatus(data:SolicitudesConsumoIntRegistradas){
    console.log(data); 
    console.log(this.SelectStatus.IdStatusSolicitudConsumo);
    try {
      this.UserAuth = await this.solicitudConsum.updateSolicitudConsumoInt(data.ID, this.SelectStatus.IdStatusSolicitudConsumo);
      console.log(data);
      console.log(this.UserAuth[0]);
      if(this.UserAuth[0] != null || this.UserAuth[0] != undefined){
        console.log(" = = = = = = = = = = = = " 
        + data.ID, this.SelectStatus.IdStatusSolicitudConsumo, data.USERSOLICITANTE, this.UserAuth[0].NombreCompleto, this.UserAuth[0].EmailAuth, this.UserAuth[0].EmailSolicitante)
        this.solicitudConsum.sendEmailSolicitudConsumoForRoles(
          data.ID, 
          this.SelectStatus.IdStatusSolicitudConsumo, 
          this.UserAuth[0].NameStatus ,
          data.USERSOLICITANTE, 
          this.UserAuth[0].NombreCompleto, 
          this.UserAuth[0].EmailAuth,
          this.UserAuth[0].EmailSolicitante);
          this.SelectedDireccion();
      }
      
    } catch (error) {
      if (error.status == 403 || error.status == 404) {
        this.toast.setMessage(error.message, "danger");
        this.auth.logout();
      }
      this.toast.setMessage("CambiaStatus :" + error.message, "danger");
    }
  }


  
}

