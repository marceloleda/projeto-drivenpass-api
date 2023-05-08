import { postSignIn } from "@/controllers";
import { Router } from "express";
import { validateBody } from '@/middlewares';
import { signInSchema } from '@/schemas';


const authenticationRouter = Router();

authenticationRouter.post('/sign-in', validateBody(signInSchema), postSignIn)

export { authenticationRouter}

validateBody(signInSchema)