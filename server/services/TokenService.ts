import { rejects } from 'assert';
import * as jwt from 'jsonwebtoken';
const moment = require('moment')


export default class TokenServ{

    CreatNewToken(id){
        const playload = {
            sub: id, //id de Usuario de Base de Datos
            iat: moment().unix(), //cuando fue creado el token (moment nos da la fecha en la que se esta creando el token)
            exp: moment().add(1, 'days').unix(), //cuando va a expirar el token, solo se agrega un dia al momento actual.
        }
        return jwt.sign(playload, process.env.SECRET_TOKEN);
    }


    decodeToken(Token){
        const decode_Token = new Promise ((resolve, reject) =>{
            try{
                const decode = jwt.verify(Token, process.env.SECRET_TOKEN);
                //console.log(decode);
                 //validamos si el tokne no ha expirado (si es menor o igual a el momento en el que se esta consultando)
                if(decode.exp <= moment().unix()){
                    //reject es el sustituto de un objeto de tipo error con status y un mensaje dentro de una promise
                    reject({status: 401, message: 'El Token ha Expirado'})
                }
                //console.log("se resolvio correctamente el TOKEN puedes continuar");
                resolve(decode.sub);
            }catch(err){
                reject({status: 500, message: 'invalid token'})
            }
            
        })
        return decode_Token;
    }
}