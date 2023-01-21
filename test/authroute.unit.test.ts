import { currentUser, login, register } from '../src/controllers/users';
import request from 'supertest';
import UserModel from '../src/models/user'
import { UserDocument } from '../src/types/user.interface';
import jwt from 'jsonwebtoken';
import { secret } from '../src/config';

// describe('POST /login', () => {
//     let req: any;
//     let res: any;
//     let next: any;

//     beforeEach(() => {
//         req = {
//             body: {
//                 email: 'test@example.com',
//                 password: 'password',
//             },
//         };
//         res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn().mockReturnThis(),
//             send: jest.fn().mockReturnThis(),
//         };
//         next = jest.fn();
//     });

//     it('should return 200 if the email and password match', async () => {
//         const userMock = {
//             email: 'test@example.com',
//             validatePasswords: jest.fn().mockReturnValue(true),
//         };
        
//         jest.spyOn(UserModel, 'findOne').mockReturnValue(userMock);
//         await login(req, res, next);
//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(res.send).toHaveBeenCalled();
//     });
// });    

describe('currentUser', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { user: { email: 'shehan@gmail.com', password: '12345' } };
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



