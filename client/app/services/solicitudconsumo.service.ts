import { Injectable } from '@angular/core';
import { HttpClient, HttpXsrfTokenExtractor, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { NgxSoapService, Client, ISoapMethodResponse, WSSecurity,security } from 'ngx-soap';
import { NgxXml2jsonService } from 'ngx-xml2json';


import { SolicitudConsumoInterno } from '../shared/models/sol_consum_int.model';
import { SolicitudesConsumoIntRegistradas } from '../shared/models/sol_consumo_int_Registradas.model';

import { Area } from '../shared/models/areas.model';
import { ProductoConsumoInterno } from '../shared/models/productosconsumointerno.model';

@Injectable()
export class SolicitudConsumoService {

    constructor(private http: HttpClient,
        private soap:NgxSoapService,
        private ngxXml2jsonService: NgxXml2jsonService) { }

    getAreasfoUser(IdUser:number): Observable<Area[]> {
        return this.http.get<Area[]>(`/api/areaconsumoInt/${IdUser}`)
    }

    // getAllSolConsumoInternoforUser(IdUser:number): Observable<SolicitudConsumoInterno[]>{
    //     console.log("user para hacer consultas------->" + IdUser);
    //     return this.http.get<SolicitudConsumoInterno[]>(`/api/solicitudesconsumointernoforuser/${IdUser}`);
    // }

    insertNewSolConsumoInterno(DataSolConsum:SolicitudConsumoInterno){
        return this.http.post('/api/insertnewsolconsumo', DataSolConsum);
    }

    getAllSolicituConsumoIntforDir_Status_Role(IdRole:number, IdDireccion:number, IdStatus:number): Observable<SolicitudesConsumoIntRegistradas>{
        return this.http.get<SolicitudesConsumoIntRegistradas>(`/api/allsolconsumoint/${IdRole}/${IdDireccion}/${IdStatus}`);
    }

    getAlldatauserauthSolConsumo(IdUsuario:number, IdRole:number){
        return this.http.get(`/api/alldatauserauthsolconsumo/${IdUsuario}/${IdRole}`);
    }

    sendEmailNewSolicitudConsumo(IdSolicitud:number, StatusSol:string, NameSolicitante:string, Nameauth:string, EmailAuth:string): any{
        return this.http.post<any>('/api/sendnewemailsolconsumo',{IdSolicitud, StatusSol ,NameSolicitante, Nameauth, EmailAuth});
    }

    validaRolExceptionForDir(IdDireccion:number){
        return this.http.get(`/api/dirauthforauthconsumoInt/${IdDireccion}`);
    }

    getAllSolConsumoInternoforUsuario(IdUser:number, IdRole:number){
        return this.http.get<SolicitudesConsumoIntRegistradas[]>(`/api/solconsumointforuser/${IdUser}/${IdRole}`).toPromise();
    }

    getDataInicialforUpdate(IdSol:number){
        return this.http.get<any[]>(`/api/inicialdataforupdate/${IdSol}`).toPromise();
    }

    getAllProductosforSolicitudConsumo(IdSolicitud:number){
        return this.http.get<ProductoConsumoInterno[]>(`/api/productosforsolconsumoint/${IdSolicitud}`).toPromise();
    }
}
