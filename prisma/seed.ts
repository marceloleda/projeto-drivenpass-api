import { prisma,connectDb, disconnectDB } from '../src/config/database';
import { error } from 'console';
import {faker } from '@faker-js/faker';
import { sellers } from '@prisma/client';


type sellersParams = Pick<sellers, 'name' | 'email' | 'key_password' | "phone_number" | "cpf">;

async function main() {
    connectDb();
    const data: sellersParams[] = [];
  
    for (let i = 0; i < 4; i++) {
      const name = faker.name.firstName();
      const email = faker.internet.email();
      const key_password = faker.internet.password();
      const phone_number = faker.phone.number();
      const cpf = faker.address.zipCode();
  
      data.push({
        name,
        email,
        key_password,
        phone_number,
        cpf,
      });
    }
  
    await prisma.sellers.createMany({
      data,
    });

    disconnectDB();

  }
main()
  .then(()=> {
    console.log("Dados mocados criados com sucesso!!!")
  })
  .catch(err => {
    console.log(error(err))
    process.exit(1)
  })
  .finally(async ()=> {
    await prisma.$disconnect();
  })
