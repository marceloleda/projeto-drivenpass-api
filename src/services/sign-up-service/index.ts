import { SignInParams, invalidCredentialsError } from "../authentication-service";
import userRepository from "@/repositories/user-repository.ts";
import bcrypt from 'bcrypt';
import { GetUserOrFailResult } from "@/protocols";
import { conflictError } from "@/errors";
import signUpRepository from "@/repositories/sign-up-repository";



async function signUp(params: SignInParams): Promise<any> {
    const { email, password } = params;
  
    const userEmail: string = await userExist(email);
  
    const hash = await validatePasswordOrFail(password);
    const createUser = await signUpRepository.create(userEmail, hash)
  
    return createUser
}

async function userExist(email: string): Promise<any> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw  conflictError("Email aready exist!");

  return user;
}


async function validatePasswordOrFail(password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return hashedPassword;
}



const signUpService = {
  signUp,
};
export default signUpService;