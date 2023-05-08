import { AuthenticatedRequest } from "@/middlewares";
import { credent } from "@/protocols";
import credentialsService from "@/services/credential-service";
import {  Response } from "express";
import httpStatus from "http-status";

export async function postCreateCredencial(req: AuthenticatedRequest, res: Response){
    const {title, url, username, password} = req.body as credent
    const {userId} = req
    const data = {title, url, username, password, userId}
    try{
        const credential = await credentialsService.credentialCreate(res, data);
        return res.sendStatus(httpStatus.CREATED).send(credential);

    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

