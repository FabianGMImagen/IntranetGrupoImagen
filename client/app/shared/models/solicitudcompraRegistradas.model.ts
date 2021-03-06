export class SolicitudesCompraRegistradas{
    ID:number;
    FECHASOLICITUD:string;
    IdTipoSolicitud:number;
    TSNOMBRE:string;
    Acronimo:any;
    IdSol:number;
    IdStatusSolicitud:number;
    Statname:string;
    CATEGORIA:string;
    USUARIO:string;
    DIRECCION:string;
    IdEmpresa:number;
    EMPRESA:string;
    DIVISION:string;
    IdPlaza:string;
    Plaza:string;
    Imputacion:string;
    Posicion:string;
    CCosto:string;
    CMayor:string;
    Tipo:string;
    IdOrdenInterna
    OInterna:string;
    REQUIRENTE:string;
    NombreUsuario:string;
    Puesto:string;
    Email:string;
    Tel:string;
    Ext:string;
    Produccion:string;
    Moneda:string;
    Justificacion:string;
    MotivoRechazo?:string;
    RutaCotizacion:string;
    MONTO:number;
    //IdSAP:string;

    //valores para mostrar contenido en vista dependiendo si se cambio el satus de la solciitud y si se tiene registro de un SAP ID
    isSAP:boolean;
    isChangeStatus:boolean;

    buttonChild:boolean;
    Comprador:string;
    status:string;
}