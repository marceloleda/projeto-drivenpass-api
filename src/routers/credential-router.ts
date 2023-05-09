import { Router } from "express";
import { authenticateToken, validateBody } from '@/middlewares';
import { deleteCredential, postCreateCredencial } from "@/controllers";


const credentialRouter = Router();

credentialRouter.all('/*', authenticateToken)
.post('/', postCreateCredencial)
.delete('/:id', deleteCredential)


export { credentialRouter}

