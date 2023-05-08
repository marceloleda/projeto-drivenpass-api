import { SignInParams } from "@/services";
import signUpService from "@/services/sign-up-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function postSignUp(req: Request, res: Response){
    const { email, password } = req.body as SignInParams;
    try{
        await signUpService.signUp(res,{email, password });
        return res.sendStatus(httpStatus.CREATED);

    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

