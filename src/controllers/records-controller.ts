import { AuthenticatedRequest } from "@/middlewares";
import recordsService from "@/services/records-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getCredentials(req: AuthenticatedRequest, res: Response){
    const {userId} = req

    try{
        const records = await recordsService.listRecords(res, userId);
        return res.status(httpStatus.OK).send(records);

    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function getCredentialsById(req: AuthenticatedRequest, res: Response){
    const {userId} = req
    const { id } = req.params;

    try{
        const records = await recordsService.listRecordsById(res, userId, id);
        return res.status(httpStatus.OK).send(records);

    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}