import request from 'supertest';
import { app } from '../src/server';
import { ExpressRequestInterface } from "../src/types/expressRequest.interface";
import  UserModel from '../src/models/user';
import  BoardModel from '../src/models/boards';

describe('GET /boards', () => {
    let userId: string;

    beforeEach(async () => {
        const user = await UserModel.create({
            email: 'shehan@gmail.com',
            name: "rambo",
            username: "shehan",      
            password: '1234'
        });
        userId = user.id;

        await BoardModel.create({
            title: 'Test Board 1',
            userId
        });

        await BoardModel.create({
            title: 'Test Board 2',
            userId
        });
    });

    it('should return 401 if user is not logged in', async () => {
        const res = await request(app).get('/api/boards');
        expect(res.status).toBe(401);
    });

    it('should return the boards of the logged in user', async () => {
        const loginRes = await request(app)
            .post('/api/users/login')
            .send({
                email: 'shehan@gmail.com',
                password: '1234'
            });
        const token = loginRes.body.token;
        const res = await request(app)
            .get('/api/boards')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(401);
    });
});
