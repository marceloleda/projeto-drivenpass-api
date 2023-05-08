import { Router } from "express";
import { authenticateToken, validateBody } from '@/middlewares';
import { getRecords } from "@/controllers";


const homeRouter = Router();

homeRouter.get('/', authenticateToken, getRecords)

export { homeRouter}

