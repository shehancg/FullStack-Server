import request from 'supertest';
import { normalizeUser } from '../src/controllers/users';
import {app} from "../src/server";
import UserModel from '../src/models/user'


describe('Register endpoint', () => {
  // afterEach(async () => {
  //   await UserModel.deleteMany({});
  // });

  it('returns 201 if user is created', async () => {
    const userData = {
      email: 'mandy1237@example.com',
      name: 'Mandira',
      username: 'mandy12k',
      password: '1234',
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData);

    expect(response.status).toBe(200);
    expect(response.body);
  });

  it('returns 409 if email is already in use', async () => {
    const existingUser = new UserModel({
      email: 'mandy@example.com',
      name: 'Mandira',
      username: 'mandyrt',
      password: '1234',
    });
    await existingUser.save();

    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'mandy@example.com',
        name: 'Mandira',
        username: 'mandyrt',
        password: '1234',
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'Email already in use' });
  });

  it('returns 409 if username is already in use', async () => {
    const existingUser = new UserModel({
      email: 'mandy44@example.com',
      name: 'Mandira',
      username: 'mandy',
      password: '1234',
    });
    await existingUser.save();

    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'mandy44485@example.com',
        name: 'Mandira',
        username: 'mandy',
        password: '1234',
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'Username already in use' });
  });

  it('returns 422 if request data is invalid', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'user@example.com',
        name: '',
        username: '',
        password: '',
      });

    expect(response.status).toBe(422);
    expect(response.body)
  });
});
