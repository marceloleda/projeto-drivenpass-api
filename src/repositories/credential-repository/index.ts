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
async function deleteById(userId: number, id: number) {
  const credential = await prisma.credential.delete({
    where: {
      id,
    },
  });

  if (!credential || credential.userId !== userId) {
    return null;
  }

  return credential;
}

const credentialRepository = {
    createCredential,
    findManyCredencials,
    findManyCredencialsTitle,
    deleteById
};

export default credentialRepository;
