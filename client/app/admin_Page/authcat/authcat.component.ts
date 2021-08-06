import { Component, OnInit } from '@angular/core';



import { ToastComponent } from 'client/app/shared/toast/toast.component';
import { SolicitudCompraService } from 'client/app/services/solicitudcompra.service';
import { User } from 'client/app/shared/models/user.model';
import { AuthServices } from 'client/app/services/auth.service';
import { Categorias } from 'client/app/shared/models/categorias.model';
import { CategoriasForUser } from 'client/app/shared/models/listcategoriesforuser.model';

@Component({
  selector: 'app-authcat',
  templateUrl: './authcat.component.html',
  styleUrls: ['./authcat.component.css']
})
export class AuthcatComponent implements OnInit {
  isLoading = false;
  panelOpenState = false;
  ListUserCompradores : User[];
  ListCategorias: Categorias[];
  ListCategoriasUsuario: CategoriasForUser[];
  User:User;
  Categoria:Categorias;
  constructor(
    private auth: AuthServices,
    public toast: ToastComponent,
    private solicitudComp: SolicitudCompraService,) { }

  ngOnInit(): void {
    this.GetAllUserCompradores();
    this.getAllCategorias();
  }

  async GetAllUserCompradores(){
    try {
      this.ListUserCompradores = await this.solicitudComp.getAllUserCompradores();
      if(this.ListUserCompradores.length == 0){
        this.toast.setMessage("La lista de usuarios compradores esta vacia, valida informacion", "warning");
      }
    } catch (error) {
      if (error.status == 403 || error.status == 404) {
        this.auth.logout();
      }else{
        this.toast.setMessage(error.message,"danger");
      }
    } 
  }


  async getAllCategorias(){
    // console.log("buscamos las categorias");
    try {
      this.ListCategorias = await this.solicitudComp.getAllCategoriasnoUsadas();
      //console.log(this.ListCategorias)
      if(!this.ListCategorias){
        this.toast.setMessage("Error al recuperar las categorias", "warning");
      }
    } catch (error) {
      if (error.status == 403 || error.status == 404) {
        this.auth.logout();
      }else{
        this.toast.setMessage(error.message,"danger");
      }
      
    }
  }

  async getAllCategoriasAdmiistradasforUserComprador(){
    try {
      this.ListCategoriasUsuario = await this.solicitudComp.getListaCategoriasforUser(this.User.IdUsuario);
      //console.log(this.ListCategoriasUsuario);
      if(this.ListCategoriasUsuario.length == 0){
        this.toast.setMessage("La lista de categorias esta vacia para este Usuario","danger");
      }
    } catch (error) {
      if (error.status == 403 || error.status == 404) {
        this.auth.logout();
      }else{
        this.toast.setMessage(error.message,"danger");
      }
    }
  }

  async InsertNewcategory(){
    // console.log(this.User);
    // console.log(this.Categoria);
    try {
      let response = await this.solicitudComp.InsertNewCategoryforCoprador(this.User.IdUsuario, this.Categoria.IdCategoria);
      if(response != undefined || response != null){
        this.toast.setMessage(response, "success");
        this.getAllCategoriasAdmiistradasforUserComprador();
        this.getAllCategorias();
      }
    } catch (error) {
      if (error.status == 403 || error.status == 404) {
        this.auth.logout();
      }else{
        this.toast.setMessage(error.message,"danger");
      }
    }
  }

  async DeleteCategoria(categoriaselect:CategoriasForUser){
    // console.log(categoriaselect)
    try {
      let response = await this.solicitudComp.DeleteCategoriaforUser(categoriaselect.IdUsuario, categoriaselect.IdCategoria);
      if(response != undefined || response != null){
        this.getAllCategoriasAdmiistradasforUserComprador();
        this.getAllCategorias();
      }
    } catch (error) {
      if (error.status == 403 || error.status == 404) {
        this.auth.logout();
      }else{
        this.toast.setMessage(error.message,"danger");
      }
    }
  }

}
