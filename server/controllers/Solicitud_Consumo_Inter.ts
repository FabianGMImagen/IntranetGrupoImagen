import { ConstantPool } from "@angular/compiler/src/constant_pool";
import { ɵConsole, Input } from "@angular/core";
import { connect } from "net";
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const Intranet = "http://localhost:4200";
const SERVER = "http://localhost:3000";
const CLIENTID = "149352725404-hdc5872pn8h3ns841ve1tfsgtj9btlra.apps.googleusercontent.com";
const CLIENTSECRET = "8EVBFB3CsQGdl1hmo8Ga1RjC";
const REDIRECTURL = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04w28OpEOrPHuCgYIARAAGAQSNwF-L9IrHcNzNa8vxh6WaGYbRy5D2XriXNuB8lZAOCctLI5JH_D9ossGPyTphZjYpE9xyNKrQ28";
export default class SolicitudConsumoInterno {
    

  getAllSolicitudesConsumoInternoForUser = (req, res) => {
    console.log(
      "dentro del metodo para recueprar todas las solicitudes de consumo interono por Usuario"
    );
    console.log(req.params.IdUser);
    var sql = require("mssql");
    var env = process.env.NODE_ENV || "SERWEB";
    var config = require("../controllers/connections/servers")[env];
    new sql.ConnectionPool(config)
      .connect()
      .then((pool) => {
        return pool
          .request()
          .input("IdUser", sql.Int, req.params.IdSolicitud)
          .execute("GetAllSolConsumoInterno");
      })
      .then((result) => {
        console.log(result);
        res.status(201).json(result.recordset);
        sql.close();
      })
      .catch((err) => {
        res.json(err);
        sql.close();
      });
  };

  getRolesSolicitudConsumo = (req, res) => {
    var sql = require("mssql");
    var env = process.env.NODE_ENV || "SERWEB";
    var config = require("../controllers/connections/servers")[env];
    var Query =
      "SELECT IdRoleConsumoInterno ,Nombre ,PuedeCambiarStatusSolicitudConsumoInterno FROM RoleConsumoInterno";
    const pool = new sql.ConnectionPool(config, (err) => {
      pool.request().query(Query, (err, result) => {
        // ... error checks
        if (err) console.log(err);
        console.log(err);
        res.status(200).json(result.recordset);
      });
    });
  };

  getUserAuthSolConsumo = (req, res) => {
    console.log("recuperamos el  user authorizador");
    var sql = require("mssql");
    var env = process.env.NODE_ENV || "SERWEB";
    var config = require("../controllers/connections/servers")[env];
    new sql.ConnectionPool(config)
      .connect()
      .then((pool) => {
        return pool
          .request()
          .input("IdUsuario", sql.Int, req.params.IdUser)
          .input("IdRole", sql.Int, req.params.IdRole)
          .execute("GelAllDataUserAuthforSolConsumo");
      })
      .then((result) => {
        //console.log(result)
        res.status(201).json(result.recordset);
      })
      .catch((err) => {
        console.log("Error al recuperar el usuario autorizador" + err);
        res
          .status(401)
          .json({ message: "Error al Recuperar el Dato del Autorizador" });
      });
  };

  getAllSolicitudConsumoIntfor_Dir_Role = (req, res) => {
    console.log(req.params.IdRole);
    console.log(req.params.IdDireccion);
    console.log(req.params.IdStatus);
    return "los datos de la solicitud de consumo interno ";
  };

  getArea = (req, res) => {
    console.log(
      "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++" +
        req.params.IdUser
    );
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || "SERWEB";
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre
    var config = require("../controllers/connections/servers")[env];
    new sql.ConnectionPool(config)
      .connect()
      .then((pool) => {
        return pool
          .request()
          .input("IdUser", sql.Int, req.params.IdUser)
          .execute("DireccionPorUsuario");
      })
      .then((resultt) => {
        console.log(resultt);
        res.status(201).json(resultt.recordset);
        sql.close();
      })
      .catch((err) => {
        if (err) console.log("errror al hacer el insert--->" + err);
        sql.close();
      });
  };

  AuthExceptionforDireccion = (req, resp) => {
    // se recupera el Id del role que se requiere exlcuir si es que existe uno.
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || "SERWEB";
    console.log("???????????????????????????????????????");
    console.log(req.params.IdDireccion);
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre
    var config = require("../controllers/connections/servers")[env];
    new sql.ConnectionPool(config)
      .connect()
      .then((pool) => {
        return pool
          .request()
          .input("IdDireccion", sql.Int, req.params.IdDireccion)
          .execute("ConsultdirexepctionAuthConsumoInt");
      })
      .then((result) => {
        console.log(result);
        resp.status(201).json(result.recordset);
        sql.close();
      })
      .catch((error) => {
        if (error) console.log("errror al hacer el insert--->" + error);
        sql.close();
      });
  };

  InsertNewSolConsumoInterno = (req, res) => {
    console.log(
      "dentro del metodo para insertar una nueva solicitud de Consumo Interno"
    );
    // console.log(req.body.IdUserSolicitante);
    // console.log(req.body.Empresa);
    // console.log(req.body.Centro);
    // console.log(req.body.Justificacion);
    // console.log(req.body.IdRole);
    // console.log(req.body.Fecha);
    console.log(req.body.Productos);
    console.log(req.body.Productos[0].Almacen);
    console.log(req.body.Productos.Caducidad);
    var sql = require("mssql");
    var env = process.env.NODE_ENV || "SERWEB";
    var config = require("../controllers/connections/servers")[env];

    new sql.ConnectionPool(config)
      .connect()
      .then((pool) => {
        return pool
          .request()
          .input("IdRole", sql.Int, req.body.IdRole)
          .input("IdStatusSol", sql.Int, req.body.IdStatusSolConsumoInt)
          .input("IdUsuarioSolicitante", sql.Int, req.body.IdUserSolicitante)
          .input("FechaSolicitud", sql.VarChar, req.body.Fecha)
          .input("IdEmpresa", sql.VarChar, req.body.Empresa.Bukrs)
          .input("NameEmpresa", sql.VarChar, req.body.Empresa.Butxt)
          .input("IdCentro", sql.VarChar, req.body.Centro.IdCentro)
          .input("NameCentro", sql.VarChar, req.body.Centro.NombreCentro)
          .input("Justificacion", sql.VarChar, req.body.Justificacion)
          .output("output_IdSolConsumo", sql.Int)
          .execute("InsertNewSolConsumoInterno");
      })
      .then((result) => {
        console.log(result.output.output_IdSolConsumo);
        req.body.Productos.forEach((element) => {
          new sql.ConnectionPool(config)
            .connect()
            .then((pool) => {
              return pool
                .request()
                .input("IdSolicitudConsumoInterno", sql.Int, result.output.output_IdSolConsumo)
                .input("Cantidad", sql.Int, element.Cantidad)
                .input("IdAlmacen", sql.VarChar, req.body.Productos[0].Almacen)
                .input("NameAlmacen", sql.VarChar, req.body.Productos[0].AlmacenName)
                .input("IdMaterial", sql.VarChar, req.body.Productos[0].Material)
                .input("NameMaterial", sql.VarChar, req.body.Productos[0].MaterialName)
                .input("IdCentroCostos", sql.VarChar, req.body.Productos[0].CentroCosto)
                .input("NameCentroCostos",sql.VarChar, req.body.Productos[0].CentroCostoName)
                .input("IdCuentaMayor", sql.VarChar, req.body.Productos[0].CuentaMayor)
                .input("NameCuentaMayor", sql.VarChar, req.body.Productos[0].CuentaMayorName)
                .input("Caducidad", sql.VarChar, req.body.Productos[0].Caducidad)
                .input("IdUnidadMedida", sql.VarChar, req.body.Productos[0].UnidadMedida)
                .input("NameUnidadMedida", sql.VarChar, req.body.Productos[0].NameUnidadMedida)
                .execute("InsertProductsbySolConsumo");
            })
            .then((response) => {
              //console.log(response);
              res.json({
                message:
                  "Se Genero Correctamente la Solicitud de Consumo Interno",
                idsol: result.output.output_IdSolConsumo,
              });
            })
            .catch((err) => {
              console.log(
                "error al realizar el insert de los productos por sol consumo interno" +
                  err
              );
              res.status(401).json({
                message:
                  "Error al guardar algunos datos de la solicitud por favor intenta de nuevo mas tarde.",
              });
            });
        });
      })
      .catch((err) => {
        console.log("error al guardar la nueva solicitud" + err);
        res.status(401).json({
          message:
            "Error al guardar la solicitud de consumo interno, por favor intenta de nuevo mas tarde",
        });
      });
    sql.close();
  };

  SendNewEmailSolConsumoInterno = (req, res) => {
    console.log(
      "entrando al metodo para enviar el mail a la persona que autoriza la SolConsumo"
    );
    // console.log(req.body.IdSolicitud);
    // console.log(req.body.StatusSol);
    // console.log(req.body.NameSolicitante);
    // console.log(req.body.Nameauth);
    // console.log(req.body.EmailAuth)<
    var accessToken: any;
    var statusAutoriza = 2;
    var statusRechaza = 3;
    const oauth2Client = new google.auth.OAuth2(
      CLIENTID, //client ID
      CLIENTSECRET, // Client Secret
      REDIRECTURL// Redirect URL
    );

    oauth2Client.setCredentials(
      {
        refresh_token:REFRESH_TOKEN,
      },
      (err) => {
        console.log("error al recuperar el token");
        console.log(err);
      }
    );
    
   oauth2Client.getAccessToken()
      .then((token) => {
        //console.log(token.token);
        accessToken = token.token;
        //cuanta de correo de donde se enviaran los diferentes correos
        var nodemailer = require("nodemailer");
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          host: "smtp.gmail.com",
          port: 587,
          auth: {
            user: "intranet@gimm.com.mx",
            type: "OAuth2",
            // clientId: '544106101605-rovj6b5vibmu9i8o6gt7f4ug08bc9sq0.apps.googleusercontent.com',
            // clienteSecret: '1qoVyt-wBMWxfP1y1-mgB0OS',
            // refreshToken: '1//0462blb5qVoUqCgYIARAAGAQSNwF-L9IreGtA-FOLTrvYbj_8Y0iwK5HOfm_MbpJO-NaKYuYlT0drUZM55A5jiYltqbf5mcVDr0M',
            clientId:CLIENTID,
            clienteSecret: CLIENTSECRET,
            refreshToken:REFRESH_TOKEN,
            accessToken: accessToken,
            //expires: 1494388182480
          },
          tls: { rejectUnauthorized: false },
          debug: false,
        });

        var mailOptionJefeDirecto = {
          to: req.body.EmailAuth,
          cc: "marco.garcia@gimm.com.mx",
          subject: req.body.StatusSol,
          html:
            '<div style="font-family: "Roboto", "Helvetica", "Arial", sans-serif;">' +
            "<Strong>TIENES UNA SOLICITUD DE CONSUMO INTERNO PENDIENTE POR REVISAR DE : </Strong>" +
            req.body.NameSolicitante +
            "<br>" +
            "<Strong>CON UN ID DE SOLICITUD : </Strong>" +
            req.body.IdSolicitud +
            "<br><br>" +
            "<Strong>FAVOR DE ENTRAR A INTRANET PARA SU REVISION DETALLADA</Strong> <br>" +
            "<br>" +
            "<Strong>EN CASO DE DENEGAR LA SOLICITUD SE DEBERA ENTRAR A LA INTRANET PARA CAPTURAR MOTIVO DE RECHAZO</Strong>" +
            "<br>" +
            '<a style="color: #007bff !important; text-decoration: none; padding-top:5px" href="' +
            Intranet +
            '">ENTRAR A INTRANET</a>' +
            "<br>" +
            "<br>" +
            //Envio de Botones para la confirmacion desde el correo Autorizacion o Denegacion de Solicitud
            '<button type="button" style="text-decoration: none; border: 1px solid #90caf9;  border-radius: 5px; padding-rigth: 5px; background-color: #90caf9; "><a href="' +
            SERVER +
            "/api/upstatusconsumo/" +
            req.body.IdSolicitud +
            "/" +
            req.body.NameSolicitante +
            "/" +
            statusAutoriza +
            '" style="text-decoration:none; color: #fff !important;">AUTORIZAR</a></button>' +
            '<button type="button" style="text-decoration: none; border: 1px solid #f48fb1;  border-radius: 5px; padding-rigth: 5px; background-color: #f48fb1; "><a href="' +
            SERVER +
            "/api/upstatusconsumo/" +
            req.body.IdSolicitud +
            "/" +
            req.body.NameSolicitante +
            "/" +
            statusRechaza +
            '" style="text-decoration:none; color: #fff !important;">DENEGAR</a></button>' +
            "<br>" +
            "<br>" +
            "<p> POR FAVOR NO RESPONDER A ESTE MENSAJE, ES UN MENSAJE AUTOMATICO<p/>" +
            "</div>",
        };

        smtpTransport.sendMail(mailOptionJefeDirecto, function (err, resp) {
          if (err) {
            //console.log(err);
            //console.log("*******************************"+resp + "************************************************");
            res.json({ message: "error al enviar el correo" }).end();
          } else {
            console.log("se envio correctamente el el mail de sol nueva ");
            res
              .json({
                message: "Se envio correctamente el mail a el Autorizador",
              })
              .end();
          }
        });
      })
      .catch((err) => {
        console.log(err);
        res
          .status(401)
          .json({
            message:
              "Error al comucnicarse con el proveedor de correo para su envio.",
          })
          .end();
      });
  };

  UpStatusConsumoInterno = (req, resp) => {
    //nivel de autorizacion para Gerente pero se valida los caso de excepcion para Gerente y Director
    if (req.params.IdStatus == 2 || req.params.IdStatus == 3) {
      console.log("-------------------Autoriza a nivel GERENTE");
      var sql = require("mssql");
      var env = process.env.NODE_ENV || "SERWEB";
      var config = require("../controllers/connections/servers")[env];
      console.log(
        "este es el id de la SOlicitud---->" + req.params.IdSolicitud
      );
      new sql.ConnectionPool(config)
        .connect()
        .then((pool) => {
          return pool
            .request()
            .input("IdSolicitud", sql.Int, req.params.IdSolicitud)
            .execute("EmailUserValidationConsumoInt");
        })
        .then((resultExclution) => {
          console.log(resultExclution.recordsets);
          console.log(resultExclution.recordsets);
          console.log("/*/*/*/*/*/*/*/*/*/*/*/*//*/*/");
          let roleaexcluir = (resultExclution.recordsets[2][0].IdRoleConsumoInterno == 0 || resultExclution.recordsets[2][0].IdRoleConsumoInterno == undefined)
              ? 0
              : resultExclution.recordsets[2][0].IdRoleConsumoInterno;
          var EstatusSolicitud = resultExclution.recordsets[1][0].IdStatusSolicitud;

          //validamos el estatus de la solicitd de consumo
          if (EstatusSolicitud === 1) {
            if (roleaexcluir === 3) {
              //el role que se excluye es el de direccion
              //validamos el valor que nos envian como peticion para que se actualice a ese esattus
              //console.log("validamos el status que se requiere actualizar --> " + req.params.IdStatus);
              let newEstatus =
                req.params.IdStatus == 2
                  ? 4
                  : req.params.IdStatus == 3
                  ? 5
                  : 1;

              let NameEstatusSolConsumo =
                newEstatus === 4
                  ? "S. C. I. AUTORIZADA POR DIRECCION"
                  : newEstatus === 5
                  ? "S. C. I. RECHAZADA POR DIRECCION"
                  : "";

              var EmailAuth = resultExclution.recordsets[0][0].Email;
              var IdSolicitud = req.params.IdSolicitud;
              var NameSolicitante =
                resultExclution.recordsets[4][0].NombreCompleto;
              var EmailSolicitante = resultExclution.recordsets[4][0].Email;

              // console.log(EmailAuth);
              // console.log(IdSolicitud);
              // console.log(NameSolicitante);
              // console.log(EmailSolicitante);

              var sql = require("mssql");
              var env = process.env.NODE_ENV || "SERWEB";
              var config = require("../controllers/connections/servers")[env];
              new sql.ConnectionPool(config)
                .connect()
                .then((pool) => {
                  return pool
                    .request()
                    .input("NewEstatus", sql.Int, newEstatus)
                    .input(
                      "IdSolicitudConsumo",
                      sql.Int,
                      req.params.IdSolicitud
                    )
                    .execute("UpdateStatusfromEmailConsumoInterno");
                })
                .then(async (result) => {
                  //console.log(resultExclution.recordsets[4]);
                  //si se actualiza el estatus de la solicitud correctamente pasamos a mandar mail al sigueinte autorizador.
                  var mailOptionAutorizaAlmacenista = {
                    to: EmailAuth,
                    cc: "marco.garcia@gimm.com.mx",
                    subject: "SOLICITUD DE CONSUMO INTERNO PENDIENTE",
                    html:
                      "<head>" +
                      "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                      "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                      "</head>" +
                      "<body>" +
                      "<Strong>TIENES UNA SOLICITUD PENDIENTE POR REVISAR DE : </Strong>" +
                      NameSolicitante +
                      "<br>" +
                      "<Strong>CON UN ID DE SOLICITUD : </Strong>" +
                      IdSolicitud +
                      "<br><br>" +
                      "<Strong>FAVOR DE ENTRAR A INTRANET PARA SU REVISION DETALLADA</Strong>" +
                      "<br>" +
                      "<Strong>EN CASO DE DENEGAR LA SOLICITUD SE DEBERA ENTRAR A LA INTRANET PARA CAPTURAR MOTIVO DE RECHAZO</Strong>" +
                      "<br>" +
                      "<br>" +
                      "<div>" +
                      '<a style="color: #007bff !important; text-decoration: none; padding-top:5px" href="' +
                      Intranet +
                      '">ENTRAR A INTRANET</a>' +
                      "<div>" +
                      "<br>" +
                      "<br>" +
                      // Envio de botones para aprovar o un denegar la solicitud de pedido
                      // '<button type="button" style="text-decoration: none; border: 1px solid #90caf9; border-radius: 5px; padding: 5px; background-color: #90caf9; "><a href="'+SERVER+'/api/upstatus/' + IdSolicitud + '/' + NombreSolicitante + '/' + EnvioStatusAutoriza + '" style="text-decoration:none; color: #fff !important;">AUTORIZAR</a></button>' +
                      // '<button type="button" style="text-decoration: none; border: 1px solid #90caf9; border-radius: 5px; padding: 5px; background-color: #90caf9; "><a href="'+SERVER+'/api/upstatus/' + IdSolicitud + '/' + NombreSolicitante + '/' + EnvioStatusRechaza + '" style="text-decoration:none; color: #fff !important;">RECHAZAR</a></button>' +
                      "<br>" +
                      "<br>" +
                      "<p> Porfavor no Responder a este Mensaje, Este es un Mensaje Automatico<p/>" +
                      "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                      "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                      "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                      "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                      "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                      "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                      "</body>",
                  };

                  var mailOptionRechaza = {
                    to: EmailSolicitante,
                    cc: "marco.garcia@gimm.com.mx",
                    subject: "SOLICITUD DE PEDIDO RECHAZADA",
                    html:
                      "" +
                      NameEstatusSolConsumo +
                      " : " +
                      NameSolicitante +
                      "<br>" +
                      "<Strong>CON UN ID DE SOLICITUD : </Strong>" +
                      IdSolicitud +
                      "<br><br>" +
                      "<Strong>FAVOR DE ENTRAR A INTRANET PARA SU REVISION DETALLADA</Strong>" +
                      "<br>" +
                      "<br>" +
                      '<a style="color: #007bff !important; text-decoration: none; padding-top:5px" href="' +
                      Intranet +
                      '">ENTRAR A INTRANT</a>' +
                      "<br>" +
                      "<br>" +
                      //Envio de Botones para la confirmacion desde el correo Autorizacion o Denegacion de Solicitud
                      //'<button type="button" class="btn btn-primary"><a href="http://189.240.98.66:4200/api/upstatus/'+req.params.IdSolicitud+'/'+req.params.Solicitante+'/'+2+'" style="text-decoration:none">Autoriza</a></button>'+
                      //'----- <button type="button" class="btn btn-danger"><a href="http://189.240.98.66:4200/api/upstatus'+req.params.IdSolicitud+'/'+req.params.Solicitante+'/'+3+'" style="text-decoration:none">Denegar</a></button>'+
                      "<br>" +
                      "<br>" +
                      "<p> POR FAVOR NO RESPONDER A ESTE MENSAJE, ES UN MENSAJE AUTOMATICO<p/>",
                  };
                  //valimos el estatqus que quieren realizar para asi poder envia el mensaje correcto con las validaciones anteriores
                  if (req.params.IdStatus == 2) {
                    //no se enevia estatus para autorizar o rechzar ya que se estaria enviando el mail al almacenista.
                    const isSend = await this.SendEmail(
                      mailOptionAutorizaAlmacenista
                    );
                    if (isSend === true) {
                      resp.status(200);
                      resp.write(
                        "<!doctype html>" +
                          "<html lang='en'>" +
                          "<head>" +
                          "<meta charset='utf-8'>" +
                          "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                          "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                          "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                          "<title>Intranet Grupo Imagen</title>" +
                          "</head>" +
                          "<body>" +
                          "<div class='alert alert-success' role='alert'>" +
                          "Se actualizo correctamente el Status de la Solicitud de Pedido !" +
                          "</div>" +
                          // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                          "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                          "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                          "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                          "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                          "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                          "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                          "</body>" +
                          "</html>"
                      );
                      resp.end();
                    } else {
                      console.log(isSend);
                      resp.write(
                        "<!doctype html>" +
                          "<html lang='en'>" +
                          "<head>" +
                          "<meta charset='utf-8'>" +
                          "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                          "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                          "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                          "<title>Intranet Grupo Imagen</title>" +
                          "</head>" +
                          "<body>" +
                          "<div class='alert alert-danger' role='alert'>" +
                          "Error al realizar el envio de mail al siguente autorizador.   " +
                          isSend +
                          "</div>" +
                          // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                          "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                          "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                          "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                          "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                          "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                          "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                          "</body>" +
                          "</html>"
                      );
                      resp.end();
                    }
                  } else {
                    //no se enevia estatus para autorizar o rechzar ya que se estaria enviando el mail al almacenista.
                    const isSend = await this.SendEmail(mailOptionRechaza);

                    if (isSend === true) {
                      resp.status(200);
                      resp.write(
                        "<!doctype html>" +
                          "<html lang='en'>" +
                          "<head>" +
                          "<meta charset='utf-8'>" +
                          "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                          "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css'" +
                          "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                          "<title>Intranet Grupo Imagen</title>" +
                          "</head>" +
                          "<body>" +
                          "<div class='alert alert-danger' role='alert'>" +
                          "Se notificará rechazo al solicitante" +
                          "</div>" +
                          // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                          "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                          "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                          "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                          "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                          "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                          "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                          "</body>" +
                          "</html>"
                      );
                      resp.end();
                    } else {
                      console.log(isSend);
                      resp.write(
                        "<!doctype html>" +
                          "<html lang='en'>" +
                          "<head>" +
                          "<meta charset='utf-8'>" +
                          "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                          "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                          "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                          "<title>Intranet Grupo Imagen</title>" +
                          "</head>" +
                          "<body>" +
                          "<div class='alert alert-danger' role='alert'>" +
                          "Error al realizar el envio de mail de rechazo de solicitud.  " +
                          isSend +
                          "</div>" +
                          // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                          "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                          "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                          "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                          "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                          "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                          "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                          "</body>" +
                          "</html>"
                      );
                      resp.end();
                    }
                  }
                })
                .catch((error) => {
                  let Message = this.messageresponseCambioEstatusdesdeEmail(
                    "Error al Actualizar el estatus de la solicitud de Consumo interno, por favor intentalo de nuevo mas tarde.   " +
                      error,
                    "alert alert-danger"
                  );
                  resp.status(404);
                  resp.write(" " + Message + " ") < resp.end();
                });
            } else {
              //se sigue el flujo normal de autorizaciones via mail a gerente
              var SiguienteEstatusAutoriza: number;
              var SiguienteEstatusRechaza: number;
              let newEstatus =
                req.params.IdStatus == 2
                  ? 2
                  : req.params.IdStatus == 3
                  ? 3
                  : 1;
              if (newEstatus == 2) {
                SiguienteEstatusAutoriza = 4;
                SiguienteEstatusRechaza = 5;
              } else {
                SiguienteEstatusAutoriza = 0;
                SiguienteEstatusRechaza = 0;
              }
              let NameEstatusSolConsumo =
                newEstatus === 12
                  ? "S. C. I. AUTORIZADA POR GERENTE"
                  : newEstatus === 13
                  ? "S. C. I. RECHAZADA POR GERENTE"
                  : "";
              var EmailAuth = resultExclution.recordsets[0][0].Email;
              var IdSolicitud = req.params.IdSolicitud;
              var NameSolicitante =
                resultExclution.recordsets[4][0].NombreCompleto;
              var EmailSolicitante = resultExclution.recordsets[4][0].Email;

              var sql = require("mssql");
              var env = process.env.NODE_ENV || "SERWEB";
              var config = require("../controllers/connections/servers")[env];
              new sql.ConnectionPool(config)
                .connect()
                .then((pool) => {
                  return pool
                    .request()
                    .input("NewEstatus", sql.Int, newEstatus)
                    .input(
                      "IdSolicitudConsumo",
                      sql.Int,
                      req.params.IdSolicitud
                    )
                    .execute("UpdateStatusfromEmailConsumoInterno");
                })
                .then(async (result) => {
                  var mailOptionAutoriza = {
                    to: EmailAuth,
                    cc: "marco.garcia@gimm.com.mx",
                    subject: "SOLICITUD DE CONSUMO INTERNO PENDIENTE",
                    html:
                      "<head>" +
                      "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                      "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                      "</head>" +
                      "<body>" +
                      "<Strong>TIENES UNA SOLICITUD PENDIENTE POR REVISAR DE : </Strong>" +
                      NameSolicitante +
                      "<br>" +
                      "<Strong>CON UN ID DE SOLICITUD : </Strong>" +
                      IdSolicitud +
                      "<br><br>" +
                      "<Strong>FAVOR DE ENTRAR A INTRANET PARA SU REVISION DETALLADA</Strong>" +
                      "<br>" +
                      "<Strong>EN CASO DE DENEGAR LA SOLICITUD SE DEBERA ENTRAR A LA INTRANET PARA CAPTURAR MOTIVO DE RECHAZO</Strong>" +
                      "<br>" +
                      "<br>" +
                      "<div>" +
                      '<a href="' +
                      Intranet +
                      '">ENTRAR A INTRANET</a>' +
                      "<div>" +
                      "<br>" +
                      "<br>" +
                      // Envio de botones para aprovar o un denegar la solicitud de pedido
                      '<button type="button" style="text-decoration: none; border: 1px solid #90caf9; border-radius: 5px; padding: 5px; background-color: #90caf9;"><a href="' +
                      SERVER +
                      "/api/upstatus/" +
                      IdSolicitud +
                      "/" +
                      NameSolicitante +
                      "/" +
                      SiguienteEstatusAutoriza +
                      '" style="text-decoration:none; color: #fff !important;">AUTORIZAR</a></button>' +
                      '<button type="button" style="text-decoration: none; border: 1px solid #f48f93; border-radius: 5px; padding: 5px; background-color: #90caf9;"><a href="' +
                      SERVER +
                      "/api/upstatus/" +
                      IdSolicitud +
                      "/" +
                      NameSolicitante +
                      "/" +
                      SiguienteEstatusRechaza +
                      '" style="text-decoration:none; color: #fff !important;">RECHAZAR</a></button>' +
                      "<br>" +
                      "<br>" +
                      "<p> Porfavor no Responder a este Mensaje, Este es un Mensaje Automatico<p/>" +
                      "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                      "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                      "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                      "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                      "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                      "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                      "</body>",
                  };

                  var mailOptionRechaza = {
                    to: EmailSolicitante,
                    cc: "marco.garcia@gimm.com.mx",
                    subject: "SOLICITUD DE CONSUMO INTERNO",
                    html:
                      "" +
                      NameEstatusSolConsumo +
                      " : " +
                      NameSolicitante +
                      "<br>" +
                      "<Strong>CON UN ID DE SOLICITUD : </Strong>" +
                      IdSolicitud +
                      "<br><br>" +
                      "<Strong>FAVOR DE ENTRAR A INTRANET PARA SU REVISION DETALLADA</Strong>" +
                      "<br>" +
                      "<br>" +
                      '<a style="color: #007bff !important; text-decoration: none; padding-top:5px" href="' +
                      Intranet +
                      '">ENTRAR A INTRANT</a>' +
                      "<br>" +
                      "<br>" +
                      //Envio de Botones para la confirmacion desde el correo Autorizacion o Denegacion de Solicitud
                      //'<button type="button" class="btn btn-primary"><a href="http://189.240.98.66:4200/api/upstatus/'+req.params.IdSolicitud+'/'+req.params.Solicitante+'/'+2+'" style="text-decoration:none">Autoriza</a></button>'+
                      //'----- <button type="button" class="btn btn-danger"><a href="http://189.240.98.66:4200/api/upstatus'+req.params.IdSolicitud+'/'+req.params.Solicitante+'/'+3+'" style="text-decoration:none">Denegar</a></button>'+
                      "<br>" +
                      "<br>" +
                      "<p> POR FAVOR NO RESPONDER A ESTE MENSAJE, ES UN MENSAJE AUTOMATICO<p/>",
                  };

                  //validamos el estatus que se requiere mandar como mail de autorizacion o rechazo
                  if (req.params.IdStatus == 2) {
                    //no se enevia estatus para autorizar o rechzar ya que se estaria enviando el mail al almacenista.
                    const isSend = await this.SendEmail(mailOptionAutoriza);
                    //validamos si se realizo el envio del mail de autorizacion
                    if (isSend == true) {
                      resp.status(200);
                      resp.write(
                        "<!doctype html>" +
                          "<html lang='en'>" +
                          "<head>" +
                          "<meta charset='utf-8'>" +
                          "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                          "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                          "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                          "<title>Intranet Grupo Imagen</title>" +
                          "</head>" +
                          "<body>" +
                          "<div class='alert alert-success' role='alert'>" +
                          "Se actualizo correctamente el Estatus de la Solicitud de Pedido !" +
                          "</div>" +
                          // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                          "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                          "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                          "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                          "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                          "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                          "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                          "</body>" +
                          "</html>"
                      );
                      resp.end();
                    } else {
                      console.log(isSend);
                      resp.write(
                        "<!doctype html>" +
                          "<html lang='en'>" +
                          "<head>" +
                          "<meta charset='utf-8'>" +
                          "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                          "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                          "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                          "<title>Intranet Grupo Imagen</title>" +
                          "</head>" +
                          "<body>" +
                          "<div class='alert alert-danger' role='alert'>" +
                          "Error al realizar el envio de mail al siguente autorizador.   " +
                          isSend +
                          "</div>" +
                          // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                          "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                          "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                          "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                          "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                          "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                          "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                          "</body>" +
                          "</html>"
                      );
                      resp.end();
                    }
                  } else {
                    //no se enevia estatus para autorizar o rechzar ya que se estaria enviando el mail al almacenista.
                    const isSend = await this.SendEmail(mailOptionRechaza);
                    //validamos si se realizo el envio del rechazo de la solicitud
                    if (isSend === true) {
                      resp.status(200);
                      resp.write(
                        "<!doctype html>" +
                          "<html lang='en'>" +
                          "<head>" +
                          "<meta charset='utf-8'>" +
                          "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                          "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css'" +
                          "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                          "<title>Intranet Grupo Imagen</title>" +
                          "</head>" +
                          "<body>" +
                          "<div class='alert alert-danger' role='alert'>" +
                          "Se notificará rechazo al solicitante" +
                          "</div>" +
                          // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                          "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                          "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                          "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                          "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                          "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                          "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                          "</body>" +
                          "</html>"
                      );
                      resp.end();
                    } else {
                      console.log(isSend);
                      resp.write(
                        "<!doctype html>" +
                          "<html lang='en'>" +
                          "<head>" +
                          "<meta charset='utf-8'>" +
                          "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                          "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                          "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                          "<title>Intranet Grupo Imagen</title>" +
                          "</head>" +
                          "<body>" +
                          "<div class='alert alert-danger' role='alert'>" +
                          "Error al realizar el envio de mail de rechazo de la solicitud.  " +
                          isSend +
                          "</div>" +
                          // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                          "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                          "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                          "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                          "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                          "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                          "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                          "</body>" +
                          "</html>"
                      );
                      resp.end();
                    }
                  }
                })
                .catch((error) => {
                  let Message = this.messageresponseCambioEstatusdesdeEmail(
                    "Error al Actualizar el estatus de la solicitud de Consumo interno, por favor intentalo de nuevo mas tarde.   " +
                      error,
                    "alert alert-danger"
                  );
                  resp.status(404);
                  resp.write(" " + Message + " ") < resp.end();
                });
            }
          } else if (EstatusSolicitud === 2 && roleaexcluir === 2) {
            console.log(
              "esta excepcion es por si el role excluido resulta ser el de gerente de direccion --- en realidad quien esta autorizando es el DIRECTOR DE AREA"
            );
            console.log("quiere decir que se envia al almacenista");
            let newEstatus =
              req.params.IdStatus == 2
                ? 4
                : req.params.IdStatus == 3
                ? 5
                : 2;

            let NameEstatusSolConsumo =
              newEstatus === 4
                ? "S. C. I. AUTORIZADA POR DIRECCION"
                : newEstatus === 5
                ? "S. C. I. RECHAZADA POR DIRECCION"
                : "";

            var EmailAuth = resultExclution.recordsets[0][0].Email;
            var IdSolicitud = req.params.IdSolicitud;
            var NameSolicitante = resultExclution.recordsets[4][0].NombreCompleto;
            var EmailSolicitante = resultExclution.recordsets[4][0].Email;
            var sql = require("mssql");
            var env = process.env.NODE_ENV || "SERWEB";
            var config = require("../controllers/connections/servers")[env];
            new sql.ConnectionPool(config)
              .connect()
              .then((pool) => {
                return pool
                  .request()
                  .input("NewEstatus", sql.Int, newEstatus)
                  .input("IdSolicitudConsumo", sql.Int, req.params.IdSolicitud)
                  .execute("UpdateStatusfromEmailConsumoInterno");
              })
              .then(async (result) => {
                var mailOptionAutorizaAlmacenista = {
                  to: EmailAuth,
                  cc: "marco.garcia@gimm.com.mx",
                  subject: "SOLICITUD DE CONSUMO INTERNO PENDIENTE",
                  html:
                    "<head>" +
                    "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                    "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                    "</head>" +
                    "<body>" +
                    "<Strong>TIENES UNA SOLICITUD PENDIENTE POR REVISAR DE : </Strong>" +
                    NameSolicitante +
                    "<br>" +
                    "<Strong>CON UN ID DE SOLICITUD : </Strong>" +
                    IdSolicitud +
                    "<br><br>" +
                    "<Strong>FAVOR DE ENTRAR A INTRANET PARA SU REVISION DETALLADA</Strong>" +
                    "<br>" +
                    "<Strong>EN CASO DE DENEGAR LA SOLICITUD SE DEBERA ENTRAR A LA INTRANET PARA CAPTURAR MOTIVO DE RECHAZO</Strong>" +
                    "<br>" +
                    "<br>" +
                    "<div>" +
                    '<a style="color: #007bff !important; text-decoration: none; padding-top:5px" href="' +
                    Intranet +
                    '">ENTRAR A INTRANET</a>' +
                    "<div>" +
                    "<br>" +
                    "<br>" +
                    // Envio de botones para aprovar o un denegar la solicitud de pedido
                    // '<button type="button" style="text-decoration: none; border: 1px solid #90caf9; border-radius: 5px; padding: 5px; background-color: #90caf9; "><a href="'+SERVER+'/api/upstatus/' + IdSolicitud + '/' + NombreSolicitante + '/' + EnvioStatusAutoriza + '" style="text-decoration:none; color: #fff !important;">AUTORIZAR</a></button>' +
                    // '<button type="button" style="text-decoration: none; border: 1px solid #90caf9; border-radius: 5px; padding: 5px; background-color: #90caf9; "><a href="'+SERVER+'/api/upstatus/' + IdSolicitud + '/' + NombreSolicitante + '/' + EnvioStatusRechaza + '" style="text-decoration:none; color: #fff !important;">RECHAZAR</a></button>' +
                    "<br>" +
                    "<br>" +
                    "<p> Porfavor no Responder a este Mensaje, Este es un Mensaje Automatico<p/>" +
                    "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                    "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                    "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                    "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                    "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                    "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                    "</body>",
                };

                var mailOptionRechaza = {
                  to: EmailSolicitante,
                  cc: "marco.garcia@gimm.com.mx",
                  subject: "SOLICITUD DE PEDIDO RECHAZADA",
                  html:
                    "" +
                    NameEstatusSolConsumo +
                    " : " +
                    NameSolicitante +
                    "<br>" +
                    "<Strong>CON UN ID DE SOLICITUD : </Strong>" +
                    IdSolicitud +
                    "<br><br>" +
                    "<Strong>FAVOR DE ENTRAR A INTRANET PARA SU REVISION DETALLADA</Strong>" +
                    "<br>" +
                    "<br>" +
                    '<a style="color: #007bff !important; text-decoration: none; padding-top:5px" href="' +
                    Intranet +
                    '">ENTRAR A INTRANT</a>' +
                    "<br>" +
                    "<br>" +
                    //Envio de Botones para la confirmacion desde el correo Autorizacion o Denegacion de Solicitud
                    //'<button type="button" class="btn btn-primary"><a href="http://189.240.98.66:4200/api/upstatus/'+req.params.IdSolicitud+'/'+req.params.Solicitante+'/'+2+'" style="text-decoration:none">Autoriza</a></button>'+
                    //'----- <button type="button" class="btn btn-danger"><a href="http://189.240.98.66:4200/api/upstatus'+req.params.IdSolicitud+'/'+req.params.Solicitante+'/'+3+'" style="text-decoration:none">Denegar</a></button>'+
                    "<br>" +
                    "<br>" +
                    "<p> POR FAVOR NO RESPONDER A ESTE MENSAJE, ES UN MENSAJE AUTOMATICO<p/>",
                };

                if (req.params.IdStatus == 2) {
                  const isSend = await this.SendEmail(
                    mailOptionAutorizaAlmacenista
                  );
                  if (isSend == true) {
                    resp.status(200);
                    resp.write(
                      "<!doctype html>" +
                        "<html lang='en'>" +
                        "<head>" +
                        "<meta charset='utf-8'>" +
                        "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                        "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                        "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                        "<title>Intranet Grupo Imagen</title>" +
                        "</head>" +
                        "<body>" +
                        "<div class='alert alert-success' role='alert'>" +
                        "Se actualizo correctamente el Estatus de la Solicitud de Pedido !" +
                        "</div>" +
                        // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                        "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                        "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                        "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                        "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                        "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                        "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                        "</body>" +
                        "</html>"
                    );
                    resp.end();
                  } else {
                    console.log(isSend);
                    resp.write(
                      "<!doctype html>" +
                        "<html lang='en'>" +
                        "<head>" +
                        "<meta charset='utf-8'>" +
                        "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                        "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                        "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                        "<title>Intranet Grupo Imagen</title>" +
                        "</head>" +
                        "<body>" +
                        "<div class='alert alert-danger' role='alert'>" +
                        "Error al realizar el envio de mail al siguente autorizador.   " +
                        isSend +
                        "</div>" +
                        // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                        "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                        "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                        "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                        "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                        "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                        "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                        "</body>" +
                        "</html>"
                    );
                    resp.end();
                  }
                } else {
                  const isSend = await this.SendEmail(mailOptionRechaza);
                  if (isSend == true) {
                    resp.status(200);
                    resp.write(
                      "<!doctype html>" +
                        "<html lang='en'>" +
                        "<head>" +
                        "<meta charset='utf-8'>" +
                        "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                        "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css'" +
                        "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                        "<title>Intranet Grupo Imagen</title>" +
                        "</head>" +
                        "<body>" +
                        "<div class='alert alert-danger' role='alert'>" +
                        "Se notificará rechazo al solicitante" +
                        "</div>" +
                        // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                        "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                        "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                        "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                        "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                        "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                        "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                        "</body>" +
                        "</html>"
                    );
                    resp.end();
                  } else {
                    console.log(isSend);
                    resp.write(
                      "<!doctype html>" +
                        "<html lang='en'>" +
                        "<head>" +
                        "<meta charset='utf-8'>" +
                        "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                        "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                        "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                        "<title>Intranet Grupo Imagen</title>" +
                        "</head>" +
                        "<body>" +
                        "<div class='alert alert-danger' role='alert'>" +
                        "Error al realizar el envio de mail de rechazo de la solicitud.  " +
                        isSend +
                        "</div>" +
                        // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                        "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                        "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                        "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                        "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                        "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                        "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                        "</body>" +
                        "</html>"
                    );
                    resp.end();
                  }
                }
              })
              .catch((error) => {
                let Message = this.messageresponseCambioEstatusdesdeEmail(
                  "Error al Actualizar el estatus de la solicitud de Consumo interno, por favor intentalo de nuevo mas tarde.   " +
                    error,
                  "alert alert-danger"
                );
                resp.status(404);
                resp.write(" " + Message + " ") < resp.end();
              });
          } else {
            //se envia un mensaje indicando que no se realiza ninguna actualizacion de estatus debido a que el estatus que se tiene es igual o superiro
            let Message = this.messageresponseCambioEstatusdesdeEmail(
              "Esta Solicitud de Consumo Interno ya tiene un status igual o superior al que se intenta actualizar",
              "alert alert-danger"
            );
            resp.write(Message);
            resp.end();
          }
        })
        .catch((error) => {
          console.log(error);
          let Message = this.messageresponseCambioEstatusdesdeEmail(
            "Error al Recuperar la Infromacion del siguente autorizador, intenta de nuevo  si persiste el problema favor de contactar a sistemas",
            "alert alert-danger"
          );
          resp.write(Message);
          resp.end();
        });
    }

    // en este nivel autoriza desde el mail el Director de area
    if (req.params.IdStatus == 4 || req.params.IdStatus == 5) {
      console.log("-------------------NIVEL DIRECTOR");
      //incluiremos retornar un mensaje al solicitanto indicando que la solicitud ha sido autorizada en el caso que asi sea
      var sql = require("mssql");
      var env = process.env.NODE_ENV || "SERWEB";
      var config = require("../controllers/connections/servers")[env];
      console.log(
        "este es el id de la SOlicitud---->" + req.params.IdSolicitud
      );
      new sql.ConnectionPool(config).connect().then((pool) => {
        return pool
          .request()
          .input("IdSolicitud", sql.Int, req.params.IdSolicitud)
          .execute("EmailUserValidationConsumoInt");
      }).then(resultEmailValidation =>{
        console.log(resultEmailValidation.recordsets);
        console.log(resultEmailValidation.recordsets);
        let roleaexcluir = (resultEmailValidation.recordsets[2][0].IdRoleConsumoInterno == 0 || resultEmailValidation.recordsets[2][0].IdRoleConsumoInterno == undefined)
              ? 0
              : resultEmailValidation.recordsets[2][0].IdRoleConsumoInterno;
        let EstatusSolicitud = resultEmailValidation.recordsets[1][0].IdStatusSolicitud;
        console.log(roleaexcluir);
        console.log(EstatusSolicitud);
        //validamos el esatatus de la solicitud y sobre eso actualizamos los esattus para el siguente autorizador y enviamos mail.
          if(EstatusSolicitud == 12 || EstatusSolicitud == 13 && roleaexcluir == 0){
            let newEstatus =
            req.params.IdStatus == 12
              ? 14
              : req.params.IdStatus == 13
              ? 15
              : 12;

            let NameEstatusSolConsumo =
              newEstatus === 14
                ? "S. C. I. AUTORIZADA POR DIRECCION"
                : newEstatus === 15
                ? "S. C. I. RECHAZADA POR DIRECCION"
                : "";
            var EmailAuth = resultEmailValidation.recordsets[0][0].Email;
            var IdSolicitud = req.params.IdSolicitud;
            var NameSolicitante = resultEmailValidation.recordsets[4][0].NombreCompleto;
            var EmailSolicitante = resultEmailValidation.recordsets[4][0].Email;
            var sql = require("mssql");
            var env = process.env.NODE_ENV || "SERWEB";
            var config = require("../controllers/connections/servers")[env];
            new sql.ConnectionPool(config)
              .connect()
              .then((pool) => {
                return pool
                  .request()
                  .input("NewEstatus", sql.Int, newEstatus)
                  .input("IdSolicitudConsumo", sql.Int, req.params.IdSolicitud)
                  .execute("UpdateStatusfromEmailConsumoInterno");
              }).then(async result =>{
                var mailOptionAutorizaAlmacenista = {
                  to: EmailAuth,
                  cc: "marco.garcia@gimm.com.mx",
                  subject: "SOLICITUD DE CONSUMO INTERNO PENDIENTE",
                  html:
                    "<head>" +
                    "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                    "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                    "</head>" +
                    "<body>" +
                    "<Strong>TIENES UNA SOLICITUD PENDIENTE POR REVISAR DE : </Strong>" +
                    NameSolicitante +
                    "<br>" +
                    "<Strong>CON UN ID DE SOLICITUD : </Strong>" +
                    IdSolicitud +
                    "<br><br>" +
                    "<Strong>FAVOR DE ENTRAR A INTRANET PARA SU REVISION DETALLADA</Strong>" +
                    "<br>" +
                    "<Strong>EN CASO DE DENEGAR LA SOLICITUD SE DEBERA ENTRAR A LA INTRANET PARA CAPTURAR MOTIVO DE RECHAZO</Strong>" +
                    "<br>" +
                    "<br>" +
                    "<div>" +
                    '<a style="color: #007bff !important; text-decoration: none; padding-top:5px" href="' +
                    Intranet +
                    '">ENTRAR A INTRANET</a>' +
                    "<div>" +
                    "<br>" +
                    "<br>" +
                    // Envio de botones para aprovar o un denegar la solicitud de pedido
                    // '<button type="button" style="text-decoration: none; border: 1px solid #90caf9; border-radius: 5px; padding: 5px; background-color: #90caf9; "><a href="'+SERVER+'/api/upstatus/' + IdSolicitud + '/' + NombreSolicitante + '/' + EnvioStatusAutoriza + '" style="text-decoration:none; color: #fff !important;">AUTORIZAR</a></button>' +
                    // '<button type="button" style="text-decoration: none; border: 1px solid #90caf9; border-radius: 5px; padding: 5px; background-color: #90caf9; "><a href="'+SERVER+'/api/upstatus/' + IdSolicitud + '/' + NombreSolicitante + '/' + EnvioStatusRechaza + '" style="text-decoration:none; color: #fff !important;">RECHAZAR</a></button>' +
                    "<br>" +
                    "<br>" +
                    "<p> Porfavor no Responder a este Mensaje, Este es un Mensaje Automatico<p/>" +
                    "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                    "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                    "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                    "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                    "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                    "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                    "</body>",
                };

                var mailOptionRechaza = {
                  to: EmailSolicitante,
                  cc: "marco.garcia@gimm.com.mx",
                  subject: "SOLICITUD DE PEDIDO RECHAZADA",
                  html:
                    "" +
                    NameEstatusSolConsumo +
                    " : " +
                    NameSolicitante +
                    "<br>" +
                    "<Strong>CON UN ID DE SOLICITUD : </Strong>" +
                    IdSolicitud +
                    "<br><br>" +
                    "<Strong>FAVOR DE ENTRAR A INTRANET PARA SU REVISION DETALLADA</Strong>" +
                    "<br>" +
                    "<br>" +
                    '<a style="color: #007bff !important; text-decoration: none; padding-top:5px" href="' +
                    Intranet +
                    '">ENTRAR A INTRANT</a>' +
                    "<br>" +
                    "<br>" +
                    //Envio de Botones para la confirmacion desde el correo Autorizacion o Denegacion de Solicitud
                    //'<button type="button" class="btn btn-primary"><a href="http://189.240.98.66:4200/api/upstatus/'+req.params.IdSolicitud+'/'+req.params.Solicitante+'/'+2+'" style="text-decoration:none">Autoriza</a></button>'+
                    //'----- <button type="button" class="btn btn-danger"><a href="http://189.240.98.66:4200/api/upstatus'+req.params.IdSolicitud+'/'+req.params.Solicitante+'/'+3+'" style="text-decoration:none">Denegar</a></button>'+
                    "<br>" +
                    "<br>" +
                    "<p> POR FAVOR NO RESPONDER A ESTE MENSAJE, ES UN MENSAJE AUTOMATICO<p/>",
                };

                if(req.params.IdStatus == 14){
                  const isSend = await this.SendEmail(
                    mailOptionAutorizaAlmacenista
                  );
                  if (isSend == true) {
                    resp.status(200);
                    resp.write(
                      "<!doctype html>" +
                        "<html lang='en'>" +
                        "<head>" +
                        "<meta charset='utf-8'>" +
                        "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                        "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                        "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                        "<title>Intranet Grupo Imagen</title>" +
                        "</head>" +
                        "<body>" +
                        "<div class='alert alert-success' role='alert'>" +
                        "Se actualizo correctamente el Estatus de la Solicitud de Pedido !" +
                        "</div>" +
                        // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                        "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                        "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                        "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                        "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                        "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                        "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                        "</body>" +
                        "</html>"
                    );
                    resp.end();
                  } else {
                    console.log(isSend);
                    resp.write(
                      "<!doctype html>" +
                        "<html lang='en'>" +
                        "<head>" +
                        "<meta charset='utf-8'>" +
                        "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                        "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                        "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                        "<title>Intranet Grupo Imagen</title>" +
                        "</head>" +
                        "<body>" +
                        "<div class='alert alert-danger' role='alert'>" +
                        "Error al realizar el envio de mail al siguente autorizador.   " +
                        isSend +
                        "</div>" +
                        // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                        "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                        "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                        "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                        "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                        "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                        "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                        "</body>" +
                        "</html>"
                    );
                    resp.end();
                  }
                }else{
                  const isSend = await this.SendEmail(mailOptionRechaza);
                  if (isSend == true) {
                    resp.status(200);
                    resp.write(
                      "<!doctype html>" +
                        "<html lang='en'>" +
                        "<head>" +
                        "<meta charset='utf-8'>" +
                        "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                        "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css'" +
                        "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                        "<title>Intranet Grupo Imagen</title>" +
                        "</head>" +
                        "<body>" +
                        "<div class='alert alert-danger' role='alert'>" +
                        "Se notificará rechazo al solicitante" +
                        "</div>" +
                        // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                        "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                        "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                        "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                        "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                        "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                        "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                        "</body>" +
                        "</html>"
                    );
                    resp.end();
                  } else {
                    console.log(isSend);
                    resp.write(
                      "<!doctype html>" +
                        "<html lang='en'>" +
                        "<head>" +
                        "<meta charset='utf-8'>" +
                        "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
                        "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                        "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
                        "<title>Intranet Grupo Imagen</title>" +
                        "</head>" +
                        "<body>" +
                        "<div class='alert alert-danger' role='alert'>" +
                        "Error al realizar el envio de mail de rechazo de la solicitud.  " +
                        isSend +
                        "</div>" +
                        // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                        "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                        "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                        "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                        "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                        "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                        "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                        "</body>" +
                        "</html>"
                    );
                    resp.end();
                  }
                }

              }).catch(error =>{
                let Message = this.messageresponseCambioEstatusdesdeEmail(
                  "Error al Actualizar el estatus de la solicitud de Consumo interno, por favor intentalo de nuevo mas tarde.   " +
                    error,
                  "alert alert-danger"
                );
                resp.status(404);
                resp.write(" " + Message + " ") < resp.end();
              });

          }else{
            let Message = this.messageresponseCambioEstatusdesdeEmail(
              "Esta Solicitud de Consumo Interno ya tiene un status igual o superior al que se intenta actualizar",
              "alert alert-danger"
            );
            resp.write(Message);
            resp.end();
          }
      }).catch(error=>{
        console.log(error);
        let Message = this.messageresponseCambioEstatusdesdeEmail(
          "Error al Recuperar la Infromacion del siguente autorizador, intenta de nuevo  si persiste el problema favor de contactar a sistemas",
          "alert alert-danger"
        );
        resp.write(Message);
        resp.end();
      });
    }
  };

  messageresponseCambioEstatusdesdeEmail(message: string, typealert: string) {
    //alert alert-danger or alert alert-success

    var Message =
      "<!doctype html>" +
      "<html lang='en'>" +
      "<head>" +
      "<meta charset='utf-8'>" +
      "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
      "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
      "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
      "<title>Intranet Grupo Imagen</title>" +
      "</head>" +
      "<body>" +
      "<div class='" +
      typealert +
      "' role='alert'>" +
      message +
      "</div>" +
      // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

      "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
      "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
      "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
      "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
      "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
      "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
      "</body>" +
      "</html>";

    return Message;
  }

  async SendEmail(SENDEMAIl: object) {
    console.log("desde el envio del mail ------>");
    return new Promise(async (resolve) => {
      var accessToken;
      const oauth2Client = new google.auth.OAuth2(
        "149352725404-hdc5872pn8h3ns841ve1tfsgtj9btlra.apps.googleusercontent.com", //client ID
        "8EVBFB3CsQGdl1hmo8Ga1RjC", // Client Secret
        "https://developers.google.com/oauthplayground" // Redirect URL
      );

      oauth2Client.setCredentials(
        {
          refresh_token:
            "1//04w28OpEOrPHuCgYIARAAGAQSNwF-L9IrHcNzNa8vxh6WaGYbRy5D2XriXNuB8lZAOCctLI5JH_D9ossGPyTphZjYpE9xyNKrQ28",
        },
        (err) => {
          console.log("error al recuperar el token");
          console.log(err);
        }
      );

      oauth2Client
        .getAccessToken()
        .then((token) => {
          //console.log("---------------------")
          //console.log(token);
          //console.log("***************")
          accessToken = token.token;
          var nodemailer = require("nodemailer");
          var smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 587,
            auth: {
              user: "intranet@gimm.com.mx",
              type: "OAuth2",
              // clientId: '544106101605-rovj6b5vibmu9i8o6gt7f4ug08bc9sq0.apps.googleusercontent.com',
              // clienteSecret: '1qoVyt-wBMWxfP1y1-mgB0OS',
              // refreshToken: '1//0462blb5qVoUqCgYIARAAGAQSNwF-L9IreGtA-FOLTrvYbj_8Y0iwK5HOfm_MbpJO-NaKYuYlT0drUZM55A5jiYltqbf5mcVDr0M',
              clientId:
                "149352725404-hdc5872pn8h3ns841ve1tfsgtj9btlra.apps.googleusercontent.com",
              clienteSecret: "8EVBFB3CsQGdl1hmo8Ga1RjC",
              refreshToken:
                "1//04w28OpEOrPHuCgYIARAAGAQSNwF-L9IrHcNzNa8vxh6WaGYbRy5D2XriXNuB8lZAOCctLI5JH_D9ossGPyTphZjYpE9xyNKrQ28",
              accessToken: accessToken,
              //expires: 1494388182480
            },
            tls: { rejectUnauthorized: false },
            debug: false,
          });

          let isSendEmail: boolean;
          //se solicita la autorizacion de la sol y se tiene un role de exlcuir a nivel direccion
          smtpTransport.sendMail(SENDEMAIl, function (err, resp) {
            //console.log(resp);
            if (err) {
              console.log(err);
              isSendEmail = false;
              resolve(isSendEmail);
            } else {
              console.log("se envio correctamente");
              isSendEmail = true;
              resolve(isSendEmail);
            }
          });
        })
        .catch((error) => {
          console.log("*/////////////////////////");
          console.log(error);
          resolve(error);
        });
    });
  }

  GetAllSolicitudsConsumoInternoporUsuario = (req, resp) =>{
    console.log(req.params.IdUser);
    console.log(req.params.IdRole);
    var sql = require("mssql");
    var env = process.env.NODE_ENV || "SERWEB";
    var config = require("../controllers/connections/servers")[env];
    new sql.ConnectionPool(config)
      .connect()
      .then((pool) => {
        return pool
          .request()
          .input("IdUser", sql.Int, req.params.IdUser)
          .input("IdRole", sql.Int, req.params.IdRole)
          .execute("getAllSolicitudConsumoforUsuario");
      })
      .then((result) => {
        //console.log(result)
        resp.status(201).json(result.recordset);
        resp.end();
      })
      .catch((err) => {
        console.log(err);
        resp.status(401).json({ message: err });
      });
  };

  GetDataSolicitudConsumoDataInitial = (req, resp) =>{
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    var Query = 'SELECT IdEmpresa , NameEmpresa , IdCentro, NameCentro FROM SolicitudConsumoInterno where IdSolicitudConsumoInterno ='+req.params.IdSol;
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request().query(Query, (err, result) => {
          if (err) console.log(err);
          console.log(result.recordset);
          resp.status(200).json(result.recordset);
        });
    });
  }

  GetAllProductosPorSolicitudConsumoInterno = (req, resp) =>{
    var sql = require("mssql");
    var env = process.env.NODE_ENV || "SERWEB";
    var config = require("../controllers/connections/servers")[env];
    new sql.ConnectionPool(config)
      .connect()
      .then((pool) => {
        return pool
        .request()
        .input("IdSolicitudConsumo", sql.Int, req.params.IdSolConsumo)
        .execute("getAllProductosSolConsumoInt")
    }).then((result)=>{
      console.log(result);
      resp.status(200).json(result.recordset);
      resp.end();
    }).catch(error=>{
      console.log(error);
      resp.status(401).json({ message: error });
    });
  }
}
