import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { Credential } from '@prisma/client';
import { prisma } from '@/config';
import { createUser } from './users-factory';

export async function createCredentialTest(params: Partial<Credential> = {}): Promise<Credential> {
  const incomingPassword = params.password || faker.internet.password(6);
  const hashedPassword = await bcrypt.hash(incomingPassword, 10);
  const user = await createUser();
  return prisma.credential.create({
    data: {
      title: params.title || faker.lorem.word(),
      url: params.url || faker.internet.url(),
      username: params.username || faker.internet.userName(),
      password: hashedPassword,
      user: {
        connect: {
          id: user.id
        }
      }
    }
  });
}

