import { Injectable } from '@angular/core';

import { Area } from '../shared/models/areas.model';

import { DirAuth } from '../shared/models/dirauth.model';


import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgxSoapService } from 'ngx-soap';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { Role } from '../shared/models/roles.model';

@Injectable()
export class DirAuthService {

    constructor(private http: HttpClient,
        private soap:NgxSoapService,
        private ngxXml2jsonService: NgxXml2jsonService) { }

        getall_Direcciones(): Observable<Area[]>{
            return this.http.get<Area[]>('/api/dirauth');
        }
    
        getall_RoleAuth(): Observable<Role[]>{
            return this.http.get<Role[]>('/api/roleauth');
        }
    
        insertExeptionAuth(TipoSolicitud:number,IdDireccion:number, IdRole:number){
            return this.http.get(`/api/insertexeptionauth/${TipoSolicitud}/${IdDireccion}/${IdRole}`);
        }
    
        listdiretionsexeptionauth(): Observable<DirAuth[]>{
            return this.http.get<DirAuth[]>('/api/lisrdirauth');
        }
        
        deleteexcepctionrole(IdAuth:number){
            return this.http.get(`/api/deleteauth/${IdAuth}`);
        }
}