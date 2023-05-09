import recordsRepository from "@/repositories/records-repository";
import { Credential } from "@prisma/client";
import { Response } from "express";
import httpStatus from "http-status";
import Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.CRYPTR, { pbkdf2Iterations: 10000, saltLength: 10 });


async function listRecords(res: Response, userId: number) {
    if(!userId){
        return res.sendStatus(httpStatus.UNAUTHORIZED)
    }

    const records: Credential[] = await recordsRepository.getRecords(userId)
    if(!records || records.length === 0){
        return res.status(httpStatus.NOT_FOUND).send({message: "there is no credentials registered"})
    }
    const decryptRecords = records.map((record)=>{
        const decryptedPassword = cryptr.decrypt(record.password)
        return {...record, password: decryptedPassword}
    })

    return decryptRecords
}
async function listRecordsById(res: Response, userId: number, id:string) {
    const credentialId = parseInt(id, 10);
    if(!userId){
        return res.sendStatus(httpStatus.UNAUTHORIZED)
    }
    const record: Credential = await recordsRepository.getRecordById(userId, credentialId);
    
    if(!record || record === null){
        return res.sendStatus(httpStatus.NOT_FOUND)
    }
    const decryptedPassword = cryptr.decrypt(record.password);
    const decryptedRecord = { ...record, password: decryptedPassword };

    return decryptedRecord
}


const recordsService = {
    listRecords,
    listRecordsById,
};
export default recordsService;