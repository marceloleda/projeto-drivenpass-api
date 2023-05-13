import { AuthenticatedRequest } from "@/middlewares";
import { networkCreat } from "@/protocols";
import networkService from "@/services/netwok-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function createNetwork(req: AuthenticatedRequest, res: Response){
    const {title, network, password} = req.body as networkCreat
    const {userId} = req
    const data = {title,network, password, userId}
    try{
        const credential = await networkService.networkCreate(res, data);
        return res.sendStatus(httpStatus.CREATED).send(credential);

    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}
export async function getNetworks(req: AuthenticatedRequest, res: Response){
    const {userId} = req

    try{
        const records = await networkService.listNetworks(res, userId);
        return res.status(httpStatus.OK).send(records);

    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function findNetworksById(req: AuthenticatedRequest, res: Response){
    const {userId} = req
    const { id } = req.params;

    try{
        const netwok = await networkService.listNetworkById(res, userId, id);
        return res.status(httpStatus.OK).send(netwok);

    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function deleteWifi(req: AuthenticatedRequest, res: Response){
    const {userId} = req
    const { id } = req.params;

    try{
        await networkService.deleteWifiById(res, userId, id);
        return res.sendStatus(httpStatus.ACCEPTED);

    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

