import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { Network } from '@prisma/client';
import { prisma } from '@/config';
import { createUser } from './users-factory';

export async function createNetworkTest(params: Partial<Network> = {}): Promise<Network> {
    const incomingPassword = params.password || faker.internet.password(6);
    const hashedPassword = await bcrypt.hash(incomingPassword, 10);
    const user = await createUser();
  
    return prisma.network.create({
      data: {
        title: params.title || faker.lorem.word(),
        network: params.network || faker.internet.url(),
        password: hashedPassword,
        userId: params.id || user.id
        }
      
    });
  }
  
