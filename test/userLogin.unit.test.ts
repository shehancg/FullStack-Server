import { currentUser, login, register } from '../src/controllers/users';
import request from 'supertest';
import UserModel from '../src/models/user'
import { UserDocument } from '../src/types/user.interface';
import jwt from 'jsonwebtoken';
import { secret } from '../src/config';
   
describe('currentUser', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { user: { email: 'shehan@gmail.com', password: '1234' } };
    res = { send: jest.fn(), sendStatus: jest.fn() };
  });

  it('should return 401 if user is not found', async () => {
    req.user = undefined;
    currentUser(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  it('should return user data if user is found', async () => {
    currentUser(req, res);
    expect(res.send).toHaveBeenCalled();
  });
});



