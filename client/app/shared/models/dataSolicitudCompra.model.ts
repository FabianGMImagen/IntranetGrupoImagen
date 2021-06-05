import { FormControl } from '@angular/forms';


export interface DataSolicitudCompra{
    IdEmpresa:Number;
    empresa:string;
    date:FormControl;
    nombreSolicitante:string;
}