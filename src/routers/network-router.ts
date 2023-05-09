import { Router } from "express";
import { authenticateToken, validateBody } from '@/middlewares';
import { createNetwork, deleteWifi, findNetworksById, getNetworks} from "@/controllers";


const networkRouter = Router();

networkRouter.all('/*', authenticateToken)
.post('/', createNetwork)
.get('/', getNetworks)
.get('/:id', findNetworksById)
.delete('/:id', deleteWifi)

export { networkRouter}

