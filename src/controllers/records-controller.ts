import recordsService from "@/services/records-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getRecords(req: Request, res: Response){
    try{
        const records = await recordsService.listRecords(res);
        return res.sendStatus(httpStatus.OK).send(records);

    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

