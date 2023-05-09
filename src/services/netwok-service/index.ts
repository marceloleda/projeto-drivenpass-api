import { networkCreat } from "@/protocols";
import { Response } from "express";
import Cryptr = require("cryptr");
import networkRepository from "@/repositories/network-repository";
import httpStatus = require("http-status");
import { Network } from "@prisma/client";
import { notFoundError } from "@/errors";
const cryptr = new Cryptr(process.env.CRYPTR, { pbkdf2Iterations: 10000, saltLength: 10 });

async function networkCreate(res: Response, data: networkCreat){
    if(!data.userId){
        return res.sendStatus(httpStatus.UNAUTHORIZED)
    }
    const encryptedPassword: string = cryptr.encrypt(data.password);
    const network = await networkRepository.networkCreate(data, encryptedPassword)
    return network 
}

async function listNetworks(res: Response, userId: number) {
    if(!userId){
        return res.sendStatus(httpStatus.UNAUTHORIZED)
    }
    const networks: Network[] = await networkRepository.findNetworks(userId)
    if(!networks || networks.length === 0){
        return res.sendStatus(httpStatus.NOT_FOUND)
    }
    const decryptnetworks = networks.map((network)=>{
        const decryptedPassword = cryptr.decrypt(network.password)
        return {...network, password: decryptedPassword}
    })
    return decryptnetworks
}
async function listNetworkById(res: Response, userId: number, id:string) {
    const credentialId = parseInt(id, 10);
    if(!userId){
        return res.sendStatus(httpStatus.UNAUTHORIZED)
    }
    const network: Network = await networkRepository.getNetworkById(userId, credentialId);
    
    if(!network || network === null){
        return res.sendStatus(httpStatus.NOT_FOUND)
    }
    const decryptedPassword = cryptr.decrypt(network.password);
    const decryptedRecord = { ...network, password: decryptedPassword };

    return decryptedRecord
}
async function deleteWifiById(res: Response, userId: number, id:string) {
    const credentialId = parseInt(id, 10);
    if(!userId){
        return res.sendStatus(httpStatus.UNAUTHORIZED)
    }
    const findId = await networkRepository.getNetworkById(userId, credentialId);
    
    if(!findId || findId === null){
        return res.sendStatus(httpStatus.NOT_FOUND)
    }    
    const deleteWifi = await networkRepository.deleteNetworkById(userId, credentialId);

    if (!deleteWifi || deleteWifi.userId !== userId) {
        return res.sendStatus(httpStatus.NOT_FOUND)
    }


    return deleteWifi
}

const networkService = {
    networkCreate,
    listNetworks,
    listNetworkById,
    deleteWifiById

};
export default networkService;