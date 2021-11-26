import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor } from '../shared/models/proveedor.model';
import { Sociedad } from '../shared/models/sociedad.model';
import { TipoSolicitud } from '../shared/models/tipoSolicitud.model';
import { Medio } from '../shared/models/medio.model';
import { SucursalPlaza } from '../shared/models/sucursalplaza.model';
import { CuentaMayor } from '../shared/models/cuentamayor.model';
//import { CentroCostos } from '../shared/models/centrocostos.model';
import { Solicitud } from '../shared/models/solicitud.model';
import { Impuesto } from '../shared/models/impuesto.model';


@Injectable()
export class SolicitudService {

  constructor(private http: HttpClient) { }

  getAllProveedores():  Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>('/api/proveedores');
  }


 


}