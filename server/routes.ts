import * as express from 'express';

import CatCtrl from './controllers/cat';
import UserCtrl from './controllers/user';
import Cat from './models/cat';
import User from './models/user';


import SolicitudController from './controllers/solicitud';
import SolicitudRegController from './controllers/solicitudesReg';

import SolicitudCompraCTR from './controllers/SolicitudCompra';
import SolicitudConsumoInterno from './controllers/Solicitud_Consumo_Inter';
import UploadFilesController from './controllers/uploadfile';
import WebServiceSap from './controllers/WebServiceSAP';
//import { RootRenderer } from '@angular/core';
import { inflateRaw } from 'zlib';
//import { ConsoleReporter } from 'jasmine';

var configMensaje = require('../server/email/configMensaje');
var auth = require('./middleware/auth');


export default function setRoutes(app) {

  const router = express.Router();

  const catCtrl = new CatCtrl();
  const userCtrl = new UserCtrl();
 
  
  
  
  //Const y Obj Sol
  //const solicitudCtrl = new SolicitudController();
 //const solicitudRegCtrl = new SolicitudRegController();
  const solicitudCompraCTR = new SolicitudCompraCTR();
  const solconsumoInterno = new SolicitudConsumoInterno();
  const solicitudCTR = new SolicitudRegController();
  const UploadCTR = new UploadFilesController();
  const webservicesap = new WebServiceSap();
  //const configMensaje = new 


//router.route('/webservicesap').get(webservicesap.example);


  //Solicitud 
  // router.route('/proveedores').get(solicitudCtrl.getAllProveedores);
  // router.route('/proveedores/:idSociedad').get(solicitudCtrl.getAllProveedoresByIdSociedad);  
  // router.route('/sociedades').get(solicitudCtrl.getAllSociedades);
  // router.route('/tiposdesolicitud').get(solicitudCtrl.getAllTiposDeSolicitud);
  // router.route('/medios').get(solicitudCtrl.getAllMedios);
  // //router.route('/sucursalplaza/:idMedio').get(solicitudCtrl.getAllSucursalPlazaByIdMedio);  
  // router.route('/cuentamayor/:idSociedad').get(solicitudCtrl.getAllCuentasMayorByIdSociedad);  
  // router.route('/centrocostos/:idSociedad').get(solicitudCtrl.getAllCentroDeCostoByIdSociedad);  
  // router.route('/impuestos').get(solicitudCtrl.getAllIVA);



  // router.route('/solicitud/:idTipoSolicitud'+
  //                        '/:idSociedad'+
  //                        '/:idProveedor' +
  //                        '/:idCentroCostos' +
  //                        '/:idCuentaMayor' +
  //                        '/:idImpuesto' +
  //                        '/:descripcionConcepto' + 
  //                        '/:importe' +
  //                        '/:autorizadorPor'+
  //                        '/:solicitante'  +
  //                        '/:retIVA'+
  //                        '/:retISR'+
  //                        '/:gastosExtras'+
  //                        '/:ordenInterna'+
  //                        '/:presupuesto'+
  //                        '/:division'+
  //                        '/:autorizadorCuentasPorPagar'+
  //                        '/:personalCuentasPorPagar'
  //             ).get(solicitudCtrl.insertSolicitud);  

  
  // //Solicitudes Registradas 
  // router.route('/solicitudesReg').get(solicitudRegCtrl.getAllSolicitudes);

 //Loggin SQL
  //router.route('/login/:password/:email').get(LogginCtrl.getLoggin);

  //Todas las empresas
  router.route('/empresas').get(auth, solicitudCompraCTR.getEmpresas);
  //Todas las Areas de la base de datos registradas
  router.route('/area/:IdUser').get(auth, solicitudCompraCTR.getArea);
  //Todas los Centos de Costos
  router.route('/costos').get(auth, solicitudCompraCTR.getCentroCostos);
  //Todas las cuentas de mayor
  router.route('/cmayor').get(auth, solicitudCompraCTR.getCuentaMayor);
  //Todas las Sucursales Plazas
  router.route('/plaza/:Id').get(auth, solicitudCompraCTR.getSucursalesPlazaByIdEmpresa);
  //Todas las Imputaciones
  router.route('/imputaciones').get(auth, solicitudCompraCTR.getAllImputaciones);
  //Eseptuamos las imputaciones oara no elegir la tipo numero 6 , tipos de imputacion por ITEM
  router.route('/imputacionesforitem').get(auth, solicitudCompraCTR.getImputacionesforItem);
  //Todas las Posiciones
  router.route('/posicion').get(auth, solicitudCompraCTR.getAllPosiciones);
  //Recupera Posicion por tipo de Imputacion seleccionada
  router.route('/posicionbyimputacion/:Id').get(auth, solicitudCompraCTR.getAllPosicionByImputacion);
  //Trae todos los Grupos de Articulos
  router.route('/garticulo').get(auth, solicitudCompraCTR.GrupoArticulo);
  //trae todo los Grupos de Compra
  router.route('/gcompra').get(auth, solicitudCompraCTR.GrupoCompra);
  //trae todos los tipos de moneda registrados en la db
  router.route('/moneda').get(auth, solicitudCompraCTR.AllMoneda);
  //trae todos los materiales de la db
  router.route('/materiales').get(auth, solicitudCompraCTR.getAllMateriales);
  //trae todos los almacenes
  router.route('/almacen').get(auth, solicitudCompraCTR.getAllAlmacenes);
  //trae todos los activos registrados
  router.route('/activo').get(auth, solicitudCompraCTR.getAllActivos);
  //trae todas la Necesidades
  router.route('/necesidad').get(auth, solicitudCompraCTR.getAllNecesidad);
  //trae el usurio autorizador de el area a la que le especifico
  router.route('/usrauth/:id').get(auth, solicitudCompraCTR.UsuarioAuth);
  //recuperamos las categorias de la base de datos.
  router.route('/categorias').get(auth, solicitudCompraCTR.AllCategorias);
  //agregamos una nueva categoría
  router.route('/newcate/:category/:descripcion').get(auth, solicitudCompraCTR.NewCategory);
  //recuperamos categorias espesificas para cada Comprador
  //router.route('/categoryforcomprador/:IdUser').get(auth, solicitudCompraCTR.AllCategoriasforUserComprador);
  
  //trae todos los activos fijos
  //router.route('/activo').get(solicitudCompraCTR.getAllActivo);
  //Recuperamos la lista de las categorías no usadas por los compradores para mostrarlas y que se puedan asignar a un comprador distinto
  router.route('/catnousada').get(auth, solicitudCompraCTR.AllCategoriasnoUsadasporCompradores);
  //recuperamos todos los usuarios Compradores para mostrarlos en la vista de PERMISOS CAT.
  router.route('/userforcat').get(auth, solicitudCompraCTR.AllUsersCompradores)
  //Lista de Categorias asgnadas por Usuario para administrarlas
  router.route('/listcat/:IdUser').get(auth, solicitudCompraCTR.ListCategoriasforUsuario);
  //Asignamos una nuveva categoria para adminsitrar por el usuario seleccionado
  router.route('/insertcatforuser/:IdUser/:IdCategoria').get(auth, solicitudCompraCTR.InsertNewCategoryforComprador)
  //Eliminamos una categoria en las 2 tablas
  router.route('/catdelete/:IdCategoria').get(auth, solicitudCompraCTR.DeleteCategoria);
  //eliminamos una categoria por usuario, para que pueda quedar libre para su asignacion
  router.route('/deletecat/:IdUser/:IdCategoria').get(auth, solicitudCompraCTR.DeleteCategoriaForUser);
  //cambio de categoria , esto por si se llega a quivocar el solicitante lo puedna cambiar la gente de ENIXE
  router.route('/changcat/:IdSol/:IdCat').get(auth, solicitudCompraCTR.ChangedCategoriForSolicitud)
  //hacemos el insert de una Nueva Solicitud de Tipo A
  router.route('/newsolicitud1').post(auth, solicitudCompraCTR.insertSolicitudNewT1);
  //hacemos el insert de una Nueva Solicitud de Tipo F

  //hacemos el insert de una Nueva Solicitud de Tipo K

  //hacemos el insert de una Nueva Solicitud de Tipo Normal




  //Direcciones por Usuario para hacer peticiones por Direccion
  router.route('/diruser/:IdUsuario').get(auth, solicitudCompraCTR.getDirforUser);
  //reegresa los status de solicitud para comrpas y para comprador
  router.route('/statususr/:IdRole/:isCompras').get(auth, solicitudCompraCTR.getStatusCompras);
  //Solicitudes Registradas con status Nueva Solicitud
  router.route('/solreg/:status/:direccion').get(auth, solicitudCompraCTR.getSolicitudRegistradasForstatus);
  //Solicitusdes registradas para los compradores hacemos un filtro extra para las categorias.
  router.route('/solregcat/:status/:direccion/:idusr').get(auth, solicitudCompraCTR.getSolicitudRegistradasForstatusanCategoria);
  //Solicitudes registradas por un Estatus espesifico solo para el SubDirector de Finanzas (Presupuesto)
  router.route('/solregpresu/:IdStatus').get(auth, solicitudCompraCTR.getSolicitudeRegistradasforstatusPresupuesto);
  //se actualiza el Status de la SOlciitud a Revisada por Compras
  router.route('/getstatuscompras/:IdSolPed/:IdStatus').get(auth, solicitudCompraCTR.ChangeSattusCompras)
  //Solicitudes Registradas con Status Presupuesto Autoriza. de cualquier area
  //router.route('/solregFinan/:status').get(solicitudCompraCTR.getSolicitudRegistradasForstatus);
  //Detalle de Solicitudes (se manda a llaar cuado dan click en el boton de detalle solicitud)
  router.route('/detallesol/:idsol').get(auth, solicitudCompraCTR.getDetalleSolicitudPedido);
  //se recuepra la infromacion de los sub items que estan relacionados con el item seleccionado
  router.route('/detalleProd/:idprod').get(auth, solicitudCompraCTR.getDetalleSubHijos);
  //Solicitudes registradas por usuario 
  router.route('/solforusr/:idusr/:IdRole').get(auth, solicitudCompraCTR.getAllSolicitudesforUsuario);
  //traer los status de las solicitudes para llenar combo
  router.route('/status/:idRole').get(auth, solicitudCompraCTR.getStatusSolicitud);
  //actualizar el status de la Solicitud de Pedido
  router.route('/updatestatus').post(auth, solicitudCompraCTR.UpdateStatusdeSolicitud);
  //se revisa el role que tenga como excepcion si es que tiene excepcion la direccion a consultar
  router.route('/checkroleexcepcion/:IdUser').get(auth, solicitudCompraCTR.getRoleExcluirSolPedido);
  
  // //insertando mensaje recuperado de sap (ID)
  // router.route('/sapid/:IdSol/:Mensaje').get(solicitudCompraCTR.InsertMessageSapId);
  // //recuperamos el id Insertado de SAP para poder evaluar el mensaje y asi determinar si se actualiza el status de la Solicitud
  // router.route('/idsapsol/:IdSolPed').get(solicitudCompraCTR.GetIdSAP); 


  // Cats
  router.route('/cats').get(catCtrl.getAll);
  router.route('/cats/count').get(catCtrl.count);
  router.route('/cat').post(catCtrl.insert);
  router.route('/cat/:id').get(catCtrl.get);
  router.route('/cat/:id').put(catCtrl.update);
  router.route('/cat/:id').delete(catCtrl.delete);

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(auth ,userCtrl.getAll);
  router.route('/direcciones').get(auth ,userCtrl.getAllDirecciones);
  router.route('/users/count').get(auth , userCtrl.count);
  router.route('/role').get(auth, userCtrl.Allrole);
  router.route('/direccion').get(auth ,userCtrl.AllDireccion);
  router.route('/filteruserDirections/:IdDireccion').get(auth, userCtrl.FilterUserDIreccion);
  router.route('/user').post(auth, userCtrl.insert);
  router.route('/user/:id').get(auth, userCtrl.get);
  router.route('/user/:id').put(auth, userCtrl.update);
  router.route('/deleteuser/:id').get(auth, userCtrl.deleteUsers);
  router.route('/deletedir/:IdDir').get(auth, userCtrl.deleteDireccion);
  router.route('/createdir/:NameDir').get(auth, userCtrl.createNewDireccion);
  router.route('/updatedir/:IdDir/:UpdateDir').get(auth, userCtrl.UpdateDireccion);
  
  //rutas para actualizar datos generales de usuario, recuperar las direcciones, agregar y eliminar.
  router.route('/updateusr').post(auth, userCtrl.UpdateUsrDataGeneral);
  router.route('/dirusr/:Id').get(auth, userCtrl.getDireccionesporUsuario);

  //agregar y eleiminar direccion a usuario con role director area, Gerente
  router.route('/adddir/:IdUsr/:IdDir').get(auth, userCtrl.AddDirUser);
  router.route('/deldir/:IdUsr/:IdDir').get(auth, userCtrl.DeleteDirUser);

  //se solicita los datos de todas las SolPed para el administrador
  router.route('/soladmin').get(auth, solicitudCTR.getAllsolicitudeforAdmin);
  router.route('/statusadmin').get(auth, solicitudCTR.getAllStatusSolicitudRegistradas);
  router.route('/upstatusAdmin/:IdSolicitud/:IdStatusUpdate').get(auth, solicitudCTR.UpdateStatusformAdmin);

  //ruta de api para la administracion de permisos para validaciones por direccion
  router.route('/dirauth').get(auth, solicitudCTR.getAllDirectionsforAutorizations);
  router.route('/roleauth').get(auth, solicitudCTR.getAllRolesforAuth);
  router.route('/insertexeptionauth/:TipoSolicitud/:IdDireccion/:IdRole').get(auth, solicitudCTR.InsertnewexceptionAuth);
  router.route('/lisrdirauth').get(auth, solicitudCTR.listDirAuth);
  router.route('/dirauthforauth/:IdDireccion').get(auth, solicitudCTR.AuthExeptionforDirection);
  router.route('/deleteauth/:IdAuth').get(auth, solicitudCTR.DeleteAuthforRoleandDir);

  //usandowebservices
  //router.route('/webSer').get();
 
  //recuperamos el usuario que autoriza de los diferentes rooles por Direccion.
  router.route('/getUserValida/:IdDireccion/:IdRole').get(auth, solicitudCompraCTR.getallDataForUserAuth);
  //Envio de email cuando es nueva solicitud
  router.route('/emailnew/:IdSolicitud/:IdStatus/:IdArea/:NombreArea/:Solicitante/:IdRol/:NombreAutorizador/:EmailAutorizador/:sendnewStatusAutoriza/:sendnewStatusRechazo').get(auth, solicitudCompraCTR.SendEmailNew);
  //email route para Director de Area y Solicitante
  router.route('/email/:IdSolicitud/:IdStatus/:IdArea/:Solicitante/:IdRol/:NombreAutorizador/:EmailAutorizador').get(auth, solicitudCompraCTR.SendEmailDirectorArea);
  //Email ruta para Geretntes de Finanzas y solicitante
  router.route('/emailgerentef/:IdSolicitud/:IdStatus/:IdArea/:Solicitante/:IdRol/:NombreAutorizador/:EmailAutorizador').get(auth, solicitudCompraCTR.SendEmailGerenteFinanzas);
  //Envio de correo para Administrador Solicitante
  router.route('/emailadmin/:IdSolicitud/:IdStatus/:IdArea/:Solicitante/:IdRol/:NombreAutorizador/:EmailAutorizador').get(auth, solicitudCompraCTR.SendEmailAdmin);
  //Actualizar Status desde el correo enviado anteriormente
  router.route('/upstatus/:IdSolicitud/:Solicitante/:IdStatus').get(solicitudCompraCTR.UpStatus);

  


  //ruta para procesar el archivo subido en el front 
  router.route('/upload/singlefile').post(UploadCTR.upLoadSingleFile);
  //crear archivo de excel con informacion de la solicitud para tablas comparativas
  router.route('/getfilecompras/:ID').get(auth, UploadCTR.createFileComrpas);
  

  
  router.route('/upinfosol').post(auth, solicitudCompraCTR.UpdateinfoSolicitud);
  router.route('/upinfoprod').post(auth, solicitudCompraCTR.UpdateinfoProduct);
  router.route('/updatechild').post(auth, solicitudCompraCTR.updatechilds);
  
  router.route("/hellosign").get(auth, solicitudCompraCTR.gethelloSing);
  router.route("/callback").get(auth, solicitudCompraCTR.callback);
//-------------------------------------------------------------------CONSUMO INTERNO---------------------------------------------------------------------------------------------
  //recuperamos las diferentes areas que puede realizar solicitudes de Consumo Interno
  router.route('/areaconsumoInt/:IdUser').get(auth, solicitudCompraCTR.getArea);
  //seccion donde se agregan las rutas para solicitar infromacion para la Solicitud de Consumo Interno
  router.route("/solicitudesconsumointernoforuser/:IdUser").get(auth ,solconsumoInterno.getAllSolicitudesConsumoInternoForUser);
  //role para mostrar en la seccion de administracion
  router.route("/roleconsumo").get(auth, solconsumoInterno.getRolesSolicitudConsumo);
  //Solicitudes de consumo interno por Direccion y estatus de User 
  router.route("/allsolconsumointforstatusrole/:IdRole/:IdDireccion/:IdStatus").get(auth ,solconsumoInterno.getAllSolicitudConsumoIntfor_Dir_Role);
  //usuario autorizador para envio de correo primer nivel
  router.route("/alldatauserauthsolconsumo/:IdUser/:IdRole").get(auth ,solconsumoInterno.getUserAuthSolConsumo);
  //recuperamos el Id del role que se escluira si es que se tiene alguno para la direccion que se consulta
  router.route("/dirauthforauthconsumoInt/:IdDireccion").get(auth, solconsumoInterno.AuthExceptionforDireccion);
  //insertar una nueva solicitude de Consumo Interno
  router.route("/insertnewsolconsumo").post(auth ,solconsumoInterno.InsertNewSolConsumoInterno);
  //Actualizacion de Status Solciitud consumo interno
  router.route("/updatesatussolconfromlocal/:IdSolicitud/:IdNewStatus").get(auth, solconsumoInterno.UpdateSstatusSolcitudConsumoInterno);
  //envio de correo de Nueva solciitud de Consumo interno
  router.route("/sendnewemailsolconsumo").post(auth ,solconsumoInterno.SendNewEmailSolConsumoInterno);
  //envio de correso para gerente director dependiendo el estatus de la solciitud y del role
  router.route("/sendemailsforroles").post(auth, solconsumoInterno.SendEmailSolConsumoInternoforRole);
  //envio de autorizacion o rechazo a nivel correo electronico para la actualizacion del estatus
  router.route("/upstatusconsumofromemail/:IdSolicitud/:Solicitante/:IdStatus").get(auth ,solconsumoInterno.UpStatusConsumoInternofromEmail);
  //recuperamos las solicitudes de consumo iterno creadas por el usuario
  router.route("/solconsumointforuser/:IdUser/:IdRole").get(auth ,solconsumoInterno.GetAllSolicitudsConsumoInternoporUsuario);
  //recuperamos los datos como la empresa y el centro seleccionado para el Id de la solicitud para despues mostrar datos actualizables para el Usuario solicitnate
  router.route("/inicialdataforupdate/:IdSol").get(auth ,solconsumoInterno.GetDataSolicitudConsumoDataInitial);
  //recuperando Productos por solicitud de consumo interno
  router.route("/productosforsolconsumoint/:IdSolConsumo").get(auth ,solconsumoInterno.GetAllProductosPorSolicitudConsumoInterno);
  //recuperamos list de status para cambiar de estatus una solicitude de consumo interno por role.
  router.route("/statusforrole/:IdRole").get(auth, solconsumoInterno.GetAllStatusforRole);
  //lista de todas las solicitudes de consumo interno ingresadas para visualizar por el administrador
  router.route("/allsolconsumoadmin").get(auth, solconsumoInterno.GetAllSolConsumoInternoForAdmin);
  //lista de todos los estatus creados para la solicitud de consumo interno
  router.route("/allstatusadmin").get(auth, solconsumoInterno.GetAllStatusConsumoInternoForAdmin);
  //actualizacion de estatus para el usuario administrador
  router.route("/changedstatusadmin/:IdSolicitud/:IdStatus").get(auth, solconsumoInterno.UpdateStatusforAdmin)
//------------------------------------------------------------------------------------------------------------------------------------------------------------------

  



  // Apply the routes to our application with the prefix /api
  app.use('/api', router);



  //ejemplo de Hellosing
//   const hellosign = require ( 'hellosign-sdk' ) ({ clave : 'SIGN_IN_AND_CREATE_API_KEY_FIRST' }); const opts = { 
//   test_mode : 1 , 
//   clientId : 'b6b8e7deaf8f0b95c029dca049356d4a2cf9710a' , 
//   asunto : 'El NDA del que hablamos' , 
//   mensaje : 'Firme este NDA y luego podremos discutir más'. , 
//   firmantes : [ { 
//       email_address : 'alice@example.com' , 
//       nombre   

      
//      : 'Alice' } ], 
//   archivos : [ 'NDA.pdf' ] }; 
// HelloSign . firmaRequest . createEmbedded ( opta ). entonces (( res ) => { // manejar respuesta }). catch (( err ) => { // manejar error }); 
  
  //Tarea Programada a una hora espesifica diario para crear archivo XLS de las Solicitudes de Pedido
  'use strict';
  var cron = require('node-cron');
  cron.schedule('0 */5 * * * *', function(req, res){
    //esta tarea se ejecuta alas 12:01:00 cada dia.
    console.log("Esta tarea se ejecuta cada 6 hrs ........>>");
   
            var Checkhora = new Date();
            console.log(Checkhora);
            var hora = Checkhora.getHours();
            console.log(hora);
    //if(hora == 7 || hora == 13 || hora == 19 ){
              var fs = require('fs');
              var fecha = new Date(new Date().toUTCString());
            
              var dia = fecha.getDate();
              var mes = fecha.getMonth();
              var MES = mes +1; 
              var año = fecha.getFullYear();
              
              var hora = fecha.getHours();
              var minutos = fecha.getMinutes();
              var segundos = fecha.getSeconds();
              var HoraExacta:string = hora+":"+minutos;
              var restaHoras = hora - 6;
              var seisHorasAntes = restaHoras+":00";

              var FechaInicial = año+"-"+MES+"-"+dia+" "+seisHorasAntes;
              var FechaFinal = año+"-"+MES+"-"+dia+" "+HoraExacta;

              console.log("Esta es la hora Inicial----->" + FechaInicial);
              console.log("Esta es la hora final----->" + FechaFinal);
             
              console.log(HoraExacta);
             
              var sql = require("mssql");
              var env = process.env.NODE_ENV || 'SERWEB';
              var config = require('../server/controllers/connections/servers')[env];

              new sql.ConnectionPool(config).connect().then(pool =>{
                return pool.request()
                                    // .input('FechaInicial', sql.VarChar, '2020-04-10 18:50')
                                    // .input('FechaFinal', sql.VarChar, '2020-04-10 20:00')
                                    .execute('DataInsertSAP')
              }).then(result =>{
                var stringify = require('csv-stringify');
                
                
                console.log(result.recordset);

                var Data = new Object();
                
                Data = result.recordset;
                if(Data == undefined || Data == ''){
                  console.log("no se genera ningun archivo");
                }else{
                  var FileName = dia+" "+MES+" "+año+" "+hora+" "+minutos+".csv";
                  console.log( stringify(Data));
                  stringify(Data, function(err, output){
                    fs.writeFile(FileName, output, 'utf-8', function(err){
                      if(err){
                        console.log("ocurrio un error de algun tipo        " + err);
                      }else{
                        console.log(".....Se creo el Archivo CSV.... ");
                      }
                    })
                  });
  
                  var EasyFtp = require ("easy-ftp");
                  var ftp = new EasyFtp();
  
                  var config = {
                    //host:"10.29.128.106",
                    host: "10.29.148.24",
                    type:"",
                    port:"",
                    username:"solpedidossap",
                    password:"grup0imagensap"
                    // username:"dalet",
                    // password:"ps1dalet" 
                  };
  
                  ftp.connect(config);
                  console.log("pasamos a subir el archivo.....");
                  //'../ImagenFinanzasFabi/'+FileName, '/'+FileName
                  //var upfile = [{local:'../ImagenFinanzasFabi/' + FileName, remote:'/'+FileName}];
                  ftp.cd("/", function(err, path){
                    ftp.upload('../IntranetProduccion/'+FileName, FileName, function(err){
                      if(err) console.log(err);
                      else console.log("Se dejo el Archivo en el //10.29.148.24/ " + "El nombre del Archivo es...  " + FileName + "  en la hora  " + HoraExacta);
                      ftp.close();
                    });
                  });	
  
                  //creacion de update para las solicitudes que se envian a sap-
                  //recorrer los valores de las solicitudes para hacer updates por cada solicitud ingresada
                  var UpdateData = new Array();
                  UpdateData = result.recordset;
                  console.log("cantidad de datos almacenados");
                  console.log(UpdateData.length);
                  var updateStatus = 10;
                  UpdateData.forEach(function(val, index, array){
                    console.log("Id de la SOlicitud a Actualizar-->"+val.IdSolicitud);
                    
                    // recorremos todos los valores de las solicitudes que se autorizo el presupuesto
                    // y rrecorreremos cada Solicitud para actualizar sus status de 7 a 8.
                    var sql = require("mssql");
                    var env = process.env.NODE_ENV || 'SERWEB';
                    var config = require('../server/controllers/connections/servers')[env];
  
                    new sql.ConnectionPool(config).connect().then(pool =>{
                      return pool.request()
                      .input('IdSolicitudPedido', sql.Int, val.IdSolicitud)
                      .input('IdStatus', sql.Int, updateStatus)
                      .execute('UpdateStatusInsertFileSentSAP');
                    }).then(result=>{
                      console.log(result);
                    });
  
                  });  
                }
                
              }).catch(err =>{
                if(err) console.log(err);
              });

  });




  
}
