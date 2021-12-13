import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './admin_Page/register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account_sol/account/account.component';
import { AdminComponent } from './admin_Page/admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DirauthComponent } from './admin_Page/dirauth/dirauth.component';

//implementing guard para con dicionar a una ruta
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';


import { ListadoSolicitudesComponent } from "./solicitud_Pedido/listado-solicitudes/listado-solicitudes.component";
import { SolicitudesComponent } from './solicitud_ConsumoInt/solicitudes-registradas-consumo-interno/solicitudes.component';
import { SolicitudComponent } from './admin_Page/solicitud-edit/solicitud.component';

import { SolicitudesRegistradasComponent } from './solicitud_Pedido/solicitudes-registradas/solicitudes-registradas.component';
import { SolicitudConsumo_Interno} from './solicitud_ConsumoInt/solicitud-consumo_Interno/solicitud-consumo_Interno.component';
import { DialogInfoComponent } from './solicitud_Pedido/dialog-info/dialog-info.component';
import { AuthcatComponent } from './admin_Page/authcat/authcat.component';
import { AdminSolicitudesComponent } from './admin_Page/admin-solicitudes/admin-solicitudes.component';
//import { SolicitudesTransitoComponent} from './solicitudes-transito/solicitudes-transito.component'





const routes: Routes = [
  
  { path: '', component: AboutComponent },
  { path: 'register', component: RegisterComponent, canActivate:[AuthGuardLogin, AuthGuardAdmin]},
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent, canActivate:[AuthGuardLogin] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuardLogin] },
  { path: 'admin', component: AdminComponent, canActivate:[AuthGuardLogin, AuthGuardAdmin] },
  { path: 'notfound', component: NotFoundComponent},
  { path: 'solicitud', component: AdminSolicitudesComponent, canActivate:[AuthGuardLogin] },
  { path: 'solicituderegistradasconsumoint', component: SolicitudesComponent, canActivate:[AuthGuardLogin] },  
  { path: 'listadoSolicitudes', component: ListadoSolicitudesComponent, canActivate:[AuthGuardLogin], data:{preload: true}},
  { path: 'solicitudesRegistradas', component: SolicitudesRegistradasComponent, canActivate:[AuthGuardLogin]},
  { path: 'RegistrarSolicitudCompras', component: SolicitudConsumo_Interno, canActivate:[AuthGuardLogin] },
  { path: 'dirauth',component: DirauthComponent, canActivate:[AuthGuardLogin, AuthGuardAdmin]},
  { path: 'dialog', component: DialogInfoComponent, canActivate:[AuthGuardLogin,]},
  { path: 'authcat', component: AuthcatComponent, canActivate:[AuthGuardLogin,]},
  { path: '**', redirectTo: '/notfound'},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ]
})

export class RoutingModule {}
