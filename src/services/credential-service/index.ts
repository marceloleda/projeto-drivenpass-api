import { credent } from "@/protocols";
import credentialRepository from "@/repositories/credential-repository";
import { Response } from "express";
import httpStatus from "http-status";



async function credentialCreate(res: Response, data: credent) {
    const quantityCredencial = await credentialRepository.findManyCredencials(data.url)
    const titleCredencial = await credentialRepository.findManyCredencialsTitle(data.title)
    console.log(titleCredencial.length)

    if(quantityCredencial.length > 2 && titleCredencial.length < 1){
        console.log(quantityCredencial)
        const credential = await credentialRepository.createCredential(data)
        return credential
        
    }
}


const credentialsService = {
    credentialCreate,
};
export default credentialsService;