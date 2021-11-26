import { Injectable } from '@angular/core';
import { HttpClient, HttpXsrfTokenExtractor, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { NgxSoapService, Client, ISoapMethodResponse, WSSecurity,security } from 'ngx-soap';
import { NgxXml2jsonService } from 'ngx-xml2json';


import { SolicitudConsumoInterno } from '../shared/models/sol_consum_int.model';
import { SolicitudesConsumoIntRegistradas } from '../shared/models/sol_consumo_int_Registradas.model';

import { Area } from '../shared/models/areas.model';
import { ProductoConsumoInterno } from '../shared/models/productosconsumointerno.model';
import { StatusConsumoInterno } from '../shared/models/status_sol_consumo.model';
import { UsrAuthSolConsumoInt } from '../shared/models/usrauth_sol_consum_int.mode';
import { SolicitudesConsumoIntRegistradasAdmin } from '../shared/models/sol_consumoint_registradasAdmin.model';

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

    getAllSolicituConsumoIntforDir_Status_Role(IdRole:number, IdDireccion:number, IdStatus:number){
        return this.http.get<SolicitudesConsumoIntRegistradas[]>(`/api/allsolconsumointforstatusrole/${IdRole}/${IdDireccion}/${IdStatus}`).toPromise();
    }

    getAlldatauserauthSolConsumo(IdUsuario:number, IdRole:number){
        return this.http.get(`/api/alldatauserauthsolconsumo/${IdUsuario}/${IdRole}`);
    }

    updateSolicitudConsumoInt(IdSolicitudConsumo:number, IdNewStatus:number){
        return this.http.get<UsrAuthSolConsumoInt>(`/api/updatesatussolconfromlocal/${IdSolicitudConsumo}/${IdNewStatus}`).toPromise();
    }

    sendEmailNewSolicitudConsumo(IdSolicitud:number, StatusSol:string, NameSolicitante:string, Nameauth:string, EmailAuth:string): any{
        return this.http.post<any>('/api/sendnewemailsolconsumo',{IdSolicitud, StatusSol ,NameSolicitante, Nameauth, EmailAuth});
    }

    sendEmailSolicitudConsumoForRoles(IdSolcitud:number, StatusSol:number, NameStatus:string, NameSolicitante:string, NameAuth:string, EmailAuth:string, EmailSolicitante:string){
        console.log(IdSolcitud, StatusSol, NameSolicitante, NameAuth, EmailAuth, EmailSolicitante);
        return this.http.post<any>('/api/sendemailsforroles', {IdSolcitud, StatusSol,NameStatus, NameSolicitante, NameAuth, EmailAuth, EmailSolicitante}).toPromise();
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
    
    getAllStatusforRoleConsumoInterno(IdRole:number){
        return this.http.get<StatusConsumoInterno[]>(`/api/statusforrole/${IdRole}`).toPromise();
    }

    getAllSolConsumoInternoforAdmin(){
        return this.http.get<SolicitudesConsumoIntRegistradasAdmin[]>('/api/allsolconsumoadmin').toPromise();
    }

    getAllStatusSolConsumo(){
        return this.http.get<StatusConsumoInterno[]>('/api/allstatusadmin').toPromise();
    }

    ChangedStatusAdmin(IdSolicitud:number, IdStatus:number){
        return this.http.get<any>(`/api/changedstatusadmin/${IdSolicitud}/${IdStatus}`).toPromise();
    }
}
