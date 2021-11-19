import { Childs } from "./childs.model";

export class Detallesol {
  IDOINT:any;
  OINT:any;
  IdProducto:number;
  CANTIDAD:number;
  PRECIO:number;
  Precio:number;
  IdAlmacen:any;
  AlmacenName:any;
  IdMaterial:any;  
  MaterialName:any;
  IdCentroCostos:any;
  CECO:any;
  IdCuentaMayor:any;
  CMAYOR:any;
  IdGrupoCompra:any;
  GrupoCompraName:any;
  IdUnidadMedida:any;
  MEDIDA:any;
  IdNumeroActivo:any;
  ACTFIJ:any;
  IdNecesidad:any;
  NumeroNecesidadName:any;
  EspGenerales:string;
  BIENOSERV:string
  SubHijos:Childs[] = []
  isOpen:boolean = false;
  butonMoreChilds:boolean = false;
}
  