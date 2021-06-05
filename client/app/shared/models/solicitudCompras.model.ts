import { FormControl } from '@angular/forms';

export class SolicitudCompras {

  
    constructor() { 
        this.FechaDeSolicitud = new FormControl(new Date());
    }

    FechaDeSolicitud:FormControl;
    
    Solicitante:string;

    PorcentajeRetIVA:number;
    PorcentejeRetISR:number;    
    PorcentejeTasaIVA:number;    
    GastoExtra2:number;    

    
    Importe:number;    
    RetIVA:number;
    ImporteConIVA:number;
    RetISR:number;    
    
    
    Total:number;
    TotalConLetra:string;
    ImpuetoIVA:number;

    Presupuesto:number;
    Division:string;
    OrdenInterna:string;

    AutorizadorPor: string;    
    AutorizadorCuentasPorPagar: string;
    PersonalCuentasPorPagar: string;

    DescripcionConcepto: string;

    
  
}
  
