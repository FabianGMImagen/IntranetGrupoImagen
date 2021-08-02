import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { animate, state, style, transition, trigger,} from "@angular/animations";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
//import { MatPaginatorIntl, PageEvent } from "@angular/material/paginator";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";

//models
import { SolicitudesConsumoIntRegistradas } from '../../shared/models/sol_consumo_int_Registradas.model';

//Servicios
import { AuthServices } from '../../services/auth.service';
import { SolicitudConsumoService } from '../../services/solicitudconsumo.service';
//Components
import { DialogDetalleSolConsumoInternoComponent } from '../../dialogs/dialog-detalle-sol-consumo-interno/dialog-detalle-sol-consumo-interno.component';
import { ToastComponent } from '../../shared/toast/toast.component';
// import { DialogUpdateDatageneralSolConsumoComponent } from '../dialogs/dialog-update-datageneral-sol-consumo/dialog-update-datageneral-sol-consumo.component';

export interface DataSolConsumoInt {
  IdSoliConsumo: string;
}

@Component({
  selector: 'app-account-sol-consumo-list',
  templateUrl: './account-sol-consumo-list.component.html',
  styleUrls: ['./account-sol-consumo-list.component.css'],

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
export class AccountSolConsumoListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  ListSolConsumoReg: SolicitudesConsumoIntRegistradas[];
  DATASOURCEFIRST: MatTableDataSource<SolicitudesConsumoIntRegistradas>;
  columnsToDisplayFirst = ["ID","FECHASOLICITUD","STATUSNAME","USERSOLICITANTE","EMPRESA"];

  constructor(
    public dialog: MatDialog,
    private auth: AuthServices,
    public toast: ToastComponent,
    private solConsumoService: SolicitudConsumoService
    ) { 

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.DATASOURCEFIRST.filter = filterValue;
    if (this.DATASOURCEFIRST.paginator) {
      this.DATASOURCEFIRST.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.getSolicitudConsumoInsertoforuser();
  }


  async getSolicitudConsumoInsertoforuser(){
    let user = this.auth.currentUser.IdUsuario
    let IdRole = this.auth.currentUser.IdRoleConsumoInterno;
    this.ListSolConsumoReg = await this.solConsumoService.getAllSolConsumoInternoforUsuario(user, IdRole);
    if(this.ListSolConsumoReg != null || this.ListSolConsumoReg != undefined){
      this.DATASOURCEFIRST = new MatTableDataSource(this.ListSolConsumoReg);
      this.DATASOURCEFIRST.paginator = this.paginator;
      this.DATASOURCEFIRST.sort = this.sort;
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

  // UpdateDataforSol(data: SolicitudesConsumoIntRegistradas){
  //   var dialogUpdate = this.dialog.open(DialogUpdateDatageneralSolConsumoComponent,{
  //     width: '2500px',
  //   });

  //   dialogUpdate.afterClosed().subscribe(result=>{
  //     console.log("El dialog de visualizacion de campos editables fue cerrado por el user");
  //     console.log(result);
  //   });
  // }

  


}


// @Component({
//   selector: 'dialog-detalle-solconsumointerno-dialog',
//   templateUrl: 'dialog-detalle-account-sol-consumo-dialog.html',
// })
// export class DialogDetalleSolConsumoInterno implements OnInit{
//   idsolicitud:number;
//   ListProductos:ProductoConsumoInterno[] = [];
//   // DATASOURCEPROD: MatTableDataSource<ProductoConsumoInterno>;
//   // displayedColumns: string[] = ['IdProductoConsumoInterno', 
//   // 'Cantidad', 
//   // 'AlmacenName', 
//   // 'MaterialName',
//   // 'CentroCostoName',
//   // 'CuentaMayorName',  
//   // 'Caducidad',
//   // 'NameUnidadMedida'];
//   constructor(
//     private solConsumoService: SolicitudConsumoService,
//     public dialogRef: MatDialogRef<DialogDetalleSolConsumoInterno>,
//     @Inject(MAT_DIALOG_DATA) public data: number) {
//     }

//   ngOnInit(): void {
//     this.idsolicitud = this.data;
//     this.getAllProductsforSolConsumoInt();

//   }

//   async getAllProductsforSolConsumoInt(){
//       this.ListProductos = await this.solConsumoService.getAllProductosforSolicitudConsumo(this.idsolicitud);
//       // if(this.ListProductos != null || this.ListProductos != undefined){
//       //   this.DATASOURCEPROD = new MatTableDataSource(this.ListProductos);
//       // }
//   }
  

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

//   onYesClick(): void {
//     this.dialogRef.close(true);
//   }

// }
