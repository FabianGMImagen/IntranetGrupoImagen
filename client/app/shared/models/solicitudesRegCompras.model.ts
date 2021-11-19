import { FormControl } from '@angular/forms';

export class SolicitudesRegCompras {

  
    constructor() { 
        this.FechaDeSolicitud = new FormControl(new Date());
    }

    FechaDeSolicitud:FormControl;
    
     //FechaSolicitud: DateTimeFormat;
     TipoSolicitud: string;
     StatusSolicitud: string;
     UsuarioSolicita: string;
     Plaza: string;
     Ccostos: string;
    
  
}
  
