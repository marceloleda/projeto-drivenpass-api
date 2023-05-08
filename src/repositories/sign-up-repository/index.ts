import { Prisma } from "@prisma/client";
import { prisma } from '@/config';

  

async function create(email: string, hash: string) {
    return prisma.user.create({
      data:{
        email: email,
        password: hash
      }
    });
}
  
const signUpRepository = {
    create,
};
  
  
  export default signUpRepository;
  