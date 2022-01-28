//import{ BodyParser } from 'body-parser';
import * as multer from 'multer' //libreria que instalar desde NPM
import *  as path from 'path';
import { read } from 'fs';
import SolicitudCompraCTR from '../controllers/SolicitudCompra';



//:::::NOTA::::: el alias que se define el el component.ts debe de ser igual al upload de 
//abajo .single('alias del archivo enviado')

//ruta donde se guardan los archivos PDF
//const DIR = '//10.29.128.161/audio/Fabi';

const Log = new SolicitudCompraCTR();
// const ruta = "http://10.29.148.40:3000/public/";
// const DIR = '../IntranetGrupoImagen/datos';


const ruta = "http://10.29.148.40:3000/public/"
const DIR = '../IntranetGrupoImagen/datos';

//const UrlCompador = "http://solicitud.adgimm.com.mx:3000/public/DatosCompras/";
// var id = 0;
// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {cb(null, DIR);},
//   filename: (req, file, cb) => {
//     let ext = path.extname(file.originalname);
//     let basename = path.basename(file.originalname, ext);
//     cb(null, id + file.fieldname + basename + ext);
//   }
// });




export default class UploadFilesController {

  upLoadSingleFile = async (req, res) => {
    const file = req.file;
    console.log("valores del archivo-----------------");
    console.log(req.headers.idsol);
    let id = req.headers.idsol;
    if (!file) {
      const error = new Error("Please upload a file");
      res.status(500).json(error);
      res.end();
    }
    var RutaCotizacion = encodeURI(
      `${ruta + id}-${req.file.originalname}`
    );
    console.log(req.file);
    console.log("Esta es la ruta del archivo---" + RutaCotizacion);
    var RutaCotizacion = encodeURI(`${ruta + req.headers.idsol}-${req.file.originalname}`);
    console.log("Esta es la ruta del archivo---" + RutaCotizacion);
    Log.InsertLog(req.headers.idsol, "Carga de Pre cotización", RutaCotizacion);
    let isSaverPathDB = await this.InsertRutaCotizacionDB(RutaCotizacion);
    console.log("Valor del guardado EN DB");
    console.log(isSaverPathDB);
    if(isSaverPathDB.is == true){
      res.status(200);
      res.send(file);
      res.end();
    }else{
      res.status(500);
      res.send({isSaverPathDB});
      res.end();
    }
    
    // console.log("fin de los valores de los archivos-------------------------");
    // try {
    //   let uploadfile = await multer({ storage: storage }).single('-');
    //   console.log(uploadfile)
    //    uploadfile(req, res, async ()=>{
    //     
    //     let isSaverPathDB = await this.InsertRutaCotizacionDB(RutaCotizacion);
    //     Log.InsertLog(req.headers.idsol, 'Carga de Pre cotización', RutaCotizacion);
    //     console.log("Valor del guardado EN DB")
    //     console.log(isSaverPathDB)
    //     res.status(200);
    //     res.end();
    //   });
    // } catch (error) {
    //   console.log("Error en la carga del archivo en UploadFilesController");
    //   console.log(error)
    //   res.status(500).json(error);
    //   res.end();
    // }
  }

  InsertRutaCotizacionDB = async (RutaCotizacion) =>{
    let sql = require("mssql");
    //variable de entorno para realizar la conexión
    let env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuración traeme en un arreglo el nodo que tenga el nombre 
    let config = require('../controllers/connections/servers')[env];
    let serealizo;
    await new sql.ConnectionPool(config).connect().then( pool => {
      return pool.request()
        .input('Ruta', sql.VarChar, RutaCotizacion)
        .execute('InsertRutaCotizacion')
    }).then(result => {
      console.log("-.-.-.Se Guardo Ruta de File en DB-.-.-");
      serealizo = {result: result, is: true};
    }).catch(err => {
      console.log("-.-.-.Error al Guardar Ruta en DB-.-.-");
      console.log(err);
      serealizo = {result: err, is: false};
    });
    // console.log(serealizo);
    // console.log("*/*/*/*/*/*/*/*/*/*/*/*/*///*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/");
    return serealizo;
}

  createFileComrpas = (req, res) => {
    console.log("creando el archivo para compras");
    console.log(req.params.ID);
    var fs = require('fs');
    var fecha = new Date(new Date().toUTCString());

    var dia = fecha.getDate();
    var mes = fecha.getMonth();
    var MES = mes + 1;
    var año = fecha.getFullYear();

    var hora = fecha.getHours();
    var minutos = fecha.getMinutes();


    var sql = require("mssql");
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../../server/controllers/connections/servers')[env];

    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdSolPed', sql.Int, req.params.ID)
        .execute('DatosFileCompras')
    }).then(result => {
      //const ExcelJS = require('exceljs');

      var stringify = require('csv-stringify');
      var path = require('path');
      console.log(result.recordset);
      var Data = new Object();
      Data = result.recordset;
      if (Data != undefined || Data != '') {
        var FileName = 'datos ' + dia + '-' + MES + '-' + año + ' , ' + hora + ':' + minutos + '.csv';
        console.log(stringify(Data));
        var path = path.join(__dirname, '../../../datos/DatosCompras/' + FileName);
        stringify(Data, function (err, output) {
          fs.writeFile(path, output, 'utf-8', function (err) {
            if (err) {
              console.log("ocurrió un error de algún tipo        " + err);
            } else {
              console.log(".....Se creo el Archivo CSV.... ");
              var RutaCotizacion = ruta + "/DatosCompras/" + FileName;
              console.log(RutaCotizacion);
              res.status(201).json(RutaCotizacion);
            }
          })
        });

      } else {
        res.status(400).json('No se pudo Generar el archivo ya que no ahi datos existentes para generarlo.')
      }
    });


  }













}
