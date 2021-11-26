import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ObservableLike } from 'rxjs';

import { User } from '../shared/models/user.model';
import { Role } from '../shared/models/roles.model';
import { Direccion } from '../shared/models/directions.model';
import { RoleSolConsumo } from '../shared/models/rolesol_consumo.mode';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }
  
  allrole(): Observable<Role[]>{
    return this.http.get<Role[]>('/api/role');
  }

  alldirection(): Observable<Direccion[]>{
    return this.http.get<Direccion[]>('/api/direccion');
  }

  filterUserDirections(IdDireccion): Observable<User[]>{
    return this.http.get<User[]>(`/api/filteruserDirections/${IdDireccion}`)
  }

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/user', user);
  }

  login(credentials): Observable<any> {
    return this.http.post('/api/login/', credentials);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  getDirecciones(): Observable<Direccion[]>{
    return this.http.get<Direccion[]>('/api/direcciones');
  } 

  countUsers(): Observable<number> {
    return this.http.get<number>('/api/users/count');
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>('/api/user', user);
  }

  getUser(user: User): Observable<User> {
    return this.http.get<User>(`/api/user/${user.IdUsuario}`);
  }

  editUser(user: User): Observable<any> {
    return this.http.put(`/api/user/${user.IdUsuario}`, user, { responseType: 'text' });
  }

  UpdateUser(dataUser:any) : Observable<any>{
    return this.http.post<any>('/api/updateusr', dataUser);
  }

  deleteUser(user: User): Observable<User> {
    return this.http.get(`/api/deleteuser/${user.IdUsuario}`);
  }

  createNewDireccion(NameDir:string){
    return this.http.get(`/api/createdir/${NameDir}`);
  }

  updateDIreccion(IdDir:number, UpdateDir:string){
    return this.http.get(`/api/updatedir/${IdDir}/${UpdateDir}`);
  }

  delelteDireccion(IdDir: number){
    return this.http.get(`/api/deletedir/${IdDir}`);
  }

  getalldirforuser(IdUser:number): Observable<Direccion[]>{
    return this.http.get<Direccion[]>(`/api/dirusr/${IdUser}`);
  }

  addDirectionForUser(IdUsr:number, IdDir:number) : Observable<any>{
    return this.http.get<any>(`/api/adddir/${IdUsr}/${IdDir}`);
  }

  deleteDirForUser(IdUsr:number, IdDir:number) : Observable<any>{
    return this.http.get<any>(`/api/deldir/${IdUsr}/${IdDir}`);
  }



  //seccion donde se agrega la infromacion de solcitud de Compras Internas
  getAllroleSolConsumo(): Observable<RoleSolConsumo[]>{
    return this.http.get<RoleSolConsumo[]>('/api/roleconsumo');
  }
}
