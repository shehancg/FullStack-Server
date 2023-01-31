import request from 'supertest';
import {app} from "../src/server";
import UserModel from '../src/models/user'
import jwt from 'jsonwebtoken';
import { secret } from '../src/config';
import { Types } from 'mongoose';
import { UserDocument } from '../src/types/user.interface';

describe('Authentication middleware', () => {
  let user: UserDocument & { _id: Types.ObjectId; };
  let token: string;

  beforeEach(async () => {
    // user = await UserModel.findOne({email: req.body.email}).select('+password'); 
    user = new UserModel({ email: 'peter@example.com', password: '1234', name: 'peter1', username: 'peter1' });
    await user.save();
    token = jwt.sign({ id: user._id, email: user.email }, secret);
  });

//   afterEach(async () => {
//     await UserModel.deleteMany({});
//   });

  it('should return 401 if no authorization header is present', async () => {
    const res = await request(app).get('/api/user');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 if the token is invalid', async () => {
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer invalid_token`);
    expect(res.statusCode).toEqual(401);
  });

  it('should return 401 if the user is not found', async () => {
    const invalidToken = jwt.sign({ id: '5f4dcc3b5aa765d61d8327deb882cf99', email: user.email }, secret);
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${invalidToken}`);
    expect(res.statusCode).toEqual(401);
  });

  it('should set the user property on the request object if the token is valid', async () => {
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body)
  });
});
