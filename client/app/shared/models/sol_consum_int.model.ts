import { Empresa } from "./empresa.model";
import { SucursalPlaza } from './sucursalplaza.model';
import { Almacen } from './almacen.model';
import { Materiales } from './materiales.model';
import { CentroCostos } from './centrocostos.model';
import { CuentaMayor } from './cuentamayor.model';
import { UnidadMedida } from './umedida.model';
import { CentrosConsumoInt } from "./centrosconsumoint.model";
import { CaducidadConsumoInt } from "./caducidadconsumoint.model";
import { ProductoConsumoInterno } from './productosconsumointerno.model';
import { Area } from "./areas.model";

export class SolicitudConsumoInterno {

    IdUserSolicitante:number
    Area:Area;
    IdStatusSolConsumoInt:number;
    IdRole:number;
    Fecha:string;
    Empresa:Empresa;
    Centro:CentrosConsumoInt;
    Cantidad:number;
    Almacen:Almacen;
    Materiales: Materiales;
    CentroCostos:CentroCostos;
    Cuentamayor:CuentaMayor;
    Caducidad:CaducidadConsumoInt;
    UMedida:UnidadMedida;
    Justificacion:string = "";
    Productos :ProductoConsumoInterno[] = [];

}