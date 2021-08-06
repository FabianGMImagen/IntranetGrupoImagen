import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
//import { d } from '@angular/core/src/render3';

@Injectable()
export class SAPInterceptor implements HttpInterceptor {
    constructor() {}



    intercept(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>>{
        //console.log("==================================== " +request.url );
                //funcion es validar si la url contiene o inica con /sap si es el caso hace una peticion http desde el server (NODEjs) 
                if(request.url.startsWith('/sap')){//las peticiones que comiencen con este /sap se enviaran al server 35
                    //esta es la ruta de el Node JS en el Seriver
                    var url = 'http://localhost:3000';
                    //var url= 'http://ecc-go.net.mx:8000';
                    //console.log("------INTERCEPTOR----------" + url+request.url);                              
                    //console.log(request.headers);
                    request = request.clone({
                        
                        
                                                                url:url+request.url,
                                                //Authorization: `Bearer ${this.auth.getToken()}`
                    //seguimiento de interceptor en app.ts (nodejs)                            
                                        });
                }

            return next.handle(request);
    }




}