import { Router } from "express";
import { authenticateToken, validateBody } from '@/middlewares';
import { createNetwork, deleteWifi, findNetworksById, getNetworks} from "@/controllers";
import { networkSchema } from "@/schemas";


const networkRouter = Router();

networkRouter.all('/*', authenticateToken)
.post('/',validateBody(networkSchema), createNetwork)
.get('/', getNetworks)
.get('/:id', findNetworksById)
.delete('/:id', deleteWifi)

export { networkRouter}

