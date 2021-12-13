import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule} from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
import { UserService } from './services/user.service';
import { AuthServices } from './services/auth.service';
import { BrowserModule } from '@angular/platform-browser';

import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './admin_Page/register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account_sol/account/account.component';
import { AdminComponent } from './admin_Page/admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { FileUploader } from 'ng2-file-upload';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


//librerias importadas para conectarse a webservice SAP por medio de SOPA
import { NgxSoapModule } from 'ngx-soap';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SAPInterceptor } from './interceptors/interceptorsap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
//import { NgxXml2jsonService } from 'ngx-xml2json';
//---------libs de SAP SOAP

import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SolicitudesComponent } from './solicitud_ConsumoInt/solicitudes-registradas-consumo-interno/solicitudes.component';

import { ListadoSolicitudesComponent } from "./solicitud_Pedido/listado-solicitudes/listado-solicitudes.component";

import { SolicitudComponent } from './admin_Page/solicitud-edit/solicitud.component';
import { SolicitudesRegistradasComponent } from './solicitud_Pedido/solicitudes-registradas/solicitudes-registradas.component';

import { SolicitudService } from './services/solicitud.service';

import { SolicitudRegService } from './services/solicitudreg.service';
import { SolicitudConsumo_Interno } from './solicitud_ConsumoInt/solicitud-consumo_Interno/solicitud-consumo_Interno.component';

import { MatDialogModule, MatPaginatorIntl } from "@angular/material";

import { SolicitudCompraService } from './services/solicitudcompra.service';
import { SolicitudConsumoService } from './services/solicitudconsumo.service';


import { DirauthComponent } from './admin_Page/dirauth/dirauth.component';

import { DirAuthService } from '../app/services/dirauth.service';
import { AuthcatComponent } from './admin_Page/authcat/authcat.component';
//import { SignaturePadModule } from 'angular2-signaturepad';
//import { SignaturePadModule } from 'angular2-signaturepad';
//import { AngularSignaturePadModule } from 'angular-signature-pad';
//import { AngularSignaturePadModule } from 'angular-signature-pad/angular-signature-pad';
//import { SignaturePadModule } from 'angular2-signature-pad';

import { SignaturePadModule } from '@ng-plus/signature-pad';
import { NgxUpperCaseDirectiveModule } from 'ngx-upper-case-directive';
import { DialogInfoComponent } from './solicitud_Pedido/dialog-info/dialog-info.component';


//libreria de infragistics------frame de exel

import { AccountSolConsumoListComponent } from './account_sol/account-sol-consumo-list/account-sol-consumo-list.component';
import { DialogDetalleSolConsumoInternoComponent } from './dialogs/dialog-detalle-sol-consumo-interno/dialog-detalle-sol-consumo-interno.component';
// import { DialogUpdateDatageneralSolConsumoComponent } from './dialogs/dialog-update-datageneral-sol-consumo/dialog-update-datageneral-sol-consumo.component';
import { DialogUpdateProductsdataSolConsumoComponent } from './dialogs/dialog-update-productsdata-sol-consumo/dialog-update-productsdata-sol-consumo.component';
import { AdminCategoriaComponent } from './admin_Page/admin-categoria/admin-categoria.component';
import { DialogNewCategoryComponent } from './dialogs/dialog-new-category/dialog-new-category.component';
import { DialogDeleteCategoryComponent } from './dialogs/dialog-delete-category/dialog-delete-category.component';
import { DialogDeleteUserComponent } from './dialogs/dialog-delete-user/dialog-delete-user.component';
import { DialogDeleteDirComponent } from './dialogs/dialog-delete-dir/dialog-delete-dir.component';
import { AdminSolicitudesComponent } from './admin_Page/admin-solicitudes/admin-solicitudes.component';
import { SolconsumointEditComponent } from './admin_Page/solconsumoint-edit/solconsumoint-edit.component';
import { DialogAdvertenciaUpdateSolpedidoComponent } from './dialogs/dialog-advertencia-update-solpedido/dialog-advertencia-update-solpedido.component';
import { DialogUploadEspesificacionComponent } from './dialogs/dialog-upload-espesificacion/dialog-upload-espesificacion.component';
import { CustomPaginator } from './custom-paginator';
import { DialogHistorySolpedidoComponent } from './dialogs/dialog-history-solpedido/dialog-history-solpedido.component';


export function tokenGetter() {
  return localStorage.getItem('token');
}



@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    AccountComponent,
    AdminComponent,
    NotFoundComponent,
    
    ListadoSolicitudesComponent,
    
    SolicitudComponent,
    SolicitudesRegistradasComponent,
    DirauthComponent,
    DialogInfoComponent,

    SolicitudConsumo_Interno,
    SolicitudesComponent,
    AccountSolConsumoListComponent,
    DialogDetalleSolConsumoInternoComponent,
    DialogUpdateProductsdataSolConsumoComponent,
    AuthcatComponent,
    AdminCategoriaComponent,
    DialogNewCategoryComponent,
    DialogDeleteCategoryComponent,
    DialogDeleteUserComponent,
    DialogDeleteDirComponent,
    AdminSolicitudesComponent,
    SolconsumointEditComponent,
    DialogAdvertenciaUpdateSolpedidoComponent,
    DialogUploadEspesificacionComponent,
    DialogHistorySolpedidoComponent,
  ],
  entryComponents:[
    DialogInfoComponent,
    
  ],
  imports: [
    MatDialogModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    FileUploadModule,
    RoutingModule,
    SharedModule,
    FileUploadModule,
    PdfViewerModule,
    NgxMatSelectSearchModule,
    SignaturePadModule,
    //IgxGridModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // whitelistedDomains: ['localhost:3000', 'localhost:4200']
      }
    }),
    ModalModule.forRoot(),
    MomentModule,
    NgxSoapModule,
    NgIdleKeepaliveModule.forRoot(),
    NgxUpperCaseDirectiveModule,
    NgbModule,
    //AngularSignaturePadModule.forRoot()
  ],
  providers: [
    AuthServices,
    AuthGuardLogin,
    AuthGuardAdmin,
    UserService,
    SolicitudCompraService,
    SolicitudConsumoService,
    SolicitudService,
    SolicitudRegService,
    DirAuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SAPInterceptor,
      multi: true
    },
    {
      provide: MatPaginatorIntl,
      useClass: CustomPaginator
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
 
})

export class AppModule { }
