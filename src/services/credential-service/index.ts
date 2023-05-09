import { create } from "@/protocols";
import credentialRepository from "@/repositories/credential-repository";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Cryptr = require("cryptr");
import recordsRepository from "@/repositories/records-repository";
import { Credential } from "@prisma/client";
const cryptr = new Cryptr(process.env.CRYPTR, { pbkdf2Iterations: 10000, saltLength: 10 });



async function credentialCreate(res: Response, data:create) {
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
    const encryptedPassword: string = cryptr.encrypt(data.password);

    const credential = await credentialRepository.createCredential(data, encryptedPassword)
    return credential 
}

async function deleteCredentialById(res: Response, userId: number, id:string) {
    const credentialId = parseInt(id, 10);
    if(!userId){
        return res.sendStatus(httpStatus.UNAUTHORIZED)
    }
    const findId = await recordsRepository.getRecordById(userId, credentialId);
    
    if(!findId || findId === null){
        return res.sendStatus(httpStatus.NOT_FOUND)
    }    
    const deleteCredential = await credentialRepository.deleteById(userId, credentialId);


    return deleteCredential
}


const credentialsService = {
    credentialCreate,
    deleteCredentialById,
};
export default credentialsService;