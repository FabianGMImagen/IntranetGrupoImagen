//import { forEach } from "@angular/router/src/utils/collection";
import { ConstantPool } from "@angular/compiler/src/constant_pool";
import { ɵConsole, Input } from "@angular/core";
import { connect } from "net";
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
// const SERVER = 'http://solicitud.adgimm.com.mx:3000';
// const Intranet = 'http://solicitud.adgimm.com.mx:3000';

const Intranet = process.env.FRONT_FRONT_CALIDAD;
const SERVER = process.env.SERVER_CALIDAD;


// const CLIENTID = '149352725404-hdc5872pn8h3ns841ve1tfsgtj9btlra.apps.googleusercontent.com';
// const CLIENTSECRET = '8EVBFB3CsQGdl1hmo8Ga1RjC';
// const REDIRECTURL = 'https://developers.google.com/oauthplayground';
// const REFRESH_TOKEN = '1//04F6bjTLj3YJlCgYIARAAGAQSNwF-L9IrrBqIYrbSPZE7BrCNOM9WTr_hff_nDJseZC0vzr_nADwFCsJWcDy485bq7VG3QYd8O6U';
const CLIENTID = process.env.CLIENTID;
const CLIENTSECRET = process.env.CLIENTSECRET;
const REDIRECTURL = process.env.REDIRECTURL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;


export default class SolicitudCompraCTR {

  getEmpresas = (req, res) => {

    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    var Query = "select Id, IdEmpresa, Nombre from Empresas";
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(Query, (err, result) => {
          // ... error checks
          if (err) console.log(err);
          console.log("*/*/*/*/*/*/*/*/---Empresas---*/*/*/*/*/*/->" + result.recordset);
          //  console.log("All Direcciones");
          // console.log(result.recordset)
          res.status(200).json(result.recordset);
        });
    });

  }

  getArea = (req, res) => {
    //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++" + req.params.IdUser);
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdUser', sql.Int, req.params.IdUser)
        .execute('DireccionPorUsuario')
    }).then(resultt => {
      //console.log(resultt);
      res.status(201).json(resultt.recordset);
      sql.close();
    }).catch(err => {
      if (err) console.log("errror al hacer el insert--->" + err);
      sql.close();
    });

  }

  getCentroCostos = (req, res) => {

    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'WEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    var Query = "select IdCentroCosto ,IdSAPCentroCosto, Nombre, FechaRegistro from ImagenFinanzas.dbo.CentroCosto";
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(Query, (err, result) => {
          // ... error checks
          if (err) console.log(err);
          console.log("*/*/*/*/*/*/*/*/---CentroCostos---*/*/*/*/*/*/->" + result.recordset);
          //  console.log("All Direcciones");
          // console.log(result.recordset)
          res.status(200).json(result.recordset);


        });


    });

  }


  getCuentaMayor = (req, res) => {

    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'WEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    var Query = "select IdCuentaMayor, Nombre from ImagenFinanzas.dbo.CuentaMayor";
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(Query, (err, result) => {
          // ... error checks
          if (err) console.log(err);
          console.log("*/*/*/*/*/*/*/*/---Cuenta Mayor---*/*/*/*/*/*/->" + result.recordset);
          //  console.log("All Direcciones");
          // console.log(result.recordset)
          res.status(200).json(result.recordset);


        });


    });

  }

  getSucursalesPlazaByIdEmpresa = (req, res) => {

    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'WEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    var Query = "Select * from Plaza where IdEmpresa =" + req.params.Id + ";";
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(Query, (err, result) => {
          // ... error checks
          if (err) console.log(err);
          console.log("*/*/*/*/*/*/*/*/---EmpresaByPlazas---*/*/*/*/*/*/->" + result.recordset);
          //  console.log("All Direcciones");
          // console.log(result.recordset)
          res.status(200).json(result.recordset);

        });
    });

  }


  getAllImputaciones = (req, res) => {

    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    var Query = "Select * From TipoSolicitud";
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(Query, (err, result) => {
          // ... error checks
          if (err) console.log(err);
          console.log("*/*/*/*/*/*/*/*/---Imputacion---*/*/*/*/*/*/->" + result.recordset);
          //  console.log("All Direcciones");
          // console.log(result.recordset)
          res.status(200).json(result.recordset);
        });
    });

  }

  getImputacionesforItem = (req, res) => {
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    var query = "select * from TipoSolicitud where IdTipoSolicitud != 6";
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(query, (err, result) => {
          // ... error checks
          if (err) console.log(err);
          console.log("*/*/*/*/*/*/*/*/---Imputacion---*/*/*/*/*/*/->" + result.recordset);
          //  console.log("All Direcciones");
          // console.log(result.recordset)
          res.status(200).json(result.recordset);
        });
    });
  }



  getAllActivo = (req, res) => {
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'WEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    var Query = "select * from Activo";
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(Query, (err, result) => {
          // ... error checks
          if (err) console.log(err);
          console.log("*/*/*/*/*/*/*/*/---Activo---*/*/*/*/*/*/->" + result.recordset);
          //  console.log("All Direcciones");
          // console.log(result.recordset)
          res.status(200).json(result.recordset);
        });
    });
  }

  getAllActivos = (req, res) => {
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'WEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    var Query = "Select * from Activo";
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(Query, (err, result) => {
          // ... error checks
          if (err) console.log(err);
          console.log("*/*/*/*/*/*/*/*/---Activo---*/*/*/*/*/*/->" + result.recordset);
          //  console.log("All Direcciones");
          // console.log(result.recordset)
          res.status(200).json(result.recordset);
        });
    });
  }


  getAllNecesidad = (req, res) => {
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    var Query = "select * from Necesidad";
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(Query, (err, result) => {
          // ... error checks
          if (err) console.log(err);
          console.log("*/*/*/*/*/*/*/*/---Necesidad---*/*/*/*/*/*/->" + result.recordset);
          //  console.log("All Direcciones");
          // console.log(result.recordset)
          res.status(200).json(result.recordset);
        });
    });
  }

  getAllMateriales = (req, res) => {
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'WEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    var Query = "select * from Material";
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(Query, (err, result) => {
          // ... error checks
          if (err) console.log(err);
          console.log("*/*/*/*/*/*/*/*/---Materiales---*/*/*/*/*/*/->" + result.recordset);
          //  console.log("All Direcciones");
          // console.log(result.recordset)
          res.status(200).json(result.recordset);
        });
    });
  }

  getAllAlmacenes = (req, res) => {
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'WEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    var Query = "select * from Almacen";
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(Query, (err, result) => {
          // ... error checks
          if (err) console.log(err);
          console.log("*/*/*/*/*/*/*/*/---Almacenes---*/*/*/*/*/*/->" + result.recordset);
          //  console.log("All Direcciones");
          // console.log(result.recordset)
          res.status(200).json(result.recordset);
        });
    });
  }

  getAllPosiciones = (req, res) => {

    // var sql = require("mssql");
    // //variable de entorno para realizar la coneccion
    // var env = process.env.NODE_ENV || 'WEB';
    // //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    // var config = require('../controllers/connections/servers')[env];              
    // var Query = "select * from Posicion";      
    // const pool1 = new sql.ConnectionPool(config, err => {           
    //   pool1.request()       
    //     .query(Query, (err, result) => {
    //       // ... error checks
    //       if (err) console.log(err); 
    //       //console.log("*/*/*/*/*/*/*/*/---Posiciones---*/*/*/*/*/*/->" + result.recordset);
    //     //  console.log("All Direcciones");
    //     // console.log(result.recordset)
    //       res.status(200).json(result.recordset); 
    //   });
    // });

  }

  getAllPosicionByImputacion(req, res) {
    console.log('recuperando posiciones por imputacion    ' + req.params.Id);
    var sql = require("mssql");
    var env = process.env.NODE_ENV || 'WEB';
    var config = require('../controllers/connections/servers')[env];
    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdImputacion', sql.Int, req.params.Id)
        .execute('AllPosicionByImputacion')
    }).then(result => {
      console.log(result.recordset);
      res.status(201).json(result.recordset);
      sql.close();
    }).catch(err => {
      if (err) console.log(err);

      sql.close();
    });
  }


  GrupoArticulo = (req, res) => {
    console.log("Dentro de el metodo que regresa Grupo de Articulos");
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'WEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    var Query = "Select * From GrupoArticulo"
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(Query, (err, result) => {
          if (err) console.log(err);
          console.log("*/*/*/*/*/*/*--Grupo de Articulo--*/*/*/*/*/*/" + result.recordset);
          res.status(200).json(result.recordset);
        });
    });

  }

  GrupoCompra = (req, res) => {
    console.log("Dentro de el metodo que regresa todos los grupos de compra");
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'WEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    var Query = "Select * From GrupoCompra";
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(Query, (err, result) => {
          if (err) console.log(err);
          console.log("*/*/*/*/*/*/-----Grupo de Compra----*/*/*/*/*/");
          res.status(200).json(result.recordset);
        });
    });
  }

  AllMoneda = (req, res) => {
    console.log("recuperando la lista de monedas");

    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    var query = "Select * from Moneda";
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(query, (err, result) => {
          if (err) console.log(err);
          console.log("*/*/*/*/*/*/----Tipos de Monedas ----*/*/*/*/*/");
          res.status(200).json(result.recordset);
          res.end();
        });
    });
  }

  UsuarioAuth = (req, res) => {
    console.log("dentro de el metodo que nos regresa el usuario que autoriza la solicitud");
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    console.log("este es el id de la direccion--->" + req.params.id);
    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('idDireccion', sql.Int, req.params.id)
        .execute('getUserAuthForDireccion')
    }).then(result => {
      res.status(201).json(result.recordset);
      sql.close();
    }).catch(err => {
      if (err) console.log(err);

      sql.close();
    });
  }

  AllCategoriasforUserComprador = (req, resp) =>{
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];

    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdUserComprador', sql.Int, req.params.IdUser)
        .execute('CategorysForUserComprador')
    }).then(result => {
      //console.log(result.recordset);
      resp.status(201).json(result.recordset);
      sql.close();
    }).catch(err => {
      if (err) console.log(err);
      resp.status(304).json({message: "Error-...." + err});
      sql.close();
    })
  }

  AllCategorias = (req, resp) =>{
    console.log("recuperamos las categorias");
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .execute('GetAllCategorias')
    }).then(result => {
      resp.status(201).json(result.recordset);
      sql.close();
    }).catch(err => {
      if (err) console.log(err);
      resp.status(304).json({message: "Error-...." + err});
      sql.close();
    })
  }

  NewCategory = (req, resp)=>{
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];

    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('NameCategory', sql.VarChar, req.params.category)
        .input('Descripcion', sql.VarChar, req.params.descripcion)
        .execute('NewCategory')
    }).then(result => {
      //console.log(result.recordset);
      resp.status(201).json({message:"Se agrego correctamente la categoría" + result});
      sql.close();
    }).catch(err => {
      if (err) console.log(err);
      resp.status(304).json({message: "Error-...." + err});
      sql.close();
    })
  }

  AllUsersCompradores = (req, resp) =>{
    console.log("Recuperamos los datos de Usuarios Compradores");
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    var query = "SELECT * FROM Usuario where IdRole = 7;";
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(query, (err, result) => {
          if (err) console.log(err);
          resp.status(200).json(result.recordset);
        });
    });
  }

  AllCategoriasnoUsadasporCompradores = (req, resp)=>{
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];

    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .execute('Categoriasnousadas')
    }).then(result => {
      //console.log(result.recordset);
      resp.status(201).json(result.recordset);
      sql.close();
    }).catch(err => {
      if (err) console.log(err);
      resp.status(304).json({message: "Error-...." + err});
      sql.close();
    })
  }

  ListCategoriasforUsuario = (req, resp) =>{
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];

    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdUser', sql.Int, req.params.IdUser)
        .execute('ListCategorisforUser')
    }).then(result => {
      //console.log(result.recordset);
      resp.status(201).json(result.recordset);
      sql.close();
    }).catch(err => {
      if (err) console.log(err);
      resp.status(304).json({message: "Error-...." + err});
      sql.close();
    })
  }

  InsertNewCategoryforComprador = (req, resp) =>{
    //InsertNewCategoriaForComprador
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];

    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdUser', sql.Int, req.params.IdUser)
        .input('IdCategoria', sql.Int, req.params.IdCategoria)
        .execute('InsertNewCategoriaForComprador')
    }).then(result => {
      console.log(result.recordsets);
      resp.status(201).json("Se asigno la categoria Correctamente");
      sql.close();
    }).catch(err => {
      if (err) console.log(err);
      resp.status(304).json({message: "Error-...." + err});
      sql.close();
    })
  }

  DeleteCategoriaForUser = (req, resp)=>{
    var sql = require("mssql");
    console.log(req.params.IdUser);
    console.log(req.params.IdCategoria)
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];

    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdUser', sql.Int, req.params.IdUser)
        .input('IdCategoria', sql.Int, req.params.IdCategoria)
        .execute('DeleteCategoriaforUserComprador')
    }).then(result => {
      console.log(result.recordsets);
      resp.status(201).json("Se elimino la categoria correctamente del usuario");
      sql.close();
    }).catch(err => {
      if (err) console.log(err);
      resp.status(304).json({message: "Error-...." + err});
      sql.close();
    })
  }
  
  DeleteCategoria= (req, resp)=>{
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];

    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdCategoria', sql.Int, req.params.IdCategoria)
        .execute('DeleteCategory')
    }).then(result => {
      console.log(result.recordsets);
      resp.status(201).json("Se elimino la categoria correctamente la Categoria");
      sql.close();
    }).catch(err => {
      if (err) console.log(err);
      resp.status(304).json({message: "Error-...." + err});
      sql.close();
    })
  }
  

  ChangedCategoriForSolicitud = (req, resp) =>{
    //ModificateCategoryforSolicitud
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];

    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdSol', sql.Int, req.params.IdSol)
        .input('IdCategory', sql.Int, req.params.IdCat)
        .execute('ModificateCategoryforSolicitud')
    }).then(result => {
      console.log(result.recordsets);
      resp.status(201).json("Se Actualizo la categoria, correctamente");
      sql.close();
    }).catch(err => {
      if (err) console.log(err);
      resp.status(304).json({message: "Error-...." + err});
      sql.close();
    })
  }


  //Inserta Solicitud
  insertSolicitudNewT1 = (req, res) => {
    //-----------------------------------------------TIPO DE SOLICITUD ---A-- o 01
    console.log(req.body);
    // console.log("Tipo de Solicitud-->" + req.body.TipoSolicitud);
    // console.log("id de el usuario-->"+req.body.IdUsuario);
    // console.log("Autorizador-->" + req.body.Autorizador.IdUsuario);
    // console.log("id Direccion-->"+req.body.Area.IdDireccion);
    // console.log("Id empresa-->"+req.body.Empresa.Bukrs);
    // console.log("NombreEmpresa-->" + req.body.Empresa.Butxt);
    // console.log("Plaza-->"+req.body.Plaza.IdPlaza);
    // console.log("id Imputacion-->"+req.body.Imputacion.IdImputacion);
    // console.log("Nombre Imputacion-->"+req.body.Imputacion.Nombre);
    // console.log("IdTipo de Moneda--" + req.body.Moneda.IdMoneda);
    console.log(req.body.Categoria.IdCategoria); 
    // console.log("Nombre tipo de moneda---" + req.body.Acronimo);
    // // console.log("ID Centro de costo-->" + req.body.CentroCostos.IdCentroCosto);
    // // console.log("Name Centro de costo-->" + req.body.CentroCostos.Nombre);
    // // console.log("ID Orden Interna-->" + req.body.OrdenInterna.IdOrdenInterna);
    // // console.log("Nombre Orden Interna-->" + req.body.OrdenInterna.NombreOrder);
    // // console.log("ID Cuenta de mayor-->" + req.body.Cuentamayor.IdCuentaMayor);
    // // console.log("Nombre Cuenta de mayor-->" + req.body.Cuentamayor.Nombre);
    // //console.log("Producto-->" + req.body.Productos);
    // console.log("Nombre de la produccion-->"+req.body.NombreProduccion);
    // console.log("Usuario-->" + req.body.Usr);
    // console.log("Puesto-->" + req.body.Puesto);
    // console.log("Email-->" + req.body.Email);
    // console.log("Tel-->" + req.body.Tel);
    // console.log("Ext-->" + req.body.Ext);

    // //cantidad de Productos que se ingresaran 
    // console.log("arreglo -->"+req.body.Productos.length);
    // console.log("Hijo OE " + req.body.SelectedOrdenEstadisiticaChild);
    // console.log("Hijo CC " + req.body.SelectedCentroCosotosChild);
    // console.log("Hijo CM " + req.body.SelectedCuentaMayorChild);
    console.log("dentro del metodo para insertar una nueva solicitud.......................................");
    console.log(req.body.IdUsuario);

    if (req.body.TipoSolicitud == 1) {
      //console.log("---------------------DEBE DE ENTRAR SI ES QUE LOS VALORES ESTAN VACIOS IMPUTACION 1");
      if (req.body.CentroCostos == null || req.body.CentroCostos == undefined &&
        req.body.OrdenInterna == null || req.body.OrdenInterna == undefined &&
        req.body.Cuentamayor == null || req.body.Cuentamayor == undefined) {

        //console.log("Se realiza el primer insert a la Tabla Solicitud");
        //aqui se valida el tipo de DIreccion para insertar el Status correcto en el caso
        //del Ing. Rivera y otras
        var sql = require("mssql");
        var env = process.env.NODE_ENV || 'SERWEB';
        var config = require('../controllers/connections/servers')[env];
        var statusNewSolicit;
        console.log("Validamos si existe una exepcion en SP ConsultdirexceptionAuth  --TIPO SOL 1");
        new sql.ConnectionPool(config).connect().then(pool => {
          return pool.request()
            .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
            .execute('ConsultdirexceptionAuth')
        }).then(result => {

          //si es diferente a null o undefined quiere decir que si tiene una validacion por omitir
          //si no se queda en estatus de solicitud 1
          if (result.recordset[0] != undefined || result.recordset[0] != null) {
            statusNewSolicit = 2;
          } else {
            statusNewSolicit = 1;
          }

          var sql = require("mssql");
          var env = process.env.NODE_ENV || 'SERWEB';
          var config = require('../controllers/connections/servers')[env];

          var date = new Date(req.body.Fecha)
          console.log(date);
          new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request()
              .input('Fecha', sql.VarChar, req.body.Fecha)
              .input('TipoSolicitud', sql.Int, req.body.TipoSolicitud)
              .input('IdStatus', sql.Int, req.body.EstatusSol)
              .input('IdUsuarioSolicitante', sql.Int, req.body.IdUsuario)
              .input('IdUsuarioAutorizadorDireccion', sql.Int, req.body.Autorizador.IdUsuario)
              .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
              .input('IdMoneda', sql.Int, req.body.Moneda.IdMoneda)
              .input('IdCategoria', sql.Int, req.body.Categoria.IdCategoria)
              .input('Usuario', sql.VarChar, req.body.Usr)
              .input('Puesto', sql.VarChar, req.body.Puesto)
              .input('Email', sql.VarChar, req.body.Email)
              .input('Tel', sql.VarChar, req.body.Tel)
              .input('Ext', sql.Int, req.body.Ext)
              .input('IdEmpresa', sql.VarChar, req.body.Empresa.Bukrs)
              .input('EmpresaName', sql.VarChar, req.body.Empresa.Butxt)
              .input('IdPalza', sql.VarChar, req.body.Plaza.IdPlaza)
              .input('PlazaName', sql.VarChar, req.body.Plaza.Nombre)
              //.input('IdCentroCosto', sql.VarChar, '')
              //.input('CentroCostoName', sql.VarChar, '')
              .input('IdOrdeninterna', sql.VarChar, '')
              .input('OrdenInternaName', sql.VarChar, '')
              //.input('IdCuentamayor', sql.VarChar, '')
              //.input('CuentaMayorName', sql.VarChar, '')
              .input('Produccion', sql.VarChar, req.body.NombreProduccion)
              .input('Justificacion', sql.VarChar, req.body.Justificacion)
              .output('output_IdSol', sql.VarChar(50))
              .execute('InsertNewSolicitudPedido')

            //campos de StoreProcedure de Base de Datos (1), sin cambio de WebService
            // .input('Fecha', sql.VarChar, req.body.Fecha)
            // .input('TipoSolicitud', sql.Int, req.body.TipoSolicitud)
            // .input('IdUsuario', sql.Int, req.body.IdUsuario)
            // .input('IdUsuarioAutorizador', sql.Int, req.body.Autorizador.IdUsuario)
            // .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
            // .input('IdEmpresa', sql.Int, req.body.Empresa.IdEmpresa)
            // .input('IdPlaza', sql.Int, req.body.Plaza.IdPlaza)
            // .input('Idimputacion', sql.Int, req.body.Imputacion.IdImputacion)
            // .input('IdPosicion', sql.Int, req.body.Posicion.IdPosicion)
            // .input('IdCentroCostos', sql.Int, null)
            // .input('IdCuentaMayor', sql.Int, null)
            // .input('Tipo', sql.VarChar, req.body.Tipo)
            // .input('OrdenInterna', sql.VarChar,req.body.IdOrdenInterna)
            // .input('Usuario', sql.VarChar, req.body.Usr)
            // .input('Puesto', sql.VarChar, req.body.Puesto)
            // .input('Email', sql.VarChar, req.body.Email)
            // .input('Tel', sql.VarChar, req.body.Tel)
            // .input('Ext', sql.Int, req.body.Ext)
            // .input('Produccion', sql.VarChar, req.body.NombreProduccion)
            // .execute('InsertNewSolicitudCompra')


          }).then(result => {

            //se tendria que insertar los Productos por un foreach 
            req.body.Productos.forEach(function (prod, indice, array) {
              // console.log("indice -->" + indice + 
              // " hay estos son los valores:" +
              // 'IdSolicitud'+ result.output.output_IdSol+
              // "  Cantidad-->"+ prod.Cantidad+
              // "  Precio-->"+prod.Precio+
              // "  Almacen-->"+prod.Almacen+
              // "  AlmacenName---->"+prod.AlmacenName +
              // //"  Centro-->"+ prod.Centro +
              // "  Material-->" + prod.Material+
              // "  MaterialName-->" + prod.MaterialName+
              // "  Centro de Costo-->"+ prod.CentroCosto+
              // "  Centro CostoName-->" + prod.CentroCostoName+
              // "  Cuenta de Mayor-->"+ prod.CuentaMayor+
              // "  Cuenta de MayorName"+ prod.CuentaMayorName+
              // "  GrupoCompra  "+ prod.GrupCompra+
              // "  NameGrupoCompra"+ prod.NameGrupoCompra+
              // "  Unidadmedida"+prod.UnidadMedida+
              // "  NameUnidadMedida"+ prod.NameUnidadMedida+
              // "  OrdenEstadistica"+ prod.IdOrdenEstadistica+
              // "  NameOrdenEstadistica"+prod.OrdenEstadisticaName+
              // "  NumActivo"+ prod.NumActivo+
              // "  NameActivo"+ prod.NameActivo+
              // "  NumNeces  "+ prod.NumNeces+
              // "  NameNeces  "+ prod.NameNeces+
              // "  NombreSolPed  " + prod.NombreSolPed+
              // "  AcronimoSolPed  " + prod.AcronimoSolPed+
              // "  Espf"+ prod.Espf+
              // "  UsoProd-->" + prod.UsoProd);

              var sql = require("mssql");
              var env = process.env.NODE_ENV || 'SERWEB';
              var config = require('../controllers/connections/servers')[env];

              new sql.ConnectionPool(config).connect().then(pool => {
                return pool.request()
                  .input('IdSolicitud', sql.Int, result.output.output_IdSol)
                  .input('Cantidad', sql.Int, prod.Cantidad) // Simepre va a ser null es un tipo de solicitud A
                  .input('Precio', sql.Decimal, prod.Precio) // Simepre va a ser null es un tipo de solicitud A
                  .input('IdAlmacen', sql.VarChar, prod.Almacen)
                  .input('AlmacenName', sql.VarChar, prod.AlmacenName)
                  .input('IdMaterial', sql.VarChar, prod.Material)
                  .input('MaterialName', sql.VarChar, prod.MaterialName)
                  .input('IdCentroCosto', sql.VarChar, prod.CentroCosto)
                  .input('CentroCostoName', sql.VarChar, prod.CentroCostoName)
                  .input('IdCuentamayor', sql.VarChar, prod.CuentaMayor)
                  .input('CuentaMayorName', sql.VarChar, prod.CuentaMayorName)
                  .input('IdGrupoCompra', sql.VarChar, prod.GrupCompra)
                  .input('GrupoCompraName', sql.VarChar, prod.NameGrupoCompra)
                  .input('IdUnidadmedida', sql.VarChar, prod.UnidadMedida)
                  .input('UnidadMedidaName', sql.VarChar, prod.NameUnidadMedida)
                  .input('IdOrdenEstadistica', sql.VarChar, '')
                  .input('OrdenEstadisticaName', sql.VarChar, '')
                  .input('IdNumeroActivo', sql.VarChar, prod.NumActivo)
                  .input('NumeroActivoName', sql.VarChar, prod.NameActivo)
                  .input('IdNecesidad', sql.VarChar, prod.NumNeces)
                  .input('EspGene', sql.VarChar, prod.Espf)
                  .input('UsoBien', sql.VarChar, prod.UsoProd)
                  .output('output_Product', sql.Int)
                  .execute('InsertProductosbyDetalleSol')
              }).then(resp => {
                res.status(201);
                sql.close();
              }).catch(err => {
                if (err) console.log(err);
                sql.close();
              });
            });
            console.log('se inserto en la tabla de solicitud y los materiales correctamente');
            res.status(201).json(result.output.output_IdSol);
            sql.close();
          }).catch(err => {
            if (err) console.log(err);
            res.end(400).json({message: "Error...." + err});
            sql.close();
          });

        }).catch(err => {
          if (err) console.log(err);
          res.end(400).json({message: "Error...." + err});
          sql.close();
        });


      }
    }

    if (req.body.TipoSolicitud == 2) {
      console.log("-----------------------ESTA OPCION ES SI ES QUE SOLO CENTRO DE COSOTOS ESTA VACIO TIPO SOL 2");
      if (req.body.CentroCostos == null || req.body.CentroCostos == undefined &&
        req.body.OrdenInterna != null || req.body.OrdenInterna != undefined &&
        req.body.Cuentamayor != null || req.body.Cuentamayor != undefined) {


        console.log("Se realiza el primer insert a la Tabla Solicitud");
        //aqui se valida el tipo de DIreccion para insertar el Status correcto en el caso
        //del Ing. Rivera y otras 
        var sql = require("mssql");
        var env = process.env.NODE_ENV || 'SERWEB';
        var config = require('../controllers/connections/servers')[env];
        var statusNewSolicit;
        console.log("Validamos si existe una exepcion en SP ConsultdirexceptionAuth  --TIPO SOL 2");
        new sql.ConnectionPool(config).connect().then(pool => {
          return pool.request()
            .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
            .execute('ConsultdirexceptionAuth')
        }).then(result => {
          console.log("------------este es el valor de result------");
          console.log(result);
          console.log(result.recordset[0]);
          console.log("********************************************");

          //si es diferente a null o undefined quiere decir que si tiene una validacion por omitir
          //si no se queda en estatus de solicitud 1
          if (result.recordset[0] != undefined || result.recordset[0] != null) {
            statusNewSolicit = 2;
          } else {
            statusNewSolicit = 1;
          }


          var sql = require("mssql");
          var env = process.env.NODE_ENV || 'SERWEB';
          var config = require('../controllers/connections/servers')[env];

          new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request()

              .input('Fecha', sql.VarChar, req.body.Fecha)
              .input('TipoSolicitud', sql.Int, req.body.TipoSolicitud)
              .input('IdStatus', sql.Int, req.body.EstatusSol)
              .input('IdUsuarioSolicitante', sql.Int, req.body.IdUsuario)
              .input('IdUsuarioAutorizadorDireccion', sql.Int, req.body.Autorizador.IdUsuario)
              .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
              .input('IdMoneda', sql.Int, req.body.Moneda.IdMoneda)
              .input('IdCategoria', sql.Int, req.body.Categoria.IdCategoria)
              .input('Usuario', sql.VarChar, req.body.Usr)
              .input('Puesto', sql.VarChar, req.body.Puesto)
              .input('Email', sql.VarChar, req.body.Email)
              .input('Tel', sql.VarChar, req.body.Tel)
              .input('Ext', sql.Int, req.body.Ext)
              .input('IdEmpresa', sql.VarChar, req.body.Empresa.Bukrs)
              .input('EmpresaName', sql.VarChar, req.body.Empresa.Butxt)
              .input('IdPalza', sql.VarChar, req.body.Plaza.IdPlaza)
              .input('PlazaName', sql.VarChar, req.body.Plaza.Nombre)
              //.input('IdCentroCosto', sql.VarChar, '')
              //.input('CentroCostoName', sql.VarChar, '')
              .input('IdOrdeninterna', sql.VarChar, req.body.OrdenInterna.IdOrdenInterna)
              .input('OrdenInternaName', sql.VarChar, req.body.OrdenInterna.NombreOrder)
              //.input('IdCuentamayor', sql.VarChar, req.body.Cuentamayor.IdCuentaMayor)
              //.input('CuentaMayorName', sql.VarChar, req.body.Cuentamayor.Nombre)
              .input('Produccion', sql.VarChar, req.body.NombreProduccion)
              .input('Justificacion', sql.VarChar, req.body.Justificacion)
              .output('output_IdSol', sql.VarChar(50))
              .execute('InsertNewSolicitudPedido')

            //campos de StoreProcedure de Base de Datos (1), sin cambio de WebService
            // .input('Fecha', sql.VarChar, req.body.Fecha)
            // .input('TipoSolicitud', sql.Int, req.body.TipoSolicitud)
            // .input('IdUsuario', sql.Int, req.body.IdUsuario)
            // .input('IdUsuarioAutorizador', sql.Int, req.body.Autorizador.IdUsuario)
            // .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
            // .input('IdEmpresa', sql.Int, req.body.Empresa.IdEmpresa)
            // .input('IdPlaza', sql.Int, req.body.Plaza.IdPlaza)
            // .input('Idimputacion', sql.Int, req.body.Imputacion.IdImputacion)
            // .input('IdPosicion', sql.Int, req.body.Posicion.IdPosicion)
            // .input('IdCentroCostos', sql.Int, null)
            // .input('IdCuentaMayor', sql.Int, null)
            // .input('Tipo', sql.VarChar, req.body.Tipo)
            // .input('OrdenInterna', sql.VarChar,req.body.IdOrdenInterna)
            // .input('Usuario', sql.VarChar, req.body.Usr)
            // .input('Puesto', sql.VarChar, req.body.Puesto)
            // .input('Email', sql.VarChar, req.body.Email)
            // .input('Tel', sql.VarChar, req.body.Tel)
            // .input('Ext', sql.Int, req.body.Ext)
            // .input('Produccion', sql.VarChar, req.body.NombreProduccion)
            // .execute('InsertNewSolicitudCompra')


          }).then(result => {
            //se tendria que insertar los Productos por un foreach 
            req.body.Productos.forEach(function (prod, indice, array) {
              // console.log("indice -->" + indice + 
              //             " hay estos son los valores:" +
              //             'IdSolicitud' + result.output.output_IdSol +
              //             "  Cantidad-->"+ prod.Cantidad+
              //             "  Precio-->"+prod.Precio+
              //             "  Almacen-->"+prod.Almacen+
              //             "  AlmacenName---->"+prod.AlmacenName +
              //             //"  Centro-->"+ prod.Centro +
              //             "  Material-->" + prod.Material+
              //             "  MaterialName-->" + prod.MaterialName+
              //             "  Centro de Costo-->"+ prod.CentroCosto+
              //             "  Centro CostoName-->" + prod.CentroCostoName+
              //             "  Cuenta de Mayor-->"+ prod.CuentaMayor+
              //             "  Cuenta de MayorName"+ prod.CuentaMayorName+
              //             "  GrupoCompra  "+ prod.GrupCompra+
              //             "  NameGrupoCompra"+ prod.NameGrupoCompra+
              //             "  Unidadmedida"+prod.UnidadMedida+
              //             "  NameUnidadMedida"+ prod.NameUnidadMedida+
              //             "  OrdenEstadistica"+ prod.IdOrdenEstadistica+
              //             "  NameOrdenEstadistica"+prod.OrdenEstadisticaName+
              //             "  NumActivo"+ prod.NumActivo+
              //             "  NameActivo"+ prod.NameActivo+
              //             "  NumNeces  "+ prod.NumNeces+
              //             "  NameNeces  "+ prod.NameNeces+
              //             "  NombreSolPed  " + prod.NombreSolPed+
              //             "  AcronimoSolPed  " + prod.AcronimoSolPed+
              //             "  Espf"+ prod.Espf+
              //             "  UsoProd-->" + prod.UsoProd);

              var sql = require("mssql");
              var env = process.env.NODE_ENV || 'SERWEB';
              var config = require('../controllers/connections/servers')[env];

              new sql.ConnectionPool(config).connect().then(pool => {
                return pool.request()
                  .input('IdSolicitud', sql.Int, result.output.output_IdSol)
                  .input('Cantidad', sql.Int, prod.Cantidad)
                  .input('Precio', sql.Decimal, prod.Precio)
                  .input('IdAlmacen', sql.VarChar, prod.Almacen)
                  .input('AlmacenName', sql.VarChar, prod.AlmacenName)
                  .input('IdMaterial', sql.VarChar, prod.Material)
                  .input('MaterialName', sql.VarChar, prod.MaterialName)
                  .input('IdCentroCosto', sql.VarChar, prod.CentroCosto)
                  .input('CentroCostoName', sql.VarChar, prod.CentroCostoName)
                  .input('IdCuentamayor', sql.VarChar, prod.CuentaMayor)
                  .input('CuentaMayorName', sql.VarChar, prod.CuentaMayorName)
                  .input('IdGrupoCompra', sql.VarChar, prod.GrupCompra)
                  .input('GrupoCompraName', sql.VarChar, prod.NameGrupoCompra)
                  .input('IdUnidadmedida', sql.VarChar, prod.UnidadMedida)
                  .input('UnidadMedidaName', sql.VarChar, prod.NameUnidadMedida)
                  .input('IdOrdenEstadistica', sql.VarChar, '')
                  .input('OrdenEstadisticaName', sql.VarChar, '')
                  .input('IdNumeroActivo', sql.VarChar, prod.NumActivo)
                  .input('NumeroActivoName', sql.VarChar, prod.NameActivo)
                  .input('IdNecesidad', sql.VarChar, prod.NumNeces)
                  .input('EspGene', sql.VarChar, prod.Espf)
                  .input('UsoBien', sql.VarChar, prod.UsoProd)
                  .output('output_Product', sql.Int)
                  .execute('InsertProductosbyDetalleSol')
              }).then(resp => {
                res.status(201);
                sql.close();
              }).catch(err => {
                if (err) console.log(err);
                sql.close();
              });
            });
            console.log('se inserto en la tabla de solicitud y los materiales correctamente');
            res.status(201).json(result.output.output_IdSol);
            sql.close();
          }).catch(err => {
            if (err) console.log(err);
            res.end(400).json({message: "Error...." + err})
            sql.close();
          });

        }).catch(err => {
          if (err) console.log(err);
          res.end(400).json({message: "Error...." + err})
          sql.close();
        });



      }
    }

    if (req.body.TipoSolicitud == 3) {
      console.log("-----------------------ESTA OPCION ES SI EL TIPO DE sOLICITUD ES DE TIPO 3");
      if (req.body.CentroCostos != null || req.body.CentroCostos != undefined &&
        req.body.OrdenInterna == null || req.body.OrdenInterna == undefined &&
        req.body.Cuentamayor != null || req.body.Cuentamayor != undefined) {

        console.log("Se realiza el primer insert a la Tabla Solicitud");
        //aqui se valida el tipo de DIreccion para insertar el Status correcto en el caso
        //del Ing. Rivera y otras 
        var sql = require("mssql");
        var env = process.env.NODE_ENV || 'SERWEB';
        var config = require('../controllers/connections/servers')[env];
        var statusNewSolicit;
        console.log("Validamos si existe una exepcion en SP ConsultdirexceptionAuth  --TIPO SOL 3");
        new sql.ConnectionPool(config).connect().then(pool => {
          return pool.request()
            .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
            .execute('ConsultdirexceptionAuth')
        }).then(result => {
          console.log("----´´´´---++´+´+´´");
          console.log(result.recordset[0]);

          //si es diferente a null o undefined quiere decir que si tiene una validacion por omitir
          //si no se queda en estatus de solicitud 1
          if (result.recordset[0] != undefined || result.recordset[0] != null) {
            statusNewSolicit = result.recordset[0].IdRole;
          } else {
            statusNewSolicit = 1;
          }

          var sql = require("mssql");
          var env = process.env.NODE_ENV || 'SERWEB';
          var config = require('../controllers/connections/servers')[env];
          new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request()
              .input('Fecha', sql.VarChar, req.body.Fecha)
              .input('TipoSolicitud', sql.Int, req.body.TipoSolicitud)
              .input('IdStatus', sql.Int, req.body.EstatusSol)
              .input('IdUsuarioSolicitante', sql.Int, req.body.IdUsuario)
              .input('IdUsuarioAutorizadorDireccion', sql.Int, req.body.Autorizador.IdUsuario)
              .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
              .input('IdMoneda', sql.Int, req.body.Moneda.IdMoneda)
              .input('IdCategoria', sql.Int, req.body.Categoria.IdCategoria)
              .input('Usuario', sql.VarChar, req.body.Usr)
              .input('Puesto', sql.VarChar, req.body.Puesto)
              .input('Email', sql.VarChar, req.body.Email)
              .input('Tel', sql.VarChar, req.body.Tel)
              .input('Ext', sql.Int, req.body.Ext)
              .input('IdEmpresa', sql.VarChar, req.body.Empresa.Bukrs)
              .input('EmpresaName', sql.VarChar, req.body.Empresa.Butxt)
              .input('IdPalza', sql.VarChar, req.body.Plaza.IdPlaza)
              .input('PlazaName', sql.VarChar, req.body.Plaza.Nombre)
              //.input('IdCentroCosto', sql.VarChar, req.body.CentroCostos.IdCentroCosto)
              //.input('CentroCostoName', sql.VarChar, req.body.CentroCostos.Nombre)
              .input('IdOrdeninterna', sql.VarChar, '')
              .input('OrdenInternaName', sql.VarChar, '')
              //.input('IdCuentamayor', sql.VarChar, req.body.Cuentamayor.IdCuentaMayor)
              //.input('CuentaMayorName', sql.VarChar, req.body.Cuentamayor.Nombre)
              .input('Produccion', sql.VarChar, req.body.NombreProduccion)
              .input('Justificacion', sql.VarChar, req.body.Justificacion)
              .output('output_IdSol', sql.VarChar(50))
              .execute('InsertNewSolicitudPedido')

            //campos de StoreProcedure de Base de Datos (1), sin cambio de WebService
            // .input('Fecha', sql.VarChar, req.body.Fecha)
            // .input('TipoSolicitud', sql.Int, req.body.TipoSolicitud)
            // .input('IdUsuario', sql.Int, req.body.IdUsuario)
            // .input('IdUsuarioAutorizador', sql.Int, req.body.Autorizador.IdUsuario)
            // .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
            // .input('IdEmpresa', sql.Int, req.body.Empresa.IdEmpresa)
            // .input('IdPlaza', sql.Int, req.body.Plaza.IdPlaza)
            // .input('Idimputacion', sql.Int, req.body.Imputacion.IdImputacion)
            // .input('IdPosicion', sql.Int, req.body.Posicion.IdPosicion)
            // .input('IdCentroCostos', sql.Int, null)
            // .input('IdCuentaMayor', sql.Int, null)
            // .input('Tipo', sql.VarChar, req.body.Tipo)
            // .input('OrdenInterna', sql.VarChar,req.body.IdOrdenInterna)
            // .input('Usuario', sql.VarChar, req.body.Usr)
            // .input('Puesto', sql.VarChar, req.body.Puesto)
            // .input('Email', sql.VarChar, req.body.Email)
            // .input('Tel', sql.VarChar, req.body.Tel)
            // .input('Ext', sql.Int, req.body.Ext)
            // .input('Produccion', sql.VarChar, req.body.NombreProduccion)
            // .execute('InsertNewSolicitudCompra')


          }).then(result => {

            //se tendria que insertar los Productos por un foreach 
            req.body.Productos.forEach(function (prod, indice, array) {
              // console.log("indice -->" + indice +
              //   " hay estos son los valores:" +
              //   'IdSolicitud' + result.output.output_IdSol +
              //   "  Cantidad-->" + prod.Cantidad +
              //   "  Precio-->" + prod.Precio +
              //   "  Almacen-->" + prod.Almacen +
              //   "  AlmacenName---->" + prod.AlmacenName +
              //   //"  Centro-->"+ prod.Centro +
              //   "  Material-->" + prod.Material +
              //   "  MaterialName-->" + prod.MaterialName +
              //   "  Centro de Costo-->" + prod.CentroCosto +
              //   "  Centro CostoName-->" + prod.CentroCostoName +
              //   "  Cuenta de Mayor-->" + prod.CuentaMayor +
              //   "  Cuenta de MayorName" + prod.CuentaMayorName +
              //   "  GrupoCompra  " + prod.GrupCompra +
              //   "  NameGrupoCompra" + prod.NameGrupoCompra +
              //   "  Unidadmedida" + prod.UnidadMedida +
              //   "  NameUnidadMedida" + prod.NameUnidadMedida +
              //   "  OrdenEstadistica" + prod.IdOrdenEstadistica +
              //   "  NameOrdenEstadistica" + prod.OrdenEstadisticaName +
              //   "  NumActivo" + prod.NumActivo +
              //   "  NameActivo" + prod.NameActivo +
              //   "  NumNeces  " + prod.NumNeces +
              //   "  NameNeces  " + prod.NameNeces +
              //   "  NombreSolPed  " + prod.NombreSolPed +
              //   "  AcronimoSolPed  " + prod.AcronimoSolPed +
              //   "  Espf" + prod.Espf +
              //   "  UsoProd-->" + prod.UsoProd);

              var sql = require("mssql");
              var env = process.env.NODE_ENV || 'SERWEB';
              var config = require('../controllers/connections/servers')[env];

              new sql.ConnectionPool(config).connect().then(pool => {
                return pool.request()
                  .input('IdSolicitud', sql.Int, result.output.output_IdSol)
                  .input('Cantidad', sql.Int, prod.Cantidad)
                  // sql.map.register(Number, sql.Real);
                  .input('Precio', sql.Decimal, prod.Precio)
                  .input('IdAlmacen', sql.VarChar, prod.Almacen)
                  .input('AlmacenName', sql.VarChar, prod.AlmacenName)
                  .input('IdMaterial', sql.VarChar, prod.Material)
                  .input('MaterialName', sql.VarChar, prod.MaterialName)
                  .input('IdCentroCosto', sql.VarChar, prod.CentroCosto)
                  .input('CentroCostoName', sql.VarChar, prod.CentroCostoName)
                  .input('IdCuentamayor', sql.VarChar, prod.CuentaMayor)
                  .input('CuentaMayorName', sql.VarChar, prod.CuentaMayorName)
                  .input('IdGrupoCompra', sql.VarChar, prod.GrupCompra)
                  .input('GrupoCompraName', sql.VarChar, prod.NameGrupoCompra)
                  .input('IdUnidadmedida', sql.VarChar, prod.UnidadMedida)
                  .input('UnidadMedidaName', sql.VarChar, prod.NameUnidadMedida)
                  .input('IdOrdenEstadistica', sql.VarChar, '')
                  .input('OrdenEstadisticaName', sql.VarChar, '')
                  .input('IdNumeroActivo', sql.VarChar, prod.NumActivo)
                  .input('NumeroActivoName', sql.VarChar, prod.NameActivo)
                  .input('IdNecesidad', sql.VarChar, prod.NumNeces)
                  .input('EspGene', sql.VarChar, prod.Espf)
                  .input('UsoBien', sql.VarChar, prod.UsoProd)
                  .output('output_Product', sql.Int)
                  .execute('InsertProductosbyDetalleSol')
              }).then(resp => {
                res.status(201);
                sql.close();
              }).catch(err => {
                if (err) console.log(err);
                sql.close();
              });
            });
            console.log('se inserto en la tabla de solicitud y los materiales correctamente');
            res.status(201).json(result.output.output_IdSol);
            sql.close();
          }).catch(err => {
            if (err) console.log(err);
            res.end(400).json({message: "Error...." + err})
            sql.close();
          });

        }).catch(err => {
          if (err) console.log(err);
          res.end(400).json({message: "Error...." + err})
          sql.close();
        });



      }
    }

    if (req.body.TipoSolicitud == 4) {
      if (req.body.CentroCostos != null || req.body.CentroCostos != undefined &&
        req.body.OrdenInterna == null || req.body.OrdenInterna == undefined &&
        req.body.Cuentamayor != null || req.body.Cuentamayor != undefined &&
        req.body.SelectedOrdenEstadisiticaChild == null || req.body.SelectedOrdenEstadisiticaChild == undefined &&
        req.body.SelectedCentroCosotosChild != null || req.body.SelectedCentroCosotosChild != undefined &&
        req.body.SelectedCuentaMayorChild != null || req.body.SelectedCuentaMayorChild != undefined) {
        console.log("--------------4---------ESTA OPCION ES SI ES Solicitud tipo 4");

        var sql = require("mssql");
        var env = process.env.NODE_ENV || 'SERWEB';
        var config = require('../controllers/connections/servers')[env];
        var statusNewSolicit;
        console.log("Validamos si existe una exepcion en SP ConsultdirexceptionAuth  --TIPO SOL 4");
        new sql.ConnectionPool(config).connect().then(pool => {
          return pool.request()
            .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
            .execute('ConsultdirexceptionAuth')
        }).then(result => {
          console.log("----´´´´---++´+´+´´");
          console.log(result.recordset[0]);

          //si es diferente a null o undefined quiere decir que si tiene una validacion por omitir
          //si no se queda en estatus de solicitud 1
          if (result.recordset[0] != undefined || result.recordset[0] != null) {
            statusNewSolicit = result.recordset[0].IdRole;
          } else {
            statusNewSolicit = 1;
          }

          var sql = require("mssql");
          var env = process.env.NODE_ENV || 'SERWEB';
          var config = require('../controllers/connections/servers')[env];


          new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request()
              .input('Fecha', sql.VarChar, req.body.Fecha)
              .input('TipoSolicitud', sql.Int, req.body.TipoSolicitud)
              .input('IdStatus', sql.Int, req.body.EstatusSol)//siempre se registra con 1 en store procedure
              .input('IdUsuarioSolicitante', sql.Int, req.body.IdUsuario)
              .input('IdUsuarioAutorizadorDireccion', sql.Int, req.body.Autorizador.IdUsuario)
              .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
              .input('IdMoneda', sql.Int, req.body.Moneda.IdMoneda)
              .input('IdCategoria', sql.Int, req.body.Categoria.IdCategoria)
              .input('Usuario', sql.VarChar, req.body.Usr)
              .input('Puesto', sql.VarChar, req.body.Puesto)
              .input('Email', sql.VarChar, req.body.Email)
              .input('Tel', sql.VarChar, req.body.Tel)
              .input('Ext', sql.Int, req.body.Ext)
              .input('IdEmpresa', sql.VarChar, req.body.Empresa.Bukrs)
              .input('EmpresaName', sql.VarChar, req.body.Empresa.Butxt)
              .input('IdPalza', sql.VarChar, req.body.Plaza.IdPlaza)
              .input('PlazaName', sql.VarChar, req.body.Plaza.Nombre)
              //.input('IdCentroCosto', sql.VarChar, req.body.CentroCostos.IdCentroCosto)
              //.input('CentroCostoName', sql.VarChar, req.body.CentroCostos.Nombre)
              .input('IdOrdeninterna', sql.VarChar, '')
              .input('OrdenInternaName', sql.VarChar, '')
              //.input('IdCuentamayor', sql.VarChar, req.body.Cuentamayor.IdCuentaMayor)
              //.input('CuentaMayorName', sql.VarChar, req.body.Cuentamayor.Nombre)
              .input('Produccion', sql.VarChar, req.body.NombreProduccion)
              .input('Justificacion', sql.VarChar, req.body.Justificacion)
              .output('output_IdSol', sql.VarChar(50))
              .execute('InsertNewSolicitudPedido')

            //campos de StoreProcedure de Base de Datos (1), sin cambio de WebService
            // .input('Fecha', sql.VarChar, req.body.Fecha)
            // .input('TipoSolicitud', sql.Int, req.body.TipoSolicitud)
            // .input('IdUsuario', sql.Int, req.body.IdUsuario)
            // .input('IdUsuarioAutorizador', sql.Int, req.body.Autorizador.IdUsuario)
            // .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
            // .input('IdEmpresa', sql.Int, req.body.Empresa.IdEmpresa)
            // .input('IdPlaza', sql.Int, req.body.Plaza.IdPlaza)
            // .input('Idimputacion', sql.Int, req.body.Imputacion.IdImputacion)
            // .input('IdPosicion', sql.Int, req.body.Posicion.IdPosicion)
            // .input('IdCentroCostos', sql.Int, null)
            // .input('IdCuentaMayor', sql.Int, null)
            // .input('Tipo', sql.VarChar, req.body.Tipo)
            // .input('OrdenInterna', sql.VarChar,req.body.IdOrdenInterna)
            // .input('Usuario', sql.VarChar, req.body.Usr)
            // .input('Puesto', sql.VarChar, req.body.Puesto)
            // .input('Email', sql.VarChar, req.body.Email)
            // .input('Tel', sql.VarChar, req.body.Tel)
            // .input('Ext', sql.Int, req.body.Ext)
            // .input('Produccion', sql.VarChar, req.body.NombreProduccion)
            // .execute('InsertNewSolicitudCompra')


          }).then(result => {
            console.log("------------------------------------------------------------");
            console.log(result.output.output_IdSol);
            console.log("------------------------------------------------------------");
            //se tendria que insertar los Productos por un foreach 
            req.body.Productos.forEach(function (prod, indice, array) {
              // console.log("indice -->" + indice +
              //   " hay estos son los valores:" +
              //   " Id de la solicitud Recuperado-->" + result.output.output_IdSol +
              //   "  Cantidad-->" + prod.Cantidad +
              //   "  Precio-->" + prod.Precio +
              //   "  Almacen-->" + prod.Almacen +
              //   "  AlmacenName---->" + prod.AlmacenName +
              //   //"  Centro-->"+ prod.Centro +
              //   "  Material-->" + prod.Material +
              //   "  MaterialName-->" + prod.MaterialName +
              //   "  Centro de Costo-->" + prod.CentroCosto +
              //   "  Centro CostoName-->" + prod.CentroCostoName +
              //   "  Cuenta de Mayor-->" + prod.CuentaMayor +
              //   "  Cuenta de MayorName" + prod.CuentaMayorName +
              //   "  GrupoCompra  " + prod.GrupCompra +
              //   "  NameGrupoCompra" + prod.NameGrupoCompra +
              //   "  Unidadmedida" + prod.UnidadMedida +
              //   "  NameUnidadMedida" + prod.NameUnidadMedida +
              //   "  OrdenEstadistica" + prod.IdOrdenEstadistica +
              //   "  NameOrdenEstadistica" + prod.OrdenEstadisticaName +
              //   "  NumActivo" + prod.NumActivo +
              //   "  NameActivo" + prod.NameActivo +
              //   "  NumNeces  " + prod.NumNeces +
              //   "  NameNeces  " + prod.NameNeces +
              //   "  NombreSolPed  " + prod.NombreSolPed +
              //   "  AcronimoSolPed  " + prod.AcronimoSolPed +
              //   "  Espf" + prod.Espf +
              //   "  UsoProd-->" + prod.UsoProd);

              var sql = require("mssql");
              var env = process.env.NODE_ENV || 'SERWEB';
              var config = require('../controllers/connections/servers')[env];

              new sql.ConnectionPool(config).connect().then(pool => {
                return pool.request()
                  .input('IdSolicitud', sql.Int, result.output.output_IdSol)
                  .input('Cantidad', sql.Int, prod.Cantidad)
                  .input('Precio', sql.Decimal, prod.Precio)
                  .input('IdAlmacen', sql.VarChar, prod.Almacen)
                  .input('AlmacenName', sql.VarChar, prod.AlmacenName)
                  .input('IdMaterial', sql.VarChar, prod.Material)
                  .input('MaterialName', sql.VarChar, prod.MaterialName)
                  .input('IdCentroCosto', sql.VarChar, prod.CentroCosto)
                  .input('CentroCostoName', sql.VarChar, prod.CentroCostoName)
                  .input('IdCuentamayor', sql.VarChar, prod.CuentaMayor)
                  .input('CuentaMayorName', sql.VarChar, prod.CuentaMayorName)
                  .input('IdGrupoCompra', sql.VarChar, prod.GrupCompra)
                  .input('GrupoCompraName', sql.VarChar, prod.NameGrupoCompra)
                  .input('IdUnidadmedida', sql.VarChar, prod.UnidadMedida)
                  .input('UnidadMedidaName', sql.VarChar, prod.NameUnidadMedida)
                  .input('IdOrdenEstadistica', sql.VarChar, '')
                  .input('OrdenEstadisticaName', sql.VarChar, '')
                  .input('IdNumeroActivo', sql.VarChar, prod.NumActivo)
                  .input('NumeroActivoName', sql.VarChar, prod.NameActivo)
                  .input('IdNecesidad', sql.VarChar, prod.NumNeces)
                  .input('EspGene', sql.VarChar, prod.Espf)
                  .input('UsoBien', sql.VarChar, prod.UsoProd)
                  .output('output_Product', sql.Int)
                  .execute('InsertProductosbyDetalleSol')


              }).then(resp => {
                console.log(resp.output.output_Product);

                prod.ChildsProducts.forEach(function (child, indice, array) {
                  console.log("Hijo Cantidad-->  " + child.Cantidad);
                  console.log("Hijo Precio-->  " + child.Precio);
                  console.log("Hijo texto Breve --->" + child.TextoServicio);
                  console.log("Hijo Unidad de medida -->  " + child.IdUMedidaChild);
                  console.log("Hijo Unidad de medida -->  " + child.NameUMedidaChild);
                  console.log("Hijo IdOrdenEstadisticaChild -->" + child.IdOrdenEstadisticaChild);
                  console.log("Hijo NameOrdenEstadisticaChild -->" + child.NameOrdenEstadisticaChild);
                  console.log("Hijo IdCentroCostoChild-->  " + child.IdCentroCostoChild);
                  console.log("Hijo CentroCostoNameChild-->  " + child.CentroCostoNameChild);
                  console.log("Hijo IdCuentaMayorChild-->" + child.IdCuentaMayorChild);
                  console.log("Hijo NameCuentaMayorChild-->" + child.NameCuentaMayorChild);

                  var sql = require("mssql");
                  var env = process.env.NODE_ENV || 'SERWEB';
                  var config = require('../controllers/connections/servers')[env];

                  new sql.ConnectionPool(config).connect().then(pool => {
                    return pool.request()
                      .input('IdProducto', sql.Int, resp.output.output_Product)
                      .input('CantidadChild', sql.Int, child.Cantidad)
                      .input('PrecioChild', sql.Decimal, child.Precio)
                      .input('TextoService', sql.VarChar, child.TextoServicio)
                      .input('IdUnidadMedida', sql.VarChar, child.IdUMedidaChild)
                      .input('UnidadmedidaName', sql.VarChar, child.NameUMedidaChild)
                      .input('IdOrdenEstadistica', sql.VarChar, child.IdOrdenEstadisticaChild)
                      .input('OrdenEstadisticaName', sql.VarChar, child.NameOrdenEstadisticaChild)
                      .input('IdCentroCosotos', sql.VarChar, child.IdCentroCostoChild)
                      .input('CentroCostosName', sql.VarChar, child.CentroCostoNameChild)
                      .input('IdCuentaMayor', sql.VarChar, child.IdCuentaMayorChild)
                      .input('CuentaMayorName', sql.VarChar, child.NameCuentaMayorChild)
                      .execute('InsertSubProduct')

                  }).then(resp => {
                    console.log("BIIIIEEENnnnnnnn");
                    console.log(resp);
                    res.status(201);
                    sql.close();
                  });
                });
              }).catch(err => {
                if (err) console.log(err);
                sql.close();
              });
            });
            console.log('se inserto en la tabla de solicitud y los materiales correctamente');
            res.status(201).json(result.output.output_IdSol);
            sql.close();
          }).catch(err => {
            if (err) console.log(err);
            res.end(400).json({message: "Error...." + err})
            sql.close();
          });

        }).catch(err => {
          if (err) console.log(err);
          res.end(400).json({message: "Error...." + err})
          sql.close();
        });



      }
    }

    if (req.body.TipoSolicitud == 5) {
      if (req.body.CentroCostos == null || req.body.CentroCostos == undefined &&
        req.body.OrdenInterna == null || req.body.OrdenInterna == undefined &&
        req.body.Cuentamayor == null || req.body.Cuentamayor == undefined) {
        console.log("------------5-----------ESTA OPCION ES SI ES QUE tipo de Solicitud 5");
        console.log("Se realiza el primer insert a la Tabla Solicitud");
        //aqui se valida el tipo de DIreccion para insertar el Status correcto en el caso
        //del Ing. Rivera y otras 
        var sql = require("mssql");
        var env = process.env.NODE_ENV || 'SERWEB';
        var config = require('../controllers/connections/servers')[env];
        var statusNewSolicit;
        console.log("Validamos si existe una exepcion en SP ConsultdirexceptionAuth  --TIPO SOL 5");
        new sql.ConnectionPool(config).connect().then(pool => {
          return pool.request()
            .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
            .execute('ConsultdirexceptionAuth')
        }).then(result => {
          console.log("----´´´´---++´+´+´´");
          console.log(result.recordset[0]);

          //si es diferente a null o undefined quiere decir que si tiene una validacion por omitir
          //si no se queda en estatus de solicitud 1
          if (result.recordset[0] != undefined || result.recordset[0] != null) {
            statusNewSolicit = result.recordset[0].IdRole;
          } else {
            statusNewSolicit = 1;
          }

          var sql = require("mssql");
          var env = process.env.NODE_ENV || 'SERWEB';
          var config = require('../controllers/connections/servers')[env];
          new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request()
              .input('Fecha', sql.VarChar, req.body.Fecha)
              .input('TipoSolicitud', sql.Int, req.body.TipoSolicitud)
              .input('IdStatus', sql.Int, req.body.EstatusSol)//siempre se registra con 1 en store procedure
              .input('IdUsuarioSolicitante', sql.Int, req.body.IdUsuario)
              .input('IdUsuarioAutorizadorDireccion', sql.Int, req.body.Autorizador.IdUsuario)
              .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
              .input('IdMoneda', sql.Int, req.body.Moneda.IdMoneda)
              .input('IdCategoria', sql.Int, req.body.Categoria.IdCategoria)
              .input('Usuario', sql.VarChar, req.body.Usr)
              .input('Puesto', sql.VarChar, req.body.Puesto)
              .input('Email', sql.VarChar, req.body.Email)
              .input('Tel', sql.VarChar, req.body.Tel)
              .input('Ext', sql.Int, req.body.Ext)
              .input('IdEmpresa', sql.VarChar, req.body.Empresa.Bukrs)
              .input('EmpresaName', sql.VarChar, req.body.Empresa.Butxt)
              .input('IdPalza', sql.VarChar, req.body.Plaza.IdPlaza)
              .input('PlazaName', sql.VarChar, req.body.Plaza.Nombre)
              //.input('IdCentroCosto', sql.VarChar, '')
              //.input('CentroCostoName', sql.VarChar, '')
              .input('IdOrdeninterna', sql.VarChar, '')
              .input('OrdenInternaName', sql.VarChar, '')
              //.input('IdCuentamayor', sql.VarChar, '')
              //.input('CuentaMayorName', sql.VarChar, '')
              .input('Produccion', sql.VarChar, req.body.NombreProduccion)
              .input('Justificacion', sql.VarChar, req.body.Justificacion)
              .output('output_IdSol', sql.VarChar(50))
              .execute('InsertNewSolicitudPedido')

            //campos de StoreProcedure de Base de Datos (1), sin cambio de WebService
            // .input('Fecha', sql.VarChar, req.body.Fecha)
            // .input('TipoSolicitud', sql.Int, req.body.TipoSolicitud)
            // .input('IdUsuario', sql.Int, req.body.IdUsuario)
            // .input('IdUsuarioAutorizador', sql.Int, req.body.Autorizador.IdUsuario)
            // .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
            // .input('IdEmpresa', sql.Int, req.body.Empresa.IdEmpresa)
            // .input('IdPlaza', sql.Int, req.body.Plaza.IdPlaza)
            // .input('Idimputacion', sql.Int, req.body.Imputacion.IdImputacion)
            // .input('IdPosicion', sql.Int, req.body.Posicion.IdPosicion)
            // .input('IdCentroCostos', sql.Int, null)
            // .input('IdCuentaMayor', sql.Int, null)
            // .input('Tipo', sql.VarChar, req.body.Tipo)
            // .input('OrdenInterna', sql.VarChar,req.body.IdOrdenInterna)
            // .input('Usuario', sql.VarChar, req.body.Usr)
            // .input('Puesto', sql.VarChar, req.body.Puesto)
            // .input('Email', sql.VarChar, req.body.Email)
            // .input('Tel', sql.VarChar, req.body.Tel)
            // .input('Ext', sql.Int, req.body.Ext)
            // .input('Produccion', sql.VarChar, req.body.NombreProduccion)
            // .execute('InsertNewSolicitudCompra')


          }).then(result => {

            //se tendria que insertar los Productos por un foreach 
            req.body.Productos.forEach(function (prod, indice, array) {
              // console.log("indice -->" + indice +
              //   " hay estos son los valores:" +
              //   'IdSolicitud' + result.output.output_IdSol +
              //   "  Cantidad-->" + prod.Cantidad +
              //   "  Precio-->" + prod.Precio +
              //   "  Almacen-->" + prod.Almacen +
              //   "  AlmacenName---->" + prod.AlmacenName +
              //   //"  Centro-->"+ prod.Centro +
              //   "  Material-->" + prod.Material +
              //   "  MaterialName-->" + prod.MaterialName +
              //   "  Centro de Costo-->" + prod.CentroCosto +
              //   "  Centro CostoName-->" + prod.CentroCostoName +
              //   "  Cuenta de Mayor-->" + prod.CuentaMayor +
              //   "  Cuenta de MayorName" + prod.CuentaMayorName +
              //   "  GrupoCompra  " + prod.GrupCompra +
              //   "  NameGrupoCompra" + prod.NameGrupoCompra +
              //   "  Unidadmedida" + prod.UnidadMedida +
              //   "  NameUnidadMedida" + prod.NameUnidadMedida +
              //   "  OrdenEstadistica" + prod.IdOrdenEstadistica +
              //   "  NameOrdenEstadistica" + prod.OrdenEstadisticaName +
              //   "  NumActivo" + prod.NumActivo +
              //   "  NameActivo" + prod.NameActivo +
              //   "  NumNeces  " + prod.NumNeces +
              //   "  NameNeces  " + prod.NameNeces +
              //   "  NombreSolPed  " + prod.NombreSolPed +
              //   "  AcronimoSolPed  " + prod.AcronimoSolPed +
              //   "  Espf" + prod.Espf +
              //   "  UsoProd-->" + prod.UsoProd);

              var sql = require("mssql");
              var env = process.env.NODE_ENV || 'SERWEB';
              var config = require('../controllers/connections/servers')[env];

              new sql.ConnectionPool(config).connect().then(pool => {
                return pool.request()
                  .input('IdSolicitud', sql.Int, result.output.output_IdSol)
                  .input('Cantidad', sql.Int, prod.Cantidad)
                  .input('Precio', sql.Decimal, prod.Precio)
                  .input('IdAlmacen', sql.VarChar, prod.Almacen)
                  .input('AlmacenName', sql.VarChar, prod.AlmacenName)
                  .input('IdMaterial', sql.VarChar, prod.Material)
                  .input('MaterialName', sql.VarChar, prod.MaterialName)
                  .input('IdCentroCosto', sql.VarChar, prod.CentroCosto)
                  .input('CentroCostoName', sql.VarChar, prod.CentroCostoName)
                  .input('IdCuentamayor', sql.VarChar, prod.CuentaMayor)
                  .input('CuentaMayorName', sql.VarChar, prod.CuentaMayorName)
                  .input('IdGrupoCompra', sql.VarChar, prod.GrupCompra)
                  .input('GrupoCompraName', sql.VarChar, prod.NameGrupoCompra)
                  .input('IdUnidadmedida', sql.VarChar, prod.UnidadMedida)
                  .input('UnidadMedidaName', sql.VarChar, prod.NameUnidadMedida)
                  .input('IdOrdenEstadistica', sql.VarChar, '')
                  .input('OrdenEstadisticaName', sql.VarChar, '')
                  .input('IdNumeroActivo', sql.VarChar, prod.NumActivo)
                  .input('NumeroActivoName', sql.VarChar, prod.NameActivo)
                  .input('IdNecesidad', sql.VarChar, prod.NumNeces)
                  .input('EspGene', sql.VarChar, prod.Espf)
                  .input('UsoBien', sql.VarChar, prod.UsoProd)
                  .output('output_Product', sql.Int)
                  .execute('InsertProductosbyDetalleSol')
              }).then(resp => {
                res.status(201);
                sql.close();
              }).catch(err => {
                if (err) console.log(err);
                sql.close();
              });
            });
            console.log('se inserto en la tabla de solicitud y los materiales correctamente');
            res.status(201).json(result.output.output_IdSol);
            sql.close();
          }).catch(err => {
            if (err) console.log(err);
            res.end(400).json({message: "Error...." + err})
            sql.close();
          });

        }).catch(err => {
          if (err) console.log(err);
          res.end(400).json({message: "Error...." + err})
          sql.close();
        });






      }
    }

    if (req.body.TipoSolicitud == 6) {
      if (req.body.CentroCostos != null || req.body.CentroCostos == undefined &&
        req.body.OrdenInterna == null || req.body.OrdenInterna == undefined &&
        req.body.OrdenEstadistica != null || req.body.OrdenEstadistica != undefined &&
        req.body.Cuentamayor != null || req.body.Cuentamayor != undefined) {
        console.log("------------6-----------ESTA OPCION ES SI ES  tipo de Solicitud 6");
        console.log("Se realiza el primer insert a la Tabla Solicitud");


        var sql = require("mssql");
        var env = process.env.NODE_ENV || 'SERWEB';
        var config = require('../controllers/connections/servers')[env];
        var statusNewSolicit;
        console.log("Validamos si existe una exepcion en SP ConsultdirexceptionAuth  --TIPO SOL 6");
        new sql.ConnectionPool(config).connect().then(pool => {
          return pool.request()
            .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
            .execute('ConsultdirexceptionAuth')
        }).then(result => {
          console.log("----´´´´---++´+´+´´");
          console.log(result.recordset[0]);

          //si es diferente a null o undefined quiere decir que si tiene una validacion por omitir
          //si no se queda en estatus de solicitud 1
          if (result.recordset[0] != undefined || result.recordset[0] != null) {
            statusNewSolicit = result.recordset[0].IdRole;
          } else {
            statusNewSolicit = 1;
          }

          var sql = require("mssql");
          var env = process.env.NODE_ENV || 'SERWEB';
          var config = require('../controllers/connections/servers')[env];

          new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request()
              .input('Fecha', sql.VarChar, req.body.Fecha)
              .input('TipoSolicitud', sql.Int, req.body.TipoSolicitud)
              .input('IdStatus', sql.Int, req.body.EstatusSol)//siempre se registra con 1 en store procedure
              .input('IdUsuarioSolicitante', sql.Int, req.body.IdUsuario)
              .input('IdUsuarioAutorizadorDireccion', sql.Int, req.body.Autorizador.IdUsuario)
              .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
              .input('IdMoneda', sql.Int, req.body.Moneda.IdMoneda)
              .input('IdCategoria', sql.Int, req.body.Categoria.IdCategoria)
              .input('Usuario', sql.VarChar, req.body.Usr)
              .input('Puesto', sql.VarChar, req.body.Puesto)
              .input('Email', sql.VarChar, req.body.Email)
              .input('Tel', sql.VarChar, req.body.Tel)
              .input('Ext', sql.Int, req.body.Ext)
              .input('IdEmpresa', sql.VarChar, req.body.Empresa.Bukrs)
              .input('EmpresaName', sql.VarChar, req.body.Empresa.Butxt)
              .input('IdPalza', sql.VarChar, req.body.Plaza.IdPlaza)
              .input('PlazaName', sql.VarChar, req.body.Plaza.Nombre)
              //.input('IdCentroCosto', sql.VarChar, '')
              //.input('CentroCostoName', sql.VarChar, '')
              .input('IdOrdeninterna', sql.VarChar, '')
              .input('OrdenInternaName', sql.VarChar, '')
              //.input('IdCuentamayor', sql.VarChar, '')
              //.input('CuentaMayorName', sql.VarChar, '')
              .input('Produccion', sql.VarChar, req.body.NombreProduccion)
              .input('Justificacion', sql.VarChar, req.body.Justificacion)
              .output('output_IdSol', sql.VarChar(50))
              .execute('InsertNewSolicitudPedido')

            //campos de StoreProcedure de Base de Datos (1), sin cambio de WebService
            // .input('Fecha', sql.VarChar, req.body.Fecha)
            // .input('TipoSolicitud', sql.Int, req.body.TipoSolicitud)
            // .input('IdUsuario', sql.Int, req.body.IdUsuario)
            // .input('IdUsuarioAutorizador', sql.Int, req.body.Autorizador.IdUsuario)
            // .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
            // .input('IdEmpresa', sql.Int, req.body.Empresa.IdEmpresa)
            // .input('IdPlaza', sql.Int, req.body.Plaza.IdPlaza)
            // .input('Idimputacion', sql.Int, req.body.Imputacion.IdImputacion)
            // .input('IdPosicion', sql.Int, req.body.Posicion.IdPosicion)
            // .input('IdCentroCostos', sql.Int, null)
            // .input('IdCuentaMayor', sql.Int, null)
            // .input('Tipo', sql.VarChar, req.body.Tipo)
            // .input('OrdenInterna', sql.VarChar,req.body.IdOrdenInterna)
            // .input('Usuario', sql.VarChar, req.body.Usr)
            // .input('Puesto', sql.VarChar, req.body.Puesto)
            // .input('Email', sql.VarChar, req.body.Email)
            // .input('Tel', sql.VarChar, req.body.Tel)
            // .input('Ext', sql.Int, req.body.Ext)
            // .input('Produccion', sql.VarChar, req.body.NombreProduccion)
            // .execute('InsertNewSolicitudCompra')


          }).then(result => {
            console.log(result);
            //se tendria que insertar los Productos por un foreach 
            req.body.Productos.forEach(function (prod, indice, array) {
              // console.log("indice -->" + indice +
              //   " hay estos son los valores:" +
              //   'IdSolicitud' + result.output.output_IdSol +
              //   "  Cantidad-->" + prod.Cantidad +
              //   "  Precio-->" + prod.Precio +
              //   "  Almacen-->" + prod.Almacen +
              //   "  AlmacenName---->" + prod.AlmacenName +
              //   //"  Centro-->"+ prod.Centro +
              //   "  Material-->" + prod.Material +
              //   "  MaterialName-->" + prod.MaterialName +
              //   "  Centro de Costo-->" + prod.CentroCosto +
              //   "  Centro CostoName-->" + prod.CentroCostoName +
              //   "  Cuenta de Mayor-->" + prod.CuentaMayor +
              //   "  Cuenta de MayorName" + prod.CuentaMayorName +
              //   "  GrupoCompra  " + prod.GrupCompra +
              //   "  NameGrupoCompra" + prod.NameGrupoCompra +
              //   "  Unidadmedida" + prod.UnidadMedida +
              //   "  NameUnidadMedida" + prod.NameUnidadMedida +
              //   "  OrdenEstadistica" + prod.IdOrdenEstadistica +
              //   "  NameOrdenEstadistica" + prod.OrdenEstadisticaName +
              //   "  NumActivo" + prod.NumActivo +
              //   "  NameActivo" + prod.NameActivo +
              //   "  NumNeces  " + prod.NumNeces +
              //   "  NameNeces  " + prod.NameNeces +
              //   "  NombreSolPed  " + prod.NombreSolPed +
              //   "  AcronimoSolPed  " + prod.AcronimoSolPed +
              //   "  Espf" + prod.Espf +
              //   "  UsoProd-->" + prod.UsoProd);

              var sql = require("mssql");
              var env = process.env.NODE_ENV || 'SERWEB';
              var config = require('../controllers/connections/servers')[env];

              new sql.ConnectionPool(config).connect().then(pool => {
                return pool.request()
                  .input('IdSolicitud', sql.Int, result.output.output_IdSol)
                  .input('Cantidad', sql.Int, prod.Cantidad)
                  .input('Precio', sql.Decimal, prod.Precio)
                  .input('IdAlmacen', sql.VarChar, prod.Almacen)
                  .input('AlmacenName', sql.VarChar, prod.AlmacenName)
                  .input('IdMaterial', sql.VarChar, prod.Material)
                  .input('MaterialName', sql.VarChar, prod.MaterialName)
                  .input('IdCentroCosto', sql.VarChar, prod.CentroCosto)
                  .input('CentroCostoName', sql.VarChar, prod.CentroCostoName)
                  .input('IdCuentamayor', sql.VarChar, prod.CuentaMayor)
                  .input('CuentaMayorName', sql.VarChar, prod.CuentaMayorName)
                  .input('IdGrupoCompra', sql.VarChar, prod.GrupCompra)
                  .input('GrupoCompraName', sql.VarChar, prod.NameGrupoCompra)
                  .input('IdUnidadmedida', sql.VarChar, prod.UnidadMedida)
                  .input('UnidadMedidaName', sql.VarChar, prod.NameUnidadMedida)
                  .input('IdOrdenEstadistica', sql.VarChar, prod.IdOrdenEstadistica)
                  .input('OrdenEstadisticaName', sql.VarChar, prod.OrdenEstadisticaName)
                  .input('IdNumeroActivo', sql.VarChar, prod.NumActivo)
                  .input('NumeroActivoName', sql.VarChar, prod.NameActivo)
                  .input('IdNecesidad', sql.VarChar, prod.NumNeces)
                  .input('EspGene', sql.VarChar, prod.Espf)
                  .input('UsoBien', sql.VarChar, prod.UsoProd)
                  .output('output_Product', sql.Int)
                  .execute('InsertProductosbyDetalleSol')
              }).then(resp => {
                res.status(201);
                sql.close();
              }).catch(err => {
                if (err) console.log(err);
                sql.close();
              });
            });
            console.log('se inserto en la tabla de solicitud y los materiales correctamente');
            res.status(201).json(result.output.output_IdSol);
            sql.close();
          }).catch(err => {
            if (err) console.log(err);
            res.end(400).json({message: "Error...." + err})
            sql.close();
          });

        }).catch(err => {
          if (err) console.log(err);
          res.end(400).json({message: "Error...." + err})
          sql.close();
        });



      }
    }

    if (req.body.TipoSolicitud == 7) {
      if (req.body.CentroCostos == null || req.body.CentroCostos == undefined &&
        req.body.OrdenInterna == null || req.body.OrdenInterna == undefined &&
        req.body.Cuentamayor == null || req.body.Cuentamayor == undefined &&
        req.body.SelectedOrdenEstadisiticaChild != null || req.body.SelectedOrdenEstadisiticaChild != undefined &&
        req.body.SelectedCentroCosotosChild != null || req.body.SelectedCentroCosotosChild != undefined &&
        req.body.SelectedCuentaMayorChild != null || req.body.SelectedCuentaMayorChild != undefined) {

        console.log("--------------7---------ESTA OPCION ES SI ES Solicitud tipo 7");

        //aqui se valida el tipo de DIreccion para insertar el Status correcto en el caso
        //del Ing. Rivera y otras 
        var sql = require("mssql");
        var env = process.env.NODE_ENV || 'SERWEB';
        var config = require('../controllers/connections/servers')[env];
        var statusNewSolicit;
        console.log("Validamos si existe una exepcion en SP ConsultdirexceptionAuth  --TIPO SOL 7");
        new sql.ConnectionPool(config).connect().then(pool => {
          return pool.request()
            .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
            .execute('ConsultdirexceptionAuth')
        }).then(result => {
          // console.log("----´´´´---++´+´+´´");
          console.log(result.recordset[0]);

          //si es diferente a null o undefined quiere decir que si tiene una validacion por omitir
          //si no se queda en estatus de solicitud 1
          if (result.recordset[0] != undefined || result.recordset[0] != null) {
            statusNewSolicit = result.recordset[0].IdRole;
          } else {
            statusNewSolicit = 1;
          }


          console.log("Este es el valor de la exclucion" + statusNewSolicit);
          var sql = require("mssql");
          var env = process.env.NODE_ENV || 'SERWEB';
          var config = require('../controllers/connections/servers')[env];

          new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request()
              .input('Fecha', sql.VarChar, req.body.Fecha)
              .input('TipoSolicitud', sql.Int, req.body.TipoSolicitud)
              .input('IdStatus', sql.Int, req.body.EstatusSol) //siempre se registra con 1 en store procedure
              .input('IdUsuarioSolicitante', sql.Int, req.body.IdUsuario)
              .input('IdUsuarioAutorizadorDireccion', sql.Int, req.body.Autorizador.IdUsuario)
              .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
              .input('IdMoneda', sql.Int, req.body.Moneda.IdMoneda)
              .input('IdCategoria', sql.Int, req.body.Categoria.IdCategoria)
              .input('Usuario', sql.VarChar, req.body.Usr)
              .input('Puesto', sql.VarChar, req.body.Puesto)
              .input('Email', sql.VarChar, req.body.Email)
              .input('Tel', sql.VarChar, req.body.Tel)
              .input('Ext', sql.Int, req.body.Ext)
              .input('IdEmpresa', sql.VarChar, req.body.Empresa.Bukrs)
              .input('EmpresaName', sql.VarChar, req.body.Empresa.Butxt)
              .input('IdPalza', sql.VarChar, req.body.Plaza.IdPlaza)
              .input('PlazaName', sql.VarChar, req.body.Plaza.Nombre)
              //.input('IdCentroCosto', sql.VarChar, req.body.CentroCostos.IdCentroCosto)
              //.input('CentroCostoName', sql.VarChar, req.body.CentroCostos.Nombre)
              .input('IdOrdeninterna', sql.VarChar, '')
              .input('OrdenInternaName', sql.VarChar, '')
              //.input('IdCuentamayor', sql.VarChar, req.body.Cuentamayor.IdCuentaMayor)
              //.input('CuentaMayorName', sql.VarChar, req.body.Cuentamayor.Nombre)
              .input('Produccion', sql.VarChar, req.body.NombreProduccion)
              .input('Justificacion', sql.VarChar, req.body.Justificacion)
              .output('output_IdSol', sql.VarChar(50))
              .execute('InsertNewSolicitudPedido')

            //campos de StoreProcedure de Base de Datos (1), sin cambio de WebService
            // .input('Fecha', sql.VarChar, req.body.Fecha)
            // .input('TipoSolicitud', sql.Int, req.body.TipoSolicitud)
            // .input('IdUsuario', sql.Int, req.body.IdUsuario)
            // .input('IdUsuarioAutorizador', sql.Int, req.body.Autorizador.IdUsuario)
            // .input('IdDireccion', sql.Int, req.body.Area.IdDireccion)
            // .input('IdEmpresa', sql.Int, req.body.Empresa.IdEmpresa)
            // .input('IdPlaza', sql.Int, req.body.Plaza.IdPlaza)
            // .input('Idimputacion', sql.Int, req.body.Imputacion.IdImputacion)
            // .input('IdPosicion', sql.Int, req.body.Posicion.IdPosicion)
            // .input('IdCentroCostos', sql.Int, null)
            // .input('IdCuentaMayor', sql.Int, null)
            // .input('Tipo', sql.VarChar, req.body.Tipo)
            // .input('OrdenInterna', sql.VarChar,req.body.IdOrdenInterna)
            // .input('Usuario', sql.VarChar, req.body.Usr)
            // .input('Puesto', sql.VarChar, req.body.Puesto)
            // .input('Email', sql.VarChar, req.body.Email)
            // .input('Tel', sql.VarChar, req.body.Tel)
            // .input('Ext', sql.Int, req.body.Ext)
            // .input('Produccion', sql.VarChar, req.body.NombreProduccion)
            // .execute('InsertNewSolicitudCompra')


          }).then(result => {
            console.log("------------------------------------------------------------");
            console.log(result.output.output_IdSol);
            console.log("------------------------------------------------------------");
            //se tendria que insertar los Productos por un foreach 
            req.body.Productos.forEach(function (prod, indice, array) {
              // console.log("indice -->" + indice + 
              //                           " hay estos son los valores:" +
              //                           " Id de la solicitud Recuperado-->" +result.output.output_IdSol + 
              //                           "  Cantidad-->"+ prod.Cantidad+
              //                           "  Precio-->"+prod.Precio+
              //                           "  Almacen-->"+prod.Almacen+
              //                           "  AlmacenName---->"+prod.AlmacenName +
              //                           //"  Centro-->"+ prod.Centro +
              //                           "  Material-->" + prod.Material+
              //                           "  MaterialName-->" + prod.MaterialName+
              //                           "  Centro de Costo-->"+ prod.CentroCosto+
              //                           "  Centro CostoName-->" + prod.CentroCostoName+
              //                           "  Cuenta de Mayor-->"+ prod.CuentaMayor+
              //                           "  Cuenta de MayorName"+ prod.CuentaMayorName+
              //                           "  GrupoCompra  "+ prod.GrupCompra+
              //                           "  NameGrupoCompra"+ prod.NameGrupoCompra+
              //                           "  Unidadmedida"+prod.UnidadMedida+
              //                           "  NameUnidadMedida"+ prod.NameUnidadMedida+
              //                           "  OrdenEstadistica"+ prod.IdOrdenEstadistica+
              //                           "  NameOrdenEstadistica"+prod.OrdenEstadisticaName+
              //                           "  NumActivo"+ prod.NumActivo+
              //                           "  NameActivo"+ prod.NameActivo+
              //                           "  NumNeces  "+ prod.NumNeces+
              //                           "  NameNeces  "+ prod.NameNeces+
              //                           "  NombreSolPed  " + prod.NombreSolPed+
              //                           "  AcronimoSolPed  " + prod.AcronimoSolPed+
              //                           "  Espf"+ prod.Espf+
              //                           "  UsoProd-->" + prod.UsoProd);

              var sql = require("mssql");
              var env = process.env.NODE_ENV || 'SERWEB';
              var config = require('../controllers/connections/servers')[env];

              new sql.ConnectionPool(config).connect().then(pool => {
                return pool.request()
                  .input('IdSolicitud', sql.Int, result.output.output_IdSol)
                  .input('Cantidad', sql.Int, prod.Cantidad)
                  .input('Precio', sql.Decimal, prod.Precio)
                  .input('IdAlmacen', sql.VarChar, prod.Almacen)
                  .input('AlmacenName', sql.VarChar, prod.AlmacenName)
                  .input('IdMaterial', sql.VarChar, prod.Material)
                  .input('MaterialName', sql.VarChar, prod.MaterialName)
                  .input('IdCentroCosto', sql.VarChar, prod.CentroCosto)
                  .input('CentroCostoName', sql.VarChar, prod.CentroCostoName)
                  .input('IdCuentamayor', sql.VarChar, prod.CuentaMayor)
                  .input('CuentaMayorName', sql.VarChar, prod.CuentaMayorName)
                  .input('IdGrupoCompra', sql.VarChar, prod.GrupCompra)
                  .input('GrupoCompraName', sql.VarChar, prod.NameGrupoCompra)
                  .input('IdUnidadmedida', sql.VarChar, prod.UnidadMedida)
                  .input('UnidadMedidaName', sql.VarChar, prod.NameUnidadMedida)
                  .input('IdOrdenEstadistica', sql.VarChar, '')
                  .input('OrdenEstadisticaName', sql.VarChar, '')
                  .input('IdNumeroActivo', sql.VarChar, prod.NumActivo)
                  .input('NumeroActivoName', sql.VarChar, prod.NameActivo)
                  .input('IdNecesidad', sql.VarChar, prod.NumNeces)
                  .input('EspGene', sql.VarChar, prod.Espf)
                  .input('UsoBien', sql.VarChar, prod.UsoProd)
                  .output('output_Product', sql.Int)
                  .execute('InsertProductosbyDetalleSol')


              }).then(resp => {
                console.log(resp.output.output_Product);

                prod.ChildsProducts.forEach(function (child, indice, array) {
                  // console.log("Hijo Cantidad-->  "+child.Cantidad);
                  // console.log("Hijo Precio-->  " + child.Precio);
                  // console.log("Hijo texto Breve --->" + child.TextoServicio);
                  // console.log("Hijo Unidad de medida -->  " + child.IdUMedidaChild);
                  // console.log("Hijo Unidad de medida -->  " + child.NameUMedidaChild);
                  // console.log("Hijo IdOrdenEstadisticaChild -->" + child.IdOrdenEstadisticaChild);
                  // console.log("Hijo NameOrdenEstadisticaChild -->" + child.NameOrdenEstadisticaChild);
                  // console.log("Hijo IdCentroCostoChild-->  " + child.IdCentroCostoChild);
                  // console.log("Hijo CentroCostoNameChild-->  " + child.CentroCostoNameChild);
                  // console.log("Hijo IdCuentaMayorChild-->" + child.IdCuentaMayorChild);
                  // console.log("Hijo NameCuentaMayorChild-->" + child.NameCuentaMayorChild);

                  var sql = require("mssql");
                  var env = process.env.NODE_ENV || 'SERWEB';
                  var config = require('../controllers/connections/servers')[env];

                  new sql.ConnectionPool(config).connect().then(pool => {
                    return pool.request()
                      .input('IdProducto', sql.Int, resp.output.output_Product)
                      .input('CantidadChild', sql.Int, child.Cantidad)
                      .input('PrecioChild', sql.Decimal, child.Precio)
                      .input('TextoService', sql.VarChar, child.TextoServicio)
                      .input('IdUnidadMedida', sql.VarChar, child.IdUMedidaChild)
                      .input('UnidadmedidaName', sql.VarChar, child.NameUMedidaChild)
                      .input('IdOrdenEstadistica', sql.VarChar, child.IdOrdenEstadisticaChild)
                      .input('OrdenEstadisticaName', sql.VarChar, child.NameOrdenEstadisticaChild)
                      .input('IdCentroCosotos', sql.VarChar, child.IdCentroCostoChild)
                      .input('CentroCostosName', sql.VarChar, child.CentroCostoNameChild)
                      .input('IdCuentaMayor', sql.VarChar, child.IdCuentaMayorChild)
                      .input('CuentaMayorName', sql.VarChar, child.NameCuentaMayorChild)
                      .execute('InsertSubProduct')

                  }).then(resp => {
                    console.log("Se insertaron correctamente los SubHijos");
                    console.log(resp);
                    res.status(201);
                    sql.close();
                  });
                });
              }).catch(err => {
                if (err) console.log(err);
                sql.close();
              });
            });
            console.log('se inserto en la tabla de solicitud y los materiales correctamente');
            res.status(201).json(result.output.output_IdSol);
            sql.close();
          }).catch(err => {
            if (err) console.log(err);
            res.end(400).json({message: "Error...." + err})
            sql.close();
          });

        }).catch(err => {
          if (err) console.log(err);
          res.end(400).json({message: "Error...." + err})
          sql.close();
        });




      }

    }

  }

  //buscamos Direcciones por Usuario
  getDirforUser = (req, res) => {
    console.log("==getDirforUser==");
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];

    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdUsuario', sql.Int, req.params.IdUsuario)
        .execute('DirecionesforUser')
    }).then(result => {
      //console.log(result.recordsets);
      res.status(201).json(result.recordset);
      sql.close();
    }).catch(err => {
      if (err) console.log(err);
      sql.close();
    })
  }

  getStatusCompras = (req, res) => {
    console.log("metodo para regresar informacion de status");
    console.log(req.params.IdRole);
    console.log(req.params.isCompras);
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];

    new sql.ConnectionPool(config).connect().then(pool => {

      return pool.request()
        .input('IdRole', sql.Int, req.params.IdRole)
        .input('isCompras', sql.Int, req.params.isCompras)
        .execute('ValidStatusConsulta')
    }).then(result => {
      res.status(201).json(result.recordset);
      sql.close();
    }).catch(err => {
      if (err) console.log(err);
      sql.close();
    });
  }

  //son todas las solicitudes con los diferentes status por direccion
  getSolicitudRegistradasForstatus = (req, res) => {
    console.log("getSolicitudRegistradasForstatus");
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    //console.log("Este es el id de el Usuario -->"+req.params.usr);
    //  console.log("este es el id de la direccion--->" +req.params.direccion);
    //  console.log("este es el status de la consulta para el direcctor de area  -->"+ req.params.status)
    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdDireccion', sql.Int, req.params.direccion)
        .input('TipoStatus', sql.Int, req.params.status)
        .execute('getAllSolRegistradasforStatus')
    }).then(result => {
      res.status(201).json(result.recordset);
      sql.close();
    }).catch(err => {
      if (err) console.log(err);

      sql.close();
    });

  }

  getSolicitudRegistradasForstatusanCategoria = (req, res) => {
    console.log("getSolicitudRegistradasForstatusanCategoria");
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    //console.log("Este es el id de el Usuario -->"+req.params.usr);
    //  console.log("este es el id de la direccion--->" +req.params.direccion);
    //  console.log("este es el status de la consulta para el direcctor de area  -->"+ req.params.status)
    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdDireccion', sql.Int, req.params.direccion)
        .input('TipoStatus', sql.Int, req.params.status)
        .input('IdUsr', sql.Int, req.params.idusr)
        .execute('getAllSolRegistradasforStatusandCategoria')
    }).then(result => {
      res.status(201).json(result.recordset);
      sql.close();
    }).catch(err => {
      if (err) console.log(err);

      sql.close();
    });

  }

  getSolicitudeRegistradasforstatusPresupuesto = (req, res) => {
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    //console.log("Este es el id de el Usuario -->"+req.params.usr);
    //  console.log("este es el id de la direccion--->" +req.params.direccion);
    //  console.log("este es el status de la consulta para el direcctor de area  -->"+ req.params.status)
    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdStatus', sql.Int, req.params.IdStatus)
        .execute('getAllSolRegforStatusPresupuesto')
    }).then(result => {
      res.status(201).json(result.recordset);
      sql.close();
    }).catch(err => {
      if (err) console.log(err);

      sql.close();
    });
  }

  getDetalleSolicitudPedido = (req, res) => {
    //console.log("Este es el Id de la Solicitud--> " + req.params.idsol);
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    //console.log("Este es el id de el Usuario -->"+req.params.usr);
    console.log("Este es el Id de la Solicitud--> " + req.params.idsol)
    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdSolicitud', sql.Int, req.params.idsol)
        .execute('DetalleSolicitudPedido')
    }).then(result => {
      res.status(201).json(result.recordset);
      sql.close();
    }).catch(err => {
      if (err) console.log(err);

      sql.close();
    });
  }

  getDetalleSubHijos = (req, res) => {
    //console.log("Este es el Id de la Solicitud--> " + req.params.idsol);
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];
    //console.log("Este es el id de el Usuario -->"+req.params.usr);
    console.log("Este es el Id del Producto--> " + req.params.idprod)
    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdProducto', sql.Int, req.params.idprod)
        .execute('DetalleProdcutosForSolicitud')
    }).then(result => {
      res.status(201).json(result.recordset);
      sql.close();
    }).catch(err => {
      if (err) console.log(err);

      sql.close();
    });


  }

  UpdateinfoSolicitud = (req, res) => {

    var sql = require("mssql");
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];
    // console.log("*********************hola como esta --------------------------------------------");
    // console.log(req.body.Id);
    // console.log(req.body.Nombre);
    // console.log(req.body.Puesto);
    // console.log(req.body.Email);
    // console.log(req.body.Tel);
    // console.log(req.body.Ext);
    // console.log(req.body.Produc);
    // console.log(req.body.Justifi);
    // console.log(req.body.IdOrInt);
    // console.log(req.body.OrdenIn);
    // console.log(req.body.NewStatus);
    // console.log("*********************hola como esta --------------------------------------------");

    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request()
        .input('IdSolPed', sql.Int, req.body.Id)
        .input('Nombre', sql.VarChar, req.body.Nombre)
        .input('Puesto', sql.VarChar, req.body.Puesto)
        .input('Email', sql.VarChar, req.body.Email)
        .input('Tel', sql.VarChar, req.body.Tel)
        .input('Ext', sql.Int, req.body.Ext)
        .input('IdOrdenInterna', sql.VarChar, req.body.IdOrInt)
        .input('OrdenInterna', sql.VarChar, req.body.OrdenIn)
        .input('Produccion', sql.VarChar, req.body.Produc)
        .input('Justificacion', sql.VarChar, req.body.Justifi)
        .input('NewStatus', sql.Int, req.body.NewStatus)
        .execute('UpdateinfoSolPedido')
    }).then(result => {
      console.log("--------------------BIEEEN------------");
      console.log(result);
      res.status(200).json(result);
      sql.close();
    }).catch(err => {
      console.log("**********ERRRORRRR*******");
      console.log(err);
      if (err) console.log(err);

      sql.close();
    });

  }

  UpdateinfoProduct = (req, res) => {
    var sql = require("mssql");
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];
    // console.log("*********************Datos a actualizar de productos --------------------------------------------");
    // console.log(req.body.IdSol);
    // console.log(req.body.IdProd);
    // console.log(req.body.Precio);
    // console.log(req.body.Cantidad);
    // console.log(req.body.IdAlmacen);
    // console.log(req.body.AlmacenName);
    // console.log(req.body.IdMaterial);
    // console.log(req.body.MaterialName);
    // console.log(req.body.IdCentroCosto);
    // console.log(req.body.CecoName);
    // console.log(req.body.IdCuentaMayor);
    // console.log(req.body.NameCuentaMayor);
    // console.log(req.body.IdGrupComp);
    // console.log(req.body.GrupComprName);
    // console.log(req.body.IdUnidadMedida);
    // console.log(req.body.NameUnidadMedida);
    // console.log(req.body.IdOrdEsta);
    // console.log(req.body.OrdEstaName);
    // console.log(req.body.IdActivo);
    // console.log(req.body.ActivoName);
    // console.log(req.body.IdNecesidad);
    // console.log(req.body.NecesidadName);
    // console.log(req.body.espesifica);
    // console.log(req.body.usobien);
    // console.log(req.body.NewStatus);
    // console.log("*********************finde los datos a actualizar de productos --------------------------------------------");

    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdSolicitud', sql.Int, req.body.IdSol)
        .input('IdProducto', sql.Int, req.body.IdProd)
        .input('Cantidad', sql.Int, req.body.Cantidad)
        .input('Precio', sql.Float, req.body.Precio)
        .input('IdAlmacen', sql.VarChar, req.body.IdAlmacen)
        .input('AlmacenName', sql.VarChar, req.body.AlmacenName)
        .input('IdMaterial', sql.VarChar, req.body.IdMaterial)
        .input('MaterialName', sql.VarChar, req.body.MaterialName)
        .input('IdCentroCostos', sql.VarChar, req.body.IdCentroCosto)
        .input('CentroCostoName', sql.VarChar, req.body.CecoName)
        .input('IdCuentaMayor', sql.VarChar, req.body.IdCuentaMayor)
        .input('CuentaMayorName', sql.VarChar, req.body.NameCuentaMayor)
        .input('IdGrupoCompra', sql.VarChar, req.body.IdGrupComp)
        .input('GrupoCompraName', sql.VarChar, req.body.GrupComprName)
        .input('IdUnidadMedidad', sql.VarChar, req.body.IdUnidadMedida)
        .input('UnidadMedidaName', sql.VarChar, req.body.NameUnidadMedida)
        .input('IdOndenEstadistica', sql.VarChar, req.body.IdOrdEsta)
        .input('OrdenEstadisticaName', sql.VarChar, req.body.OrdEstaName)
        .input('IdNumActivo', sql.VarChar, req.body.IdActivo)
        .input('NumActivoName', sql.VarChar, req.body.ActivoName)
        .input('IdNecesidad', sql.VarChar, req.body.IdNecesidad)
        .input('EspGeneral', sql.VarChar, req.body.espesifica)
        .input('UsoBien', sql.VarChar, req.body.usobien)
        .input('NewStatus', sql.Int, req.body.NewStatus)
        .execute('UpdateProducts')
    }).then(result => {
      // console.log("--------------------BIEEEN------------");
      // console.log(result);
      res.status(200).json(result);
      sql.close();
    }).catch(err => {
      console.log("**********ERRRORRRR*******");
      console.log(err);
      if (err) console.log(err);

      sql.close();
    });
  }

  updatechilds = (req, res) => {
    console.log(req.body.IdSol);
    console.log(req.body.IdChild);
    console.log(req.body.Precio);
    console.log(req.body.Cantidad);
    console.log(req.body.IdOrdenEsta);
    console.log(req.body.NameOrdenEst);
    console.log(req.body.IdCeco);
    console.log(req.body.NameCeco);
    console.log(req.body.IdCuentaMayor);
    console.log(req.body.NameCuentaMayor);
    console.log(req.body.IdUnidadMedida);
    console.log(req.body.NombreUnidadMedida);
    console.log(req.body.textobreve);
    console.log(req.body.NewStatus);
    var sql = require("mssql");
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];
    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdSol', sql.Int, req.body.IdSol)
        .input('IdChild', sql.Int, req.body.IdChild)
        .input('CantidadChild', sql.Int, req.body.Cantidad)
        .input('PrecioChild', sql.Float, req.body.Precio)
        .input('IdOrdenEstadistica', sql.VarChar, req.body.IdOrdenEsta)
        .input('NameOrdenEstadisitica', sql.VarChar, req.body.NameOrdenEst)
        .input('IdCeco', sql.VarChar, req.body.IdCeco)
        .input('NameCeco', sql.VarChar, req.body.NameCeco)
        .input('IdCuentaMayor', sql.VarChar, req.body.IdCuentaMayor)
        .input('NameCuentaMayor', sql.VarChar, req.body.NameCuentaMayor)
        .input('IdUnidadMedida', sql.VarChar, req.body.IdUnidadMedida)
        .input('NameUnidadMedida', sql.VarChar, req.body.NombreUnidadMedida)
        .input('textbreve', sql.VarChar, req.body.textobreve)
        .input('NewStatus', sql.Int, req.body.NewStatus)
        .execute('UpdateChildsforSOlPed')
    }).then(result => {
      // console.log("--------------------BIEEEN------------");
      // console.log(result);
      res.status(200).json(result);
      sql.close();
    }).catch(err => {
      //console.log("**********ERRRORRRR*******");
      console.log(err);
      if (err) console.log(err);

      sql.close();
    });

  }


  getAllSolicitudesforUsuario = (req, res) => {
      var sql = require("mssql");
      //variable de entorno para realizar la coneccion
      var env = process.env.NODE_ENV || 'SERWEB';
      //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
      var config = require('../controllers/connections/servers')[env];
      //console.log("Este es el id de el Usuario -->"+req.params.usr);
      // console.log("Este es el ID de el USR--> " + req.params.idusr);
      // console.log("Este es el ID de la Direccion --->" + req.params.iddireccion);
      // console.log("Este es el ID de el ROLE-->"+ req.params.IdRole);
      new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request()
          .input('IdUsr', sql.Int, req.params.idusr)
          //.input('IdDireccion', sql.Int, req.params.iddireccion)
          .input('IdRole', sql.Int, req.params.IdRole)
          .execute('getAllSolicitudforUsuario')
      }).then(result => {
        res.status(201).json(result.recordset);
        sql.close();
      }).catch(err => {
        if (err){ 
          res.status(500).send({message: 'Error en getAllSolicitudesforUsuario:  ' + err});
          console.log(err);
        }
        sql.close();
      });
  }


  getRoleExcluirSolPedido = (req, resp) =>{
    var sql = require("mssql");
        var env = process.env.NODE_ENV || 'SERWEB';
        var config = require('../controllers/connections/servers')[env];
        new sql.ConnectionPool(config).connect().then(pool => {
          return pool.request()
            .input('IdUser', sql.Int, req.params.IdUser)
            .execute('ConsultdirexceptionAuth')
        }).then(data=>{ 
          console.log(data.recordset);
          var statusExcluir:number;
          if(data.recordset[0] === undefined){
            statusExcluir = 0
          }else{
            statusExcluir = data.recordset[0].IdRole;
          }
          resp.json(statusExcluir);
          sql.close();
        }).catch(err=>{
          resp.json({message: "Error...." + err});
          sql.close();
        });
  }


  getStatusSolicitud = (req, res) => {
    console.log("Este es el Id de el Rol de el usuario---->" + req.params.idRole);
    var sql = require("mssql");
    //variable de entorno para realizar la coneccion
    var env = process.env.NODE_ENV || 'SERWEB';
    //de el archivo de configuracion traeme en un arreglo el nodo que tenga el nombre 
    var config = require('../controllers/connections/servers')[env];

    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdRole', sql.Int, req.params.idRole)
        .execute('StatusPermitidosForUser')
    }).then(result => {
      res.status(201).json(result.recordset);
      sql.close;
    }).catch(err => {
      if (err) console.log("error al recuperar infromacion STATUS por Usuario" + err);
      sql.close;
    });


  }


  UpdateStatusdeSolicitud = (req, res) => {
    console.log("");
    console.log(req.body.Idstatus);
    console.log(req.body.IdSolicitud);
    console.log(req.body.Justifi_rechazo);
    var sql = require("mssql");
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];
    if(req.body.Idstatus == 8){
      let title = 'S. P. REVISADA POR COMPRAS';
      let descript = '';
      this.InsertLog( req.body.IdSolicitud, title, descript); 
    }else if(req.body.Idstatus == 9){
      let title = 'S. P. RECHAZADA POR COMPRAS';
      let descript = req.body.Justifi_rechazo;
      const islog =  this.InsertLog( req.body.IdSolicitud, title, descript); 
    }else if(req.body.Idstatus == 10){
      let title = 'S. P. CARGADA EN ARCHIVO Y ENVIADA A SAP';
      let descript = 'CAMBIO DE ESTATUS AUTOMATICAMENTE';
      const islog =  this.InsertLog( req.body.IdSolicitud, title, descript); 
    }else if(req.body.Idstatus == 11){
      let title = 'S. P. CANCELADA';
      let descript = req.body.Justifi_rechazo;
      const islog =  this.InsertLog( req.body.IdSolicitud, title, descript); 
    }else if(req.body.Idstatus == 12 ){
      let title = 'CONTRATO MARCO';
      let descript = 'CAMBIO DE ESTATUS';
      const islog =  this.InsertLog( req.body.IdSolicitud, title, descript); 
    }else if(req.body.Idstatus == 13){
      let title = 'INTERCAMBIOS';
      let descript = 'CAMBIO DE INTERCAMBIOS';
      const islog =  this.InsertLog( req.body.IdSolicitud, title, descript); 
    }
    
    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdStatusCambio', sql.Int, req.body.Idstatus)
        .input('IdSolicitud', sql.Int, req.body.IdSolicitud)
        .input('RechazoJustificacion', sql.VarChar, req.body.Justifi_rechazo)
        .execute('UpdateStatusSolicitud')
    }).then(result => {
      console.log(result);
      res.status(201).json(req.body);
      sql.close();
    }).catch(err => {
      if (err) console.log(err);

      sql.close();
    });
  }


  getallDataForUserAuth = (req, res) => {
    var sql = require("mssql");
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];
    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input("IdDIreccion", sql.Int, req.params.IdDireccion)
        .input("IdRole", sql.Int, req.params.IdRole)
        .execute("getAllDataForUserAuth")
    }).then(result => {
      console.log(result);
      console.log("validnado los valores retornados de parte    getAllDataForUserAuth")
      sql.close();
      res.status(201).json(result.recordset);
      res.end();
    }).catch(err => {
      if (err) console.log(err);
      sql.close();
      res.status(201)
      res.end();
    });
  }

  GetDate = async () =>{
    var time = new Date();
    var date = new Date();
    //console.log(event.value.toISOString());
    //var FechaSelect = this.Date.value.substring(0, 10);
    //console.log(date.tolo());
    //console.log(date.getMonth());
    //console.log(date.getFullYear());
    var FechaSelect = date.toLocaleDateString();
    var day = date.getDate();
    var mo = date.getUTCMonth();
    var mont = mo + 1;
    var year = date.getFullYear();
    // console.log(day);
    // console.log(mont + 1);
    // console.log("---------" + year);
    // console.log(date.getUTCMonth());
    // console.log(mont.toLocaleString());

    var FechaConHora = time.toLocaleTimeString();
    var fechayhora = year + "-" + mont + "-" + day + " " + FechaConHora;
    //console.log(fechayhora);
    return fechayhora;
  }

  //Envio de Email Cuando se crea una solicitu nueva
  SendEmailNew = async (req, res) => {
    //Envio de correo desde la vista de Solicitud de Pedido
    // console.log("**********************************************************Dentro de el metodo SEND email NEW");
    // console.log("Id de Solicitud-->" + req.params.IdSolicitud);
    // console.log("id de Status SOl-->" + req.params.IdStatus);
    // console.log("id de Area-->" + req.params.IdArea);
    // console.log("Nombre del Area que se refiere--> " + req.params.NombreArea);
    // console.log("id de Solicitante-->" + req.params.Solicitante);
    // console.log("Id de Rool -->" + req.params.IdRol);
    // console.log("Name Autoriza -->" + req.params.NombreAutorizador);
    // console.log("Email de la Persona DirArea que Autoriza--->" + req.params.EmailAutorizador);
    // console.log("Valor que se tomara para el envio del mail 
    //status autorizador, dependinedo el estatus es el role excluido de las autorizaciones --" + req.params.sendnewStatusAutoriza);
    // console.log("valor que se tomara para el envio del mail status de rechazo, 
    //dependinedo el estatus es el role excluido de las autorizaciones ---->" + req.params.sendnewStatusRechazo)
    console.log("NUEVO CORREO");
    let Nombre: string;
    let statusAutoriza: number;
    let statusRechaza: number;
    let TitleName: string;
    TitleName = "SOLICITUD DE PEDIDO NUEVA";
    if (req.params.IdStatus == 1) {
      Nombre = "S. P. NUEVA PETICION";
    }

    if (req.params.sendnewStatusAutoriza != 0) {
      statusAutoriza = req.params.sendnewStatusAutoriza;
    } else {
      statusAutoriza = 2;
    }

    if (req.params.sendnewStatusRechazo != 0) {
      statusRechaza = req.params.sendnewStatusRechazo;
    } else {
      statusRechaza = 3;
    }



    // console.log(req.params.IdSolicitud);
    // console.log(req.params.IdStatus);
    // console.log(Nombre);
    // console.log(req.params.NombreAutorizador);
    // console.log(req.params.EmailAutorizador);
    // console.log( req.params.Solicitante,);
    // console.log(req.params.EmailSolicitante);
    // console.log(TitleName);
    // console.log(statusAutoriza);
    // console.log(statusRechaza);
    let isLog = await this.InsertLog( req.params.IdSolicitud, Nombre, TitleName);
    let isSendEmail = await this.SendMail(
      req.params.IdSolicitud,
      req.params.IdStatus,
      Nombre,
      req.params.NombreAutorizador,
      req.params.EmailAutorizador,
      req.params.Solicitante,
      req.params.EmailSolicitante,
      TitleName,
      statusAutoriza,
      statusRechaza
    );

    console.log("*/*/*/*/*/VALOR DE ENVIO DE MAIL*//*/*/");
    console.log(isSendEmail);
    console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");
    console.log("*/*/*/*/*/VALOR DEL LOG*//*/*/");
    console.log(isLog);
    console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");

    if (isSendEmail == false) {
      res.status(400)
      res.end("error");
    } else {
      console.log("-.-.-.-.-.CORREO ENVIADO-.-.-.-.-");
      res.status(200);
      res.end("sent");
    }
        
  }

  SendEmailDirectorArea = async (req, res) => {
    // console.log(req.body.Nombre);
    
    // console.log("Id de Solicitud-->" + req.params.IdSolicitud);
    // console.log("id de Status SOl-->"  + req.params.IdStatus);
    // console.log("id de Area-->" + req.params.IdArea);
    console.log("id de Solicitante-->"+req.params.Solicitante);
    // console.log("Id de Rool -->" + req.params.IdRol);
    // console.log("Name Autoriza -->" + req.params.NombreAutorizador);
    // console.log("Email de la Persona DirArea que Autoriza--->" + req.params.EmailAutorizador);
    console.log("SEND EMail GERENTE");
    let NombreCompletoSolicitante: string;
    let EmailSolicitante: string;
    let Nombre: string;
    let statusAutoriza:number;
    let statusRechaza:number;
    let TitleName:string;
    // var Direccion: string;
    // var accessToken: any;

    if (req.params.IdStatus == 2) { 
      Nombre = "S. P. AUTORIZADO POR GERENTE";
      TitleName = "SOLICITUD DE PEDIDO PENDIENTE";
      statusAutoriza = 4;
      statusRechaza = 5;
    } else if (req.params.IdStatus == 3) {
      Nombre = "S. P. RECHAZADA POR GERENTE";
      TitleName = "SOLICITUD DE PEDIDO PENDIENTE";
      //si se rechaza la solicitud, se cambia el nombre de la solicitud
      //si ese es el status de la solicitud solicitamos al abse de datos el corre para reportarle al solicitante
    }

    var sql = require("mssql");
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];
    //console.log("??????????????????????????????????????????????????????????");
    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input('IdDir', sql.Int, req.params.IdArea)
        .execute('UserSolicitanteforDirandRole')
    }).then(async result => {
      console.log("----------------*****datos de regreso del solicitante----------------");
      console.log(result.recordset);
      console.log(result.recordset[0]);
      NombreCompletoSolicitante = req.params.Solicitante;
      console.log(NombreCompletoSolicitante);
      EmailSolicitante = result.recordset[0].Email;
      console.log(EmailSolicitante);
      
      let isLog = await this.InsertLog( req.params.IdSolicitud, Nombre, TitleName);
      let isSendEmail = await this.SendMail(
        req.params.IdSolicitud,
        req.params.IdStatus,
        Nombre,
        req.params.NombreAutorizador,
        req.params.EmailAutorizador,
        NombreCompletoSolicitante,
        EmailSolicitante,
        TitleName,
        statusAutoriza,
        statusRechaza
      );
      
      console.log("*/*/*/*/*/VALOR DE ENVIO DE MAIL*//*/*/");
      console.log(isSendEmail);
      console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");
      console.log("*/*/*/*/*/VALOR DEL LOG*//*/*/");
      console.log(isLog);
      console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");
  
      if (isSendEmail == false) {
          //console.log(err);
          //console.log("*******************************"+resp + "************************************************");
          res.status(400)
          res.end("error");
      } else {
          console.log("-.-.-.-.-.CORREO ENVIADO-.-.-.-.-");
          res.status(200);
          res.end("sent");
      }

      sql.close();
    }).catch(err => {
      if (err) console.log(err);
      sql.close();
    });
  }

  SendEmailGerenteFinanzas = async (req, res) => {
    // console.log("Dentro de el metodo para Enviar correo a Genrente de Finanzas y Usuario");
    // console.log(req.params.IdSolicitud);
    // console.log(req.params.IdStatus);
    // console.log(req.params.IdArea);
    // console.log(req.params.Solicitante);
    // console.log(req.params.IdRol);
    // console.log(req.params.NombreAutorizador);
    // console.log("Email de la Persona Director de Area que Autoriza--->" + req.params.EmailAutorizador);
    console.log("SEND EMAIL DIRECCION");
    let NombreCompletoSolicitante: string;
    let EmailSolicitante: string;
    let Nombre: string;
    let TitleName: string;
    let statusAutoriza: number;
    let statusRechaza: number;

    if (req.params.IdStatus == 4) {
      Nombre = "S. P. AUTORIZADO POR DIRECCION";
      TitleName = "SOLICITUD DE PEDIDO PENDIENTE";
      statusAutoriza = 6;
      statusRechaza = 7;
    } else if (req.params.IdStatus == 5) {
      Nombre = "S. P. RECHAZADA POR DIRECCION";
      TitleName = "SOLICITUD DE PEDIDO PENDIENTE"
    }

      var sql = require("mssql");
      var env = process.env.NODE_ENV || 'SERWEB';
      var config = require('../controllers/connections/servers')[env];
      //console.log("??????????????????????????????????????????????????????????");
      new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request()
          .input('IdDir', sql.Int, req.params.IdArea)
          .execute('UserSolicitanteforDirandRole')
      }).then(async result => {
        console.log("----------------*****datos de regreso del solicitante----------------");
        // console.log(result.recordset);
        console.log(result.recordset[0]);
        NombreCompletoSolicitante = req.params.Solicitante;
        console.log(NombreCompletoSolicitante);
        EmailSolicitante = result.recordset[0].Email;
        console.log(EmailSolicitante);
        

        console.log(req.params.IdSolicitud);
        console.log(req.params.IdStatus);
        console.log(Nombre);
        console.log(req.params.NombreAutorizador);
        console.log(req.params.EmailAutorizador);
        console.log(NombreCompletoSolicitante);
        console.log(EmailSolicitante);
        console.log(TitleName);
        console.log(statusAutoriza);
        console.log(statusRechaza);
      let isLog = await this.InsertLog( req.params.IdSolicitud, Nombre, TitleName);
      let isSendEmail = await this.SendMail(
        req.params.IdSolicitud,
        req.params.IdStatus,
        Nombre,
        req.params.NombreAutorizador,
        req.params.EmailAutorizador,
        NombreCompletoSolicitante,
        EmailSolicitante,
        TitleName,
        statusAutoriza,
        statusRechaza
      );
    
      console.log("*/*/*/*/*/VALOR DE ENVIO DE MAIL*//*/*/");
      console.log(isSendEmail);
      console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");
      console.log("*/*/*/*/*/VALOR DEL LOG*//*/*/");
      console.log(isLog);
      console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");

      if (isSendEmail == false) {
          //console.log(err);
          //console.log("*******************************"+resp + "************************************************");
          res.status(400)
          res.end("error");
      } else {
          console.log("-.-.-.-.-.CORREO ENVIADO 1 -.-.-.-.-");
          //notificamos a Director de la autorizacon realizada correctamente
          var sql = require("mssql");
          var env = process.env.NODE_ENV || 'SERWEB';
          var config = require('../controllers/connections/servers')[env];
          //console.log("??????????????????????????????????????????????????????????");
          new sql.ConnectionPool(config).connect().then(pool => {
          return pool.request()
            .input('IdDir', sql.Int, req.params.IdArea)
            .input('IdRole', sql.Int, 3)
            .execute('UserSolicitanteforDirandRole')
          }).then(async result => {
            //console.log("----------------*****DATOS DEL DIRECTOR PARA CONFIRMACION----------------");
            // console.log(result.recordset);
            console.log(result.recordset[0]);
            NombreCompletoSolicitante = result.recordset[0].NombreCompleto;
            console.log(NombreCompletoSolicitante);
            EmailSolicitante = result.recordset[0].Email;
            console.log(EmailSolicitante);
            let isSendEmail = await this.SendMail(
              req.params.IdSolicitud,
              0,
              Nombre,
              req.params.NombreAutorizador,
              req.params.EmailAutorizador,
              NombreCompletoSolicitante,
              EmailSolicitante,
              TitleName,
              statusAutoriza,
              statusRechaza
            );
              if(isSendEmail == false){
                res.status(400)
                res.end("error");
              }else{
                console.log("-.-.-.-.-.CORREO ENVIADO 2 -.-.-.-.-");
                res.status(200);
                res.end("sent");
              }

          }).catch(err => {
            if (err) console.log(err);
            sql.close();
          });
      }


        sql.close();
      }).catch(err => {
        if (err) console.log(err);

        sql.close();
      });
  }

  SendEmailAdmin = async (req, res) => {

    console.log("Dentro del metodo para enviar el correo a el solicitante y al Administradior");
    console.log(req.params.IdSolicitud);
    console.log(req.params.IdStatus);
    console.log(req.params.IdArea);
    console.log(req.params.Solicitante);
    console.log(req.params.IdRol);
    console.log(req.params.NombreAutorizador);
    console.log("Email de la Persona Gerente de Fininzas que Autoriza--->" + req.params.EmailAutorizador);
  
    let NombreCompletoSolicitante: string;
    let EmailSolicitante: string;
    let Nombre: string;
    let TitleName: string;
    let statusAutoriza: number;
    let statusRechaza: number;

    if (req.params.IdStatus == 6) {
      Nombre = "S. P. PRESUPUESTO AUTORIZADO ";
      TitleName = "SOLICITUD DE PEDIDO PENDIENTE";
      statusAutoriza = 8;
      statusRechaza = 9;
    } else if (req.params.IdStatus == 7) {
      Nombre = "S. P. PRESUPUESTO RECHAZADO";
      TitleName = "SOLICITUD DE PEDIDO PENDIENTE";
    }

      var sql = require("mssql");
      var env = process.env.NODE_ENV || 'SERWEB';
      var config = require('../controllers/connections/servers')[env];
      new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request()
          .input('IdDir', sql.Int, req.params.IdArea)
          .execute('UserSolicitanteforDirandRole')
      }).then(async result => {
        console.log("----------------*****datos de regreso del solicitante----------------");
        // console.log(result.recordset);
        // console.log(result.recordset[0]);
        NombreCompletoSolicitante = req.params.NombreAutorizador;
        EmailSolicitante = result.recordset[0].Email;
        // console.log(NombreCompletoSolicitante);
        // console.log(EmailSolicitante);
        let isLog = await this.InsertLog( req.params.IdSolicitud, Nombre, TitleName);
        let isSendEmail = await this.SendMail(
          req.params.IdSolicitud,
          req.params.IdStatus,
          Nombre,
          req.params.NombreAutorizador,
          req.params.EmailAutorizador,
          NombreCompletoSolicitante,
          EmailSolicitante,
          TitleName,
          statusAutoriza,
          statusRechaza
        );
        
        console.log("*/*/*/*/*/VALOR DE ENVIO DE MAIL*//*/*/");
        console.log(isSendEmail);
        console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");
        console.log("*/*/*/*/*/VALOR DEL LOG*//*/*/");
        console.log(isLog);
        console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");
    
        if (isSendEmail == false) {
            //console.log(err);
            //console.log("*******************************"+resp + "************************************************");
            res.status(400)
            res.end("error");
        } else {
            console.log("-.-.-.-.-.CORREO ENVIADO-.-.-.-.-");
            res.status(200);
            res.end("sent");
        }
        sql.close();
      }).catch(err => {
        if (err) console.log(err);
  
        sql.close();
      });
  }

  //Metodo de actualiza el status de la solicitud desde el correo
  UpStatus = (req, res) => {
    // console.log("Dentro de el metodo que Actualiza el status metodo Solicitado desde la pagina de el correo");
    // console.log(req.params.IdSolicitud);
    console.log(req.params.Solicitante);
    // console.log("----STATUS-----" + req.params.IdStatus);
    //----------------------------Validmaos la opcion seleccionada de GERENTE DE AREA o DIRECCION
    let NombreAutorizador: string;
    let EmailAutorizador: string;
    let StatusSolicitud;
    let NombreCompletoSolicitante:string;
    let EmailSolicitante: string;
    let TitleName: string;
    let Nombre: string;
    let EnvioStatusAutoriza:number;
    let EnvioStatusRechaza: number;
    let IdNewestatus: number = 0;

    if (req.params.IdStatus == 2 || req.params.IdStatus == 3) {
      console.log("Gerente de Direccion");
      var sql = require("mssql");
      var env = process.env.NODE_ENV || 'SERWEB';
      var config = require('../controllers/connections/servers')[env];

      //primero preguntamos a la base de datos el status de la soliciud y el autorizador de la solicitd
      new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request()
          .input('IdSolicitud', sql.Int, req.params.IdSolicitud)
          .execute('EmailUserValidation')
      }).then(resultexept => {
        //guardamos los valores un variables correspondientes
        // console.log(resultexept.recordset);
        // console.log(resultexept.recordsets);
        console.log("este es el valor del Status de la SOl-->");
        let roleexcluir: number;
        if (resultexept.recordsets[2][0] == undefined) {
          roleexcluir = 0;
        } else {
          roleexcluir = resultexept.recordsets[2][0].IdRole;
        }
        //var NombreCompleto:string = result.recordset[0].NombreCompleto;
        //var emailSig:string = result.recordset[0].Email;
        StatusSolicitud = resultexept.recordsets[1][0].IdStatusSolicitud;
        //si el valor enviado es igual alde la base de datos no se hace nada
        //console.log(StatusSolicitud);
        if (StatusSolicitud == 1) {
          if (roleexcluir == 3) {
              if (req.params.IdStatus == 2) {
                IdNewestatus = 4;
              } else if (req.params.IdStatus == 3) {
                IdNewestatus = 3;
              }
            var sql = require("mssql");
            var env = process.env.NODE_ENV || 'SERWEB';
            var config = require('../controllers/connections/servers')[env];
            new sql.ConnectionPool(config).connect().then(pool => {
              return pool.request()
                .input('IdNewStatus', sql.Int, IdNewestatus) //definimos Autorizada por direccion para que aparesca eninterfaz de fiannzas correctamente.
                .input('IdSolicitud', sql.Int, req.params.IdSolicitud)
                //.output('output_parameter', sql.VarChar(50))//se ocupara para cuando hay un valor de retorno en el storeprocedure
                .execute('UpdateStatusfromEmail')
            }).then( async result => {
              console.log("este es el resultado de el Update de la SolPed");
              //console.log(result);
              NombreAutorizador = resultexept.recordset[0].NombreCompleto;
              EmailAutorizador = resultexept.recordset[0].Email;
              StatusSolicitud = resultexept.recordsets[1][0].IdStatusSolicitud;
              NombreCompletoSolicitante = req.params.Solicitante;
              //NombreCompletoSolicitante = resultexept.recordsets[4][0].NombreCompleto;
              EmailSolicitante = resultexept.recordsets[4][0].Email;
              
              EnvioStatusAutoriza = 6;
              EnvioStatusRechaza = 7;

              if (req.params.IdStatus == 2 && resultexept.recordsets[2][0].IdRole == 3) {
                Nombre = 'S. P. AUTORIZADO POR DIRECCION';
                TitleName = "SOLICITUD DE PEDIDO PENDIENTE";
              } else {
                Nombre = 'S. P. RECHAZADA POR DIRECCION';
                TitleName = "SOLICITUD DE PEDIDO PENDIENTE";
              }

                console.log("----IdStatus solicitud----");
                console.log(resultexept.recordsets[1][0]);
                console.log("------------------------------");
                console.log("----Role a Excluir----");
                console.log(resultexept.recordsets[2][0]);
                console.log("------------------------------");
                console.log("----------StatusSolicitud ---------");
                console.log(StatusSolicitud);
                console.log("-----------------------------------");
                console.log("--------------DATOS DE USUARIO SIGUIENTE AUTORIZAR------------");
                console.log(NombreAutorizador);
                console.log(EmailAutorizador);
                console.log("-------------------------------------------------");
                console.log("----------DATOS DE USUARIO REQUIERENTE------------");
                console.log(NombreCompletoSolicitante);
                console.log(EmailSolicitante);
                console.log("------------------------------------------------");
                let isLog = await this.InsertLog( req.params.IdSolicitud, Nombre, TitleName);
                let isSendEmail = await this.SendMail(
                  req.params.IdSolicitud,
                  IdNewestatus,
                  Nombre,
                  NombreAutorizador,
                  EmailAutorizador,
                  NombreCompletoSolicitante,
                  EmailSolicitante,
                  TitleName,
                  EnvioStatusAutoriza,
                  EnvioStatusRechaza
                );
                
                console.log("*/*/*/*/*/SE ENVIO EL MAIL EN EXEPCION DIRECTOR ? *//*/*/");
                console.log(isSendEmail);
                console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");
                console.log("*/*/*/*/*/VALOR DEL LOG*//*/*/");
                console.log(isLog);
                console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");
            
                if (isSendEmail == false) {
                    res.status(400)
                    res.write("<!doctype html>" +
                      "<html lang='en'>" +
                      "<head>" +

                      "<meta charset='utf-8'>" +
                      "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +

                      "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                      "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +

                      "<title>Intranet Grupo Imagen</title>" +
                      "</head>" +
                      "<body>" +

                      "<div class='alert alert-danger' style='text-align: center;' role='alert'>" +
                      "ERROR AL ENVIAR EL CORREO" + isSendEmail + 
                      "</div>" +

                      "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                      "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                      "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                      "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                      "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                      "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                      "</body>" +
                      "</html>");
                      res.end();
                } else {
                    console.log("-.-.-.-.-.CORREO ENVIADO-.-.-.-.-");
                    if(IdNewestatus == 4){
                      res.status(200);
                      res.write("<!doctype html>" +
                          "<html lang='en'>" +
                          "<head>" +
  
                          "<meta charset='utf-8'>" +
                          "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
  
                          "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                          "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
  
                          "<title>Intranet Grupo Imagen</title>" +
                          "</head>" +
                          "<body>" +
  
                          "<div class='alert alert-success' style='text-align: center;' role='alert'>" +
                            "Se actualizo correctamente el Estatus de la Solicitud de Pedido" +
                          "</div>" +
  
                          "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                          "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                          "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                          "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                          "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                          "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                          "</body>" +
                          "</html>");
                      res.end();
                    }else{
                      res.status(200);
                      res.write("<!doctype html>" +
                      "<html lang='en'>" +
                      "<head>" +

                      "<meta charset='utf-8'>" +
                      "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +

                      "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                      "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +

                      "<title>Intranet Grupo Imagen</title>" +
                      "</head>" +
                      "<body>" +

                      "<div class='alert alert-danger' style='text-align: center;' role='alert'>" +
                      "Se notificará rechazo al solicitante" +
                      "</div>" +

                      "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                      "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                      "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                      "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                      "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                      "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                      "</body>" +
                      "</html>");
                      res.end();
                    }
                }
            }).catch(err => {
              console.log("error al actualizar el estatus de la Solicitud en EXEPCION DIRECTOR ");
              console.log(err);
              res.write("<!doctype html>" +
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
                  "Error al Realizar la actualizacion del estatus , en caso de seguir con el mismo error por favor entrar directamente a la Intranet." + err +
                "</div>" +
                // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

                "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                "</body>" +
                "</html>");
                res.end();
            });
          } else {
            console.log("flujo normal sin ningnuna excepcion de autorizacion");
            IdNewestatus = req.params.IdStatus;
            console.log("------------------------------");
            console.log(IdNewestatus);
            var sql = require("mssql");
            var env = process.env.NODE_ENV || 'SERWEB';
            var config = require('../controllers/connections/servers')[env];
            new sql.ConnectionPool(config).connect().then(pool => {
              return pool.request()
                .input('IdNewStatus', sql.Int, req.params.IdStatus)
                .input('IdSolicitud', sql.Int, req.params.IdSolicitud)
                //.output('output_parameter', sql.VarChar(50))//se ocupara para cuando hay un valor de retorno en el storeprocedure
                .execute('UpdateStatusfromEmail')
            }).then(async result => {
              //console.log("este es el resultado de el Update de la SolPed");
              console.log(resultexept.recordsets[3][0].Email);
              console.log(resultexept.recordsets[3][0].NombreCompleto);
              console.log(resultexept.recordset[0].NombreCompleto);
              console.log(resultexept.recordset[0].Email);
              StatusSolicitud = resultexept.recordsets[1][0].IdStatusSolicitud;
              NombreCompletoSolicitante = req.params.Solicitante;
              //NombreCompletoSolicitante = resultexept.recordsets[4][0].NombreCompleto;
              EmailSolicitante = resultexept.recordsets[4][0].Email;

              if (req.params.IdStatus == 2) {
                NombreAutorizador = resultexept.recordset[0].NombreCompleto;
                EmailAutorizador = resultexept.recordset[0].Email;
                Nombre = 'S. P. AUTORIZADO POR GERENTE';
                TitleName = "SOLICITUD DE PEDIDO PENDIENTE";
                EnvioStatusAutoriza = 4;
                EnvioStatusRechaza = 5;
              } else {
                Nombre = 'S. P. RECHAZADA POR GERENTE';
                TitleName = "SOLICITUD DE PEDIDO PENDIENTE";
                NombreAutorizador = resultexept.recordsets[3][0].NombreCompleto;
                EmailAutorizador = resultexept.recordsets[3][0].Email;
                EnvioStatusAutoriza = 4;
                EnvioStatusRechaza = 5;
              }

                console.log(resultexept);
                console.log("----IdStatus solicitud----");
                console.log(resultexept.recordsets[1][0]);
                console.log("------------------------------");
                console.log("----Role a Excluir----");
                console.log(resultexept.recordsets[2][0]);
                console.log("------------------------------");
                console.log("----------StatusSolicitud ---------");
                console.log(StatusSolicitud);
                console.log("-----------------------------------");
                console.log("--------------DATOS DE USUARIO SIGUIENTE AUTORIZAR------------");
                console.log(NombreAutorizador);
                console.log(EmailAutorizador);
                console.log("-------------------------------------------------");
                console.log("----------DATOS DE USUARIO REQUIERENTE------------");
                console.log(NombreCompletoSolicitante);
                console.log(EmailSolicitante);
                console.log("------------------------------------------------");
                console.log("----------ESTATUS PARA CORREO------------");
                console.log(EnvioStatusAutoriza);
                console.log(EnvioStatusRechaza);
                console.log("------------------------------------------------");
                let isLog = await this.InsertLog( req.params.IdSolicitud, Nombre, TitleName);
                let isSendEmail = await this.SendMail(
                  req.params.IdSolicitud,
                  IdNewestatus,
                  Nombre,
                  NombreAutorizador,
                  EmailAutorizador,
                  NombreCompletoSolicitante,
                  EmailSolicitante,
                  TitleName,
                  EnvioStatusAutoriza,
                  EnvioStatusRechaza
                );

                console.log("*/*/*/*/*/SE ENVIO EL MAIL PARA GERENTE DIR *//*/*/");
                console.log(isSendEmail);
                console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");
                console.log("*/*/*/*/*/VALOR DEL LOG*//*/*/");
                console.log(isLog);
                console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");

                if (isSendEmail == false) {
                  res.status(400)
                  res.write("<!doctype html>" +
                  "<html lang='en'>" +
                  "<head>" +

                  "<meta charset='utf-8'>" +
                  "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +

                  "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                  "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +

                  "<title>Intranet Grupo Imagen</title>" +
                  "</head>" +
                  "<body>" +

                  "<div class='alert alert-danger' style='text-align: center;' role='alert'>" +
                  "ERROR AL ENVIAR EL CORREO" + isSendEmail + 
                  "</div>" +

                  "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                  "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                  "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                  "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                  "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                  "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                  "</body>" +
                  "</html>");
                  res.end();
                } else {
                  console.log("-.-.-.-.-.CORREO ENVIADO-.-.-.-.-"+IdNewestatus);
                  if(IdNewestatus == 2){
                    res.status(200);
                    res.write("<!doctype html>" +
                        "<html lang='en'>" +
                        "<head>" +

                        "<meta charset='utf-8'>" +
                        "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +

                        "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                        "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +

                        "<title>Intranet Grupo Imagen</title>" +
                        "</head>" +
                        "<body>" +

                        "<div class='alert alert-success' style='text-align: center;' role='alert'>" +
                          "Se actualizo correctamente el Estatus de la Solicitud de Pedido" +
                        "</div>" +

                        "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                        "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                        "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                        "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                        "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                        "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                        "</body>" +
                        "</html>");
                    res.end();
                  }else{
                    res.status(200);
                    res.write("<!doctype html>" +
                    "<html lang='en'>" +
                    "<head>" +

                    "<meta charset='utf-8'>" +
                    "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +

                    "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                    "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +

                    "<title>Intranet Grupo Imagen</title>" +
                    "</head>" +
                    "<body>" +

                    "<div class='alert alert-danger' style='text-align: center;' role='alert'>" +
                    "Se notificará rechazo al solicitante" +
                    "</div>" +

                    "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                    "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                    "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                    "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                    "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                    "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                    "</body>" +
                    "</html>");
                    res.end();
                  }
                }
            }).catch(err => {
                console.log("error al realizar la actualizacion del estatus");
                console.log("error al actualizar el estatus de la Solicitud");
                res.write("<!doctype html>" +
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
                  "Error al Realizar la actualizacion del estatus , en caso de seguir con el mismo error por favor entrar directamente a la Intranet. /n" + err + 
                  "</div>" +

                  "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                  "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                  "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                  "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                  "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                  "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                  "</body>" +
                  "</html>");
                  res.end();
            });
          }
        } else if (StatusSolicitud == 2 && roleexcluir == 2) {
          console.log("esta excepcion es por si el role excluido resulta ser el de gerente de direccion --- en realidad quien esta autorizando es el DIRECTOR DE AREA");
          console.log("quiere decir que se envia a planeacion finaciera");
          NombreAutorizador = resultexept.recordset[0].NombreCompleto;
          EmailAutorizador = resultexept.recordset[0].Email;
          StatusSolicitud = resultexept.recordsets[1][0].IdStatusSolicitud;
          NombreCompletoSolicitante = req.params.Solicitante;
          //NombreCompletoSolicitante = resultexept.recordsets[4][0].NombreCompleto;
          EmailSolicitante = resultexept.recordsets[4][0].Email;

          if (req.params.IdStatus == 2) {
            IdNewestatus = 4;
          } else if (req.params.IdStatus == 3) {
            IdNewestatus = 5;
          }

          var sql = require("mssql");
          var env = process.env.NODE_ENV || 'SERWEB';
          var config = require('../controllers/connections/servers')[env];
          new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request()
              .input('IdNewStatus', sql.Int, IdNewestatus)
              .input('IdSolicitud', sql.Int, req.params.IdSolicitud)
              //.output('output_parameter', sql.VarChar(50))//se ocupara para cuando hay un valor de retorno en el storeprocedure
              .execute('UpdateStatusfromEmail')
          }).then(async result => {
            console.log("este es el resultado de el Update de la SolPed");
            //console.log(result.recordset);
            //console.log(result.recordset[0].IdStatusSolicitud);
            StatusSolicitud = result.recordset[0].IdStatusSolicitud;
            if (StatusSolicitud == 4) {
              Nombre = 'S. P. AUTORIZADO POR DIRECCION';
              TitleName = 'SOLICITUD DE PEDIDO PENDIENTE';
              EnvioStatusAutoriza = 6;
              EnvioStatusRechaza = 7;
            } else {
              Nombre = 'S. P. RECHAZADA POR DIRECCION';
              TitleName = 'SOLICITUD DE PEDIDO PENDIENTE';
              EnvioStatusAutoriza = 6;
              EnvioStatusRechaza = 7;
            }

            console.log("----IdStatus solicitud----");
            console.log(resultexept.recordsets[1][0]);
            console.log("------------------------------");
            console.log("----Role a Excluir----");
            console.log(resultexept.recordsets[2][0]);
            console.log("------------------------------");
            console.log("----------StatusSolicitud ---------");
            console.log(StatusSolicitud);
            console.log("-----------------------------------");
            console.log("--------------DATOS DE USUARIO SIGUIENTE AUTORIZAR------------");
            console.log(NombreAutorizador);
            console.log(EmailAutorizador);
            console.log("-------------------------------------------------");
            console.log("----------DATOS DE USUARIO REQUIERENTE------------");
            console.log(NombreCompletoSolicitante);
            console.log(EmailSolicitante);
            console.log("------------------------------------------------");
            console.log("----------ESTATUS PARA CORREO------------");
            console.log(EnvioStatusAutoriza);
            console.log(EnvioStatusRechaza);
            console.log("------------------------------------------------");
            let isLog = await this.InsertLog( req.params.IdSolicitud, Nombre, TitleName);
            let isSendEmail = await this.SendMail(
              req.params.IdSolicitud,
              IdNewestatus,
              Nombre,
              NombreAutorizador,
              EmailAutorizador,
              NombreCompletoSolicitante,
              EmailSolicitante,
              TitleName,
              EnvioStatusAutoriza,
              EnvioStatusRechaza
            );

            console.log("*/*/*/*/*/SE ENVIO EL MAIL PARA --PF-- ECHO POR DIRECTO*//*/*/");
            console.log(isSendEmail);
            console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");
            console.log("*/*/*/*/*/VALOR DEL LOG*//*/*/");
            console.log(isLog);
            console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");

            if (isSendEmail == false) {
              res.status(400)
              res.write("<!doctype html>" +
                "<html lang='en'>" +
                "<head>" +

                "<meta charset='utf-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +

                "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +

                "<title>Intranet Grupo Imagen</title>" +
                "</head>" +
                "<body>" +

                "<div class='alert alert-danger' style='text-align: center;' role='alert'>" +
                "ERROR AL ENVIAR EL CORREO" + isSendEmail + 
                "</div>" +

                "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                "</body>" +
                "</html>");
                res.end();
            } else {
              console.log("-.-.-.-.-.CORREO ENVIADO-.-.-.-.-");
              if(IdNewestatus == 4){
                res.status(200);
                res.write("<!doctype html>" +
                    "<html lang='en'>" +
                    "<head>" +

                    "<meta charset='utf-8'>" +
                    "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +

                    "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                    "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +

                    "<title>Intranet Grupo Imagen</title>" +
                    "</head>" +
                    "<body>" +

                    "<div class='alert alert-success' style='text-align: center;' role='alert'>" +
                      "Se actualizo correctamente el Estatus de la Solicitud de Pedido" +
                    "</div>" +

                    "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                    "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                    "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                    "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                    "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                    "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                    "</body>" +
                    "</html>");
                res.end();
              }else{
                res.status(200);
                res.write("<!doctype html>" +
                "<html lang='en'>" +
                "<head>" +

                "<meta charset='utf-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +

                "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +

                "<title>Intranet Grupo Imagen</title>" +
                "</head>" +
                "<body>" +

                "<div class='alert alert-danger' style='text-align: center;' role='alert'>" +
                "Se notificará rechazo al solicitante" +
                "</div>" +

                "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                "</body>" +
                "</html>");
                res.end();
              }
            }
            
          });
        } else {
          console.log("no se envia ningun mail solo se regresa un mensaje indicando que" +
            "se tiene el estatus o tiene un status diferente");
          res.status(200);
          res.write("<!doctype html>" +
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
            "Esta Solicitud de Pedido ya tiene un Estatus igual o superior al que se intenta actualizar" +
            "</div>" +

            "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
            "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
            "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
            "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
            "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
            "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
            "</body>" +
            "</html>");
            res.end();
        }
      }).catch(err => {
        if (err) console.log(err);
        res.write("<!doctype html>" +
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
          "Error al Recuperar la Infromacion del siguente autorizador, intentar de nuevo /n si persiste el problema favor de contactar a sistemas" +
          "</div>" +
          // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

          "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
          "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
          "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
          "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
          "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
          "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
          "</body>" +
          "</html>").end();
        sql.close();
      });

    }

    //----------------------------Validamos la opcion seleccionada de DIRECTOR DE AREA o DIRECCION
    if (req.params.IdStatus == 4 || req.params.IdStatus == 5) {
      console.log("Director de Area");
      var sql = require("mssql");
      var env = process.env.NODE_ENV || 'SERWEB';
      var config = require('../controllers/connections/servers')[env];
      //primero preguntamos a la base de datos el status de la soliciud y el autorizador de la solicitd
      new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request()
          .input('IdSolicitud', sql.Int, req.params.IdSolicitud)
          .execute('EmailUserValidation')
      }).then(resultauth => {
        // console.log(resultauth.recordset);
        // console.log(resultauth.recordsets);
        // console.log("este es el valor del Status de la SOl-->");
        // console.log(resultauth.recordsets[1][0])
        // console.log("????   ");
        // console.log(resultauth.recordsets[2][0]);
        console.log(resultauth.recordsets[3][0].NombreCompleto);
        console.log(resultauth.recordsets[3][0].Email);
        // console.log(resultauth.recordsets[4][0].Email);
        StatusSolicitud = resultauth.recordsets[1][0].IdStatusSolicitud;
        console.log(StatusSolicitud);
        if (StatusSolicitud == 2 || StatusSolicitud == 3) {
          console.log("quiere decir que se envia a planeacion finaciera");
          var sql = require("mssql");
          var env = process.env.NODE_ENV || 'SERWEB';
          var config = require('../controllers/connections/servers')[env];

          new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request()
              .input('IdNewStatus', sql.Int, req.params.IdStatus)
              .input('IdSolicitud', sql.Int, req.params.IdSolicitud)
              //.output('output_parameter', sql.VarChar(50))//se ocupara para cuando hay un valor de retorno en el storeprocedure
              .execute('UpdateStatusfromEmail')
          }).then( async result => {
            console.log("este es el resultado de el Update de la SolPed");
            
            StatusSolicitud = resultauth.recordsets[1][0].IdStatusSolicitud;
            NombreCompletoSolicitante = req.params.Solicitante;
            //NombreCompletoSolicitante = resultauth.recordsets[4][0].NombreCompleto;
            EmailSolicitante = resultauth.recordsets[4][0].Email;
            IdNewestatus = req.params.IdStatus;
            
            if (req.params.IdStatus == 4) {
              NombreAutorizador = resultauth.recordset[0].NombreCompleto;
              EmailAutorizador = resultauth.recordset[0].Email;
              Nombre = 'S. P. AUTORIZADO POR DIRECCION';
              TitleName = "SOLICITUD DE PEDIDO PENDIENTE";
              EnvioStatusAutoriza = 6;
              EnvioStatusRechaza = 7;
            } else {
              NombreAutorizador = resultauth.recordsets[3][0].NombreCompleto;
              EmailAutorizador = resultauth.recordsets[3][0].Email;
              Nombre = 'S. P. RECHAZADA POR DIRECCION';
              TitleName = "SOLICITUD DE PEDIDO PENDIENTE";
              EnvioStatusAutoriza = 6;
              EnvioStatusRechaza = 7;
            }

            console.log("----IdStatus solicitud----");
            console.log(StatusSolicitud);
            console.log("------------------------------");
            // console.log("----Role a Excluir----");
            //console.log(resultexept.recordsets[2][0]);
            // console.log("------------------------------");
            console.log("----------StatusSolicitud ---------");
            console.log(StatusSolicitud);
            console.log("-----------------------------------");
            console.log("--------------DATOS DE USUARIO SIGUIENTE AUTORIZAR------------");
            console.log(NombreAutorizador);
            console.log(EmailAutorizador);
            console.log("-------------------------------------------------");
            console.log("----------DATOS DE USUARIO REQUIERENTE------------");
            console.log(NombreCompletoSolicitante);
            console.log(EmailSolicitante);
            console.log("------------------------------------------------");
            let isLog = await this.InsertLog( req.params.IdSolicitud, Nombre, TitleName);
            let isSendEmail = await this.SendMail(
              req.params.IdSolicitud,
              IdNewestatus,
              Nombre,
              NombreAutorizador,
              EmailAutorizador,
              NombreCompletoSolicitante,
              EmailSolicitante,
              TitleName,
              EnvioStatusAutoriza,
              EnvioStatusRechaza
            );
            console.log("*/*/*/*/*/SE ENVIO EL MAIL EN EXEPCION DIRECTOR ? *//*/*/");
            console.log(isSendEmail);
            console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");
            console.log("*/*/*/*/*/VALOR DEL LOG*//*/*/");
            console.log(isLog);
            console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");

            if (isSendEmail == false) {
                    res.status(400)
                    res.write("<!doctype html>" +
                      "<html lang='en'>" +
                      "<head>" +

                      "<meta charset='utf-8'>" +
                      "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +

                      "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                      "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +

                      "<title>Intranet Grupo Imagen</title>" +
                      "</head>" +
                      "<body>" +

                      "<div class='alert alert-danger' style='text-align: center;' role='alert'>" +
                      "ERROR AL ENVIAR EL CORREO" + isSendEmail + 
                      "</div>" +

                      "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                      "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                      "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                      "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                      "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                      "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                      "</body>" +
                      "</html>");
                      res.end();
            }else {
                    console.log("-.-.-.-.-.CORREO ENVIADO-.-.-.-.-");
                      //console.log(EmailSolicitante);
                      let isSendEmail = await this.SendMail(
                        req.params.IdSolicitud,
                        0,
                        Nombre,
                        resultauth.recordsets[3][0].NombreCompleto,
                        resultauth.recordsets[3][0].Email,
                        NombreCompletoSolicitante,
                        EmailSolicitante,
                        TitleName,
                        1,
                        1
                      );

                      console.log("*/*/*/*/*/SE ENVIO EL MAIL PARA GERENTE DIR *//*/*/");
                      console.log(isSendEmail);
                      console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");
                      if(isSendEmail == false){
                        res.status(400)
                        res.write("<!doctype html>" +
                          "<html lang='en'>" +
                          "<head>" +
    
                          "<meta charset='utf-8'>" +
                          "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
    
                          "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                          "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
    
                          "<title>Intranet Grupo Imagen</title>" +
                          "</head>" +
                          "<body>" +
    
                          "<div class='alert alert-danger' style='text-align: center;' role='alert'>" +
                          "ERROR AL ENVIAR EL CORREO" + isSendEmail + 
                          "</div>" +
    
                          "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                          "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                          "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                          "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                          "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                          "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                          "</body>" +
                          "</html>");
                          res.end();
                      }else{
                        if(IdNewestatus == 4){
                          res.status(200);
                          res.write("<!doctype html>" +
                              "<html lang='en'>" +
                              "<head>" +
      
                              "<meta charset='utf-8'>" +
                              "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
      
                              "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                              "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
      
                              "<title>Intranet Grupo Imagen</title>" +
                              "</head>" +
                              "<body>" +
      
                              "<div class='alert alert-success' style='text-align: center;' role='alert'>" +
                                "Se actualizo correctamente el Estatus de la Solicitud de Pedido" +
                              "</div>" +
      
                              "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                              "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                              "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                              "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                              "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                              "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                              "</body>" +
                              "</html>");
                          res.end();
                        }else{
                          res.status(200);
                          res.write("<!doctype html>" +
                          "<html lang='en'>" +
                          "<head>" +
    
                          "<meta charset='utf-8'>" +
                          "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +
    
                          "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                          "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +
    
                          "<title>Intranet Grupo Imagen</title>" +
                          "</head>" +
                          "<body>" +
    
                          "<div class='alert alert-danger' style='text-align: center;' role='alert'>" +
                          "Se notificará rechazo al solicitante" +
                          "</div>" +
    
                          "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                          "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                          "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                          "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                          "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                          "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                          "</body>" +
                          "</html>");
                          res.end();
                        }
                      }
                      
                    
                }
          });
        } else {
          console.log("quiere decir que la solicitud ya tiene un status igual o superior al que se intenta actualizar.");
          res.status(200);
          res.write("<!doctype html>" +
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
            "Esta Solicitud de Pedido ya tiene un status igual o superior al que se intenta actualizar" +
            "</div>" +

            "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
            "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
            "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
            "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
            "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
            "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
            "</body>" +
            "</html>");
          res.end();
            
        }
      }).catch(err => {
        console.log("error al recuperar la infromacion del siguente autorizador");
        res.write("<!doctype html>" +
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
            "OCURRIO UN ERROR  " + err + 
            "</div>" +

            "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
            "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
            "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
            "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
            "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
            "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
            "</body>" +
            "</html>");
        res.end();
      });

    }


    if (req.params.IdStatus == 6 || req.params.IdStatus == 7) {
      console.log("Persona de finanzas");
      var sql = require("mssql");
      var env = process.env.NODE_ENV || 'SERWEB';
      var config = require('../controllers/connections/servers')[env];
      //primero preguntamos a la base de datos el status de la soliciud y el autorizador de la solicitd
      new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request()
          .input('IdSolicitud', sql.Int, req.params.IdSolicitud)
          .execute('EmailUserValidation')
      }).then(resultauth => {
        // console.log(resultauth.recordset);
        // console.log(resultauth.recordsets);
        // console.log("este es el valor del Status de la SOl-->");
        // console.log(resultauth.recordsets[1][0])
        // console.log("????   ");
        // console.log(resultauth.recordsets[2][0]);
        // console.log(resultauth.recordsets[3][0].NombreCompleto);
        // console.log(resultauth.recordsets[4][0].Email);
        // var NombreCompleto: string = resultauth.recordset[0].NombreCompleto;
        // var emailSig: string = resultauth.recordset[0].Email;
        // var emailAnter: string = resultauth.recordsets[4][0].Email;
        // var Nombreauth: string;
        // var emailAuth: string;
        StatusSolicitud = resultauth.recordsets[1][0].IdStatusSolicitud;
        if (StatusSolicitud == 4 || StatusSolicitud == 5) {
          console.log("quieere decir que si se envia el mailal sigueinte autorizador");
          var sql = require("mssql");
          var env = process.env.NODE_ENV || 'SERWEB';
          var config = require('../controllers/connections/servers')[env];

          new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request()
              .input('IdNewStatus', sql.Int, req.params.IdStatus)
              .input('IdSolicitud', sql.Int, req.params.IdSolicitud)
              //.output('output_parameter', sql.VarChar(50))//se ocupara para cuando hay un valor de retorno en el storeprocedure
              .execute('UpdateStatusfromEmail')
          }).then( async result => {
            
            StatusSolicitud = resultauth.recordsets[1][0].IdStatusSolicitud;
            NombreCompletoSolicitante = req.params.Solicitante;
            //NombreCompletoSolicitante = resultauth.recordsets[4][0].NombreCompleto;
            EmailSolicitante = resultauth.recordsets[4][0].Email;
            IdNewestatus = req.params.IdStatus;
            if (req.params.IdStatus == 6) {
              NombreAutorizador = resultauth.recordset[0].NombreCompleto;
            EmailAutorizador = resultauth.recordset[0].Email;
              Nombre = 'S. P. PRESUPUESTO AUTORIZADO';
              TitleName = "SOLICITUD DE PEDIDO PENDIENTE";
            } else {
              NombreAutorizador = resultauth.recordsets[3][0].NombreCompleto;
              EmailAutorizador = resultauth.recordsets[3][0].Email;
              Nombre = 'S. P. PRESUPUESTO RECHAZADO';
              TitleName = "SOLICITUD DE PEDIDO PENDIENTE";
            }

            console.log("----IdStatus solicitud----");
            console.log(StatusSolicitud);
            console.log("------------------------------");
            // console.log("----Role a Excluir----");
            // console.log(resultexept.recordsets[2][0]);
            // console.log("------------------------------");
            console.log("----------StatusSolicitud ---------");
            console.log(StatusSolicitud);
            console.log("-----------------------------------");
            console.log("--------------DATOS DE USUARIO SIGUIENTE AUTORIZAR------------");
            console.log(NombreAutorizador);
            console.log(EmailAutorizador);
            console.log("-------------------------------------------------");
            console.log("----------DATOS DE USUARIO REQUIERENTE------------");
            console.log(NombreCompletoSolicitante);
            console.log(EmailSolicitante);
            console.log("------------------------------------------------");
            let isLog = await this.InsertLog( req.params.IdSolicitud , Nombre, TitleName);
            let isSendEmail = await this.SendMail(
              req.params.IdSolicitud,
              IdNewestatus,
              Nombre,
              NombreAutorizador,
              EmailAutorizador,
              NombreCompletoSolicitante,
              EmailSolicitante,
              TitleName,
              EnvioStatusAutoriza,
              EnvioStatusRechaza
            );

            console.log("*/*/*/*/*/SE ENVIO EL MAIL EN PLANEACION FINANZAS *//*/*/");
            console.log(isSendEmail);
            console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");
            console.log("*/*/*/*/*/VALOR DEL LOG*//*/*/");
            console.log(isLog);
            console.log("/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*//");

            if (isSendEmail == false) {
              res.status(400)
              res.write("<!doctype html>" +
                "<html lang='en'>" +
                "<head>" +

                "<meta charset='utf-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +

                "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +

                "<title>Intranet Grupo Imagen</title>" +
                "</head>" +
                "<body>" +

                "<div class='alert alert-danger' style='text-align: center;' role='alert'>" +
                "ERROR AL ENVIAR EL CORREO" + isSendEmail + 
                "</div>" +

                "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                "</body>" +
                "</html>");
                res.end();
            }else {
                    console.log("-.-.-.-.-.CORREO ENVIADO-.-.-.-.-");
                    if(IdNewestatus == 6){
                      res.status(200);
                      res.write("<!doctype html>" +
                          "<html lang='en'>" +
                          "<head>" +

                          "<meta charset='utf-8'>" +
                          "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +

                          "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                          "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +

                          "<title>Intranet Grupo Imagen</title>" +
                          "</head>" +
                          "<body>" +

                          "<div class='alert alert-success' style='text-align: center;' role='alert'>" +
                            "Se actualizo correctamente el Estatus de la Solicitud de Pedido" +
                          "</div>" +

                          "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                          "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                          "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                          "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                          "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                          "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                          "</body>" +
                          "</html>");
                      res.end();
                    }else{
                      res.status(200);
                      res.write("<!doctype html>" +
                      "<html lang='en'>" +
                      "<head>" +

                      "<meta charset='utf-8'>" +
                      "<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>" +

                      "<link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css' " +
                      "integrity='sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh' crossorigin='anonymous'>" +

                      "<title>Intranet Grupo Imagen</title>" +
                      "</head>" +
                      "<body>" +

                      "<div class='alert alert-danger' style='text-align: center;' role='alert'>" +
                      "Se notificará rechazo al solicitante" +
                      "</div>" +

                      "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
                      "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
                      "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
                      "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
                      "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
                      "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
                      "</body>" +
                      "</html>");
                      res.end();
                    }
            }
          }).catch(err => {
            console.log(err);
            res.write("<!doctype html>" +
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
            "Error al actualizar el valor en Base de Datos" + err + 
            "</div>" +

            "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
            "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
            "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
            "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
            "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
            "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
            "</body>" +
            "</html>");
            res.end();
            
          });
        } else {
          console.log("se envia un mensaje diciendo que ya esta actualizado o que ya tiene un valor");
          res.write("<!doctype html>" +
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
            "Esta Solicitud de Pedido ya tiene un status igual o superior al que se intenta actualizar" +
            "</div>" +
            // "<h1>¡Solicitud de Pedido Actualizada!</h1>"+

            "<script src='https://code.jquery.com/jquery-3.4.1.slim.min.js' " +
            "integrity='sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n' crossorigin='anonymous'></script>" +
            "<script src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js' " +
            "integrity='sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo' crossorigin='anonymous'></script>" +
            "<script src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js' " +
            "integrity='sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6' crossorigin='anonymous'></script>" +
            "</body>" +
            "</html>");
            res.end();
        }
      }).catch(err => {
        console.log("Error al recuperar la infromacion del siguente autorizador" + err);
        res.end();
      });

    }
  }

  SendMail = async (IdSolicitud:number, 
    IdStatus:number, 
    NameStatus:string, 
    NameAutorizador:string, 
    EmailAutorizador:string, 
    NameSolicitante:string, 
    EmailSolicitante:string, 
    Subjetc:string, 
    EstatusAutoriza:number, 
    EstatusRechaza:number) =>{
    // try{
    //   let valreturn = 10000000;
    //   let modificado = valreturn - 200000;
    //   return modificado;
    // }catch(error){
    //   return 0;
    // }
    try {
      return new Promise((resolve, reject) => {
        console.log("*/*/SendMail*/*/");
          var accessToken: any;
          const oauth2Client = new google.auth.OAuth2(
            CLIENTID, //client ID
            CLIENTSECRET, // Client Secret 
            REDIRECTURL // Redirect URL 
          );
          oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
          oauth2Client.getAccessToken().then(async (token,response) => {
            //console.log(token.token);
            accessToken = token.token;
            //cuanta de correo de donde se enviaran los diferentes correos 
            var nodemailer = require("nodemailer");
            var smtpTransport = nodemailer.createTransport({
              service: 'Gmail',
              host: 'smtp.gmail.com',
              port: 587,
              auth: {
                user: "intranet@gimm.com.mx",
                type: 'OAuth2',
                clientId: CLIENTID,
                clienteSecret: CLIENTSECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
              },
              tls: { rejectUnauthorized: false },
              debug: false
            });
    
            let mailOptionAceptacion;
            let mailOptionRechaza;
            let mailOptionConfiramacion;
            let ButtonAutoriza;
            let ButtonRechaza;
            
            //Validamos si el evio de la Solicitd fue aceptada o rechazada para realizar envio dependiendo de lo seleccionado
              if (IdStatus == 3 || IdStatus == 5 || IdStatus == 7 || IdStatus == 9) {
                mailOptionRechaza = {
                  to: EmailSolicitante,
                  cc: 'yuki.estrada@gimm.com.mx',
                  bcc: 'marco.garcia@gimm.com.mx',
                  subject: Subjetc,
                  html:'<div style="text-align: center;">'+
                          '<h1 style="color: #919499 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 62px; font-weight: 800; line-height: 72px; margin: 0 0 24px; text-align: center; text-transform: uppercase;">' + NameStatus + ', REALIZADO POR : ' + NameAutorizador + '</h1>' +
                          '<h3 style="color: #919499 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 62px; font-weight: 800; line-height: 36px; margin: 0 0 24px; text-align: center;">CON UN ID DE SOLICITUD : <p style="text-decoration: underline;">' + IdSolicitud + '</p><h3>' +
                          '<p style="color: #f8f8f8 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 18px; font-weight: 500; line-height: 32px; margin: 0 0 24px;"> PARA VER DETALLE ENTRAR A LA INTRANET</p>' +
                          '<a style="color: #c8c8c8; text-decoration: underline;" href="'+Intranet+'">ENTRAR A INTRANET</a>' +
                          
                          '<p style="color: #f8f8f8 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 15px; font-weight: 500; line-height: 32px; margin: 0 0 30px;"> POR FAVOR NO RESPONDER ESTE MENSAJE, ES UN MENSAJE AUTOMATICO</p>'+
                        '</div>'
                  }
                console.log("-- Rechazo if --");
                smtpTransport.sendMail(mailOptionRechaza, function (error, info) {
                  if (error) {
                    console.log("error is "+error);
                   resolve(false); // or use rejcet(false) but then you will have to handle errors
                  } 
                  else {
                    console.log('Email sent: ' + info.response);
                    resolve(true);
                  }
                });
              }else if(IdStatus == 4){
                mailOptionAceptacion = {
                  to: EmailAutorizador,
                  cc: 'yuki.estrada@gimm.com.mx',
                  bcc: 'marco.garcia@gimm.com.mx',
                  subject: Subjetc,
                  html: '<div style="text-align: center;">'+
                          '<h1 style="color: #919499 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 62px; font-weight: 800; line-height: 72px; margin: 0 0 24px; text-align: center; text-transform: uppercase;">TIENES UNA SOLICITUD DE PEDIDO PENDIENTE POR REVISAR DE : ' + NameSolicitante + '</h1>'+ 
                          '<h2 style="color: #919499 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 62px; font-weight: 800; line-height: 36px; margin: 0 0 24px; text-align: center;">CON UN ID DE SOLICITUD : ' + IdSolicitud + '</h2>'+ 
                          '<h3 style="color: #f8f8f8 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 18px; font-weight: 500; line-height: 32px; margin: 0 0 24px;">PARA VER DETALLE ENTRAR A LA INTRANET</h3>' +
                          '<a style="color: #c8c8c8; text-decoration: underline;" href="'+Intranet+'">ENTRAR A INTRANET</a>' +
                          '<br>' +
                          '<p style="color: #007bff !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 15px; font-weight: 500; line-height: 32px; margin: 0 0 30px;"> POR FAVOR NO RESPONDER ESTE MENSAJE, ES UN MENSAJE AUTOMATICO</p>'+
                        '</div>'
                                     }
                console.log("Autorizo Nivel Dir sin botones para Fianzas");
                smtpTransport.sendMail(mailOptionAceptacion, function (error, info) {
                  if (error) {
                    console.log("error is "+error);
                   resolve(false); // or use rejcet(false) but then you will have to handle errors
                  } 
                  else {
                    console.log('Email sent: ' + info.response);
                    resolve(true);
                  }
                });
              }else if(IdStatus == 0){
                mailOptionConfiramacion = {
                  to: EmailAutorizador,
                  cc: 'yuki.estrada@gimm.com.mx',
                  bcc: 'marco.garcia@gimm.com.mx',
                  subject: Subjetc,
                  html: '<div style="text-align: center; display: block;">'+
                          '<h1 style="color: #919499 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 62px; font-weight: 800; line-height: 72px; margin: 0 0 24px; text-align: center; text-transform: uppercase; ">REALIZASTE CAMBIO DE ESTATUS A : '+ NameStatus +'</h1>'+
                          '<h2 style="color: #919499 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 60px; font-weight: 800; line-height: 36px; margin: 0 0 24px; text-align: center;" > PARA LA SOLICITUD CON ID : '+ IdSolicitud +'</h2>' + 
                          '<h3 style="color: #f8f8f8 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 15px; font-weight: 500; line-height: 32px; margin: 0 0 24px;"> SOLICITANTE :' + NameSolicitante + '</h3>' +
                          '<p style="color: #f8f8f8 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 15px; font-weight: 500; line-height: 32px; margin: 0 0 24px;"> PARA VER DETALLE ENTRAR A LA INTRANET</p>' +
                          '<a style="color: #007bff; text-decoration: underline;" href="'+Intranet+'">ENTRAR A INTRANET</a>' +
                          '<p style="color: #f8f8f8 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 15px; font-weight: 500; line-height: 32px; margin: 0 0 24px;"> POR FAVOR NO RESPONDER ESTE MENSAJE, ES UN MENSAJE AUTOMATICO</p>'+
                        '<div>' 
                       
                }
                console.log("CONFIRMACION PARA DIRECTORES");
                smtpTransport.sendMail(mailOptionConfiramacion, function (error, info) {
                  if (error) {
                    console.log("error is "+error);
                   resolve(false); // or use rejcet(false) but then you will have to handle errors
                  } 
                  else {
                    console.log('Email sent: ' + info.response);
                    resolve(true);
                  }
                });
              }else if(IdStatus == 1 || IdStatus == 2){
                ButtonAutoriza = '<button type="button" style="text-decoration: none; border: 1px solid #90caf9;  border-radius: 5px; padding-rigth: 5px; background-color: #90caf9; margin: 5px;">'+
                '<a href="'+SERVER+'/api/upstatus/' 
                + IdSolicitud + 
                '/' + NameSolicitante + 
                '/' + EstatusAutoriza + 
                '" style="text-decoration:none; color: #fff !important; font-size: 12px;">AUTORIZAR</a>'+'</button>';

                ButtonRechaza = '<button type="button" style="text-decoration: none; border: 1px solid #f48fb1;  border-radius: 5px; padding-rigth: 5px; background-color: #f48fb1; margin: 5px;">'+
                                '<a href="'+SERVER+'/api/upstatus/' +
                                                IdSolicitud + 
                                                '/' + NameSolicitante + 
                                                '/' + EstatusRechaza + 
                                                '" style="text-decoration:none; color: #fff !important; font-size: 12px;">DENEGAR</a>'+'</button>';
                mailOptionAceptacion = {
                                  to: EmailAutorizador,
                                  cc: 'yuki.estrada@gimm.com.mx',
                                  bcc: 'marco.garcia@gimm.com.mx', 
                                  subject: Subjetc,
                                  html: '<div style="text-align: center;">'+
                                        '<h1 style="color: #919499 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 62px; font-weight: 800; line-height: 72px; margin: 0 0 24px; text-align: center; text-transform: uppercase;">TIENES UNA SOLICITUD DE PEDIDO PENDIENTE POR REVISAR DE : ' + NameSolicitante + '</h1>'+
                                        '<h3 style="color: #919499 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 62px; font-weight: 800; line-height: 36px; margin: 0 0 24px; text-align: center;">CON UN ID DE SOLICITUD : ' + IdSolicitud + '<h3>' + 
                                        '<p style="color: #f8f8f8 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 15px; font-weight: 500; line-height: 32px; margin: 0 0 24px;"> PARA VER DETALLE ENTRAR A LA INTRANET</p>' +
                                        '<a style="color: #007bff; text-decoration: underline;" href="'+Intranet+'">ENTRAR A INTRANET</a>' +                              
                                        '<p style="color: #f8f8f8 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 18px; font-weight: 500; line-height: 32px; margin: 0 0 24px;">EN CASO DE DENEGAR LA SOLICITUD SE DEBERA ENTRAR A LA INTRANET PARA CAPTURAR MOTIVO DE RECHAZO</p>' +
                                          ButtonAutoriza + ButtonRechaza +
                                        '<br>' +
                                        '<p Style="color: #f8f8f8 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 15px; font-weight: 500; line-height: 32px; margin: 0 0 30px;> POR FAVOR NO RESPONDER A ESTE MENSAJE, ES UN MENSAJE AUTOMATICO</p>'+
                                        '</div>'
                                        }

                // mailOptionRechaza = {
                //                 to: EmailSolicitante,
                //                 cc: 'yuki.estrada@gimm.com.mx',
                //                 bcc: 'marco.garcia@gimm.com.mx',
                //                 subject: Subjetc,
                //                 html:'<div style="text-align: center;">'+
                //                         '<h1 style="color: #919499 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 62px; font-weight: 800; line-height: 72px; margin: 0 0 24px; text-align: center; text-transform: uppercase;">' + NameStatus + ', REALIZADO POR : ' + NameAutorizador + ' </h1>' +
                //                         '<h3 style="color: #919499 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 60px; font-weight: 800; line-height: 36px; margin: 0 0 24px; text-align: center;">CON UN ID DE SOLICITUD : </Strong>' + IdSolicitud + 
                //                         '<p style="color: #f8f8f8 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 18px; font-weight: 500; line-height: 32px; margin: 0 0 24px;">FAVOR DE ENTRAR A INTRANET PARA SU REVISION DETALLADA</p>' +

                //                         '<a style="color: #c8c8c8; text-decoration: underline;" href="'+Intranet+'">ENTRAR A INTRANET</a>' +
                //                         '<p Style="color: #f8f8f8 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 15px; font-weight: 500; line-height: 32px; margin: 0 0 30px;"> POR FAVOR NO RESPONDER ESTE MENSAJE, ES UN MENSAJE AUTOMATICO</p>'+
                //                     '</div>'
                //                     }

                    smtpTransport.sendMail(mailOptionAceptacion, function (error, info) {
                      if (error) {
                          console.log("error is  "+ error);
                          resolve(false); // or use rejcet(false) but then you will have to handle errors
                      }else {
                        console.log('Email sent: ' + info.response);
                        resolve(true);
                      }
                    });
              }else if(IdStatus == 6){
                mailOptionAceptacion = {
                  to: EmailAutorizador,
                  cc: 'yuki.estrada@gimm.com.mx',
                  bcc: 'marco.garcia@gimm.com.mx', 
                  subject: Subjetc,
                  html: '<div style="text-align: center;">'+
                        '<h1 style="color: #919499 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 62px; font-weight: 800; line-height: 72px; margin: 0 0 24px; text-align: center; text-transform: uppercase;"> ' + NameStatus + '</h1>'+
                        '<h3 style="color: #919499 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 62px; font-weight: 800; line-height: 36px; margin: 0 0 24px; text-align: center;">CON UN ID DE SOLICITUD : ' + IdSolicitud + '<h3>' +                                
                        '<a style="color: #007bff !important; text-decoration: none; padding-top:5px" href="'+Intranet+'">ENTRAR A INTRANET</a>' +
                        '<br>' +
                        '<p Style="color: #f8f8f8 !important; font-family: "'+"Raleway"+'",sans-serif; font-size: 15px; font-weight: 500; line-height: 32px; margin: 0 0 30px;> POR FAVOR NO RESPONDER A ESTE MENSAJE, ES UN MENSAJE AUTOMATICO</p>'+
                        '</div>'
                        }

                smtpTransport.sendMail(mailOptionAceptacion, function (error, info) {
                          if (error) {
                            console.log("error is  "+ error);
                            resolve(false); // or use rejcet(false) but then you will have to handle errors
                          }else {
                            console.log('Email sent: ' + info.response);
                            resolve(true);
                          }
                });   
              
              }else{
                console.log("No entro a ninguna opcion para el envio del correo");
                resolve(false);
              }
              
          }).catch(err => {
            console.log("Error en el metodo de nuevo envio de correo");
            console.log(err);
            //res.end(err);
            resolve(false);
          });
      })
    } catch (error) {
      console.log(".-.-.--.-.-.-. ERROR IN SendEmail -.-.-.-.-.-.-.-.-.-.-")
      console.log(error);
      return error;
    }
    
  }

  InsertLog = async (IdSolicitud:number, EventName:string, EventDetails:string) =>{
    return new Promise( async (resolve, reject) => {
      let date = await this.GetDate();
      let sql = require("mssql");
      let env = process.env.NODE_ENV || 'SERWEB';
      let config = require('../controllers/connections/servers')[env];
      new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request()
          .input('IdSolPedido', sql.Int, IdSolicitud)
          .input('EventDate', sql.VarChar, date)
          .input('EventName', sql.VarChar, EventName)
          .input('EventDetail', sql.VarChar, EventDetails)
          .execute('LogSolicitudPedido')
        }).then(async result => {
          console.log(result);
          resolve(true);
        }).catch(err => {
          if (err) console.log(err);
          resolve(false);
        });
    });
  }

  getIdStatusSolicitud = (req, res) => {
    console.log(req)
    //solicitamos el status de la solicitud creada
    var sql = require("mssql");
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];
    var StatusSolicitud;
    var Query = "Select IdStatusSolicitud From Solicitud where IdSolicitud =" + req;
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(Query, (err, result) => {
          // ... error checks
          if (err) console.log(err);
          //  console.log("All Direcciones");
          console.log(result.recordset);
          //result.recordset[0].IdStatusSolicitud;
          return result.recordset;
        })
    });
  }

  ChangeSattusCompras = (req, res) => {
    console.log(req.params.IdStatus);
    console.log(req.params.IdSolPed);
    var sql = require("mssql");
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];
    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input("IdSolPed", sql.Int, req.params.IdSolPed)
        .input("IdStatus", sql.Int, req.params.IdStatus)
        .execute("UpdateStatusCompras")
    }).then(result => {
      console.log(result);
      res.status(201).json(result.recordset);
      sql.close();
    }).catch(err => {
      if (err) console.log(err);
      sql.close();
    });
  }

  gethelloSing = (req, res) => {
    //ejemplo de Hellosing
    const hellosign = require('hellosign-sdk')({ key: 'f2b78745c24f7e072ea65b7cd8c3b0d750f64cbe503b12534cde2338274bfa4f' });
    const opts = {
      test_mode: 1,
      clientId: 'f2b78745c24f7e072ea65b7cd8c3b0d750f64cbe503b12534cde2338274bfa4f',
      subject: 'The NDA we talked about',
      message: 'Please sign this NDA and then we can discuss more.',
      signers: [
        {
          email_address: 'alice@example.com',
          name: 'Alice'
        }
      ],
      files: ['NDA.pdf']
    };

    hellosign.signatureRequest.createEmbedded(opts).then((res) => {
      console.log(res);
      // handle response
      hellosign.signatureRequest.createEmbedded(opts).then((res) => {
        const signature = res.signature_request.signatures[0];
        const signatureId = signature.signature_id;

        return hellosign.embedded.getSignUrl(signatureId);
      }).then((res) => {
        console.log('The sign url: ' + res.embedded.sign_url);
      }).catch((err) => {
        // handle error
        console.log("error al recuperar el create Embadded");
      });
    }).catch((err) => {
      // handle error
      console.log("error al create Embadded");
    });




  }

  callback = (req, res) => {
    console.log("-------dentro del metodo callback de la hellosign----");
    //console.log(res);
  }

  HistorySolPed = (req, res)=>{
    console.log(req.body.IdSolicitud);
    var sql = require("mssql");
    var env = process.env.NODE_ENV || 'SERWEB';
    var config = require('../controllers/connections/servers')[env];
    new sql.ConnectionPool(config).connect().then(pool => {
      return pool.request()
        .input("IdSolicitudPedido", sql.Int, req.body.IdSolicitud)
        .execute("HistorySolPedido")
    }).then(result => {
      console.log("HistorySolPedido")
      console.log(result);
      sql.close();
      res.status(201).json(result.recordset);
      res.end();
    }).catch(err => {
      if (err) console.log(err);
      sql.close();
      res.status(201)
      res.end();
    });
  }



}
