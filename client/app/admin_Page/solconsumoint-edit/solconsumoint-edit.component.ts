import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
//services
import { SolicitudConsumoService } from '../../services/solicitudconsumo.service';
import { AuthServices } from 'client/app/services/auth.service';

//components
import { ToastComponent } from 'client/app/shared/toast/toast.component';

//models
import { StatusConsumoInterno } from 'client/app/shared/models/status_sol_consumo.model';
import { SolicitudesConsumoIntRegistradasAdmin } from 'client/app/shared/models/sol_consumoint_registradasAdmin.model';
import { SolicitudCompraService } from 'client/app/services/solicitudcompra.service';




@Component({
  selector: 'app-solconsumoint-edit',
  templateUrl: './solconsumoint-edit.component.html',
  styleUrls: ['./solconsumoint-edit.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.2, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class SolconsumointEditComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  columnsToDisplay = ['Id','Solicitante','Fecha','Empresa','Centro',];
  dataSource: MatTableDataSource<SolicitudesConsumoIntRegistradasAdmin>;
  ListSolConsumo:SolicitudesConsumoIntRegistradasAdmin[];
  ListStatusSolConsumoInt:StatusConsumoInterno[];
  SelectedStatus:StatusConsumoInterno;

  constructor(public solconsumservice:SolicitudConsumoService,
    public solicitudComp: SolicitudCompraService,
    public toast: ToastComponent, 
    private auth: AuthServices) { }

  ngOnInit(){
    this.getAllSolicutdesConsumoAdmin();
    this.getAllStatusSolConsumoInt();
  }

  async getAllSolicutdesConsumoAdmin(){
   try {
     this.ListSolConsumo = await this.solconsumservice.getAllSolConsumoInternoforAdmin();
     if(this.ListSolConsumo.length == 0){
        this.toast.setMessage("Error al recuperar la lista de las Solicitude de Consumo Interno", "warning");
     }
      //console.log(this.ListSolConsumo.length);
      this.dataSource = new MatTableDataSource(this.ListSolConsumo);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
   } catch (error) {
      if (error.status == 403 || error.status == 404) {
        this.toast.setMessage(error.message, "danger");
        this.auth.logout();
      }
      this.toast.setMessage("Error al recuperar la lista de las Solicitude de Consumo Interno", "warning");
      console.log(error);     
   }
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

  async getAllStatusSolConsumoInt(){
   
    try {
      this.ListStatusSolConsumoInt = await this.solconsumservice.getAllStatusSolConsumo();
      if(this.ListStatusSolConsumoInt.length == 0){
        this.toast.setMessage("Error al recuperar los estatus", "warning");
     }
    } catch (error) {
      if (error.status == 403 || error.status == 404) {
        this.toast.setMessage(error.message, "danger");
        this.auth.logout();
      }
      this.toast.setMessage("Error al recuperar los estatus", "warning");
      console.log(error);
    }
  }

  async ChangeStatus(element){
    console.log(element);
    console.log(this.SelectedStatus);
    try {
      var isupdate = await this.solconsumservice.ChangedStatusAdmin(element.Id, this.SelectedStatus.IdStatusSolicitudConsumo);
      //console.log(isupdate);
      this.toast.setMessage(isupdate ,"success");
      this.getAllSolicutdesConsumoAdmin();
    } catch (error) {
      if (error.status == 403 || error.status == 404) {
        this.toast.setMessage(error.message, "danger");
        this.auth.logout();
      }
      this.toast.setMessage("Error al recuperar los estatus", "warning");
      console.log(error);
    }
  }

}
