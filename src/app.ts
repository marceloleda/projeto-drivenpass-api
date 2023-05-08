import 'reflect-metadata';
import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';
import { connectDb, disconnectDB } from './config/database';
import { handleApplicationErrors } from './middlewares';
import { 
  authenticationRouter, 
  signUpRouter 
} from './routers';



const app = express();
app
  .use(cors())
  .use(express.json())
  .use('/auth', authenticationRouter)
  .use('/sign-up', signUpRouter)
  .use(handleApplicationErrors);


export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;