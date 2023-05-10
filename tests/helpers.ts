import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

import { createUser } from './factories';
import { prisma } from '@/config';

export async function cleanDb() {
    await prisma.credential.deleteMany({});
    await prisma.network.deleteMany({});
    await prisma.user.deleteMany({});
}

export async function generateValidToken(id?:number) {
  const incomingUser = id || (await createUser());
  const token = jwt.sign({ userId: incomingUser }, process.env.JWT_SECRET);

  return token;
}

export async function generateTokenReal(userId: number){
  const login = userId || (await createUser());
  const token = jwt.sign({ login }, process.env.JWT_SECRET);
  
    return token;

}
