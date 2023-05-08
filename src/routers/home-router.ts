import { Router } from "express";
import { authenticateToken, validateBody } from '@/middlewares';
import { getRecords } from "@/controllers/records-controller";


const homeRouter = Router();

homeRouter.get('/', authenticateToken, getRecords)

export { homeRouter}

