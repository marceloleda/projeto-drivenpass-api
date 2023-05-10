import app, { init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser } from "../factories";
import jwt from 'jsonwebtoken';


const baseURL = '/network';

beforeAll(async () => {
    await init();
  });
const server = supertest(app);
describe("when token dont exist", ()=>{
    it('should respond Unauthorized if no token', async ()=> {
      const response = await server.post(baseURL);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    })
  })
  

describe('when token is valid', () => {

    it('should respond with status 201 when created network', async () => {
        const networkData = {
          title: 'Beber agua',
          network: 'Beba, agora',
          password: 'maikecarls'
        };
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    
        const response = await server.post(baseURL)
          .set('Authorization', `Bearer ${token}`)
          .send({...networkData, userId: user.id});
      
        expect(response.status).toBe(httpStatus.CREATED);
      });
      
    it("should return 200 when get all networks", async () => {
        const networkData = {
            title: 'Beber agua',
            network: 'Beba, agora',
            password: 'maikecarls'
          };
          const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
          await server.post(baseURL)
          .set('Authorization', `Bearer ${token}`)
          .send({...networkData, userId: user.id});
       
      const response = await server
        .get(baseURL)
        .set('Authorization', `Bearer ${token}`);
    
      expect(response.status).toBe(httpStatus.OK);
    }, 10000);
    
    it("dont have networks, it should return 404", async () => {
        const user = await createUser();
    
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    
          const response = await server
          .get(baseURL)
          .set('Authorization', `Bearer ${token}`);
      
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    })

   

})