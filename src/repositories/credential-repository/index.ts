import { prisma } from '@/config';
import { create } from '@/protocols';

async function createCredential(data: create, encryptedPassword: string) {
  const create =  await prisma.credential.create({
    data: {
      ...data,
      password: encryptedPassword
    },
  });

  return create;
}

async function findManyCredencials(url: string, userId: number) {
    const findCredent = await prisma.credential.findMany({
      where:{
        userId,
        url
      },
    });
  return findCredent;
}
async function findManyCredencialsTitle(title: string, userId: number) {
    const findMany = await prisma.credential.findMany({
      where:{
        userId,
        title
      },
    });
  return findMany;
}  
async function findByUserId(id: number) {
  const find =  await prisma.user.findUnique({
    where: {
      id
    },
  });
  return find;
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
    deleteById,
    findByUserId
};

export default credentialRepository;
