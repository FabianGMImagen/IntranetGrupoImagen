import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

//servicios
import { SolicitudConsumoService } from "client/app/services/solicitudconsumo.service";
//modelos
import { ProductoConsumoInterno } from "client/app/shared/models/productosconsumointerno.model";

//componentes
import { DialogUpdateProductsdataSolConsumoComponent } from "../dialog-update-productsdata-sol-consumo/dialog-update-productsdata-sol-consumo.component";
import { ToastComponent } from "client/app/shared/toast/toast.component";

@Component({
  selector: "app-dialog-detalle-sol-consumo-interno",
  templateUrl: "./dialog-detalle-sol-consumo-interno.component.html",
  styleUrls: ["./dialog-detalle-sol-consumo-interno.component.css"],
})
export class DialogDetalleSolConsumoInternoComponent implements OnInit {
  viewspiner:boolean;
  idsolicitud: number;
  canupdate:boolean;
  DataInitial:Object;
  ListProductos: ProductoConsumoInterno[] = [];
  constructor(
    public dialog: MatDialog,
    public toast: ToastComponent,
    private solConsumoService: SolicitudConsumoService,
    public dialogRef: MatDialogRef<DialogDetalleSolConsumoInternoComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.viewspiner = true;
    this.idsolicitud = this.data;
    this.getDataInciialforUpdateProducts();
    this.getAllProductsforSolConsumoInt();
  }

  async getDataInciialforUpdateProducts(){
    
    this.DataInitial = await this.solConsumoService.getDataInicialforUpdate(this.idsolicitud);
    console.log(this.DataInitial[0]);
    if(this.DataInitial[0] == undefined){
      this.toast.setMessage(
        "Los datos principales no se pudieron recueprar favor, salir y volver a entrar.",
        "danger"
      );
    }
  }

  async getAllProductsforSolConsumoInt() {
    this.ListProductos =
      await this.solConsumoService.getAllProductosforSolicitudConsumo(
        this.idsolicitud
      );
    if(this.ListProductos != null || this.ListProductos != undefined){
      this.viewspiner = false;
    }
  }

  UpdateDataProdcuts(products:ProductoConsumoInterno){
    console.log(products);
    var dialogUpProdcut = this.dialog.open(DialogUpdateProductsdataSolConsumoComponent,{
      width: '1000px',
      data: [products, this.DataInitial]
      
    });
    dialogUpProdcut.afterClosed().subscribe(result=>{
      console.log("El dialog de visualizacion de campos editables fue cerrado por el user");
      console.log(result);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
