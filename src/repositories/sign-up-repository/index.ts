import { prisma } from '@/config';
import {  user } from '@/protocols';
import { Prisma, User } from '@prisma/client';

async function create(data: user) {
    return prisma.user.create({
      data,
    });
}

async function findByEmail(email: string): Promise<User | null>{
  const validEmail = await prisma.user.findFirst({
    where: { email: email }
  });

  return validEmail;
}


  
const signUpRepository = {
    create,
    findByEmail
};
  
  
  export default signUpRepository;
  