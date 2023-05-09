import { prisma } from '@/config';
import { create, credent } from '@/protocols';

async function createCredential(data: create, encryptedPassword: string) {
  return prisma.credential.create({
    data: {
      ...data,
      password: encryptedPassword
    },
  });
}

async function findManyCredencials(url: string, userId: number) {
    return prisma.credential.findMany({
      where:{
        userId,
        url
      },
    });
}
async function findManyCredencialsTitle(title: string, userId: number) {
    return prisma.credential.findMany({
      where:{
        userId,
        title
      },
    });
}  

const credentialRepository = {
    createCredential,
    findManyCredencials,
    findManyCredencialsTitle,
};

export default credentialRepository;
