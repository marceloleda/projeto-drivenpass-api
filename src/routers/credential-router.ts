import { Router } from "express";
import { authenticateToken, validateBody } from '@/middlewares';
import { deleteCredential, postCreateCredencial } from "@/controllers";
import { credentialSchema } from "@/schemas";


const credentialRouter = Router();

credentialRouter.all('/*', authenticateToken)
.post('/', validateBody(credentialSchema), postCreateCredencial)
.delete('/:id', deleteCredential)


export { credentialRouter}

