import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { SolicitudesReg } from '../../shared/models/solicitudesReg.model';
import { StatusSolicitud } from '../../shared/models/statussolicitud.model';

import * as jsPDF from 'jspdf';
import { SolicitudRegService } from '../../services/solicitudreg.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthServices } from 'client/app/services/auth.service';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.2, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SolicitudComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnsToDisplay = ['Id','Solicitante','FechaSolicitud','Empresa','Plaza','Direccion'];
  dataSource: MatTableDataSource<SolicitudesReg>;


  ListSolPedsReg:SolicitudesReg[];
  ListStatus:StatusSolicitud[];
  SelectedStatus:StatusSolicitud;


  constructor(private solicitudService: SolicitudRegService, 
              public toast: ToastComponent, 
              private auth: AuthServices) { }

  ngOnInit() {
    //solicitamos los datos de las solicitudes de pedido
    this.getAllSolicitudPedidosAdmin();
    this.getAllStatusSolicitud();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    console.log(filterValue);
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllSolicitudPedidosAdmin(){
    console.log("Solicitamos todas las Solicitudes de Pedido");
    this.solicitudService.getAllSolicitudesRegAdmin().subscribe(data =>{
      console.log("entrando al mentodo que nos regresa las solicitudes");
      this.ListSolPedsReg = data;
      //console.log(this.ListSolPedsReg);
    }, error=>{
      if(error.status == 403 || error.status == 404){
        this.toast.setMessage(
          error.message,
          "danger"
        );
        this.auth.logout();
      }
      console.log("error al recuperar la informacion de las solicitudes");
      console.log(error);
    },()=>{
      console.log("pasamos al informacion del arreglo a la lista");
          this.dataSource = new MatTableDataSource(this.ListSolPedsReg);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
    });
  }

  getAllStatusSolicitud(){
    console.log("dentro del metodo para recuperar los status de las solicitudes");
    this.solicitudService.getAllStatusSOlicituPedido().subscribe(data =>{
      //console.log(data);
      this.ListStatus = data;
    }, error=>{
      if(error.status == 403 || error.status == 404){
        this.toast.setMessage(
          error.message,
          "danger"
        );
        this.auth.logout();
      }
      console.log("ocurrio un error al recuperar la infromacion de los status");
    })
  }

  SelectStatus(){
    console.log(this.SelectedStatus);
  }

  ChangeStatus(element){
    console.log(element);
    console.log(this.SelectedStatus);
    this.solicitudService.UpdateStatusAdmin(element.Id, this.SelectedStatus.IdStatusSolicitud).subscribe(data =>{
      console.log(data);
      this.getAllSolicitudPedidosAdmin();
      this.getAllStatusSolicitud();
    }, error =>{
      if(error.status == 403 || error.status == 404){
        this.toast.setMessage(
          error.message,
          "danger"
        );
        this.auth.logout();
      }
      console.log(error);
    });
    //console.log(result);
  }
  
}