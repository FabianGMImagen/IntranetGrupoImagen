import { WSDL, createClient} from 'soap';
import { AxiosInstance } from 'axios';
import { Buffer } from 'buffer';


//import * as express from 'express';
//import { ConsoleReporter } from 'jasmine';
require('request').debug = true;
const soapRequest = require('easy-soap-request');
const fs = require('fs');
var path = require('path');
//var soap = require('soap');



export default class WebServiceSap
{   
    

    //utilizando ngx-soap
    // example(){
    // //    console.log("-------------------------------------------------------------");
    // //     var options = { 
    // //             'Content-Type':  'application/xml',
    // //             'Authorization':  'Basic QUNBQkFMTEVSTzpzZWlkb3IwMQ=='
    // //             };
    // //     var url = '/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs?sap-client=200'
    // //     this.soap.createClient(url,options).then(client =>{
    // //         console.log("/*/*/*/*/*//*/*/*/*/"+client);
    // //     });


    // }


    //example how HTTP
    // example(){
    //     var url = 'http://ecc-go.net.mx:8000/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs?sap-client=200';
    //     function saveDataFunction(pSession, pDescription, pData, cbSuccess, cbError) {
    //         http({
    //             url: url,
    //             method: 'POST',
    //             headers: {
    //                 'Host': 'ecc-go.net.mx',
    //                 'Content-Type': 'text/xml; charset=utf-8'
                    
    //             },
    //             data: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">'+
    //             '<soapenv:Header/>'+
    //             '<soapenv:Body>'+
    //                '<urn:ZgetCompany>'+
    //                   '<!--Optional:-->'+
    //                   '<IParameter1></IParameter1>'+
    //                '</urn:ZgetCompany>'+
    //             '</soapenv:Body>'+
    //          '</soapenv:Envelope>'
    //         })
    //         .then(cbSuccess, cbError);
    //     }
    // }




    //ejemplo con SOAP STRONG
    // example(){
    //     "use strict";
      
    //     var soap = require('strong-soap').soap;
        
    //     // wsdl of the web service this client is going to invoke. For local wsdl you can use, url = './wsdls/stockquote.wsdl'
    //     var url = 'http://ecc-go.net.mx:8000/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs?sap-client=200';

    //     var auth1 =  new soap.BasicAuthSecurity('ACABALLERO', 'seidor01');
    //     var auth = "Basic " + Buffer.from("ACABALLERO" + ":"+ "seidor01").toString("base64");

    //     var options = { 
    //     //     wsdl_headers:{syscall : 'ZgetCompany',
    //     //     'Accept-Encoding':'gzip,deflate',
    //     //     Connection:'Keep-Alive',
    //     //     'Content-Length':'319',
    //     //     'Content-Type' : 'application/soap+xml;charset=UTF-8;action="urn:sap-com:document:sap:soap:functions:mc-style:ZWS_BUKRS:ZgetCompanyRequest"',
    //     //     Endpoint: 'http://ecc-go.net.mx:8000/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs',
    //     //     Interface : 'ZWS_BUKRS_soap12',
    //     //     Operation : 'ZgetCompany',
    //     //     Security : {Username: 'ACABALLERO', Password:'seidor01'}
    //     // }
    // };
       
    //     // console.log(auth);

    //     var args = {
    //         IParameter1 : '0MB1'
    //     }
       
    //         //var args = {name: 'value'};
    //         soap.createClient(url, options,function(err, client) {
    //             client.setEndpoint("/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs");
    //             client.setSOAPAction("urn:sap-com:document:sap:soap:functions:mc-style:ZWS_BUKRS:ZgetCompanyRequest");
                
    //             client.setSecurity(new soap.BasicAuthSecurity("ACABALLERO", "seidor01"));
    //             console.log(err);
    //             console.log(client);
    //             //var method = client['soapenv:Envelope']['soapenv:Header']['soapenv:Body']['urn:ZgetCompany']['IParameter1']
    //             client.ZgetCompany(args, function(err, result) {
    //                 console.log(result);
    //             });
    //         });
        

        
    // }
    




    //ejemplo de NPM sopa
    // example(){
    //     var url = path.join(__dirname, 'test', 'XMLREQUEST.wsdl');
    //     var params = require('../test/paramsrequest.js');
    //     http://ecc-go.net.mx:8000/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/ztest_get4/200/ztest_get4/ztest_get4?sap-client=200
    //     var url = 'http://ecc-go.net.mx:8000/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_bukrs/200/zws_bukrs/zws_bukrs?sap-client=200';
        
     

    //     soap.createClient(url,{Username:'ACABALLERO', Password: 'seidor01', IParameter1:''},(err, client) =>{
    //         console.log(err);
    //         console.groupCollapsed(client);
    //         try{
    //             console.log("--Ya tenemos la conexion--");
    //             client.setSecurity(new soap.NTLMSecurity('ACABALLERO', 'seidor01', '', ''));
    //             client.createClient((err, res) =>{
    //                 if(err){
    //                     console.log(err);
    //                 }else{
    //                     console.log(res);
    //                 }
                    
    //             });
    //         }catch(e){
    //             console.log(e);
    //         }
            
            
    //     });


    //     var args = {Username: 'ACABALLERO', Password: 'seidor01'};
    //     soap.createClient(url,'ACABALLERO', 'seidor01').then((client) => {
    //         return client.add(args);
    //       }).then((result) => {
    //         console.log(result);
    //       });
    // }




    //ejemplo de NPM easy-soap-request
    // example(){
    //     // example data
    //     const url = 'http://ecc-go.net.mx:8000/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/ztest_get4/200/ztest_get4/ztest_get4?sap-client=200';
    //     const headers = {
    //         'Content-Type': 'text/xml;charset=UTF-8',
    //         'User-Agent': 'ACABALLERO',
    //         'soapAction': "http://ecc-go.net.mx:8000/sap/bc/srt/rfc/sap/ztest_get4/200/ztest_get4/ztest_get4" 
    //     };

    //     // const xml = fs.readFileSync('../test/XMLREQUEST.xml', 'utf-8');
        
    //     const xml = `http://ecc-go.net.mx:8000/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/ztest_get4/200/ztest_get4/ztest_get4?sap-client=200`;
                    
    //     const endP = 'http://ecc-go.net.mx:8000/sap/bc/srt/rfc/sap/ztest_get4/200/ztest_get4/ztest_get4';
    //     const user = 'ACABALLERO';
    //     const pass = 'seidor01';
        

    //     // usage of module
    //     (async () => {
    //         try {
    //           const { response } = await soapRequest(url, headers, xml);
    //           console.log("Esta es la respuesta-->"+response);
    //           const { body,statusCode } = response;
    //           console.log("Este es el Body"+body);
    //           console.log("Este es el codigo de Status"+statusCode);
    //           //expect(statusCode).to.not.be.equal(200);
    //         } catch (e) {
    //           // Test promise rejection for coverage
    //           console.log("-----------------------------/O.O/" + e);
    //         }
    //       })();
    //     // (async () => {
    //     // const { response } = await soapRequest(url, headers, xml, user, pass); // Optional timeout parameter(milliseconds)
    //     // const { body, statusCode } = response;
    //     // console.log(body);
    //     // console.log(statusCode);
    //     // })();
    // }


}

