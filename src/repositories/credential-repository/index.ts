import { prisma } from '@/config';
import { credent } from '@/protocols';

async function createCredential(data: credent) {
  return prisma.credential.create({
    data,
  });
}

async function findManyCredencials(url: string) {
    return prisma.credential.findMany({
      where:{
        url
      },
    });
}
async function findManyCredencialsTitle(title: string) {
    return prisma.credential.findMany({
      where:{
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
