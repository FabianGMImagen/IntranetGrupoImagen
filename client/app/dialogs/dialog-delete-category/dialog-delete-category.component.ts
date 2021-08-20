import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-delete-category',
  templateUrl: './dialog-delete-category.component.html',
  styleUrls: ['./dialog-delete-category.component.css']
})
export class DialogDeleteCategoryComponent implements OnInit {

  constructor(public dialogdelecat: MatDialogRef<DialogDeleteCategoryComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    //console.log(this.data.category.Nombre)
  }

  // onYesClick(){
  //   // if(this.newcategory != undefined){
  //   //   this.solcompraSRV.InsertNewCategory(this.newcategory).then(result=>{
  //   //     if(result == undefined){
  //   //       this.toast.setMessage("Error al guardar la Categoría" ,"warning");
  //   //     }
  //   //     this.toast.setMessage("Se creo correctamente la categoría" ,"success");
  //   //     this.dialogRef.close({catadd: this.newcategory, message:"Se agrego nueva categoría"});
  //   //   }).catch(erro=>{
  //   //     this.toast.setMessage("Error al guardar la Categoría" +erro,"warning");
  //   //   });
  //   // }
  //   // this.toast.setMessage("por favor Ingresa un nombre para la nueva categoria.","warning");
  // }

  onNoClick(): void {
    this.dialogdelecat.close({message:"Operación cancelada"});
  }

}
