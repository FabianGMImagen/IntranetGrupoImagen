import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolicitudesReg } from '../shared/models/solicitudesReg.model';
import { StatusSolicitud } from '../shared/models/statussolicitud.model';

@Injectable()
export class SolicitudRegService {

  constructor(private http: HttpClient) { }

  getAllSolicitudesRegAdmin():  Observable<SolicitudesReg[]> {
    return this.http.get<SolicitudesReg[]>('/api/soladmin');
  }

  getAllStatusSOlicituPedido(): Observable<StatusSolicitud[]>{
    return this.http.get<StatusSolicitud[]>('/api/statusadmin');
  }

  UpdateStatusAdmin(IdSolicitud:any, IdStatusUpdate:any){
    console.log("+´+´+´+´+´+´+´+´+´+´+--->" + IdSolicitud +"-------------"+ IdStatusUpdate);
    //return this.http.get('/api/upadmin/');
    return this.http.get(`/api/upstatusAdmin/${IdSolicitud}/${IdStatusUpdate}`);
    //return this.http.get(`/api/getUserValida/${IdDireccion}/${IdRole}`);
  }
}