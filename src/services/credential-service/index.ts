import { create } from "@/protocols";
import credentialRepository from "@/repositories/credential-repository";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.CRYPTR, { pbkdf2Iterations: 10000, saltLength: 10 });



async function credentialCreate(res: Response, req: Request, data: create) {
    const {password} = req.body
    const quantityCredencial = await credentialRepository.findManyCredencials(data.url, data.userId)
    const titleCredencial = await credentialRepository.findManyCredencialsTitle(data.title, data.userId)
    console.log(quantityCredencial.length)
    if(quantityCredencial.length >= 2 ){
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).send({
            message: "maximum limit of credentials reached per site"
        })
    }
    if(titleCredencial.length === 1){
        return res.status(httpStatus.CONFLICT).send({
            message: "title must be unique"
        })
    }
    const encryptedPassword: string = cryptr.encrypt(password);

    const credential = await credentialRepository.createCredential(data, encryptedPassword)
    return credential
        
}


const credentialsService = {
    credentialCreate,
};
export default credentialsService;