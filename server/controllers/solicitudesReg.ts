//import Cat from '../models/cat';
import { ConstantPool } from "@angular/compiler/src/constant_pool";
import { ɵConsole, Input } from "@angular/core";
import { connect } from "net";
const nodemailer = require ("nodemailer"); 

export default class SolicitudRegController {
  
getAllsolicitudeforAdmin = (req, res) =>{
        var sql = require("mssql");
        //variable de entorno para realizar la coneccion
        var env = process.env.NODE_ENV || 'SERWEB';
        //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
        var config = require('../controllers/connections/servers')[env]; 
        new sql.ConnectionPool(config).connect().then(pool =>{
          return pool.request().execute('ListSolPedforAdmin')
        }).then(result =>{
          //console.log(result);
          res.status(201).json(result.recordset);
          sql.close();  
        }).catch(err =>{
          if(err) console.log(err);
          sql.close();
        });
  
}

getAllStatusSolicitudRegistradas = (req,res) =>{
  console.log("dentro del metodo para recuperar todos los status de las solicitudes");
  var sql = require("mssql");
  var env = process.env.NODE_ENV || 'SERWEB';
  var config = require('../controllers/connections/servers')[env];
  var Query = "Select * from StatusSolicitud;";      
  const pool1 = new sql.ConnectionPool(config, err => {           
    pool1.request()       
      .query(Query, (err, result) => {
        console.log("Status de las Solicitudes." + result.recordset);
        res.status(200).json(result.recordset);
        if (err) console.log("error al recuperar la informacion de los STATUS"+err); 
        
  });
});

}

UpdateStatusformAdmin = (req, res) =>{
  console.log("dentro del metodo para actualizar el valor en base de datos con otro status");
  console.log("´+´+´+´+´+´+´+´+´+´+´+´+´+");
  console.log(req.params.IdSolicitud);
  console.log(req.params.IdStatusUpdate);
  var sql = require("mssql");
  var env = process.env.NODE_ENV || 'SERWEB';
  var config = require('../controllers/connections/servers')[env];
  new sql.ConnectionPool(config).connect().then(pool =>{
    return pool.request()
    .input('IdSolPed', sql.Int, req.params.IdSolicitud)
    .input('IdStatusNew', sql.Int, req.params.IdStatusUpdate)
    .execute('UpdatstatusSolPedforAdmin')
  }).then(result =>{
    console.log(result);
    res.status(201).json(result.recordset);
    sql.close();  
  }).catch(err =>{
    if(err) console.log(err);
    sql.close();
  });

}


getAllDirectionsforAutorizations = (req, res) =>{
  console.log("dentro del metodo apra recuperar las direcciones");
  var sql = require("mssql");
  var env = process.env.NODE_ENV || 'SERWEB';
  var config = require('../controllers/connections/servers')[env];
  var Query = "Select * from Direccion;"; 
  const pool1 = new sql.ConnectionPool(config, err => {           
    pool1.request()       
      .query(Query, (err, result) => {
        console.log("Direcciones" + result.recordset);
        res.status(200).json(result.recordset);
        if (err) console.log("error al recuperar la lista de las direcciones"+err); 
        
    });
  });
}

getAllRolesforAuth = (req, res) =>{
  console.log("Recuperamos los rooles para espesificar en la vista cul es el que se excluye");
  
  var sql = require("mssql");
  var env = process.env.NODE_ENV || 'SERWEB';
  var config = require('../controllers/connections/servers')[env];
  var Query = "Select * From Role where IdRole > 1 and IdRole < 4;";
  const pool1 = new sql.ConnectionPool(config, err => {           
    pool1.request()       
      .query(Query, (err, result) => {
        console.log("Direcciones" + result.recordset);
        res.status(200).json(result.recordset);
        if (err) console.log("error al recuperar la lista de las direcciones"+err); 
        
    });
  });
}

InsertnewexceptionAuth = (req, res)=>{
  console.log("insert nueva excepcion ");
  console.log(req.params.IdDireccion);
  console.log(req.params.IdRole);
  var sql = require("mssql");
  var env = process.env.NODE_ENV || 'SERWEB';
  var config = require('../controllers/connections/servers')[env];
  new sql.ConnectionPool(config).connect().then(pool =>{
    return pool.request()
    .input('TipoSolicitud', sql.Int, req.params.TipoSolicitud)
    .input('IdDireccion', sql.Int, req.params.IdDireccion)
    .input('IdRole', sql.Int, req.params.IdRole)
    .execute('InsertNewExeptionAuthorization')
  }).then(result =>{
    //console.log(result);
    res.status(201).json(1);
    sql.close();  
  }).catch(err =>{
    if(err) console.log(err);
    res.status(500).json(0);
    sql.close();
  });
}


listDirAuth = (req, res) =>{
  console.log("entrando al metodo para recuperar la lsita de las direcciones con excepcion");
  var sql = require("mssql");
  var env = process.env.NODE_ENV || 'SERWEB';
  var config = require('../controllers/connections/servers')[env];
  new sql.ConnectionPool(config).connect().then(pool =>{
    return pool.request()
    .execute('ListDireccioneswidthExeptionAutorization')
  }).then(result =>{
    //console.log(result);
    res.status(201).json(result.recordset);
    sql.close();  
  }).catch(err =>{
    if(err) console.log(err);
    sql.close();
  });
}

  AuthExeptionforDirection = (req, res) => {
    console.log("Entrando al metodo para recuperar la utorizacion excluida por direccion  " + req.params.IdDireccion);
    var sql = require("mssql");
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];

    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdDireccion', sql.Int, req.params.IdDireccion)
        .execute('ConsultdirexceptionAuth')
    }).then(result => {
      console.log(result.recordset);
      res.status(201).json(result.recordset);
      sql.close();
    }).catch(err => {
      if (err) console.log(err);
      sql.close();
    });
  }

  DeleteAuthforRoleandDir = (req, res) => {
    console.log("Eliminando por id de excepcion");
    console.log(req.params.IdAuth);
    var sql = require("mssql");
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];
    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdAuth', sql.Int, req.params.IdAuth)
        .execute('DeleteExceptionRole')
      }).then(result => {
        //console.log(result.recordset);
        res.status(201).json(1);
        sql.close();
      }).catch(err => {
        if (err) console.log(err);
        res.status(500).json(0);
        sql.close();
      });

  }



}