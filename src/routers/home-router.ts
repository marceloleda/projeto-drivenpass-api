import { Router } from "express";
import { authenticateToken, validateBody } from '@/middlewares';
import { getCredentials, getCredentialsById } from "@/controllers";


const homeRouter = Router();

homeRouter.all('/*', authenticateToken)
.get('/', getCredentials)
.get('/:id', getCredentialsById);

export { homeRouter}

