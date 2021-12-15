import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';




import setRoutes from './routes';
//import { ConsoleReporter } from 'jasmine';


var cors = require('cors');
var httpProxy = require('http-proxy');

const app = express();

console.log("---------------ENTRANDO AL NodoJS-APP----------------");

//autorizacion anterior de server pruebas
//'authorization' :'Basic QUNBQkFMTEVSTzpzZWlkb3IwMQ=='

app.use(cors())
dotenv.config({ path: '.env' });
app.set('port', (process.env.PORT || 3000));
app.use(morgan('dev'));


app.use (express.json ()); 
app.use (express.urlencoded ()); 
app.use(express.static('datos'));
app.use('/public', express.static('datos'));

app.use (function (req, res, next) { 
  res.header ("Access-Control-Allow-Origin", "*"); 
  res.header ("Access-Control-Allow-Headers", "Origin, X -Required-With, Content-Type, Accept "); 
  next (); 
});
  




app.use('/', express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//app.use('../data', express.static(process.cwd() + '../data')); 

var proxy = require('http-proxy-middleware');
//var auth = 'WEFDQUJBTExFUk86U2VpZG9yMDgq';//contraseña para conectar a sap
// var buf = btoa("XACABALLERO:Seidor12*");
//     console.log("       "+ buf + "    ");

app.get('/ps', function(req, res){
console.log(req);
});
var buf = process.env.SECRET_SAP;
var newnuf  = Buffer.from(buf).toString('base64');
//var auth = 'WEFDQUJBTExFUk86U2VpZG9yMTIq';//contraseña para conectar a sap
var auth = newnuf;//contraseña para conectar a sap
console.log(process.env.SECRET_SAP);
//var buf = btoa("INTRANCOMUNI:Intr4netC01"); --> para QIM Calidad
//var buf = btoa("INTRANCOMUNI:Intr4netC0"); ---> para PIM Produccion


//LINK DE CALIDAD PARA QIM (CALIDAD) -->http://smxcrqim.grupoempresarialangeles.com.mx:8025/sap/bc/srt/wsdl/flv_10002A10MAD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320

//LINK DE PRODUCi PARA PIM (PRODUCC) -->http://smxcrpim.grupoempresarialangeles.com.mx:8035/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320
//el interceptor envia a el app.ts de nodejs y node lo interpreta y le a
//se envia doble autorizacion en la seccion de authorization y en normalizeName (si alguno de estos 2 es null o no existe no anlazara con con grupoempresarial)
//nota para otros casos con mandar authorization y la contraseña en ASCCI es mas que suficiente.
//LINK DE CALIDAD PARA QIM (CALIDAD)       -->http://smxcrqim.grupoempresarialangeles.com.mx:8025/sap/bc/srt/wsdl/flv_10002A10MAD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320

//LINK DE PRODUCCION PARA PIM (PRODUCCION) -->http://smxcrpim.grupoempresarialangeles.com.mx:8035/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zws_sap_in/320/zws_sap_in/zws_sap_in?sap-client=320
//const URL = 'http://smxcrpim.grupoempresarialangeles.com.mx:8035';
const URL = 'http://smxcrpim.grupoempresarialangeles.com.mx:8034';
app.use('/sap', proxy({ target: URL,
                        changeOrigin: true, 
                        logLevel: 'debug',
                        headers:{
                        'authorization' : 'Basic ' + auth,
                        'normalizeNames' : 'Basic' + auth}
                      }) );

    setRoutes(app);

    app.get('/*', function(req, res) {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    if (!module.parent) {
      app.listen(app.get('port'), () => {
        console.log('Angular Full Stack listening on port ' + app.get('port'));
      });
    }

    
    
  
// let mongodbURI;
// if (process.env.NODE_ENV === 'test') {
//   mongodbURI = process.env.MONGODB_TEST_URI;
// } else {
//   mongodbURI = 'mongodb://localhost:27017/angularfullstack';
//  // mongodbURI = process.env.MONGODB_URI;
//   app.use(morgan('dev'));
// }

// console.log("===============================================" + mongodbURI);

// //mongodbURI = 'mongodb://localhost:27017/angularfullstack';
// console.log("===============================================22222222222222222=====" + mongodbURI);
// mongoose.Promise = global.Promise;
// const mongodb = mongoose.connect(mongodbURI);

// mongodb
//   .then((db) => {
//     console.log('Connected to MongoDB');

//     setRoutes(app);

//     app.get('/*', function(req, res) {
//       res.sendFile(path.join(__dirname, '../public/index.html'));
//     });

//     if (!module.parent) {
//       app.listen(app.get('port'), () => {
//         console.log('Angular Full Stack listening on port ' + app.get('port'));
//       });
//     }

//   })
//   .catch((err) => {
//     console.error(err);
// });







export { app };
