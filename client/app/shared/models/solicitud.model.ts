import { TipoSolicitud } from './tipoSolicitud.model';
import { Sociedad } from './sociedad.model';
import { Proveedor } from './proveedor.model';
import { FormControl, Validators } from '@angular/forms';
import { Medio } from './medio.model';

import { CuentaMayor } from './cuentamayor.model';
import { Impuesto } from './impuesto.model';
import { Empresa } from './empresa.model';
import { SucursalPlaza } from './sucursalplaza.model';
import { CentroCostos } from './centrocostos.model';
import { Area } from './areas.model';
import { Materiales } from './materiales.model';
import { Imputacion } from './imputacion.model';
import { Posiciones } from './posiciones.model';
import { Almacen } from './almacen.model';
import { Necesidad } from './necesidad.model';
import { GrupoArticulo } from './grupoarticulo.model';
import { GrupoCompra } from './grupocompra.model';
import { Producto } from './producto.model';
import { ProductoHijos } from './productHijos.model';
import { User } from '../models/user.model';
import { OrdenInterna } from '../models/ordeninterna.model';
import { UnidadMedida } from '../models/umedida.model';
import { Activo } from '../models/activo.model';
import { Moneda } from '../models/moneda.model';
import { DecimalPipe } from '@angular/common';
import { Categorias } from './categorias.model';

export class Solicitud { 
    
    
    Fecha:String;
    TipoSolicitud:number;
    EstatusSol:number;
    IdUsuario:number;
    Autorizador:User = new User();
    Area:Area = new Area();
    Empresa:Empresa = new Empresa();
    Plaza:SucursalPlaza = new SucursalPlaza();
    Categoria:Categorias = new Categorias();
    Imputacion:Imputacion = new Imputacion();
    Materiales: Materiales = new Materiales();
    Posicion:Posiciones = new Posiciones();
    CentroCostos:CentroCostos = new CentroCostos();
    Cuentamayor:CuentaMayor = new CuentaMayor();
    OrdenInterna:OrdenInterna = new OrdenInterna();
    OrdenEstadistica:OrdenInterna = new OrdenInterna();
    //Tipo:string;
    IdOrdenInterna:number;
    Usr:string;
    Puesto:string;
    Email:string;
    Tel:string;
    Ext:number;
    NombreProduccion:string;
    
    PuestoAutoriza:string;

    Almacen:Almacen = new Almacen();
    Necesidad:Necesidad = new Necesidad();
    GArticulo:GrupoArticulo = new GrupoArticulo();
    GCompra:GrupoCompra = new GrupoCompra();
    UMedida:UnidadMedida = new UnidadMedida();
    NActivo:Activo = new Activo();
    Moneda:Moneda = new Moneda();

    ImputacionItem:Imputacion = new Imputacion();
    

    Productos :Producto[] = [];
    //ProdView : Producto[] = [];
    //datos de productos para recuperar y pasarlos a un objeto y despues hacer push al arreglo de Productos.
    Cantidad:number;
    Precio:number;
    Espf:string;
    UsoBien:string;
    Justificacion:string;

    /*-----------------------------------------Variables Hijos de Productos para validaciones del lado del NODE ----------------------------------- */
        SelectedOEstadisiticaChild:OrdenInterna = new OrdenInterna();
        SelectedCentroCosotosChild:CentroCostos = new CentroCostos();
        SelectedCuentaMayorChild:CuentaMayor = new CuentaMayor();
    /*----------------------------------------- FIn de las Variables -------------------------------------------------------------------------------*/

    constructor(){
        this.Fecha
        this.IdUsuario = 0;
        this.NombreProduccion ="";
        this.Cantidad = 0;
        this.Precio = 1;
        this.Espf = "";
        this.UsoBien = ""; 
    }
    
  
}
  
