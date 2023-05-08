import { Router } from "express";
import { validateBody } from '@/middlewares';
import { signInSchema } from '@/schemas';
import { postSignUp } from "@/controllers";


const signUpRouter = Router();

signUpRouter.post('/', validateBody(signInSchema), postSignUp)

export { signUpRouter}

validateBody(signInSchema)