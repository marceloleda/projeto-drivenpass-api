import { SignInParams } from "@/services";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function postSignUp(req: Request, res: Response){
    const { email, password } = req.body as SignInParams;
    try{
        const result = await signUpService.signUp({ email, password });
        return res.status(httpStatus.CREATED).send(result);

    }catch(error){
        return res.status(httpStatus.UNAUTHORIZED).send({});
    }
}

