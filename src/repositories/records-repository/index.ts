import { prisma } from '@/config';

async function getRecords(userId: number) {
  return prisma.credential.findMany({
    where:{
      userId
    }
  });
}
async function getRecordById(userId: number, id: number) {
  const record = await prisma.credential.findUnique({
    where: {
      id,
    },
  });

  if (!record || record.userId !== userId) {
    return null;
  }

  return record;
}


const recordsRepository = {
    getRecords,
    getRecordById
};

export default recordsRepository;
