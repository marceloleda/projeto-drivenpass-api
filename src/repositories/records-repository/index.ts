import { prisma } from '@/config';

async function getRecords() {
  return prisma.credential.findMany();
}

const recordsRepository = {
    getRecords,
};

export default recordsRepository;
