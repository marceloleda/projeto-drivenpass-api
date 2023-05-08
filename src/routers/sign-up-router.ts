import { Router } from "express";
import { validateBody } from '@/middlewares';
import { signUpSchema } from '@/schemas';
import { postSignUp } from "@/controllers";


const signUpRouter = Router();

signUpRouter.post('/', validateBody(signUpSchema), postSignUp)

export { signUpRouter}
validateBody(signUpSchema)
