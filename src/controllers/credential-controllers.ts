import { AuthenticatedRequest } from "@/middlewares";
import { create } from "@/protocols";
import credentialsService from "@/services/credential-service";
import { Credential } from "@prisma/client";
import {  Response } from "express";
import httpStatus from "http-status";

export async function postCreateCredencial(req: AuthenticatedRequest, res: Response){
    const {title, url, username, password} = req.body as create
    const {userId} = req
    const data = {title, url, username, password,userId}
    try{
        const credential = await credentialsService.credentialCreate(res, data);
        return res.sendStatus(httpStatus.CREATED).send(credential);

    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}
export async function deleteCredential(req: AuthenticatedRequest, res: Response){
    const {userId} = req
    const { id } = req.params;

    try{
       await credentialsService.deleteCredentialById(res, userId, id);
        return res.sendStatus(httpStatus.ACCEPTED);

    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}


