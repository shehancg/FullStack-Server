import request from 'supertest';
import {app} from "../src/server";
import UserModel from '../src/models/user'
import BoardModel from '../src/models/boards';
import ColumnModel from '../src/models/column';
import { Types } from 'mongoose';
import { ColumnDocument } from '../src/types/column.interface';
import { UserDocument } from '../src/types/user.interface';
import { BoardDocument } from '../src/types/board.interface';

describe('GET /boards/:boardId/columns', () => {
  let user: UserDocument & { _id: Types.ObjectId; }, board: BoardDocument & { _id: Types.ObjectId; }, columns: (ColumnDocument & { _id: Types.ObjectId; })[];
  
  beforeEach(async () => {
    // Create user and board in database
    user = await UserModel.create({
      email: 'peter@example.com',
      name: 'peter',
      username: 'peter',
      password: '1234',
    });

    board = await BoardModel.create({
      title: 'Test Board',
      userId: user.id,
    });

    // Create columns in database
    columns = await ColumnModel.create([
      { title: 'Column 1', boardId: board.id, userId:user.id },
    ]);
  });

  it('should return columns of a board', async () => {
    const response = await request(app)
      .get(`/api/boards/${board.id}/columns`)
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZDkyZjk0ODVhMDRjNjYyOGI0OTYxYyIsImVtYWlsIjoicGV0ZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE2NzUxNzgzNDB9.FvvJtBYXlpPKgRUBic6rUoCCWVJJhmvGfxaKerB4GjY')
      .expect(200);

    expect(response.body)
  });

  it('should return 401 if user is not authorized', async () => {
    await request(app)
      .get(`/api/boards/${board.id}/columns`)
      .expect(401);
  });
});
