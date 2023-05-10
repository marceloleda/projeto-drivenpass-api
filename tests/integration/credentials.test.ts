import supertest from 'supertest';
import httpStatus from 'http-status';
import app, { init } from '@/app';
import { cleanDb, generateValidToken } from '../helpers';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { createUser } from '../factories';
import jwt from 'jsonwebtoken';
import Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.CRYPTR, { pbkdf2Iterations: 10000, saltLength: 10 });

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
  it('should respond with status 200 when get all credentials', async () => {
    const credential =
      {
        title: 'Central Functionality ',
        url: 'https://loremflickr.c',
        username: 'Ransom',
        password: 'hashedPassword'
      }
    const user: User = await createUser()
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
     await server.post(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send(credential);
      const cred = await prisma.credential.findMany({
        where:{
          userId: user.id
        }
      })
      const array = await server.get('/home')
      .set('Authorization', `Bearer ${token}`)
    
      expect(array.status).toBe(httpStatus.OK);
      expect(cred).toEqual(expect.arrayContaining(cred));
  });
  it('should respond with status 401 when dont exist userId', async () => {
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

});
describe('list Credential', () => {
  it('should return 401 if userId is not provided', async () => {
    const response = await server.get('/home');
    expect(response.status).toBe(401);
  });

  it('should return decrypted credentials if userId is provided', async () => {
    const user = await createUser();
    const credentials = [
      {
        title: 'Central Functionality',
        url: 'https://loremflickr.c',
        username: 'Ransom',
        password: cryptr.encrypt('senha1'),
        userId: user.id,
      },
      {
        title: 'Functionality',
        url: 'https://loremflikr.c',
        username: 'Ransom',
        password: cryptr.encrypt('senha2'),
        userId: user.id,
      },
    ];
    await prisma.credential.createMany({ data: credentials });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    const response = await server.get('/home')
      .set('Authorization', `Bearer ${token}`);
    

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(credentials.length);
    expect(response.body[0].password).toBe('senha1');
    expect(response.body[1].password).toBe('senha2');
  });
});
describe('listRecordsById', () => {
  const userId = '123';
  let credentialId: number;

  beforeAll(async () => {
    const user = await createUser(); 
    const credential = await prisma.credential.create({
      data: {
        userId: user.id,
        title: 'Test Credential',
        url: 'http://test.com',
        username: 'testuser',
        password: 'testpassword',
      },
    });
    credentialId = credential.id;
  });


  it('should return status 404 when the id is invalid', async () => {
    const user: User = await createUser()
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    const response = await server
      .get(`/home/${faker.random.alphaNumeric(4)}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
  it('should return 401 when user is not authenticated', async () => {
    const res = await server.get(`/home/${credentialId}`);
    expect(res.status).toBe(401);
  });
  it('should return 404 when credential is not found', async () => {
    const user = await createUser(); 
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    const res = await server
      .get(`/home/${credentialId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});