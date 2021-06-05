import { Input } from "@angular/core";

abstract class BaseCtrl {

  abstract model: any;

  // Get all
 getAll = (req, res) => {
    /*this.model.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });*/
    console.log("Dentro de el Servicio que regresa todos los Usuarios");
    var sql = require("mssql");
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];
    new sql.ConnectionPool(config).connect().then(pool =>{
       return pool.request()
       .execute('GetAllUsers')
    }).then(result =>{
      res.status(201).json(result.recordset);
      sql.close();
    }).catch(err =>{
      if(err) console.log(err);

      sql.close();
    });
  }

  getAllDirecciones = (req, res ) =>{
    console.log("dentro del metodo para solicitar todas las direcciones");
    var sql = require("mssql");
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];
    new sql.ConnectionPool(config).connect().then(pool =>{
      return pool.request()
      .execute('getAllDirecciones')
    }).then(result =>{
      res.status(201).json(result.recordset);
      sql.close();
    }).catch(err=>{
      if(err) console.log(err);
      sql.close();
    })
  }
  
  // Count all
  count = (req, res) => {
    this.model.count((err, count) => {
      if (err) { return console.error(err); }
      res.status(200).json(count);
    });
  }

  // Insert
  insert = (req, res) => {
    console.log("Nombre usr desde el DAO-->" + req.body.name);
    console.log("Este es el usuario name desde dao--->" + req.body.username);
    console.log("Este es el email desde dao--->" + req.body.email);
    console.log("Este es el password desde dao--->" + req.body.password);
    console.log("Este es el role desde dao--->" + req.body.role);
    console.log("Este es el Role Consumo Int --> " + req.body.roleconsumo);
    console.log("Esta es la direccion DAO--->" + req.body.direc);
    console.log("Este es el telefono DAO--->" + req.body.tel);
    console.log("Esta es la extencion DAO--->" + req.body.ext);
    console.log("Este es el puesto DAO--->" + req.body.puesto);

    var sql = require("mssql");
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];
    new sql.ConnectionPool(config).connect().then(pool =>{
      return pool.request()
                          .input('IdRole', sql.Int, req.body.role)
                          .input('IdRoleConsumo', sql.Int, req.body.roleconsumo)
                          .input('IdDireccion', sql.Int, req.body.direc)
                          .input('NameUsr', sql.VarChar, req.body.name)
                          .input('LoginName', sql.VarChar, req.body.username)
                          .input('Password', sql.VarChar, req.body.password)
                          .input('Email', sql.VarChar, req.body.email)
                          .input('Tel', sql.VarChar, req.body.tel)
                          .input('Ext', sql.Int, req.body.ext)
                          .input('Puesto', sql.VarChar, req.body.puesto)
                          .execute('InsertNewUser')
    }).then(result =>{
        res.status(200).json(result.body)
        sql.close();
    }).catch(err =>{
      if(err) console.log(err);
      sql.close();
    });

    /*const obj = new this.model(req.body);
    obj.save((err, item) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
      res.status(200).json(item);
    });*/
  }

  // Get by id
  get = (req, res) => {
    this.model.findOne({ _id: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  }

  // Update by id
  update = (req, res) => {
    this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }

  // Delete by id
  delete = (req, res) => {
  


    this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }
}

export default BaseCtrl;
