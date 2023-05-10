import supertest from 'supertest';
import { Express } from 'express';
import httpStatus from 'http-status';
import app, { init } from '@/app';
import { cleanDb, generateTokenReal, generateValidToken } from '../helpers';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { createUser } from '../factories';
import { createCredentialTest } from '../factories/credentials-factory';
import { credentialTest } from '@/protocols';
import jwt from 'jsonwebtoken';
import { prisma } from '@/config';


const baseURL = '/credential';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("when token isnt valid", ()=>{
  it('should respond Unauthorized if no token', async ()=> {
    const response = await server.post(baseURL);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED)
  })
})

describe('when token is valid', () => {
  let user: User;
  let token: string;

  beforeAll(async () => {
    user = await createUser();
    token = await generateValidToken(user.id);
  });

  it('should respond with status 400 when body is not given', async () => {
    const response = await server.post(baseURL)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });
  
  it('should respond with status 400 when body is not valid', async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
    const response = await server.post(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 201 when created credential', async () => {
    const credentia = {
      title: 'Central Functionality ',
      url: 'https://loremflickr.c',
      username: 'Ransom',
      password: 'hashedPassword'
    };
    const user: User = await createUser()
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    const response = await server.post(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send(credentia);
    
    expect(response.status).toBe(httpStatus.CREATED);
    
  });

  it('should return CONFLICT status when the title is not unique', async () => {
    const credential = {
      title: 'Central Functionality Producer',
      url: 'https://loremflickr.com/640/480',
      username: 'Ransom',
      password: 'hashedPassword'
    };
    const user: User = await createUser()
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    const firstTry = await server.post(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send(credential);

    expect(firstTry.status).toEqual(httpStatus.CREATED);

    const secondTry = await server.post(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send(credential);

    expect(secondTry.status).toEqual(httpStatus.CONFLICT);
    expect(secondTry.body.message).toEqual('title must be unique');
  });

  it("delete credential, it should return 202", async () => {
    const credential = {
      title: 'Central Functionality ',
      url: 'https://loremflickr.c',
      username: 'Ransom',
      password: 'hashedPassword'
    };
    const user: User = await createUser()
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
     await server.post(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send(credential);
      const cred = await prisma.credential.findFirst({
        where:{
          title: credential.title
        }
      })
    const response = await server.delete(`/credential/${cred.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(credential);
    
  
    expect(response.status).toBe(httpStatus.ACCEPTED);
  
  })
  
});