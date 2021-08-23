import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SolicitudCompraService } from 'client/app/services/solicitudcompra.service';


import { ToastComponent } from 'client/app/shared/toast/toast.component';
import { DialogDetalleSolConsumoInternoComponent } from '../dialog-detalle-sol-consumo-interno/dialog-detalle-sol-consumo-interno.component';

@Component({
  selector: 'app-dialog-new-category',
  templateUrl: './dialog-new-category.component.html',
  styleUrls: ['./dialog-new-category.component.css']
})
export class DialogNewCategoryComponent implements OnInit {
  newcategory:string;
  constructor( 
    public solcompraSRV:SolicitudCompraService,
    public dialog: MatDialog,
    public toast: ToastComponent,
    public dialogRef: MatDialogRef<DialogDetalleSolConsumoInternoComponent>,
    @Inject(MAT_DIALOG_DATA) public data
    ) { }


  ngOnInit(): void {
  }

   onYesClick(){
    if(this.newcategory != undefined){
      this.solcompraSRV.InsertNewCategory(this.newcategory).then(result=>{
        if(result == undefined){
          this.toast.setMessage("Error al guardar la Categoría" ,"warning");
        }
        this.toast.setMessage("Se creo correctamente la categoría" ,"success");
        this.dialogRef.close({catadd: this.newcategory, message:"Se agrego nueva categoría"});
      }).catch(erro=>{
        this.toast.setMessage("Error al guardar la Categoría" +erro,"warning");
      });
    }
    this.toast.setMessage("por favor Ingresa un nombre para la nueva categoria.","warning");
  }

  onNoClick(): void {
    this.dialogRef.close({message:"Operación cancelada"});
  }

}
