import Cat from '../models/cat';

export default class SolicitudController {
  model = Cat;
  mysql:any;
  connection:any;
  sql:string;
  constructor(){   
    this.mysql = require('mysql');
    this.connection = this.mysql.createConnection({
      host     : 'localhost',
      user     : 'imagen',
      password : 'd1no$auri0Z',
      database : 'IMAGEN_FINANZAS'
    });
    this.connection.connect();
  }

    // Get all
  getAllProveedores = (req, res) => {
    this.sql = 'select * from Proveedor;'
    this.connection.query(this.sql, function (error, results, fields) {
      if (error) throw error;
      // connected!
      res.status(200).json(results);                    
    });        
  }
  

  getAllIVA  = (req, res) => {
    this.sql = 'select * from Impuesto;'
    this.connection.query(this.sql, function (error, results, fields) {
      if (error) throw error;
      // connected!
      res.status(200).json(results);                    
    });        
  }


  getAllProveedoresByIdSociedad = (req, res) => {
    
    this.sql = 'SELECT * \n'+
                'FROM IMAGEN_FINANZAS.Sociedad_tiene_Proveedor as SocProv \n'+
                '      LEFT JOIN Proveedor AS Prov ON \n'+
                '           SocProv.Proveedor_RFC  = Prov.RFC \n' +
                'WHERE Sociedad_idSociedadSAP =  ' + req.params.idSociedad + ' \n' +
                'ORDER BY Prov.nombreProveedor ASC;';
    
    console.log(this.sql);
    this.connection.query(this.sql, function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);                    
    });    

    
  }


  /*getAllSucursalPlazaByIdMedio = (req, res) => {							    
    this.sql = 'SELECT * \n'+
                'FROM IMAGEN_FINANZAS.Medio_tiene_SurcursalPlaza  as MSP  \n'+
                '      LEFT JOIN Medio as M on  \n'+
                '           MSP.medio_idMedio = M.idMedio \n' +
                '      LEFT JOIN SurcursalPlaza as SP on  \n'+
                '           MSP.SurcursalPlaza_idSurcursalPlaza = SP.idSurcursalPlaza \n' +
                'WHERE 	MSP.medio_idMedio =  ' + req.params.idMedio +  ' ;' ;
                
    
    console.log("getAllSucursalPlazaByIdMedio SQL= " + this.sql);
    this.connection.query(this.sql, function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);                    
    });    

    
  }*/


  getAllCuentasMayorByIdSociedad = (req, res) => {	  
         
    this.sql = 'SELECT * \n'+
                'FROM Sociedad as Soc \n'+
                '      LEFT JOIN Sociedad_tiene_CuentaMayor as SCM ON    \n'+
                '           Soc.idSociedadSAP = SCM.Sociedad_idSociedadSAP \n' +                
                '      LEFT JOIN CuentaMayor as CM ON     \n'+
                '           SCM.CuentaMayor_idCuentaMayor = CM.idCuentaMayor \n' +                
                'WHERE Soc.idSociedadSAP = ' + req.params.idSociedad + ' \n' +
                'ORDER BY CM.nombreCuentaMayor ASC;';
    
    console.log("getAllCuentasMayourByIdSociedad SQL= " + this.sql);
    this.connection.query(this.sql, function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);                    
    });    

    
  }

  getAllCentroDeCostoByIdSociedad = (req, res) => {	  
    
    

    this.sql = 'SELECT * \n'+
                'FROM Sociedad as Soc \n'+
                '      LEFT JOIN CentroDeCosto as CenCost ON    \n'+
                '           Soc.idSociedadSAP = CenCost.sociedad_idSociedad \n' +                
                'WHERE Soc.idSociedadSAP = ' + req.params.idSociedad + ' \n' + 
                'ORDER BY idCentroCostos ASC ';
    
    console.log("getAllCuentasMayourByIdSociedad SQL= " + this.sql);
    this.connection.query(this.sql, function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);                    
    });    

    
  }


   


  

  getAllTiposDeSolicitud = (req, res) => {
    this.sql= 'select * from TipoSolicitud;';
     this.connection.query(this.sql, function (error, results, fields) {
      if (error) throw error;      
      res.status(200).json(results);                    
    });        
  }


  getAllSociedades = (req, res) => {
    this.sql= 'select * from Sociedad order by nombreSociedad asc ;';
     this.connection.query(this.sql, function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);                    
    });        
  }
  

  getAllMedios = (req, res) => {
    this.sql= 'select * from Medio;';
     this.connection.query(this.sql, function (error, results, fields) {
      if (error) throw error;      
      res.status(200).json(results);                    
    });        
  }


  insertSolicitud = (req, res) => {
    
    console.log( "========POSST " + req.params.idTipoSolicitud );
    var idStatusSolicitud = 1;
    this.sql = "INSERT INTO Solicitud (TipoSolicitud, "+
                                      "StatusSolicitud, "+
                                      "Sociedad, "+
                                      "DescripcionConcepto, "+
                                      "Importe, "+
                                      "TasaIVA, "+
                                      "CuentaMayor, "+
                                      "Proveedor, "+
                                      "CentroDeCosto , "+
                                      "Autorizador , " +
                                      "Solicitante , " +
                                      "RetIVA , " +
                                      "RetISR , " +
                                      "GastosExtras , " +
                                      "OrdenInterna , " +
                                      "Presupuesto , " +
                                      "Division , " +
                                      "AutorizadorCuentasPorPagar , " +
                                      "PersonalCuentasPorPagar  " +
                                      " ) \n"+
               "VALUES ('"+ req.params.idTipoSolicitud + "', " +
                            idStatusSolicitud+ " , '" +
                            req.params.idSociedad + "' , '" + 
                            req.params.descripcionConcepto + "' , " +
                            req.params.importe + " , "+
                            req.params.idImpuesto + " , '" +
                            req.params.idCuentaMayor + "' , '" +
                            req.params.idProveedor + "' , '" +
                            req.params.idCentroCostos + "' , '" +
                            req.params.autorizadorPor + "' , '" +                            
                            req.params.solicitante + "' , " +    
                            req.params.retIVA + " , " +                                                        
                            req.params.retISR + " , " +        
                            req.params.gastosExtras + " , '" +        
                            req.params.ordenInterna + "' , " +        
                            req.params.presupuesto + " , '" +        
                            req.params.division + "' , '" +        
                            req.params.autorizadorCuentasPorPagar + "' , '" +        
                            req.params.personalCuentasPorPagar + "' " +        
                            ")";

    console.log(this.sql);
    this.connection.query(this.sql, function (error, results, fields) {
      if (error) throw error;
      // connected!
      res.status(200).json(results);                    
    });        
   

    //res.status(200).json();       
  }
  



}
