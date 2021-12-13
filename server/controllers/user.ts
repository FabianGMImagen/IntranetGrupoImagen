import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';

import User from '../models/user';
import BaseCtrl from './base';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';
import { execFile } from 'child_process';
//import { ConsoleReporter } from 'jasmine';
import { ComponentFactoryResolver } from '@angular/core';
import TokenService from '../services/TokenService';
//import { ConsoleReporter } from 'jasmine';

export default class UserCtrl extends BaseCtrl {
  model = User;
  token_serv = new TokenService();
  /*login = (req, res) => {
    dotenv.load({ path: '.env' });
    this.model.findOne({ email: req.body.email }, (err, user) => {
      if (!user) { return res.sendStatus(403); }
      user.comparePassword(req.body.password, (error, isMatch) => {
        if (!isMatch) { return res.sendStatus(403); }
        console.log("TTTTTTTTTTTTTTTTTTTOKEEEEEEEEEEEEEEEN"+process.env.SECRET_TOKEN);
        //const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
        const token = jwt.sign({ user: user }, 'catswillruletheworld'); // , { expiresIn: 10 } seconds
        
        res.status(200).json({ token: token });
      });
    });
  }*/

  login = (req, res) => {
    var sql = require("mssql");
    //env es una variable de entorno para realizar la conexion
    var env = process.env.NODE_ENV || 'SERWEB';
    //config es la variable de configuracion y le pide a env (enviroment) que traega el nodo llamado WEB
    var config = require('../controllers/connections/servers')[env];              
    var Query = "select * from Usuario where Password = '" + req.body.password + "' and Email = '" + req.body.email + "' ;" ; 
    new sql.ConnectionPool(config).connect().then(pool =>{
      return pool.request().query(Query)
    }).then(result =>{
            console.log( "----------Registros Recuperados----------"+ result.rowsAffected );
            // console.log(req.body.password);
            // console.log(result.recordset);
            if(result.rowsAffected == 0 || result.rowsAffected > 1){
              return res.status(403).json({message:'Existe un error de correo duplicado, por favor contacta a Mesa de Control o Sistemas.'});
              
            }else if(result.rowsAffected == 1){
              //console.log("hola como estaaaa");

              if(result.recordset[0].Password != req.body.password){
                
                return res.status(403).json({message: 'El Password es incorrecto'});
              }

              //console.log("***********************************************");
              //console.log(result.recordset[0]);

              
              //const token = jwt.sign({user: result.recordset[0]}, process.env.SECRET_TOKEN);
              const Token = this.token_serv.CreatNewToken(result.recordset[0]);
              //console.log(Token);
              // console.log("*/*/*/*/*/*/**/*/*/*/*/*/**/*/*/passssss-->" + req.body.password);
              // console.log("*/*/*/*/*/*/*/*/ passdel Schema -->" + result.recordset[0].LoginName);
              // console.log("*/*/*/*/*/*/*/*/* Nombre del schema -->" + result.recordset[0].NombreCompleto);
              // console.log("*/*/*/*/**/*/ ---> este es el Id del Usuario--" + result.recordset[0].IdUsuario);
              // console.log("*/*/*/*/*//*/ ---> este es el id de el ROL --" + result.recordset[0].IdRole);
              //console.log("TOOOOOKEEEEENNNNNNNNNNNN      " + Token);
              //console.log("*/*/*/*/*/*/*/*--> este el id de la direccion--"+ result.recordset[0].IdDireccion);
              // const descodeTOKEN = this.token_serv.decodeToken(Token);
              // console.log("---------------------------")
              // console.log(descodeTOKEN);
              res.status(200).json({token: Token});
            }

            sql.close();
    }).catch(err =>{
        if(err) console.log(err);
        sql.close();
    });
  }



      Allrole = (req, res)=>{
          var sql =  require('mssql');
          var env = process.env.NODE_ENV || 'SERWEB';
          var config = require('../controllers/connections/servers')[env];
          var Query = "Select IdRole,Nombre From Role";

          const pool = new sql.ConnectionPool(config, err =>{
            pool.request()
                        .query(Query, (err, result)=>{
                          if (err) console.log(err);
                          console.log("*//*/*/*/*/*/*/*/*/*/*/*/*----AllRole----*/*/*/*/*/*/*/*/*/*/*/");
                          res.status(201).json(result.recordset);
                        })
          });
      }


      AllDireccion = (req, res) =>{
          var sql =  require('mssql');
          var env = process.env.NODE_ENV || 'SERWEB';
          var config = require('../controllers/connections/servers')[env];
          var Query = "Select IdDireccion, Nombre From Direccion";

          const pool = new sql.ConnectionPool(config, err =>{
            pool.request()
                        .query(Query, (err, result)=>{
                          if (err) console.log(err);
                          console.log("*//*/*/*/*/*/*/*/*/*/*/*/*----AllDireccion----*/*/*/*/*/*/*/*/*/*/*/");
                          res.status(201).json(result.recordset);
                        })
          });
      }

      FilterUserDIreccion = (req, resp) =>{
        console.log(req.params.IdDireccion);
        var sql =  require('mssql');
          var env = process.env.NODE_ENV || 'SERWEB';
          var config = require('../controllers/connections/servers')[env];
          new sql.ConnectionPool(config).connect().then(pool=>{
              return pool.request()
                  .input('IdDireccion', sql.Int, req.params.IdDireccion)
                  .execute('FilterUserforDirecc')
          }).then(result=>{
            resp.status(200).json(result.recordset);
            sql.close();
          }).catch(err=>{
            resp.status(400).json({message: "Error al recuperar Usuarios"})
            sql.close();
          })
        
      }

      deleteUsers = (req, res) =>{
        console.log("este es el id de el usuario--->" + req.params.id); 
        var sql = require("mssql");
        var env = process.env.NODE_ENV || 'SERWEB';
        var config = require('../controllers/connections/servers')[env];
        new sql.ConnectionPool(config).connect().then(pool =>{
          return pool.request()
                          .input('IdUser', sql.Int, req.params.id)
                          .execute('DeleteUsersbyAdmin')
                        }).then(result =>{
                          res.status(201).json(result.recordset);
                          sql.close();
                        }).catch(err =>{
                          if(err) console.log(err);
                          
                          sql.close();
                        });
        
        //res.sendStatus(200);
      }

      createNewDireccion = (req, res) =>{
        console.log("se crea una nueva direccion");
        var sql = require("mssql");
        var env = process.env.NODE_ENV || 'SERWEB';
        var config = require('../controllers/connections/servers')[env];
        new sql.ConnectionPool(config).connect().then(pool =>{
          return pool.request()
                      .input('NameDireccion', sql.VarChar, req.params.NameDir)
                      .execute('CreateNewDireccionbyAdmin')
        }).then(result=>{
          console.log(result);
          res.status(201).json(1);
          sql.close();
        }).catch(err=>{
          res.status(201).json(0);
          sql.close();
        });
      }

      UpdateDireccion = (req, res) =>{
        var sql = require("mssql");
        var env = process.env.NODE_ENV || 'SERWEB';
        var config = require('../controllers/connections/servers')[env];
        new sql.ConnectionPool(config).connect().then(pool =>{
          return pool.request()
                .input('IdDir', sql.Int, req.params.IdDir)
                .input('UpdateDir', sql.VarChar, req.params.UpdateDir)
                .execute('UpdateDireccionbyAdmin')
        }).then(result=>{
          console.log(result);
          res.status(201).json(1);
          sql.close();
        }).catch(err=>{
          res.status(201).json(err);
          sql.close();
        });
      }

      deleteDireccion = (req, res) =>{
        console.log("Eliminando una direccion-----");
        var sql = require("mssql");
        var env = process.env.NODE_ENV || 'SERWEB';
        var config = require('../controllers/connections/servers')[env];
        new sql.ConnectionPool(config).connect().then(pool =>{
          return pool.request()
                      .input('IdDireccion', sql.Int, req.params.IdDir)
                      .execute('DeleteDireccionbyAdmin')
        }).then(result=>{
          console.log(result);
          res.status(201).json(1);
          sql.close();
        }).catch(err=>{
          console.log(err);
          res.status(201).json(0);
          sql.close();
        })
      }

      getDireccionesporUsuario = (req, res) =>{
       console.log("recuperar las direcciones de el usuario seleccionado");
       console.log("Este es el id de el usuario seleccionado--->    "  + req.params.Id);
       
       
        var sql = require("mssql");
        var env = process.env.NODE_ENV || 'SERWEB';
        var config = require('../controllers/connections/servers')[env];

        new sql.ConnectionPool(config).connect().then(pool =>{
          return pool.request()
                            .input('IdUser', sql.Int, req.params.Id)
                            .execute('GetAllDirecctionsForUser')

        }).then(result =>{
          res.status(200).json(result.recordset);
          sql.close();
        }).catch(err =>{
          if(err) console.log(err);
          sql.close();
        })



      }


      UpdateUsrDataGeneral = (req, res) =>{
        console.log("Actualiza el usuario con dicha informacion  ID ---->" + req.body.IdUsr);
        console.log("Nombre USR --->" + req.body.Name);
        console.log("Nombre USRname --->" + req.body.username);
        console.log("Nombre email --->" + req.body.email);
        console.log("Nombre password --->" + req.body.password);
        console.log("Nombre tel --->" + req.body.tel);
        console.log("Nombre ext --->" + req.body.ext);
        console.log("Nombre puesto --->" + req.body.puesto);
        console.log("Other tipo de Role SolPed--->" + req.body.rolesolped);
        console.log("Other tipo de Role Consumo interno ---->" + req.body.rolesolconsumo);
        var Name, username, email, password, tel, ext, puesto, rolesolped, roleconsumo; 
        if(req.body.Name == '' || req.body.Name == undefined){
          Name = '';
        }else{
          Name = req.body.Name;
        }
        if(req.body.username == '' || req.body.username == undefined){
          username = '';
        }else{
          username = req.body.username ;
        }
        if(req.body.email == '' || req.body.email == undefined){
          email = '';
        }else{
          email = req.body.email;
        }
        if(req.body.password == '' || req.body.password == undefined){
          password = '';
        }else{
          password = req.body.password;
        }
        if(req.body.tel == 0 || req.body.tel == undefined){
          tel = '0';
        }else{
          tel = req.body.tel;
        }
        if(req.body.ext == 0 || req.body.ext == undefined){
          ext = '0';
        }else{
          ext = req.body.ext;
        }
        if(req.body.puesto == '' || req.body.puesto == undefined){
          puesto = '';
        }else{
          puesto = req.body.puesto;
        }
        if(req.body.rolesolped == 0 || req.body.rolesolped == undefined){
          rolesolped = 0;
        }else{
          rolesolped = req.body.rolesolped;
        }
        if(req.body.rolesolconsumo == 0 || req.body.rolesolconsumo == undefined){
          roleconsumo = 0;
        }else{
          roleconsumo = req.body.rolesolconsumo;
        }
       
          var sql = require("mssql");
          var env = process.env.NODE_ENV || 'SERWEB';
          var config = require('../controllers/connections/servers')[env];
          new sql.ConnectionPool(config).connect().then(pool =>{
            return pool.request()
                                .input('IdUsuario', sql.Int, req.body.IdUsr)
                                .input('NombreCompleto', sql.VarChar, Name)
                                .input('UserName', sql.VarChar, username)
                                .input('Email', sql.VarChar, email)
                                .input('Password', sql.VarChar, password)
                                .input('Telefono', sql.BigInt, tel)
                                .input('Ext', sql.Int, req.body.ext)
                                .input('Puesto', sql.VarChar, puesto)
                                .input('RoleSolPed', sql.Int, rolesolped)
                                .input('RoleConsumo', sql.Int, roleconsumo)
                                .execute('UpdateDataGeneralUser')
          }).then(result =>{
            console.log("--------------------");
            console.log(result.recordset);
            res.status(200).json(result.recordset);
            sql.close();
          }).catch(err =>{
            if(err) console.log(err);
            sql.close();
          })
        
    
        // if(req.body.Name != ''){
          
        //       new sql.ConnectionPool(config).connect().then(pool =>{
        //         return pool.request()
        //                             .input('IdUsuario', sql.Int, req.body.IdUsr)
        //                             .input('NombreCompleto', sql.VarChar, req.body.Name)
        //                             .execute('UpdateDataGeneralUser')
        //       }).then(result =>{
        //         res.status(200).json(result.recordset);
        //         sql.close();
        //       }).catch(err =>{
        //         if(err) console.log(err);
        //         sql.close();
        //       })
          
        // }
        // if(req.body.username != ''){
        //       console.log("Tiene un valor nuevo el  username --->" + req.body.IdUsr + " " + req.body.username);
        //       new sql.ConnectionPool(config).connect().then(pool =>{
        //         return pool.request()
        //                             .input('IdUsuario', sql.Int, req.body.IdUsr)
        //                             .input('UserName', sql.VarChar, req.body.username)
        //                             .execute('UpdateDataGeneralUser')
        //       }).then(result =>{
        //         res.status(200).json(result.recordset);
        //         //sql.close();
        //       }).catch(err =>{
        //         if(err) console.log(err);
        //         //sql.close();
        //       })
        // }
        // if(req.body.email != ''){
        //   console.log("Tiene un valor nuevo el  email --->" + req.body.IdUsr + " " + req.body.email);

        //         new sql.ConnectionPool(config).connect().then(pool =>{
        //           return pool.request()
        //                               .input('IdUsuario', sql.Int, req.body.IdUsr)
        //                               .input('Email', sql.VarChar, req.body.username)
        //                               .execute('UpdateDataGeneralUser')
        //         }).then(result =>{
        //           res.status(200).json(result.recordset);
        //           //sql.close();
        //         }).catch(err =>{
        //           if(err) console.log(err);
        //           //sql.close();
        //         })

        // }
        // if(req.body.password != ''){
        //   console.log("Tiene un valor nuevo el  password --->" + req.body.IdUsr + " " + req.body.password);

        //         new sql.ConnectionPool(config).connect().then(pool =>{
        //           return pool.request()
        //                               .input('IdUsuario', sql.Int, req.body.IdUsr)
        //                               .input('Password', sql.VarChar, req.body.password)
        //                               .execute('UpdateDataGeneralUser')
        //         }).then(result =>{
        //           res.status(200).json(result.recordset);
        //           //sql.close();
        //         }).catch(err =>{
        //           if(err) console.log(err);
        //           //sql.close();
        //         })

        // }
        // if(req.body.tel != 0  ){
        //   console.log("Tiene un valor nuevo el  tel --->" + req.body.IdUsr + " " + req.body.tel);
        //      var telstring = ""+req.body.tel+"";

        //       new sql.ConnectionPool(config).connect().then(pool =>{
        //         return pool.request()
        //                             .input('IdUsuario', sql.Int, req.body.IdUsr)
        //                             .input('Telefono', sql.VarChar, req.body.tel)
        //                             .execute('UpdateDataGeneralUser')
        //       }).then(result =>{
        //         res.status(200).json(result.recordset);
        //        // sql.close();
        //       }).catch(err =>{
        //         if(err) console.log(err);
        //         //sql.close();
        //       })
            
        // }
        // if(req.body.ext != 0 ){
        //   console.log("Tiene un valor nuevo el  ext --->" + req.body.IdUsr + " " + req.body.ext);

        //       new sql.ConnectionPool(config).connect().then(pool =>{
        //         return pool.request()
        //                             .input('IdUsuario', sql.Int, req.body.IdUsr)
        //                             .input('Ext', sql.Int, req.body.ext)
        //                             .execute('UpdateDataGeneralUser')
        //       }).then(result =>{
        //         res.status(200).json(result.recordset);
        //         //sql.close();
        //       }).catch(err =>{
        //         if(err) console.log(err);
        //         //sql.close();
        //       })

        // }
        // if(req.body.puesto != '' || req.body.puesto != undefined || req.body.puesto != null){
        //   console.log("Tiene un valor nuevo el  puesto --->" + req.body.IdUsr + " " + req.body.puesto);

        //       new sql.ConnectionPool(config).connect().then(pool =>{
        //         return pool.request()
        //                             .input('IdUsuario', sql.Int, req.body.IdUsr)
        //                             .input('Puesto', sql.VarChar, req.body.puesto)
        //                             .execute('UpdateDataGeneralUser')
        //       }).then(result =>{
        //         console.log(result);
        //         res.status(200).json(result.recordset);
        //         //sql.close();
        //       }).catch(err =>{
        //         if(err) console.log(err);
        //         //sql.close();
        //       });
        // }

        // if( req.body.rolesolped != 0){
        //   console.log("un nuevo valor para el Role Slicitud de Pedido ------" + req.body.rolesolped + "---" + req.body.IdUsr);
        //     new sql.ConnectionPool(config).connect().then(pool =>{
        //       return pool.request()
        //                           .input('IdUsuario', sql.Int, req.body.IdUsr)
        //                           .input('RoleSolPed', sql.Int, req.body.rolesolped)
        //                           .execute('UpdateDataGeneralUser')
        //     }).then(result =>{
        //       //console.log(result);
        //       res.status(200).json(result.recordset);
        //       //sql.close();
        //     }).catch(err =>{
        //       if(err) console.log(err);
        //       //sql.close();
        //     });
        // }

        // if( req.body.rolesolconsumo != 0){
        //   console.log("un nuevo valor para el ROle de Consumo Interno ------" + req.body.rolesolconsumo + "---" + req.body.IdUsr);
        //   new sql.ConnectionPool(config).connect().then(pool =>{
        //     return pool.request()
        //                         .input('IdUsuario', sql.Int, req.body.IdUsr)
        //                         .input('RoleConsumo', sql.Int, req.body.rolesolconsumo)
        //                         .execute('UpdateDataGeneralUser')
        //   }).then(result =>{
        //     console.log(result.recordset);
        //     res.status(200).json(result.recordset);
        //     //sql.close();
        //   }).catch(err =>{
        //     if(err) console.log(err);
        //     //sql.close();
        //   });
        // }

        //sql.close();
      }



      AddDirUser = (req, res) =>{
        console.log("Se agrega direccion a un usuario");
        console.log("Id del Usuario--->   " + req.params.IdUsr + "  Este es el Id de la Direccion---->   " +  req.params.IdDir);
        var sql = require("mssql");
        var env = process.env.NODE_ENV || 'SERWEB';
        var config = require('../controllers/connections/servers')[env];

        new sql.ConnectionPool(config).connect().then(pool =>{
          return pool.request()
                            .input('IdUser', sql.Int, req.params.IdUsr)
                            .input('IdDireccion', sql.Int, req.params.IdDir)
                            .execute('AddDirectionUser')
        }).then(result =>{
          res.status(200).json(result.recordset);
          sql.close();
        }).catch(err=>{
          sql.close();
          if(err){
            console.log(err.number);
            console.log(err.originalError.info.message)
            if(err.number == 2627){
              res.status(401).json('El usuario ya tiene la direccion seleccionada ligada.')
            }else{
              res.status(401).json(err)
            }
          } 
          
        });
      }

      DeleteDirUser = (req, res) =>{
        console.log("Eliminando una direccion para el Usuario espesifico");
        console.log("Este de el Id Usuario-->  " + req.params.IdUsr + "  Este es el Id de la DIreccion-->   " + req.params.IdDir);

        var sql = require("mssql");
        var env = process.env.NODE_ENV || 'SERWEB';
        var config = require('../controllers/connections/servers')[env];

        new sql.ConnectionPool(config).connect().then(pool =>{
          return pool.request()
                            .input('IdUser', sql.Int, req.params.IdUsr)
                            .input('IdDir', sql.Int, req.params.IdDir)
                            .execute('DeleteDireccionUser')
        }).then(result =>{
          res.status(200).json(result.recordset);
          sql.close();
        }).catch(err=>{
          if(err) console.log(err);
          sql.close();
        });

      }

}
