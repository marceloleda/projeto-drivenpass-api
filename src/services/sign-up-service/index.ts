import { SignInParams, invalidCredentialsError } from "../authentication-service";
import userRepository from "@/repositories/user-repository.ts";
import bcrypt from 'bcrypt';
import { conflictError, notFoundError } from "@/errors";
import signUpRepository from "@/repositories/sign-up-repository";
import { Prisma } from "@prisma/client";
import { Response } from "express";
import httpStatus from "http-status";



async function signUp(res: Response,params: SignInParams) {
    const { email, password } = params;
  
    await checkIfEmailExists(res,email);

    const hash = await hashPassword(password);
    const data = {email, password: hash}
    const createdUser = await signUpRepository.create(data);
  
    return createdUser;
}

async function checkIfEmailExists(res: Response, email: string) {
  const existingUser = await signUpRepository.findByEmail(email);
  if(existingUser){
    return res.sendStatus(httpStatus.CONFLICT)
  }
}

async function hashPassword(password?: string): Promise<string> {
  if (!password) {
    throw notFoundError();
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}


const signUpService = {
  signUp,
};
export default signUpService;