//import{ BodyParser } from 'body-parser';
import * as multer from 'multer' //libreria que instalar desde NPM
import *  as path from 'path';
import { read } from 'fs';



//:::::NOTA::::: el alias que se define el el component.ts debe de ser igual al upload de 
//abajo .single('alias del archivo enviado')

//ruta donde se guardan los archivos PDF
//const DIR = '//10.29.128.161/audio/Fabi';

const ruta = "http://10.29.148.40:3000/public/"
//const ruta = "http://10.29.148.40:3000/public/";
//const ruta = "http://solicitud.adgimm.com.mx:3000/public/"

//const DIR = '../ImagenFinanzasPruebaslocal/datos';
const DIR = '../IntranetGrupoImagen/datos';
//const DIR = "../IntranetProduccion/datos";
console.log(process.env.SECRET_SAP);

var id = 0;
let storage = multer.diskStorage({
  
    destination: (req, file, cb) => {
      cb(null, DIR);
    }
    ,
    filename: (req, file, cb) => {
      
        let ext = path.extname(file.originalname);
        let basename = path.basename(file.originalname,ext );
        console.log(file);
        console.log("Este es el Nombre del archivo --> " + file.originalname);
        console.log("esta es su extencion --> " + ext);
        console.log("---------"+basename);
        cb(null, id+file.fieldname  + basename+  ext);
    }
    
});




export default class UploadFilesController {    

    upLoadSingleFile =  (req, res) => {
          
          console.log("valores del archivo-----------------");
           console.log(req.headers.idsol);
           id = req.headers.idsol;
           console.log("fin de los varoles de los archuvos-------------------------");

           var uploadfile = multer({storage: storage}).single(' ');
           uploadfile(req, res, function (err) {
             
                //console.log("File = " + req.file.originalname + " - " + path.extname(req.file.originalname) );
                if (err) {
                    console.log("Se genero un error al enviar el archivo"+ err);
                    return res.send({
                        success: false
                    });
                }
                // Everything went fine.
                //console.log("GOOOOD------- guardamos la ruta del archivo subido a la DB");
                var RutaCotizacion = encodeURI(ruta + req.headers.idsol+' '+req.file.originalname);
                console.log(req.file);
                console.log("Esta es la ruta del archivo---" + RutaCotizacion);

                var sql = require("mssql");
                //variable de entorno para realizar la coneccion
                var env = process.env.NODE_ENV || 'SERWEB';
                //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
                var config = require('../controllers/connections/servers')[env];
                new sql.ConnectionPool(config).connect().then(pool =>{
                    return pool.request()
                                      .input('Ruta', sql.VarChar, RutaCotizacion)
                                      .execute('InsertRutaCotizacion')
                  }).then(resultt => {
                    console.log(resultt);
                    res.status(201).json(resultt.recordset);
                    sql.close();
                  }).catch(err => {
                    if(err) console.log("errror al hacer el insert--->" + err);
                    sql.close();
                  }); 
                return res.send({
                    success: true
                })
            });
    }

    createFileComrpas = (req, res) => {
      const ruta = process.env.INTRANET_PATH;
      console.log("creando el archivo para compras");
      console.log(req.params.ID);
      var fs = require('fs');
      var fecha = new Date(new Date().toUTCString());
    
      var dia = fecha.getDate();
      var mes = fecha.getMonth();
      var MES = mes +1; 
      var año = fecha.getFullYear();
      
      var hora = fecha.getHours();
      var minutos = fecha.getMinutes();
      var sql = require("mssql");
              var env = process.env.NODE_ENV || 'SERWEB';
              var config = require('../../server/controllers/connections/servers')[env];

              new sql.ConnectionPool(config).connect().then(pool =>{
                return pool.request()
                                    .input('IdSolPed', sql.Int, req.params.ID)
                                    .execute('DatosFileCompras')
              }).then(result =>{

                var stringify = require('csv-stringify');
                var path = require('path');
                console.log(result.recordset);
                var Data = new Object();
                Data = result.recordset;
                if(Data != undefined || Data != ''){
                  var FileName = 'datos '+dia+'-'+MES+'-'+año+','+hora+':'+minutos+'.csv';
                  console.log( stringify(Data));
                  var path = path.join(__dirname ,'../../../datos/DatosCompras/'+FileName);
                  stringify(Data, function(err, output){
                    fs.writeFile(path, output, 'utf-8', function(err){
                      if(err){
                        console.log("ocurrio un error de algun tipo        " + err);
                      }else{
                        console.log(".....Se creo el Archivo CSV.... ");
                        var RutaCotizacion = ruta+'DatosCompras/'+FileName;
                        console.log(RutaCotizacion);
                        res.status(201).json(RutaCotizacion);
                      }
                    })
                  });
                  
                }else{
                  //return 0;
                }
              });


    }


   
    



   





}
  