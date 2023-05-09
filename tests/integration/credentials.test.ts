import {faker} from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';

import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';
import app, { init } from '@/app';
import { createUser } from '../factories';
import credentialsService from '@/services/credential-service';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);
const request = supertest;
const baseURL = '/credential';

describe('/postCreateCredencial', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get(baseURL);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get(baseURL).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get(baseURL).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 204 when there is no enrollment for given user', async () => {
      const token = await generateValidToken();

      const response = await server.get(baseURL).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NO_CONTENT);
    });


  it('should return CREATED status and the created credential when the request is valid', async () => {
    // Arrange
    const user = await createUser();
    const token = generateValidToken(user);
    const credential = {
      title: faker.lorem.words(),
      url: faker.internet.url(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };
    const data = { ...credential, userId: user.id };

    // Act
    const response = await request(server)
      .post(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    // Assert
    expect(response.status).toEqual(httpStatus.CREATED);
    expect(response.body.title).toEqual(credential.title);
    expect(response.body.url).toEqual(credential.url);
    expect(response.body.username).toEqual(credential.username);
  });

  it('should return UNPROCESSABLE_ENTITY status when the maximum limit of credentials per site is reached', async () => {
    // Arrange
    const user = await createUser();
    const token = generateValidToken(user);
    const url = faker.internet.url();
    const title = faker.lorem.words();
    const data = {
      title,
      url,
      username: faker.internet.userName(),
      password: faker.internet.password(),
      userId: user.id,
    };

    await credentialsService.credentialCreate({} as any, {} as any, { ...data, userId: user.id });
    await credentialsService.credentialCreate({} as any, {} as any, { ...data, userId: user.id });

    // Act
    const response = await request(server)
      .post(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    // Assert
    expect(response.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
    expect(response.body.message).toEqual('maximum limit of credentials reached per site');
  });

  it('should return CONFLICT status when the title is not unique', async () => {
    // Arrange
    const user = await createUser();
    const token = generateValidToken(user);
    const title = faker.lorem.words();
    const url = faker.internet.url();
    const data = {
      title,
      url,
      username: faker.internet.userName(),
      password: faker.internet.password(),
      userId: user.id,
    };

    await credentialsService.credentialCreate({} as any, {} as any, { ...data, userId: user.id });

    // Act
    const response = await request(server)
      .post(baseURL)
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    // Assert
    expect(response.status).toEqual(httpStatus.CONFLICT);
    expect(response.body.message).toEqual('title must be unique');
  });
});

