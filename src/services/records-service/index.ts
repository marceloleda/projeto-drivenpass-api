import recordsRepository from "@/repositories/records-repository";
import { Response } from "express";
import httpStatus from "http-status";


async function listRecords(res: Response) {
    const records = await recordsRepository.getRecords()
    if(!records || records.length === 0){
        return res.sendStatus(httpStatus.NOT_FOUND)
    }
    return records
}


const recordsService = {
    listRecords,
};
export default recordsService;