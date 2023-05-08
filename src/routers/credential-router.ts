import { Router } from "express";
import { authenticateToken, validateBody } from '@/middlewares';
import { postCreateCredencial } from "@/controllers";


const credentialRouter = Router();

credentialRouter.post('/', authenticateToken, postCreateCredencial)

export { credentialRouter}

