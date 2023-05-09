import { AuthenticatedRequest } from "@/middlewares";
import { create, credent } from "@/protocols";
import credentialsService from "@/services/credential-service";
import {  Response } from "express";
import httpStatus from "http-status";

export async function postCreateCredencial(req: AuthenticatedRequest, res: Response){
    const {title, url, username} = req.body as create
    const {userId} = req
    const data = {title, url, username, userId}
    try{
        const credential = await credentialsService.credentialCreate(res, req, data);
        return res.sendStatus(httpStatus.CREATED).send(credential);

    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

