import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { AuthServices } from 'client/app/services/auth.service';
import { SolicitudCompraService } from 'client/app/services/solicitudcompra.service';


import { Categorias } from 'client/app/shared/models/categorias.model';
import { ToastComponent } from 'client/app/shared/toast/toast.component';
import { DialogNewCategoryComponent } from '../../dialogs/dialog-new-category/dialog-new-category.component';
import { DialogDeleteCategoryComponent } from 'client/app/dialogs/dialog-delete-category/dialog-delete-category.component';

export interface DialogCategoria {
  Id:number;
  Nombre: string;
  Categoria : string;
}

@Component({
  selector: 'app-admin-categoria',
  templateUrl: './admin-categoria.component.html',
  styleUrls: ['./admin-categoria.component.css']
})
export class AdminCategoriaComponent implements OnInit {

  ListCategorias:Categorias[];
  countcat:number= 0;
  constructor(
    public toast: ToastComponent,
    private auth: AuthServices,
    public solicitudComp: SolicitudCompraService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.getAllCategorias();
  }


  async getAllCategorias(){
    try {
      this.ListCategorias = await this.solicitudComp.getAllCategorias();
      if(!this.ListCategorias){
        this.toast.setMessage("Error al recuperar las categorias", "warning");
      }
      this.countcat = this.ListCategorias.length;
    } catch (error) {
      if (error.status == 403 || error.status == 404) {
        this.auth.logout();
      }else{
        this.toast.setMessage(error.message,"danger");
      }
      
    }
  }


  NewCategory(){
    const dialogcreatecategory = this.dialog.open(DialogNewCategoryComponent, {
      width: '400px',
      data: {}
    });

    dialogcreatecategory.afterClosed().subscribe(result => {
      //console.log(`No esta indefinida la variable, le dieron en si ${result}`);
      console.log("desde el metodo de dialog");
      console.log(result);
          if(result == undefined){
              console.log("le dieron que no no manches");
          }else{
            console.log(`No esta indefinida la variable, le dieron en si`);
            this.getAllCategorias();
          }
    });
  }

  DeleteCategory(category:Categorias){
    console.log(category);
    const dialogdeletecategory = this.dialog.open(DialogDeleteCategoryComponent, {
      width: '500px',
      data: {category}
    });

    dialogdeletecategory.afterClosed().subscribe( async result => {
      //console.log(`No esta indefinida la variable, le dieron en si ${result}`);
          if(result == undefined){
              console.log("le dieron que no");
          }else{
            console.log(`No esta indefinida la variable, le dieron en si`);
            const isdelete = await this.solicitudComp.DeleteCategoria(result.category.IdCategoria);
            if(isdelete){
              this.toast.setMessage('Se elimino la Categoria', 'success')
            }else{
              this.toast.setMessage('Error al eliminar la categoria', 'danger')
            }
            this.getAllCategorias();
          }
    });
  }
}
