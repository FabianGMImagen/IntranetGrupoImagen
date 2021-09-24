import { Injectable } from '@angular/core';
import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { Empresa } from '../shared/models/empresa.model';
import { SolicitudesRegCompras } from '../shared/models/solicitudesRegCompras.model';
import { CentroCostos } from '../shared/models/centrocostos.model';
import { CuentaMayor } from '../shared/models/cuentamayor.model';
import { SucursalPlaza } from '../shared/models/sucursalplaza.model';
import { Imputacion } from '../shared/models/imputacion.model';
import { Posiciones } from '../shared/models/posiciones.model';
import { Materiales } from '../shared/models/materiales.model';
import { Almacen } from '../shared/models/almacen.model';
import { Activo } from '../shared/models/activo.model';
import { Necesidad } from '../shared/models/necesidad.model';
import { GrupoArticulo } from '../shared/models/grupoarticulo.model';
import { GrupoCompra } from '../shared/models/grupocompra.model';
import { Producto } from '../shared/models/producto.model';
import { User } from '../shared/models/user.model';
import { OrdenInterna } from '../shared/models/ordeninterna.model';
import { UnidadMedida } from '../shared/models/umedida.model';
import { Direccion } from '../shared/models/directions.model';
import { Moneda } from '../shared/models/moneda.model';
import { CentrosConsumoInt } from '../shared/models/centrosconsumoint.model';
import { Childs } from '../shared/models/childs.model';
import { CaducidadConsumoInt } from '../shared/models/caducidadconsumoint.model';

import { Area } from '../shared/models/areas.model';
import { Solicitud } from '../shared/models/solicitud.model';
import { StatusSolicitud } from '../shared/models/statussolicitud.model';
import { Detallesol } from '../shared/models/detallesol.model';

import { SolicitudesCompraRegistradas } from '../shared/models/solicitudcompraRegistradas.model';
import { SolicitudPedidoSAP } from '../shared/models/solpedSAP.model';
import { DataSAP } from '../shared/models/dataSAP.model';
import { MensajesSolPed } from '../shared/models/mensajessolped.model';


// import { Pazas } from '../shared/models/'

import { Options } from 'selenium-webdriver/opera';

//importacion de ngx-soap para hacer peticiones a SERVICIOS SOAP para SAP
import { NgxSoapService, Client, ISoapMethodResponse, WSSecurity, security } from 'ngx-soap';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { Categorias } from '../shared/models/categorias.model';
import { CategoriasForUser } from '../shared/models/listcategoriesforuser.model';







@Injectable()
export class SolicitudCompraService {

  SolPed: SolicitudPedidoSAP = new SolicitudPedidoSAP();
  ListItemsSAP: SolicitudPedidoSAP;
  DataInsertSAP: DataSAP = new DataSAP();

  constructor(private http: HttpClient,
    private soap: NgxSoapService,
    private ngxXml2jsonService: NgxXml2jsonService) { }


  // //pruebas de conexion a un webservice OSA
  // getwebservice(): Observable<webService[]>{
  //   console.log("recuperando los datos de el webservice");
  //   return this.http.get<webService[]>(this.url);
  // }

  getEmpresas(): Array<Empresa> {
    //return this.http.get<Empresa[]>('/api/empresas');
    //console.log("---------------------dentro de el Servico  para Sucursales/Empresas--------------------");

    var Listws = [];
    var Listwebser = new Array<Empresa>();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml'

      })
    };
    //http://smxcrqim.grupoempresarialangeles.com.mx:8025/sap/bc/srt/wsdl/flv_10002A10MAD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320
    //var url ='/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs?sap-client=200';
    //var url = '/sap/bc/srt/wsdl/flv_10002A10M1D1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/300/zws_sap_in/zws_sap_in?sap-client=300';
    //var url = '/sap/bc/srt/wsdl/flv_10002A10MAD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320'; //QIM CALIDAD
    var url = '/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    //Parametros para enviar servicio, se manda vacios para que nos regrese todas las empresas
    const parametros = {
      BUKRS: ''
    };


    this.soap.createClient(url, httpOptions).then(client => {
      //console.log("***************SERVICEEEEEEEEEEEEEEEEEE**************"+client);

      //client.setEndpoint("/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs");
      //client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/300/zws_sap_in/zws_sap_in");
      client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in");
      (<any>client).ZGET_COMPANIES(parametros).subscribe((res: ISoapMethodResponse) => {

        //console.log("message ********SERVICIIIIOO 11111111111111******* " + res.responseBody);


        var separadorini = '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap-env:Header/>' +
          '<soap-env:Body>' +
          '<n0:ZGET_COMPANIESResponse xmlns:n0="urn:sap-com:document:sap:rfc:functions">'+
          '<MENSAJE/>';

        var separadorfin = '</n0:ZGET_COMPANIESResponse>' +
          '</soap-env:Body>' +
          '</soap-env:Envelope>';

        try {
          var split1 = res.responseBody.split(separadorini);
          //le hacemos un split para quitarle la parte que no nos sirve separadorini
          //console.log("SPLIIITEADOOO 1111111111     "+split1[0] + "------------" + split1[1]);
          var cadena = split1[1].toString();
          //volvemos a hacer un split para quitar la parte final separador2
          var split2 = cadena.split(separadorfin);
          //console.log("SPLITEEEADOOO 2222222222    " + split2[0] + "-------------" + split2[0]);
          //convertimos de nuevo el arreglo en cadena para quitar las comas
          var cadena2 = split2[0].toString();
  
          var NuevoXML = cadena2.trim();
          //console.log("---XML FORMATEADO--" + NuevoXML);
          var parse = new DOMParser();
          var xml = parse.parseFromString(NuevoXML, 'text/xml');
          //console.log(xml);
          var json = this.ngxXml2jsonService.xmlToJson(xml);
          //FUNCION PARA RECORRER LAS LLAVEZ DE EL OBJETO Y AL ENCONTRAR UN NOMBRE DE LLAVE CORRECTO AGREGA LOS VALORES A UN NUEVO ARREGLO
          
        } catch (error) {
          console.log(error);
          return null;
        }

        listProps(json, 3);

        function listProps(obj, level) {
          level = level || 0;
          for (var property in obj) {
            //console.log(level+' - '.repeat(level) + property);

            if (property == 'BUKRS') {
              //console.log(Object.entries(obj));

              var id = Object.values(obj)[0];
              var name = Object.values(obj)[1].toString();
              //console.log("ESTE ES EL ID-> " + id + "  ESTE ES EL NOMBRE--> " + name);
              Listws.push(id);
              Listws.push(name);
              //console.log("---------------"+Listws.length);

            }
            if (typeof obj[property] === 'object') {
              listProps(obj[property], ++level);

            }
          }
        }
        //iteramos el arreglo fuera de la funcion para poder pasarlo a un arreglo de modelo y retornar el array para su uso
        var vuelta = 1;
        for (let val of Listws) {
          //console.log("VVVVVVVVVVVVVVVVVVV"+vuelta+"VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          if (vuelta % 2 == 1) {
            //console.log("es impar" + val);
            var acronimo = val;
            //console.log(acronimo);
            vuelta++;
          } else if (vuelta % 2 == 0) {
            var ws = new Empresa();
            //console.log("es par" + val);
            ws.Bukrs = acronimo;
            ws.Butxt = val;
            //console.log(ws.Butxt);

            Listwebser.push(ws);
            //console.log("*/*/*/*"+ Listwebser.length);
            vuelta++;
          }

        }
      });

    });
    return Listwebser;
  }

  getAllAreas(IdUser: number): Observable<Area[]> {
    return this.http.get<Area[]>(`/api/area/${IdUser}`);
  }

  getCentoCosto(idempresa: Empresa, idplaza: SucursalPlaza): Array<CentroCostos> {
    //console.log("---------------------dentro de el Servico  para Centros de Costo--------------------" + idempresa.Bukrs + "  ---  " + idplaza.IdPlaza);
    var ListCcos = [];
    var ListCCos = new Array<CentroCostos>();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml'

      })
    };

    //var url = '/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    var url = '/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';

    const parametros = {
      BUKRS: idempresa.Bukrs,
      GSBER: idplaza.IdPlaza
    };


    this.soap.createClient(url, httpOptions).then(client => {
      //console.log("***************SERVICEEEEEEEEEEEEEEEEEE**************"+client);

      //client.setEndpoint("/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs");
      client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in");
      (<any>client).ZGET_CECOS(parametros).subscribe((res: ISoapMethodResponse) => {

        //console.log("message ********SERVICIIIO PLAZA******* " + res.responseBody);


        var separadorini = '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap-env:Header/>' +
          '<soap-env:Body>' +
          '<n0:ZGET_CECOSResponse xmlns:n0="urn:sap-com:document:sap:rfc:functions">' +
          '<MENSAJE/>';

        var separadorfin = '</n0:ZGET_CECOSResponse>' +
          '</soap-env:Body>' +
          '</soap-env:Envelope>';

        try {
          var split1 = res.responseBody.split(separadorini);
          //le hacemos un split para quitarle la parte que no nos sirve separadorini
          //console.log("SPLIIITEADOOO 1111111111     "+split1[0] + "------------" + split1[1]);
          var cadena = split1[1].toString();
          //volvemos a hacer un split para quitar la parte final separador2
          var split2 = cadena.split(separadorfin);
          //console.log("SPLITEEEADOOO 2222222222    " + split2[0] + "-------------" + split2[0]);
          //convertimos de nuevo el arreglo en cadena para quitar las comas
          var cadena2 = split2[0].toString();
  
          var NuevoXML = cadena2.trim();
          //console.log("---XML FORMATEADO--" + NuevoXML);
          var parse = new DOMParser();
          var xml = parse.parseFromString(NuevoXML, 'text/xml');
  
          //console.log(xml);
          var json = this.ngxXml2jsonService.xmlToJson(xml);
          //FUNCION PARA RECORRER LAS LLAVEZ DE EL OBJETO Y AL ENCONTRAR UN NOMBRE DE LLAVE CORRECTO AGREGA LOS VALORES A UN NUEVO ARREGLO
          
        } catch (error) {
          console.log(error);
          return null;
        }

        listProps(json, 3);

        function listProps(obj, level) {
          level = level || 0;
          for (var property in obj) {
            //console.log(level+' - '.repeat(level) + property);

            if (property == 'KOSTL') {
              //console.log(Object.entries(obj));

              var idcco = Object.values(obj)[0];
              var namececo = Object.values(obj)[1].toString();
              //console.log("ESTE ES EL ID-> " + id + "  ESTE ES EL NOMBRE--> " + name);
              ListCcos.push(idcco);
              ListCcos.push(namececo);
              //console.log("---------------"+ListCcos.length);

            } else if (property == 'MENSAJE') {
              //console.log(Object.entries(obj));
              var objet = Object.values(obj)[0];
              //console.log(Object.values(objet)[1]);
              var err = Object.values(objet)[1];
              ListCcos.push(err);
            }
            if (typeof obj[property] === 'object') {
              listProps(obj[property], ++level);

            }
          }
        }
        //iteramos el arreglo fuera de la funcion para poder pasarlo a un arreglo de modelo y retornar el array para su uso
        var vuelta = 1;
        for (let val of ListCcos) {
          //console.log("VVVVVVVVVVVVVVVVVVV"+vuelta+"VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          if (vuelta % 2 == 1) {
            //console.log("es impar   " + val + " tiene de valores" + ListCcos.length);
            var acronimo = val;

            //console.log(acronimo);
            vuelta++;
          } else if (vuelta % 2 == 0) {
            var ws = new CentroCostos();
            //console.log("es par  " + val);
            ws.IdCentroCosto = acronimo;
            ws.Nombre = val;
            //console.log(ws.Butxt);

            ListCCos.push(ws);
            //console.log("*/*/*/*"+ ListCCos.length);
            vuelta++;
          }
        }


      });

    });
    return ListCCos;

    //return this.http.get<CentroCostos[]>('/api/costos');
  }

  getCentoCostoConsumiInterno(IdEmpresa: Empresa, IdCentro: string): Array<CentroCostos> {
    //console.log("---------------------dentro de el Servico  para Centros de Costo--------------------" + idempresa.Bukrs + "  ---  " + idplaza.IdPlaza);
    var ListCcos = [];
    var ListCCos = new Array<CentroCostos>();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml'

      })
    };

    //var url = '/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    var url = '/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';

    const parametros = {
      BUKRS: IdEmpresa.Bukrs,
      GSBER: IdCentro
    };


    this.soap.createClient(url, httpOptions).then(client => {
      //console.log("***************SERVICEEEEEEEEEEEEEEEEEE**************"+client);

      //client.setEndpoint("/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs");
      client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in");
      (<any>client).ZGET_CECOS(parametros).subscribe((res: ISoapMethodResponse) => {

        //console.log("message ********SERVICIIIO PLAZA******* " + res.responseBody);


        var separadorini = '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap-env:Header/>' +
          '<soap-env:Body>' +
          '<n0:ZGET_CECOSResponse xmlns:n0="urn:sap-com:document:sap:rfc:functions">' +
          '<MENSAJE/>';

        var separadorfin = '</n0:ZGET_CECOSResponse>' +
          '</soap-env:Body>' +
          '</soap-env:Envelope>';

        try {
          var split1 = res.responseBody.split(separadorini);
          //le hacemos un split para quitarle la parte que no nos sirve separadorini
          //console.log("SPLIIITEADOOO 1111111111     "+split1[0] + "------------" + split1[1]);
          var cadena = split1[1].toString();
          //volvemos a hacer un split para quitar la parte final separador2
          var split2 = cadena.split(separadorfin);
          //console.log("SPLITEEEADOOO 2222222222    " + split2[0] + "-------------" + split2[0]);
          //convertimos de nuevo el arreglo en cadena para quitar las comas
          var cadena2 = split2[0].toString();
  
          var NuevoXML = cadena2.trim();
          //console.log("---XML FORMATEADO--" + NuevoXML);
          var parse = new DOMParser();
          var xml = parse.parseFromString(NuevoXML, 'text/xml');
  
          //console.log(xml);
          var json = this.ngxXml2jsonService.xmlToJson(xml);
          //FUNCION PARA RECORRER LAS LLAVEZ DE EL OBJETO Y AL ENCONTRAR UN NOMBRE DE LLAVE CORRECTO AGREGA LOS VALORES A UN NUEVO ARREGLO
          
        } catch (error) {
          
        }

        listProps(json, 3);

        function listProps(obj, level) {
          level = level || 0;
          for (var property in obj) {
            //console.log(level+' - '.repeat(level) + property);

            if (property == 'KOSTL') {
              //console.log(Object.entries(obj));

              var idcco = Object.values(obj)[0];
              var namececo = Object.values(obj)[1].toString();
              //console.log("ESTE ES EL ID-> " + id + "  ESTE ES EL NOMBRE--> " + name);
              ListCcos.push(idcco);
              ListCcos.push(namececo);
              //console.log("---------------"+ListCcos.length);

            } else if (property == 'MENSAJE') {
              //console.log(Object.entries(obj));
              var objet = Object.values(obj)[0];
              //console.log(Object.values(objet)[1]);
              var err = Object.values(objet)[1];
              ListCcos.push(err);
            }
            if (typeof obj[property] === 'object') {
              listProps(obj[property], ++level);

            }
          }
        }
        //iteramos el arreglo fuera de la funcion para poder pasarlo a un arreglo de modelo y retornar el array para su uso
        var vuelta = 1;
        for (let val of ListCcos) {
          //console.log("VVVVVVVVVVVVVVVVVVV"+vuelta+"VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          if (vuelta % 2 == 1) {
            //console.log("es impar   " + val + " tiene de valores" + ListCcos.length);
            var acronimo = val;

            //console.log(acronimo);
            vuelta++;
          } else if (vuelta % 2 == 0) {
            var ws = new CentroCostos();
            //console.log("es par  " + val);
            ws.IdCentroCosto = acronimo;
            ws.Nombre = val;
            //console.log(ws.Butxt);

            ListCCos.push(ws);
            //console.log("*/*/*/*"+ ListCCos.length);
            vuelta++;
          }
        }


      });

    });
    return ListCCos;

    //return this.http.get<CentroCostos[]>('/api/costos');
  }

  getCuentaMayor(idEmpresa: Empresa, IdTipoSol: string): Array<CuentaMayor> {
    //return this.http.get<CuentaMayor[]>('/api/cmayor');
    console.log("---------------------dentro de el Servico  para Cuenta de Mayor--------------------" + idEmpresa.Bukrs + " Tipo de SOlicitud---> " + IdTipoSol);

    var ListCta = [];
    var ListCtaMa = new Array<CuentaMayor>();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml'

      })
    };

    //var url = '/sap/bc/srt/wsdl/flv_10002A10MAD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    var url = '/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    const parametros = {
      BUKRS: idEmpresa.Bukrs,
      SOL_TYPE: IdTipoSol
    };

    this.soap.createClient(url, httpOptions).then(client => {
      //console.log("***************SERVICEEEEEEEEEEEEEEEEEE**************"+client);

      //client.setEndpoint("/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs");
      client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in");
      (<any>client).ZGET_ACCOUNTS(parametros).subscribe((res: ISoapMethodResponse) => {

        //console.log("message ********SERVICIIIO PLAZA******* " + res.responseBody);


        var separadorini = '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap-env:Header/>' +
          '<soap-env:Body>' +
          '<n0:ZGET_ACCOUNTSResponse xmlns:n0="urn:sap-com:document:sap:rfc:functions">' +
          '<MENSAJE/>';

        var separadorfin = '</n0:ZGET_ACCOUNTSResponse>' +
          '</soap-env:Body>' +
          '</soap-env:Envelope>';

        try {
          
          var split1 = res.responseBody.split(separadorini);
          //le hacemos un split para quitarle la parte que no nos sirve separadorini
          //console.log("SPLIIITEADOOO 1111111111     "+split1[0] + "------------" + split1[1]);
          var cadena = split1[1].toString();
          //volvemos a hacer un split para quitar la parte final separador2
          var split2 = cadena.split(separadorfin);
          //console.log("SPLITEEEADOOO 2222222222    " + split2[0] + "-------------" + split2[0]);
          //convertimos de nuevo el arreglo en cadena para quitar las comas
          var cadena2 = split2[0].toString();
  
          var NuevoXML = cadena2.trim();
          //console.log("---XML FORMATEADO--" + NuevoXML);
          var parse = new DOMParser();
          var xml = parse.parseFromString(NuevoXML, 'text/xml');
  
          //console.log(xml);
          var json = this.ngxXml2jsonService.xmlToJson(xml);
          //FUNCION PARA RECORRER LAS LLAVEZ DE EL OBJETO Y AL ENCONTRAR UN NOMBRE DE LLAVE CORRECTO AGREGA LOS VALORES A UN NUEVO ARREGLO
        } catch (error) {
          
        }

        listProps(json, 3);

        function listProps(obj, level) {
          level = level || 0;
          for (var property in obj) {
            //console.log(level+' - '.repeat(level) + property);

            if (property == 'SAKNR') {
              //console.log(Object.entries(obj));

              var idplaza = Object.values(obj)[0];
              var nameplaza = Object.values(obj)[1].toString();
              //console.log("ESTE ES EL ID-> " + id + "  ESTE ES EL NOMBRE--> " + name);
              ListCta.push(idplaza);
              ListCta.push(nameplaza);
              //console.log("---------------"+ListPlza.length);

            }
            if (typeof obj[property] === 'object') {
              listProps(obj[property], ++level);

            }
          }
        }
        //iteramos el arreglo fuera de la funcion para poder pasarlo a un arreglo de modelo y retornar el array para su uso

        var vuelta = 1;
        for (let val of ListCta) {
          //console.log("VVVVVVVVVVVVVVVVVVV"+vuelta+"VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          if (vuelta % 2 == 1) {
            //console.log("es impar" + val);
            var acronimo = val;
            //console.log(acronimo);
            vuelta++;
          } else if (vuelta % 2 == 0) {
            var ctamayor = new CuentaMayor();
            //console.log("es par" + val);
            ctamayor.IdCuentaMayor = acronimo;
            ctamayor.Nombre = val;
            //console.log(ws.Butxt);

            ListCtaMa.push(ctamayor);
            //console.log("*/*/*/*"+ ListPlaza.length);
            vuelta++;
          }

        }


      });

    });
    return ListCtaMa;






  }

  getAllSucursalPlazaByIdEmpresa(Id: Empresa): Array<SucursalPlaza> {
    //return this.http.get<SucursalPlaza[]>(`/api/plaza/${Id.IdEmpresa}`);
    console.log("---------------------dentro de el Servico  para Plazas--------------------" + Id.Bukrs);

    var ListPlza = [];
    var ListPlaza = new Array<SucursalPlaza>();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml'

      })
    };

    //var url ='/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs?sap-client=200';
    var url = '/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    //Parametros para enviar servicio, se manda vacios para que nos regrese todas las empresas
    const parametros = {
      BUKRS: Id.Bukrs
    };


    this.soap.createClient(url, httpOptions).then(client => {
      //console.log("***************SERVICEEEEEEEEEEEEEEEEEE**************"+client);

      //client.setEndpoint("/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs");
      client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in");
      (<any>client).ZGET_BUSSINES_AREAS(parametros).subscribe((res: ISoapMethodResponse) => {

        //console.log("message ********SERVICIIIO PLAZA******* " + res.responseBody);


        var separadorini = '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap-env:Header/>' +
          '<soap-env:Body>' +
          '<n0:ZGET_BUSSINES_AREASResponse xmlns:n0="urn:sap-com:document:sap:rfc:functions">' +
          '<MENSAJE/>';

        var separadorfin = '</n0:ZGET_BUSSINES_AREASResponse>' +
          '</soap-env:Body>' +
          '</soap-env:Envelope>';

        try {
          var split1 = res.responseBody.split(separadorini);
          //le hacemos un split para quitarle la parte que no nos sirve separadorini
          //console.log("SPLIIITEADOOO 1111111111     "+split1[0] + "------------" + split1[1]);
          var cadena = split1[1].toString();
          //volvemos a hacer un split para quitar la parte final separador2
          var split2 = cadena.split(separadorfin);
          //console.log("SPLITEEEADOOO 2222222222    " + split2[0] + "-------------" + split2[0]);
          //convertimos de nuevo el arreglo en cadena para quitar las comas
          var cadena2 = split2[0].toString();
  
          var NuevoXML = cadena2.trim();
          //console.log("---XML FORMATEADO--" + NuevoXML);
          var parse = new DOMParser();
          var xml = parse.parseFromString(NuevoXML, 'text/xml');
  
          //console.log(xml);
          var json = this.ngxXml2jsonService.xmlToJson(xml);
          //FUNCION PARA RECORRER LAS LLAVEZ DE EL OBJETO Y AL ENCONTRAR UN NOMBRE DE LLAVE CORRECTO AGREGA LOS VALORES A UN NUEVO ARREGLO
          
        } catch (error) {
          
        }

        listProps(json, 3);

        function listProps(obj, level) {
          level = level || 0;
          for (var property in obj) {
            //console.log(level+' - '.repeat(level) + property);

            if (property == 'GSBER') {
              //console.log(Object.entries(obj));

              var idplaza = Object.values(obj)[0];
              var nameplaza = Object.values(obj)[1].toString();
              //console.log("ESTE ES EL ID-> " + id + "  ESTE ES EL NOMBRE--> " + name);
              ListPlza.push(idplaza);
              ListPlza.push(nameplaza);
              //console.log("---------------"+ListPlza.length);

            }
            if (typeof obj[property] === 'object') {
              listProps(obj[property], ++level);

            }
          }
        }
        //iteramos el arreglo fuera de la funcion para poder pasarlo a un arreglo de modelo y retornar el array para su uso

        var vuelta = 1;
        for (let val of ListPlza) {
          //console.log("VVVVVVVVVVVVVVVVVVV"+vuelta+"VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          if (vuelta % 2 == 1) {
            //console.log("es impar" + val);
            var acronimo = val;
            //console.log(acronimo);
            vuelta++;
          } else if (vuelta % 2 == 0) {
            var ws = new SucursalPlaza();
            //console.log("es par" + val);
            ws.IdPlaza = acronimo;
            ws.Nombre = val;
            //console.log(ws.Butxt);

            ListPlaza.push(ws);
            //console.log("*/*/*/*"+ ListPlaza.length);
            vuelta++;
          }

        }


      });

    });
    return ListPlaza;


  }

  InsertNewCategory(categoria:string){
    console.log(categoria);
    return this.http.get(`/api/newcate/${categoria}`).toPromise();
  }

  getAllCategoriasforUser(IdUser:number){
    return this.http.get<Categorias[]>(`/api/categoryforcomprador/${IdUser}`).toPromise();
  }

  getAllCategorias(){
    return this.http.get<Categorias[]>('/api/categorias').toPromise();
  }

  getAllUserCompradores(){
    return this.http.get<User[]>('/api/userforcat').toPromise();
  }

  getAllCategoriasnoUsadas(){
    return this.http.get<Categorias[]>('/api/catnousada').toPromise();
  }

  getListaCategoriasforUser(IdUser:number){
    return this.http.get<CategoriasForUser[]>(`/api/listcat/${IdUser}`).toPromise();
  }

  changedcategoryforsolicitud(IdSol:number, IdCateg:number){
    return this.http.get(`/api/changcat/${IdSol}/${IdCateg}`).toPromise();
  }

  InsertNewCategoryforCoprador(IdUser, IdCategori){
    return this.http.get(`/api/insertcatforuser/${IdUser}/${IdCategori}`).toPromise();
  }

  DeleteCategoria(IdCategoria:number){
    return this.http.get(`/api/catdelete/${IdCategoria}`).toPromise();
  }
  
  DeleteCategoriaforUser(IdUser:number, IdCategoria:number){
    return this.http.get(`/api/deletecat/${IdUser}/${IdCategoria}`).toPromise();
  }

  getAllImputaciones(): Observable<Imputacion[]> {
    return this.http.get<Imputacion[]>('/api/imputaciones');
  }

  getAllimputacionesForItem(): Observable<Imputacion[]> {
    return this.http.get<Imputacion[]>('/api/imputacionesforitem')
  }

  getAllPosiciones(): Observable<Posiciones[]> {
    return this.http.get<Posiciones[]>('/api/posicion');
  }

  getAllPosicionesByImputacion(Id: Imputacion): Observable<Posiciones[]> {
    return this.http.get<Posiciones[]>(`/api/posicionbyimputacion/${Id.IdTipoSolicitud}`);
  }

  getAllmateriales(idplaza: SucursalPlaza, idalmacen: Almacen): Array<Materiales> {
    //return this.http.get<Materiales[]>('/api/materiales');
    //console.log("---------------------dentro de el Servico para Materiales --------------------" + idplaza.IdPlaza + "  Almacen-->" + idalmacen.IdAlmacen);

    var Listmat = [];
    var ListMateriales = new Array<Materiales>();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml'

      })
    };

    //var url = '/sap/bc/srt/wsdl/flv_10002A10MAD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    var url = '/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    const parametros = {
      LGORT: idalmacen.IdAlmacen,
      WERKS: idplaza.IdPlaza
    };

    this.soap.createClient(url, httpOptions).then(client => {
      //console.log("***************SERVICEEEEEEEEEEEEEEEEEE**************"+client);

      //client.setEndpoint("/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs");
      client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in");
      (<any>client).ZGET_MATERIALES(parametros).subscribe((res: ISoapMethodResponse) => {

        //console.log("message ********SERVICIIIO PLAZA******* " + res.responseBody);


        var separadorini = '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap-env:Header/>' +
          '<soap-env:Body>' +
          '<n0:ZGET_MATERIALESResponse xmlns:n0="urn:sap-com:document:sap:rfc:functions">' +
          '<MENSAJE/>';

        var separadorfin = '</n0:ZGET_MATERIALESResponse>' +
          '</soap-env:Body>' +
          '</soap-env:Envelope>';

        try {
          
          var split1 = res.responseBody.split(separadorini);
          //le hacemos un split para quitarle la parte que no nos sirve separadorini
          //console.log("SPLIIITEADOOO 1111111111     "+split1[0] + "------------" + split1[1]);
          var cadena = split1[1].toString();
          //volvemos a hacer un split para quitar la parte final separador2
          var split2 = cadena.split(separadorfin);
          //console.log("SPLITEEEADOOO 2222222222    " + split2[0] + "-------------" + split2[0]);
          //convertimos de nuevo el arreglo en cadena para quitar las comas
          var cadena2 = split2[0].toString();
  
          var NuevoXML = cadena2.trim();
          //console.log("---XML FORMATEADO--" + NuevoXML);
          var parse = new DOMParser();
          var xml = parse.parseFromString(NuevoXML, 'text/xml');
  
          //console.log(xml);
          var json = this.ngxXml2jsonService.xmlToJson(xml);
          //FUNCION PARA RECORRER LAS LLAVEZ DE EL OBJETO Y AL ENCONTRAR UN NOMBRE DE LLAVE CORRECTO AGREGA LOS VALORES A UN NUEVO ARREGLO
        } catch (error) {
          console.log(error);
          return null;
        }
        
        listProps(json, 3);

        function listProps(obj, level) {
          level = level || 0;
          for (var property in obj) {
            //console.log(level+' - '.repeat(level) + property);

            if (property == 'MATNR') {
              //console.log(Object.entries(obj));

              var idmaterial = Object.values(obj)[0];
              var namematerial = Object.values(obj)[1].toString();
              //console.log("ESTE ES EL ID-> " + id + "  ESTE ES EL NOMBRE--> " + name);
              Listmat.push(idmaterial);
              Listmat.push(namematerial);
              //console.log("---------------"+ListPlza.length);

            }
            if (typeof obj[property] === 'object') {
              listProps(obj[property], ++level);

            }
          }
        }
        //iteramos el arreglo fuera de la funcion para poder pasarlo a un arreglo de modelo y retornar el array para su uso

        var vuelta = 1;
        for (let val of Listmat) {
          //console.log("VVVVVVVVVVVVVVVVVVV"+vuelta+"VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          if (vuelta % 2 == 1) {
            //console.log("es impar" + val);
            var acronimo = val;
            //console.log(acronimo);
            vuelta++;
          } else if (vuelta % 2 == 0) {
            var materiales = new Materiales();
            //console.log("es par" + val);
            materiales.IdMaterial = acronimo;
            materiales.Nombre = val;
            //console.log(ws.Butxt);

            ListMateriales.push(materiales);
            //console.log("*/*/*/*"+ ListPlaza.length);
            vuelta++;
          }

        }


      });

    });
    return ListMateriales;
  }

  getAllmaterialesConsumoInt(Centro: CentrosConsumoInt, Almacen: Almacen): Array<Materiales> {
    //return this.http.get<Materiales[]>('/api/materiales');
    //console.log("---------------------dentro de el Servico para Materiales --------------------" + IdCentro + "  Almacen-->" + IdAlmacen);

    var Listmat = [];
    var ListMateriales = new Array<Materiales>();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml'

      })
    };

    //var url = '/sap/bc/srt/wsdl/flv_10002A10MAD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    var url = '/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    const parametros = {
      LGORT: Almacen.IdAlmacen,
      WERKS: Centro.IdCentro
    };

    this.soap.createClient(url, httpOptions).then(client => {
      //console.log("***************SERVICEEEEEEEEEEEEEEEEEE**************"+client);

      //client.setEndpoint("/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs");
      client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in");
      (<any>client).ZGET_MATERIALES(parametros).subscribe((res: ISoapMethodResponse) => {

        //console.log("message ********SERVICIIIO PLAZA******* " + res.responseBody);


        var separadorini = '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap-env:Header/>' +
          '<soap-env:Body>' +
          '<n0:ZGET_MATERIALESResponse xmlns:n0="urn:sap-com:document:sap:rfc:functions">' +
          '<MENSAJE/>';

        var separadorfin = '</n0:ZGET_MATERIALESResponse>' +
          '</soap-env:Body>' +
          '</soap-env:Envelope>';

        try {
          var split1 = res.responseBody.split(separadorini);
          //le hacemos un split para quitarle la parte que no nos sirve separadorini
          //console.log("SPLIIITEADOOO 1111111111     "+split1[0] + "------------" + split1[1]);
          var cadena = split1[1].toString();
          //volvemos a hacer un split para quitar la parte final separador2
          var split2 = cadena.split(separadorfin);
          //console.log("SPLITEEEADOOO 2222222222    " + split2[0] + "-------------" + split2[0]);
          //convertimos de nuevo el arreglo en cadena para quitar las comas
          var cadena2 = split2[0].toString();
  
          var NuevoXML = cadena2.trim();
          //console.log("---XML FORMATEADO--" + NuevoXML);
          var parse = new DOMParser();
          var xml = parse.parseFromString(NuevoXML, 'text/xml');
  
          //console.log(xml);
          var json = this.ngxXml2jsonService.xmlToJson(xml);
          //FUNCION PARA RECORRER LAS LLAVEZ DE EL OBJETO Y AL ENCONTRAR UN NOMBRE DE LLAVE CORRECTO AGREGA LOS VALORES A UN NUEVO ARREGLO
          
        } catch (error) {
          
        }
        //console.log(json);
        listProps(json, 3);

        function listProps(obj, level) {
          level = level || 0;
          for (var property in obj) {
            //console.log(level+' - '.repeat(level) + property);

            if (property == 'MATNR') {
              //console.log(Object.entries(obj));

              var idmaterial = Object.values(obj)[0];
              var namematerial = Object.values(obj)[1].toString();
              //console.log("ESTE ES EL ID-> " + id + "  ESTE ES EL NOMBRE--> " + name);
              Listmat.push(idmaterial);
              Listmat.push(namematerial);
              //console.log("---------------"+ListPlza.length);

            }
            if (typeof obj[property] === 'object') {
              listProps(obj[property], ++level);

            }
          }
        }
        //iteramos el arreglo fuera de la funcion para poder pasarlo a un arreglo de modelo y retornar el array para su uso

        var vuelta = 1;
        for (let val of Listmat) {
          //console.log("VVVVVVVVVVVVVVVVVVV"+vuelta+"VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          if (vuelta % 2 == 1) {
            //console.log("es impar" + val);
            var acronimo = val;
            //console.log(acronimo);
            vuelta++;
          } else if (vuelta % 2 == 0) {
            var materiales = new Materiales();
            //console.log("es par" + val);
            materiales.IdMaterial = acronimo;
            materiales.Nombre = val;
            //console.log(ws.Butxt);

            ListMateriales.push(materiales);
            //console.log("*/*/*/*"+ ListPlaza.length);
            vuelta++;
          }

        }


      });

    });
    return ListMateriales;
  }

  getAllAlmacen(idplaza: SucursalPlaza): Array<Almacen> {
    // return this.http.get<Almacen[]>('/api/almacen');
    //console.log("---------------------dentro de el Servico para Almacen--------------------" + idplaza.IdPlaza);

    var Listalma = [];
    var ListAlmacen = new Array<Almacen>();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml'

      })
    };

    //var url = '/sap/bc/srt/wsdl/flv_10002A10MAD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    var url = '/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    const parametros = {
      WERKS: idplaza.IdPlaza
    };

    this.soap.createClient(url, httpOptions).then(client => {
      //console.log("***************SERVICEEEEEEEEEEEEEEEEEE**************"+client);

      //client.setEndpoint("/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs");
      client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in");
      (<any>client).ZGET_LOCATIONS(parametros).subscribe((res: ISoapMethodResponse) => {

        //console.log("message ********SERVICIIIO PLAZA******* " + res.responseBody);


        var separadorini = '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap-env:Header/>' +
          '<soap-env:Body>' +
          '<n0:ZGET_LOCATIONSResponse xmlns:n0="urn:sap-com:document:sap:rfc:functions">' +
          '<MENSAJE/>';

        var separadorfin = '</n0:ZGET_LOCATIONSResponse>' +
          '</soap-env:Body>' +
          '</soap-env:Envelope>';

        try {
          var split1 = res.responseBody.split(separadorini);
          //le hacemos un split para quitarle la parte que no nos sirve separadorini
          //console.log("SPLIIITEADOOO 1111111111     "+split1[0] + "------------" + split1[1]);
          var cadena = split1[1].toString();
          //volvemos a hacer un split para quitar la parte final separador2
          var split2 = cadena.split(separadorfin);
          //console.log("SPLITEEEADOOO 2222222222    " + split2[0] + "-------------" + split2[0]);
          //convertimos de nuevo el arreglo en cadena para quitar las comas
          var cadena2 = split2[0].toString();
  
          var NuevoXML = cadena2.trim();
          //console.log("---XML FORMATEADO--" + NuevoXML);
          var parse = new DOMParser();
          var xml = parse.parseFromString(NuevoXML, 'text/xml');
  
          //console.log(xml);
          var json = this.ngxXml2jsonService.xmlToJson(xml);
          //FUNCION PARA RECORRER LAS LLAVEZ DE EL OBJETO Y AL ENCONTRAR UN NOMBRE DE LLAVE CORRECTO AGREGA LOS VALORES A UN NUEVO ARREGLO
          
        } catch (error) {
          console.log(error);
        }
        //console.log(json);
        listProps(json, 3);

        function listProps(obj, level) {
          level = level || 0;
          for (var property in obj) {
            //console.log(level+' - '.repeat(level) + property);

            if (property == 'LGORT') {
              //console.log(Object.entries(obj));

              var idplaza = Object.values(obj)[0];
              var nameplaza = Object.values(obj)[1].toString();
              //console.log("ESTE ES EL ID-> " + id + "  ESTE ES EL NOMBRE--> " + name);
              Listalma.push(idplaza);
              Listalma.push(nameplaza);
              //console.log("---------------"+ListPlza.length);

            }
            if (typeof obj[property] === 'object') {
              listProps(obj[property], ++level);

            }
          }
        }
        //iteramos el arreglo fuera de la funcion para poder pasarlo a un arreglo de modelo y retornar el array para su uso

        var vuelta = 1;
        for (let val of Listalma) {
          //console.log("VVVVVVVVVVVVVVVVVVV"+vuelta+"VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          if (vuelta % 2 == 1) {
            //console.log("es impar" + val);
            var acronimo = val;
            //console.log(acronimo);
            vuelta++;
          } else if (vuelta % 2 == 0) {
            var almacen = new Almacen();
            //console.log("es par" + val);
            almacen.IdAlmacen = acronimo;
            almacen.Nombre = val;
            //console.log(ws.Butxt);

            ListAlmacen.push(almacen);
            //console.log("*/*/*/*"+ ListPlaza.length);
            vuelta++;
          }

        }


      });

    });
    return ListAlmacen;

  }

  getAllAlmacenConsumoInt(IdCentro: string): Array<Almacen> {
    // return this.http.get<Almacen[]>('/api/almacen');
    //.log("---------------------dentro de el Servico para Almacen de Consumo Interno--------------------" + IdCentro);

    var Listalma = [];
    var ListAlmacen = new Array<Almacen>();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml'

      })
    };

    //var url = '/sap/bc/srt/wsdl/flv_10002A10MAD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    var url = '/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    const parametros = {
      WERKS: IdCentro
    };

    this.soap.createClient(url, httpOptions).then(client => {
      //console.log("***************SERVICEEEEEEEEEEEEEEEEEE**************"+client);

      //client.setEndpoint("/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs");
      client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in");
      (<any>client).ZGET_LOCATIONS(parametros).subscribe((res: ISoapMethodResponse) => {

        //console.log("message ********SERVICIIIO PLAZA******* " + res.responseBody);


        var separadorini = '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap-env:Header/>' +
          '<soap-env:Body>' +
          '<n0:ZGET_LOCATIONSResponse xmlns:n0="urn:sap-com:document:sap:rfc:functions">' +
          '<MENSAJE/>';

        var separadorfin = '</n0:ZGET_LOCATIONSResponse>' +
          '</soap-env:Body>' +
          '</soap-env:Envelope>';

        try {
          var split1 = res.responseBody.split(separadorini);
          //le hacemos un split para quitarle la parte que no nos sirve separadorini
          //console.log("SPLIIITEADOOO 1111111111     "+split1[0] + "------------" + split1[1]);
          var cadena = split1[1].toString();
          //volvemos a hacer un split para quitar la parte final separador2
          var split2 = cadena.split(separadorfin);
          //console.log("SPLITEEEADOOO 2222222222    " + split2[0] + "-------------" + split2[0]);
          //convertimos de nuevo el arreglo en cadena para quitar las comas
          var cadena2 = split2[0].toString();
  
          var NuevoXML = cadena2.trim();
          //console.log("---XML FORMATEADO--" + NuevoXML);
          var parse = new DOMParser();
          var xml = parse.parseFromString(NuevoXML, 'text/xml');
  
          //console.log(xml);
          var json = this.ngxXml2jsonService.xmlToJson(xml);
          //FUNCION PARA RECORRER LAS LLAVEZ DE EL OBJETO Y AL ENCONTRAR UN NOMBRE DE LLAVE CORRECTO AGREGA LOS VALORES A UN NUEVO ARREGLO
          
        } catch (error) {
          console.log(error);
        }
        //console.log(json);
        listProps(json, 3);

        function listProps(obj, level) {
          level = level || 0;
          for (var property in obj) {
            //console.log(level+' - '.repeat(level) + property);

            if (property == 'LGORT') {
              //console.log(Object.entries(obj));

              var idplaza = Object.values(obj)[0];
              var nameplaza = Object.values(obj)[1].toString();
              //console.log("ESTE ES EL ID-> " + id + "  ESTE ES EL NOMBRE--> " + name);
              Listalma.push(idplaza);
              Listalma.push(nameplaza);
              //console.log("---------------"+ListPlza.length);

            }
            if (typeof obj[property] === 'object') {
              listProps(obj[property], ++level);

            }
          }
        }
        //iteramos el arreglo fuera de la funcion para poder pasarlo a un arreglo de modelo y retornar el array para su uso

        var vuelta = 1;
        for (let val of Listalma) {
          //console.log("VVVVVVVVVVVVVVVVVVV"+vuelta+"VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          if (vuelta % 2 == 1) {
            //console.log("es impar" + val);
            var acronimo = val;
            //console.log(acronimo);
            vuelta++;
          } else if (vuelta % 2 == 0) {
            var almacen = new Almacen();
            //console.log("es par" + val);
            almacen.IdAlmacen = acronimo;
            almacen.Nombre = val;
            //console.log(ws.Butxt);

            ListAlmacen.push(almacen);
            //console.log("*/*/*/*"+ ListPlaza.length);
            vuelta++;
          }

        }


      });

    });
    return ListAlmacen;

  }

  getAllActivo(idEmpresa: Empresa): Array<Activo> {
    // return this.http.get<Activo[]>('/api/activo');
    //console.log("---------------------dentro de el Servico  para Numero de Activo--------------------" + idEmpresa.Bukrs);

    var Listacti = [];
    var ListActivo = new Array<Activo>();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml'

      })
    };

    //var url = '/sap/bc/srt/wsdl/flv_10002A10MAD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    var url = '/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    const parametros = {
      BUKRS: idEmpresa.Bukrs
    };

    this.soap.createClient(url, httpOptions).then(client => {
      //console.log("***************SERVICEEEEEEEEEEEEEEEEEE**************"+client);

      //client.setEndpoint("/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs");
      client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in");
      (<any>client).ZGET_ASSETS(parametros).subscribe((res: ISoapMethodResponse) => {

        //console.log("message ********SERVICIIIO PLAZA******* " + res.responseBody);


        var separadorini = '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap-env:Header/>' +
          '<soap-env:Body>' +
          '<n0:ZGET_ASSETSResponse xmlns:n0="urn:sap-com:document:sap:rfc:functions">' +
          '<MENSAJE/>';

        var separadorfin = '</n0:ZGET_ASSETSResponse>' +
          '</soap-env:Body>' +
          '</soap-env:Envelope>';

        try {
          
          var split1 = res.responseBody.split(separadorini);
          //le hacemos un split para quitarle la parte que no nos sirve separadorini
          //console.log("SPLIIITEADOOO 1111111111     "+split1[0] + "------------" + split1[1]);
          var cadena = split1[1].toString();
          //volvemos a hacer un split para quitar la parte final separador2
          var split2 = cadena.split(separadorfin);
          //console.log("SPLITEEEADOOO 2222222222    " + split2[0] + "-------------" + split2[0]);
          //convertimos de nuevo el arreglo en cadena para quitar las comas
          var cadena2 = split2[0].toString();
  
          var NuevoXML = cadena2.trim();
          //console.log("---XML FORMATEADO--" + NuevoXML);
          var parse = new DOMParser();
          var xml = parse.parseFromString(NuevoXML, 'text/xml');
  
          //console.log(xml);
          var json = this.ngxXml2jsonService.xmlToJson(xml);
          //FUNCION PARA RECORRER LAS LLAVEZ DE EL OBJETO Y AL ENCONTRAR UN NOMBRE DE LLAVE CORRECTO AGREGA LOS VALORES A UN NUEVO ARREGLO
        } catch (error) {
          console.log(error);
        }

        listProps(json, 3);

        function listProps(obj, level) {
          level = level || 0;
          for (var property in obj) {
            //console.log(level+' - '.repeat(level) + property);

            if (property == 'ANLN1') {
              //console.log(Object.entries(obj));

              var idActivo = Object.values(obj)[0];
              var nameActivo = Object.values(obj)[2].toString();
              //console.log("ESTE ES EL ID-> " + id + "  ESTE ES EL NOMBRE--> " + name);
              Listacti.push(idActivo);
              Listacti.push(nameActivo);
              //console.log("---------------"+ListPlza.length);

            }
            if (typeof obj[property] === 'object') {
              listProps(obj[property], ++level);

            }
          }
        }
        //iteramos el arreglo fuera de la funcion para poder pasarlo a un arreglo de modelo y retornar el array para su uso

        var vuelta = 1;
        for (let val of Listacti) {
          //console.log("VVVVVVVVVVVVVVVVVVV"+vuelta+"VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          if (vuelta % 2 == 1) {
            //console.log("es impar" + val);
            var acronimo = val;
            //console.log(acronimo);
            vuelta++;
          } else if (vuelta % 2 == 0) {
            var activo = new Activo();
            //console.log("es par" + val);
            activo.IdActivo = acronimo;
            activo.Nombre = val;
            //console.log(ws.Butxt);

            ListActivo.push(activo);
            //console.log("*/*/*/*"+ ListPlaza.length);
            vuelta++;
          }

        }


      });

    });
    return ListActivo;

  }

  getAllOrdenInterna(idempresa: Empresa, SolPed: Imputacion): Array<OrdenInterna> {
    //console.log("---------------------dentro de el Servico  para Orden Interna--------------------" + idempresa.Bukrs);

    var Listorden = [];
    var ListOrdenInterna = new Array<OrdenInterna>();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml'

      })
    };

    //var url = '/sap/bc/srt/wsdl/flv_10002A10MAD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    var url = '/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    const parametros = {
      BUKRS: idempresa.Bukrs,
      SOL_TYPE: SolPed.Acronimo
    };
    try {
      this.soap.createClient(url, httpOptions).then(client => {
        //console.log("***************SERVICEEEEEEEEEEEEEEEEEE**************"+client);
        
        //client.setEndpoint("/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs");
        client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in");
        (<any>client).ZGET_ORDERS(parametros).subscribe((res: ISoapMethodResponse) => {
  
          //console.log("message ********SERVICIIIO PLAZA******* " + res.responseBody);
  
          var separadorini = '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">' +
            '<soap-env:Header/>' +
            '<soap-env:Body>' +
            '<n0:ZGET_ORDERSResponse xmlns:n0="urn:sap-com:document:sap:rfc:functions">' +
            '<MENSAJE/>';
  
          var separadorfin = '</n0:ZGET_ORDERSResponse>' +
            '</soap-env:Body>' +
            '</soap-env:Envelope>';
  
  
          
          try {
            var split1 = res.responseBody.split(separadorini);
            //le hacemos un split para quitarle la parte que no nos sirve separadorini
            //console.log("SPLIIITEADOOO 1111111111     "+split1[0] + "------------" + split1[1]);
            var cadena = split1[1].toString();
            //volvemos a hacer un split para quitar la parte final separador2
            var split2 = cadena.split(separadorfin);
            //console.log("SPLITEEEADOOO 2222222222    " + split2[0] + "-------------" + split2[0]);
            //convertimos de nuevo el arreglo en cadena para quitar las comas
            var cadena2 = split2[0].toString();
            
            var NuevoXML = cadena2.trim();
            //console.log("---XML FORMATEADO--" + NuevoXML);
            var parse = new DOMParser();
            var xml = parse.parseFromString(NuevoXML, 'text/xml');
    
            //console.log(xml);
            var json = this.ngxXml2jsonService.xmlToJson(xml);
            //FUNCION PARA RECORRER LAS LLAVEZ DE EL OBJETO Y AL ENCONTRAR UN NOMBRE DE LLAVE CORRECTO AGREGA LOS VALORES A UN NUEVO ARREGLO
    
            listProps(json, 3);
          } catch (error) {
            console.log(error);
          }
          
         
  
          function listProps(obj, level) {
            level = level || 0;
            for (var property in obj) {
              //console.log(level+' - '.repeat(level) + property);
  
              if (property == 'AUFNR') {
                //console.log(Object.entries(obj));
  
                var idOrden = Object.values(obj)[0];
                var nameOrden = Object.values(obj)[1].toString();
                //console.log("ESTE ES EL ID-> " + id + "  ESTE ES EL NOMBRE--> " + name);
                Listorden.push(idOrden);
                Listorden.push(nameOrden);
                //console.log("---------------"+ListPlza.length);
  
              }
              if (typeof obj[property] === 'object') {
                listProps(obj[property], ++level);
  
              }
            }
          }
          //iteramos el arreglo fuera de la funcion para poder pasarlo a un arreglo de modelo y retornar el array para su uso
  
          var vuelta = 1;
          for (let val of Listorden) {
            //console.log("VVVVVVVVVVVVVVVVVVV"+vuelta+"VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
            if (vuelta % 2 == 1) {
              //console.log("es impar" + val);
              var acronimo = val;
              //console.log(acronimo);
              vuelta++;
            } else if (vuelta % 2 == 0) {
              var orden = new OrdenInterna();
              //console.log("es par" + val);
              orden.IdOrdenInterna = acronimo;
              orden.NombreOrder = val;
              //console.log(ws.Butxt);
  
              ListOrdenInterna.push(orden);
              //console.log("*/*/*/*"+ ListPlaza.length);
              vuelta++;
            }
          }
  
  
        });
  
      });
      return ListOrdenInterna;
    } catch (error) {
      console.log(error);
      return error;
    }
    
  }

  getAllNecesidad(): Observable<Necesidad[]> {
    return this.http.get<Necesidad[]>('/api/necesidad');
  }

  getAllGrupoArticulo(): Observable<GrupoArticulo[]> {
    return this.http.get<GrupoArticulo[]>('/api/garticulo');
  }

  getAllGrupoCompra(IdEmpresa: Empresa): Array<GrupoCompra> {
    //return this.http.get<GrupoCompra[]>('/api/gcompra');

    //console.log("--------Esta es la Empresaaaa...." + IdEmpresa.Bukrs);

    var Listgcompra = [];
    var ListGrupoCompra = new Array<GrupoCompra>();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml'

      })
    };

    //var url = '/sap/bc/srt/wsdl/flv_10002A10MAD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    var url = '/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    const parametros = {
      BUKRS: IdEmpresa.Bukrs
      //  WERKS: idPlaza.IdPlaza,
      //  MATNR: IdMaterial.IdMaterial                          
    };

    this.soap.createClient(url, httpOptions).then(client => {
      //console.log("***************SERVICEEEEEEEEEEEEEEEEEE**************"+client);

      //client.setEndpoint("/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs");
      client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in");
      (<any>client).ZGET_PURGROUPS(parametros).subscribe((res: ISoapMethodResponse) => {

        // console.log("message ********SGRUPO DE COMPRAAAAA******* " + res.responseBody);


        var separadorini = '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap-env:Header/>' +
          '<soap-env:Body>' +
          '<n0:ZGET_PURGROUPSResponse xmlns:n0="urn:sap-com:document:sap:rfc:functions">' +
          '<MENSAJE/>';

        var separadorfin = '</n0:ZGET_PURGROUPSResponse' +
          '</soap-env:Body>' +
          '</soap-env:Envelope>';

        try {
          var split1 = res.responseBody.split(separadorini);
          //le hacemos un split para quitarle la parte que no nos sirve separadorini
          //console.log("SPLIIITEADOOO 1111111111     "+split1[0] + "------------" + split1[1]);
          var cadena = split1[1].toString();
          //volvemos a hacer un split para quitar la parte final separador2
          var split2 = cadena.split(separadorfin);
          //console.log("SPLITEEEADOOO 2222222222    " + split2[0] + "-------------" + split2[0]);
          //convertimos de nuevo el arreglo en cadena para quitar las comas
          var cadena2 = split2[0].toString();

          var NuevoXML = cadena2.trim();
          //console.log("---XML FORMATEADO--" + NuevoXML);
          var parse = new DOMParser();
          var xml = parse.parseFromString(NuevoXML, 'text/xml');

          //console.log(xml);
          var json = this.ngxXml2jsonService.xmlToJson(xml);
          //FUNCION PARA RECORRER LAS LLAVEZ DE EL OBJETO Y AL ENCONTRAR UN NOMBRE DE LLAVE CORRECTO AGREGA LOS VALORES A UN NUEVO ARREGLO
        } catch (error) {
          console.log(error);
        }
        

        listProps(json, 3);

        function listProps(obj, level) {
          level = level || 0;
          for (var property in obj) {
            //console.log(level+' - '.repeat(level) + property);

            if (property == 'EKGRP') {
              //console.log(Object.entries(obj));

              var idplaza = Object.values(obj)[0];
              var nameplaza = Object.values(obj)[1].toString();
              //console.log("ESTE ES EL ID-> " + id + "  ESTE ES EL NOMBRE--> " + name);
              Listgcompra.push(idplaza);
              Listgcompra.push(nameplaza);
              //console.log("---------------"+ListPlza.length);

            }
            if (typeof obj[property] === 'object') {
              listProps(obj[property], ++level);

            }
          }
        }
        //iteramos el arreglo fuera de la funcion para poder pasarlo a un arreglo de modelo y retornar el array para su uso

        var vuelta = 1;
        for (let val of Listgcompra) {
          //console.log("VVVVVVVVVVVVVVVVVVV"+vuelta+"VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          if (vuelta % 2 == 1) {
            //console.log("es impar" + val);
            var acronimo = val;
            //console.log(acronimo);
            vuelta++;
          } else if (vuelta % 2 == 0) {
            var gcompra = new GrupoCompra();
            //console.log("es par" + val);
            gcompra.IdGrupoCompra = acronimo;
            gcompra.Nombre = val;
            //console.log(ws.Butxt);

            ListGrupoCompra.push(gcompra);
            //console.log("*/*/*/*"+ ListPlaza.length);
            vuelta++;
          }

        }


      });

    });
    return ListGrupoCompra;

  }

  GetAllMonedas(): Observable<Moneda[]> {
    return this.http.get<Moneda[]>('/api/moneda');
  }

  GetAllUnidadMedida(IdMaterial: String) {
    //console.log("---------------------dentro de el Servico  para Unidad de Medida--------------------" + "Materiales" + "  " + IdMaterial);

    var ListUMedida = [];
    var ListunidadMedida = new Array<UnidadMedida>();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml'

      })
    };

    //var url = '/sap/bc/srt/wsdl/flv_10002A10MAD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    var url = '/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    const parametros = {
      MATNR: IdMaterial
    };

    this.soap.createClient(url, httpOptions).then(client => {
      //console.log("***************SERVICEEEEEEEEEEEEEEEEEE**************"+client);

      //client.setEndpoint("/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs");
      client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in");
      (<any>client).ZGET_UNITS(parametros).subscribe((res: ISoapMethodResponse) => {

        //console.log("message ********SERVICIIIO PLAZA******* " + res.responseBody);


        var separadorini = '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap-env:Header/>' +
          '<soap-env:Body>' +
          '<n0:ZGET_UNITSResponse xmlns:n0="urn:sap-com:document:sap:rfc:functions">' +
          '<MENSAJE/>';

        var separadorfin = '</n0:ZGET_UNITSResponse' +
          '</soap-env:Body>' +
          '</soap-env:Envelope>';

        try {
          var split1 = res.responseBody.split(separadorini);
          //le hacemos un split para quitarle la parte que no nos sirve separadorini
          //console.log("SPLIIITEADOOO 1111111111     "+split1[0] + "------------" + split1[1]);
          var cadena = split1[1].toString();
          //volvemos a hacer un split para quitar la parte final separador2
          var split2 = cadena.split(separadorfin);
          //console.log("SPLITEEEADOOO 2222222222    " + split2[0] + "-------------" + split2[0]);
          //convertimos de nuevo el arreglo en cadena para quitar las comas
          var cadena2 = split2[0].toString();

          var NuevoXML = cadena2.trim();
          //console.log("---XML FORMATEADO--" + NuevoXML);
          var parse = new DOMParser();
          var xml = parse.parseFromString(NuevoXML, 'text/xml');

          //console.log(xml);
          var json = this.ngxXml2jsonService.xmlToJson(xml);
        } catch (error) {
            console.log(error);
        }
        
        //FUNCION PARA RECORRER LAS LLAVEZ DE EL OBJETO Y AL ENCONTRAR UN NOMBRE DE LLAVE CORRECTO AGREGA LOS VALORES A UN NUEVO ARREGLO

        listProps(json, 3);

        function listProps(obj, level) {
          level = level || 0;
          for (var property in obj) {
            //console.log(level+' - '.repeat(level) + property);

            if (property == 'MEINS') {
              //console.log(Object.entries(obj));

              var idunidadmedida = Object.values(obj)[0];
              var nameunidadmedida = Object.values(obj)[1].toString();
              //console.log("ESTE ES EL ID-> " + id + "  ESTE ES EL NOMBRE--> " + name);
              ListUMedida.push(idunidadmedida);
              ListUMedida.push(nameunidadmedida);
              //console.log("---------------"+ListPlza.length);

            }
            if (typeof obj[property] === 'object') {
              listProps(obj[property], ++level);

            }
          }
        }
        //iteramos el arreglo fuera de la funcion para poder pasarlo a un arreglo de modelo y retornar el array para su uso

        var vuelta = 1;
        for (let val of ListUMedida) {
          //console.log("VVVVVVVVVVVVVVVVVVV"+vuelta+"VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          if (vuelta % 2 == 1) {
            //console.log("es impar" + val);
            var acronimo = val;
            //console.log(acronimo);
            vuelta++;
          } else if (vuelta % 2 == 0) {
            var UnMedida = new UnidadMedida();
            //console.log("es par" + val);
            UnMedida.IdUnidadMedida = acronimo;
            UnMedida.NombreUnidadMedida = val;
            //console.log(ws.Butxt);

            ListunidadMedida.push(UnMedida);
            //console.log("*/*/*/*"+ ListPlaza.length);
            vuelta++;
          }

        }


      });

    });
    return ListunidadMedida;
  }

  //recuperamos el id de el Usuario Autorizador
  getIdAutorizador(id: number): Observable<User[]> {
    return this.http.get<User[]>(`/api/usrauth/${id}`);
  }

  //Trae tipo de Solciitud dependiendo de el rool de el
  InsertSolicitudPedido1(Data: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>('/api/newsolicitud1', Data);
  }

  //nos trae las Solicitudes Registradas para la Tabla
  /*getAllSolicitudReg() : Observable<SolicitudesCompraRegistradas[]>{
    return this.http.get<SolicitudesCompraRegistradas[]>('/api/solreg');
  }*/

  //recuperamos las diferentes direccions que tiene a su cargo o mando un Usuario
  getAllDirectionsForUser(IdUsuario: number): Observable<Direccion[]> {
    return this.http.get<Direccion[]>(`/api/diruser/${IdUsuario}`);
  }

  getStatusforCompras(IdRole: number, isCompras: number): any {
    return this.http.get<any>(`/api/statususr/${IdRole}/${isCompras}`);
  }

  //todas las Solicitudes con el status modificado por direccion
  getAllSolicitudNewSoli(status: number, direccion: number): Observable<SolicitudesCompraRegistradas[]> {
    return this.http.get<SolicitudesCompraRegistradas[]>(`/api/solreg/${status}/${direccion}`);
  }

  getAllSolicitudNewSoliforCategori(status: number, direccion: number, Idusr): Observable<SolicitudesCompraRegistradas[]> {
    return this.http.get<SolicitudesCompraRegistradas[]>(`/api/solregcat/${status}/${direccion}/${Idusr}`);
  }

  getAllSolicitudesForStatusPresupuesto(IdStatus: number): Observable<SolicitudesCompraRegistradas[]> {
    return this.http.get<SolicitudesCompraRegistradas[]>(`/api/solregpresu/${IdStatus}`);
  }
  // //solo lo posrian ver los autorizadores de finanzas
  // getAllSolicitudForStatus(status:number) : Observable<SolicitudesCompraRegistradas[]>{
  //   return this.http.get<SolicitudesCompraRegistradas[]>(`/api/solreg/${status}`);
  // }

  getDetalleSolicitud(idsol: number): Observable<Detallesol[]> {
    return this.http.get<Detallesol[]>(`/api/detallesol/${idsol}`);
  }

  getDetalleSubItems(idProd): Observable<Childs[]> {
    return this.http.get<Childs[]>(`/api/detalleProd/${idProd}`);
  }
  //se visualizara contenido si es que el autorizador genera en elagum momento alguna solicitud...(solo aplica para los usuarios Solicitantes)
  getAllSolicitudforusr(idusr: number, IdRole: number): Observable<SolicitudesCompraRegistradas[]> {
    return this.http.get<SolicitudesCompraRegistradas[]>(`/api/solforusr/${idusr}/${IdRole}`);
  }

  getAllStatusSolicitud(idRole: number): Observable<StatusSolicitud[]> {
    return this.http.get<StatusSolicitud[]>(`/api/status/${idRole}`);
  }

  UpdateStatusSolicitud(Idstatus: number, IdSolicitud: number, Justifi_rechazo: string): Observable<StatusSolicitud> {
    return this.http.post<StatusSolicitud>('/api/updatestatus', {Idstatus, IdSolicitud, Justifi_rechazo});
  }

  getInfoSolPed(IdSolicitudPedido: number, Acronimo: string): Observable<DataSAP[]> {
    return this.http.get<DataSAP[]>(`/api/infosolped/${IdSolicitudPedido}/${Acronimo}`);
  }

  updateinfoSol(Id: number, Nombre: string, Puesto: string, Email: string, Tel: string, Ext: any, Produc: string, Justifi: String, IdOrInt: string, OrdenIn: string, NewStatus: number) {
    // console.log("desde el servicio");
    // console.log(IdOrInt);
    // console.log(OrdenIn);
    return this.http.post('/api/upinfosol', { Id, Nombre, Puesto, Email, Tel, Ext, Produc, Justifi, IdOrInt, OrdenIn, NewStatus });
  }
  
  updateinfoProd(IdSol, IdProd: number, Precio: number, Cantidad: number, IdAlmacen: string, AlmacenName: string, IdMaterial: string, MaterialName: string, IdCentroCosto: string, CecoName: string, IdCuentaMayor: string, NameCuentaMayor: string, IdGrupComp: number, GrupComprName: string, IdUnidadMedida: string, NameUnidadMedida: string, IdOrdEsta: string, OrdEstaName: string, IdActivo: string, ActivoName: string, IdNecesidad: number, NecesidadName: string, espesifica: string, usobien: string, NewStatus: number) {
    // console.log(IdSol);
    // console.log(IdProd);
    // console.log(Precio);
    // console.log(Cantidad);
    // console.log(IdAlmacen);
    // console.log(AlmacenName);
    // console.log(IdMaterial);
    // console.log(MaterialName);
    // console.log(IdCentroCosto);
    // console.log(CecoName);
    // console.log(IdCuentaMayor);
    // console.log(NameCuentaMayor);
    // console.log(IdGrupComp);
    // console.log(GrupComprName);
    // console.log(IdUnidadMedida);
    // console.log(NameUnidadMedida);
    // console.log(IdOrdEsta);
    // console.log(OrdEstaName);
    // console.log(IdActivo);
    // console.log(ActivoName);
    // console.log(IdNecesidad);
    // console.log(NecesidadName);
    // console.log(espesifica);
    // console.log(usobien);
    return this.http.post('/api/upinfoprod', {
      IdSol,
      IdProd,
      Precio,
      Cantidad,
      IdAlmacen,
      AlmacenName,
      IdMaterial,
      MaterialName,
      IdCentroCosto,
      CecoName,
      IdCuentaMayor,
      NameCuentaMayor,
      IdGrupComp,
      GrupComprName,
      IdUnidadMedida,
      NameUnidadMedida,
      IdOrdEsta,
      OrdEstaName,
      IdActivo,
      ActivoName,
      IdNecesidad,
      NecesidadName,
      espesifica,
      usobien,
      NewStatus
    });
  }

  updateinfoChilds(IdSol: number, IdChild: number, Precio: number, Cantidad: number, IdOrdenEsta: string, NameOrdenEst: string, IdCeco: string, NameCeco: string, IdCuentaMayor: string, NameCuentaMayor: string, IdUnidadMedida: string, NombreUnidadMedida: string, textobreve: string, NewStatus: number) {
    return this.http.post('/api/updatechild', { IdSol, IdChild, Precio, Cantidad, IdOrdenEsta, NameOrdenEst, IdCeco, NameCeco, IdCuentaMayor, NameCuentaMayor, IdUnidadMedida, NombreUnidadMedida, textobreve, NewStatus });
  }
  //METODO PARA HACER INSERT A SAP CUANDO TERMINE EL PROCESO (AUTORIZADO POR DIRECTOR), SE CAMBIO ESTE POR LA CREACION DE EXCEL CON TODAS LAS SOLPED DE UN DIA.
  // getInsertinSAP(IdSol:number,datos : SolicitudPedidoSAP): Observable<string>{
  //   console.log("Acronimo --->" + datos.SOL_TYPE);
  //   var SOL_TYPE : string = datos.SOL_TYPE;
  //   var Items = datos.Item;
  //   var vueltas = 0;
  //   var item : Array<any> = new Array<any>();
  //   var MENSAJE = '';
  //   var insertSAP : MensajesSolPed; 

  //   Items.forEach(function(val, index, array:any[]){
  //     vueltas ++;

  //     if(vueltas == 1){

  //       var Data = {val};
  //       item.push(val);
  //     }else if(vueltas >= 1){

  //       Data = {val};
  //       item.push(val);
  //       console.log(item);
  //     }
  //     console.log(item.length);
  //     console.log("-------N° Vueltas---------" + vueltas);




  //   });


  //   var Mensaje = new Observable<string>();
  //   var Listmsj = [];
  //   const  httpOptions = {
  //     headers: new HttpHeaders({
  //                                   'Content-Type':  'application/xml'
  //                             })
  //     };

  //       //var url ='/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs?sap-client=200';
  //       // var url = '/sap/bc/srt/wsdl/flv_10002A10M1D1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/300/zws_sap_in/zws_sap_in?sap-client=300';
  //       var url = '/sap/bc/srt/wsdl/flv_10002A10MAD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
  //       const parametros = {
  //         SOLPEDS:{
  //           item
  //         },
  //         SOL_TYPE:SOL_TYPE
  //       };
  //       console.log(parametros);


  //     this.soap.createClient(url,httpOptions).then(client  => {     
  //               //console.log("***************SERVICE SOAP INSEEEERTTTTTTTTTTTTTTTTTTT**************"+client);

  //             //client.setEndpoint("/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs");
  //             client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in");
  //             (<any>client).ZPOST_SOLPED(parametros).subscribe((res: ISoapMethodResponse) => { 

  //               //console.log("message ********SERVICE SOAP InSERT SAPPP******* " + res.responseBody);

  //               var separadorini = '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">'+
  //                                   '<soap-env:Header/>'+
  //                                   '<soap-env:Body>'+
  //                                   '<n0:ZPOST_SOLPEDResponse xmlns:n0="urn:sap-com:document:sap:rfc:functions">'+
  //                                   '<E_MENSAJE>';

  //               var separadorfin =  '</E_MENSAJE>'+'</n0:ZPOST_SOLPEDResponse>'+'</soap-env:Body>'+'</soap-env:Envelope>';

  //               var split1 = res.responseBody.split(separadorini);
  //               //le hacemos un split para quitarle la parte que no nos sirve separadorini
  //               //console.log("SPLIIITEADOOO 1111111111     "+split1[1]);
  //               var cadena = split1[1].toString();
  //               //volvemos a hacer un split para quitar la parte final separador2
  //               var split2 = cadena.split(separadorfin);
  //               //console.log("SPLITEEEADOOO 2222222222    " + split2[0]);
  //               //convertimos de nuevo el arreglo en cadena para quitar las comas
  //               var cadena2 = split2[0].toString();
  //               Listmsj.push(cadena2);
  //               //console.log(Listmsj);

  //               //FUNCION PARA RECORRER LAS LLAVEZ DE EL OBJETO Y AL ENCONTRAR UN NOMBRE DE LLAVE CORRECTO AGREGA LOS VALORES A UN NUEVO ARREGLO
  //               // console.log("////////////////////////////////////////////////////////");

  //               // listProps(json, 1);
  //               // function listProps(obj, level) {
  //               //   level = level || 0;

  //               //   for(var property in obj) {

  //               //       console.log(' - ' + property);
  //               //       if(property === 'EMensaje'){
  //               //        var msj = Object.values(obj)[0].toString();

  //               //         Listmsj.push(msj);
  //               //       }
  //               //       if(typeof obj[property] === 'object') {
  //               //           listProps(obj[property], ++level);

  //               //       }

  //               //     }


  //               var vuelta = 1;
  //                   for(let val of Listmsj){
  //                     //console.log("Este es el valor----->" + val);
  //                     if(val != undefined || val != ''){
  //                      var mensaje:string;

  //                       console.log(IdSol);
  //                       console.log(val);

  //                       //console.log("es par" + val);
  //                       mensaje = val;

  //                       vuelta++;
  //                     }

  //                   }
  //                   console.log("mensaje de SAp--->" + mensaje);
  //                   if(mensaje == null || mensaje == undefined){
  //                     console.log("mensaje de SAp--->" + mensaje);

  //                   }else{
  //                     //console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
  //                     var split  = mensaje.split(' ');
  //                     console.log(split);
  //                    // console.log("este es el total de posiciones de el areglo---->"+ split.length);
  //                     if(split.length == 9){
  //                       var IdSap = split[8];
  //                       //console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo");
  //                     }else{
  //                       //Mensaje.push(mensaje);
  //                     }


  //                     // this.InsertsAPid(IdSol, mensaje).subscribe(data =>{
  //                     //   console.log("se realizo", data);
  //                     // },
  //                     // err =>{
  //                     //   console.log(err);
  //                     // });
  //                   }

  //               //   }



  //             });

  //     });

  //     //this.insertIDSAP();
  //     //this.insertIDSAP(IdSol,MENSAJE);


  //     return Mensaje;

  // }



  InsertsAPid(IdSol: number, Mensaje: string) {
    //console.log("mensaje----->  " + Mensaje + "    " + IdSol);
    return this.http.get(`/api/sapid/${IdSol}/${Mensaje}`);
  }

  getRecuperaIdSap(IdSolPed: number) {
    //console.log("Recuperando el ID de SAP Guardado en DB");
    return this.http.get<string>(`/api/idsapsol/:${IdSolPed}`);
  }


  SendEmailNewSolicitud(IdSolicitud: any, IdStatus: number, IdArea: number, NombreArea: string, Solicitante: string, IdRol: number, NombreAutorizador: string, EmailAutorizador: string, sendnewStatusAutoriza:number, sendnewStatusRechazo) {
    return this.http.get<string>(`/api/emailnew/${IdSolicitud}/${IdStatus}/${IdArea}/${NombreArea}/${Solicitante}/${IdRol}/${NombreAutorizador}/${EmailAutorizador}/${sendnewStatusAutoriza}/${sendnewStatusRechazo}`);
  }

  SendEmailDirectorArea(IdSolicitud: number, IdStatus: number, IdArea: number, Solicitante: string, IdRol: number, NombreAutorizador: string, EmailAutorizador: string) {
    return this.http.get<string>(`/api/email/${IdSolicitud}/${IdStatus}/${IdArea}/${Solicitante}/${IdRol}/${NombreAutorizador}/${EmailAutorizador}`);
    //return this.http.post('/api/email',Nombre);
  }

  SendEmailGerenteFianzas(IdSolicitud: number, IdStatus: number, IdArea: number, Solicitante: string, IdRol: number, NombreAutorizador: string, EmailAutorizador: string) {
    return this.http.get<string>(`/api/emailgerentef/${IdSolicitud}/${IdStatus}/${IdArea}/${Solicitante}/${IdRol}/${NombreAutorizador}/${EmailAutorizador}`);
  }

  SendEmailAdmin(IdSolicitud: number, IdStatus: number, IdArea: number, Solicitante: string, IdRol: number, NombreAutorizador: string, EmailAutorizador: string) {
    return this.http.get<string>(`/api/emailadmin/${IdSolicitud}/${IdStatus}/${IdArea}/${Solicitante}/${IdRol}/${NombreAutorizador}/${EmailAutorizador}`);
  }

  downloadCotizacion(ruta: string) {
    //console.log("nombre del archivo ---> " + ruta);
    return this.http.get(`/api/downloadcotizacion/${ruta}`);
    //window.open();
  }

  checkdirauthexeption(IdDireccion: number) {
    //console.log("dentro del metodo para revisar que la direccion a" +
      //"la que se registra la solicitud tenga exepcion de Autorizacion  " + IdDireccion);
    return this.http.get<number>(`/api/dirauthforauth/${IdDireccion}`);

  }

  getUserAutorizador(IdDireccion: number, IdRole: number) {
    //console.log("desde el servicio-->" + IdDireccion);
    //console.log("desde el Servicio-->" + IdRole);
    return this.http.get(`/api/getUserValida/${IdDireccion}/${IdRole}`);
  }

  getChangestatusCompras(IdSolPed: number, IdStatus: number) {
    return this.http.get(`/api/getstatuscompras/${IdSolPed}/${IdStatus}`);
  }

  getFileCompras(ID: Number) {
    return this.http.get(`/api/getfilecompras/${ID}`);
  }

  // getexeptionAuth(IdDireccion:number){
  //   console.log("Esta es la direccion a consultar");
  //   return this.http.get<number>('/api/dirauthforauth');
  // }


  getHellosgin() {
    return this.http.get('/api/hellosign');
  }


  getCentros(IdEmpresa: number): Array<CentrosConsumoInt> {
    //console.log(IdEmpresa);
    var Listcentro = [];
    var LIstAllCentros = new Array<CentrosConsumoInt>();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml'

      })
    };
    var url = '/sap/bc/srt/wsdl/flv_10002A10MAD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    //'/sap/bc/srt/wsdl/flv_10002P111AD1/sdef_url/ZWS_SAP_IN?sap-client=320'
    const parametros = {
      BUKRS: IdEmpresa
    };

    this.soap.createClient(url, httpOptions).then(client => {
      //console.log(client);

      client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in");
      (<any>client).ZGET_CENTRO(parametros).subscribe((res: ISoapMethodResponse) => {

        //console.log("message ********CENTROS SOBRE UNA SOLCITUD******* " + res.responseBody);


        var separadorini = '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap-env:Header/>' +
          '<soap-env:Body>' +
          '<n0:ZGET_CENTROResponse xmlns:n0="urn:sap-com:document:sap:rfc:functions">' +
          '<MENSAJE/>';


        var separadorfin = '</n0:ZGET_CENTROResponse>' +
          '</soap-env:Body>' +
          '</soap-env:Envelope>';

        var split1 = res.responseBody.split(separadorini);
        //le hacemos un split para quitarle la parte que no nos sirve separadorini
        //console.log("SPLIIITEADOOO 1111111111     "+split1[0] + "------------" + split1[1]);
        var cadena = split1[1].toString();
        //volvemos a hacer un split para quitar la parte final separador2
        var split2 = cadena.split(separadorfin);
        //console.log("SPLITEEEADOOO 2222222222    " + split2[0] + "-------------" + split2[0]);
        //convertimos de nuevo el arreglo en cadena para quitar las comas
        var cadena2 = split2[0].toString();

        var NuevoXML = cadena2.trim();
        //console.log("---XML FORMATEADO--" + NuevoXML);
        var parse = new DOMParser();
        var xml = parse.parseFromString(NuevoXML, 'text/xml');
        //console.log("este es el xml--->");
        //console.log(xml);
        var json = this.ngxXml2jsonService.xmlToJson(xml);
        //FUNCION PARA RECORRER LAS LLAVEZ DE EL OBJETO Y AL ENCONTRAR UN NOMBRE DE LLAVE CORRECTO AGREGA LOS VALORES A UN NUEVO ARREGLO
        //console.log(json);
        listProps(json, 2);
        function listProps(obj, level) {
          level = level || 0;
          for (var property in obj) {
            //console.log(level+' - '.repeat(level) + property);
            if (property == 'WERKS') {
              //console.log(Object.entries(obj));

              var idcentro = Object.values(obj)[0];
              var namecentro = Object.values(obj)[1].toString();
              //console.log("ESTE ES EL ID-> " + idcentro + "  ESTE ES EL NOMBRE--> " + namecentro);
              Listcentro.push(idcentro);
              Listcentro.push(namecentro);
              //console.log("------------------------------"+Listcentro.length);
            }
            if (typeof obj[property] === 'object') {
              listProps(obj[property], ++level);
            }
          }
        }

        var vuelta = 1;
        for (let val of Listcentro) {
          //console.log("VVVVVVVVVVVVVVVVVVV"+vuelta+"VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          if (vuelta % 2 == 1) {
            //console.log("es impar" + val);
            var acronimo = val;
            //console.log(acronimo);
            vuelta++;
          } else if (vuelta % 2 == 0) {
            var centro = new CentrosConsumoInt();
            //console.log("es par" + val);
            centro.IdCentro = acronimo;
            centro.NombreCentro = val;
            //console.log(ws.Butxt);

            LIstAllCentros.push(centro);
            //console.log("*/*/*/*"+ LIstAllCentros.length);
            vuelta++;
          }
        }



      });

    });
    return LIstAllCentros;
  }

  getAllCaducidad(IdAlmacen: string, IdMaterial: string, IdCentro: string): CaducidadConsumoInt{
    //console.log(IdAlmacen + "-----" + IdMaterial + "------" + IdCentro + "------");
    var Listcaducidad = [];
    var caducidad = new CaducidadConsumoInt();
    //var LIstAllCaducidad = new Array<CaducidadConsumoInt>();
    //var ListCaducidad: CaducidadConsumoInt[] = [];
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/xml'

      })
    };
    var url = '/sap/bc/srt/wsdl/flv_10002A10MAD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320';
    const parametros = {
      LGORT: IdAlmacen,
      MATNR: IdMaterial,
      WERKS: IdCentro
    };
    this.soap.createClient(url, httpOptions).then(client => {
      client.setEndpoint("/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in");
      (<any>client).ZGET_CADUC(parametros).subscribe((res: ISoapMethodResponse) => {
        //console.log("message ********CENTROS SOBRE UNA SOLCITUD******* " + res.responseBody);
        var separadorini = '<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soap-env:Header/>' +
          '<soap-env:Body>' +
          '<n0:ZGET_CADUCResponse xmlns:n0="urn:sap-com:document:sap:rfc:functions">' +
          '<MENSAJE/>';
        var separadorfin = '</n0:ZGET_CADUCResponse>' +
          '</soap-env:Body>' +
          '</soap-env:Envelope>';

        var split1 = res.responseBody.split(separadorini);
        //le hacemos un split para quitarle la parte que no nos sirve separadorini
        //console.log("SPLIIITEADOOO 1111111111     "+split1[0] + "------------" + split1[1]);
        var cadena = split1[1].toString();
        //volvemos a hacer un split para quitar la parte final separador2
        var split2 = cadena.split(separadorfin);
        //console.log("SPLITEEEADOOO 2222222222    " + split2[0] + "-------------" + split2[0]);
        //convertimos de nuevo el arreglo en cadena para quitar las comas
        var cadena2 = split2[0].toString();

        var NuevoXML = cadena2.trim();
        //console.log("---XML FORMATEADO--" + NuevoXML);
        var parse = new DOMParser();
        var xml = parse.parseFromString(NuevoXML, 'text/xml');
        //console.log("este es el xml--->");
        //console.log(xml);
        var json = this.ngxXml2jsonService.xmlToJson(xml);
        //console.log(json);

        listProps(json, 2);
        function listProps(obj, level) {
          level = level || 0;
          for (var property in obj) {
            //console.log(level+' - '.repeat(level) + property);
            if (property == 'CHARG') {
              //console.log(Object.entries(obj));

              var caducidad = Object.values(obj)[0];
              var stok = Object.values(obj)[1].toString();
              //console.log("ESTE ES EL ID-> " + idcentro + "  ESTE ES EL NOMBRE--> " + namecentro);
              Listcaducidad.push(caducidad);
              Listcaducidad.push(stok);
              //console.log("------------------------------"+Listcaducidad.length);
            }
            if (typeof obj[property] === 'object') {
              listProps(obj[property], ++level);
            }
          }
        }

        var vuelta = 1;
        for (let val of Listcaducidad) {
          //console.log("VVVVVVVVVVVVVVVVVVV"+vuelta+"VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          if (vuelta % 2 == 1) {
            //console.log("es impar" + val);
            var acronimo = val;
            //console.log(acronimo);
            vuelta++;
          } else if (vuelta % 2 == 0) {
            //var caducidad = new CaducidadConsumoInt();
            //console.log("es par" + val);
            caducidad.CHARG = acronimo;
            caducidad.CLABS = val;
            //console.log(ws.Butxt);

            //ListCaducidad.push(caducidad);
            //console.log(ListCaducidad);
            vuelta++;
          }
        }

      });
    });

    return caducidad;
  }

  getRoleExcepcionDir(IdUser:number){
    return this.http.get(`/api/checkroleexcepcion/${IdUser}`)
  }

}
