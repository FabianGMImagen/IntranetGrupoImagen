import { Console } from 'console';
import TokenService from '../services/TokenService';



    function isAuthToken(req, resp, next){
        var token = '';
        const Service_Token = new TokenService()
        //console.log("pasando por el middleware de Backend");
        //console.log(req.headers)
        if(!req.headers.authorization){
            return resp.status(403).send({message: 'No tienes Autorizacion para continuar, inicia de nuevo'})
        }
        //decodificamos el Token para pasarlo al servicio (por default caundo se envia un token comienza con Bearer_Token)
        //se splitea el token para separar la palabra Bearer y tomamos unicamente el Token
        token = req.headers.authorization.split(' ')[1];
        //cosultamos el servicio y le pasamos el token ya decodificado
        Service_Token.decodeToken(token).then(res =>{
            //console.log("TOKEN Valido, se desencriptara...");
            //pasamos la respuesta de el servicio a una variable y la ocuparemos para saber si existe ese usuario en la base de datosy el id de ese User en la DB
            //console.log(res);
            console.log("----Se puede continuar----");
            //var pass = '';
            //console.log('Id desde el middleware----->');
            //console.log(usr);
            next();
        }).catch(err =>{
            //encontramos un error ... y se manda un mensaje
            console.log('hay un error --->' + err)
            resp.status(404).send({message: 'La Autorizacion es Invalida o a sido modificado, inicia de nuevo por favor'})
        })
    }

module.exports = isAuthToken;