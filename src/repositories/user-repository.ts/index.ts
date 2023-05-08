import { prisma } from '@/config';


async function findByEmail(email: string) {
  const validEmail = await prisma.user.findFirst({
    where: { email: email }
  });

  return validEmail;
}


const userRepository = {
  findByEmail,
};


export default userRepository;
