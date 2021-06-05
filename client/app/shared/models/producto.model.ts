import { OrdenInterna } from '../models/ordeninterna.model';
import { CentroCostos } from './centrocostos.model';
import { CuentaMayor } from './cuentamayor.model';
import { ProductoHijos } from './productHijos.model';
export class Producto {
    IdPrduct:number;
    Cantidad:number;
    Precio:number;
    PriceView:string;
    Almacen:any;
    AlmacenName:any;
    //Centro:string;
    Material:any;
    MaterialName:any;
    CentroCosto:any;
    CentroCostoName:any;
    CuentaMayor:any;
    CuentaMayorName:any;
    IdOrdenEstadistica:any;
    OrdenEstadisticaName:any;
    GrupCompra:any;
    NameGrupoCompra:any;
    UnidadMedida:any;
    NameUnidadMedida:any;
    NumActivo:any;
    NameActivo:string;
    NumNeces:any;
    NameNeces:string;
    NombreSolPed:string;
    AcronimoSolPed:string;
    Espf:string;
    UsoProd:string;
    /*estos son los datos de los Items Hijos*/
    ChildsProducts:ProductoHijos[] = [];
    IdOrdenEstadisticaChild:any;
    NameOrdenEstadistica:any;
    IdCentroCostoChild:any;
    NameCentroCostoChild:any;
    IdCuentaMayorChild:any;
    NameCuentaMayorChild:any;
    UM:string;
    CantidadChild:number;
    PrecioChild:number;
    /*fin de iterms de hijos */ 
    
  }