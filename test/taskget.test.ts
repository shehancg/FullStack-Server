import request from 'supertest';
import {app} from "../src/server";
import TaskModel from "../src/models/task";

describe('GET /boards/:boardId/tasks', () => {
  beforeEach(async () => {
    await TaskModel.deleteMany({});
  });

  it('should return 401 if user is not logged in', async () => {
    const response = await request(app).get('/api/boards/1/tasks');
    expect(response.status).toBe(401);
  });

  it('should return array of tasks if user is logged in', async () => {
    const userId = '63d767761174336665714a71';
    const boardId = '63d767a91174336665714a7e';
    const columnId = '63d8d76f7a9e2b8f6cb61b37';
    const __v = 0;
    const tasks = [
      { boardId, title: 'Task 1', userId, columnId, __v},
      { boardId, title: 'Task 2', userId, columnId, __v },
    ];
    
    await TaskModel.insertMany(tasks);

    const authResponse = await request(app)
      .post('/api/users/login')
      .send({ userId });

    const token = authResponse.body.token;

    const response = await request(app)
      .get('/api/boards/63d767a91174336665714a7e/tasks')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZDc2NzQ4MTE3NDMzNjY2NTcxNGE2NiIsImVtYWlsIjoic2hlaGFuQGdtYWlsLmNvbSIsImlhdCI6MTY3NTE1NjQxM30.LAGg-1LcjDE2VVOELt20nkHwLrhnyWHgFtWSn52_FgE');

    expect(response.status).toBe(200);
    expect(response.body)
  });

  it('should return empty array if no tasks found for the board', async () => {
    const userId = '63d767761174336665714a71';
    const boardId = '1';

    const authResponse = await request(app)
      .post('/api/users/login')
      .send({ userId });

    const token = authResponse.body.token;

    const response = await request(app)
      .get('/api/boards/1/tasks')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZDc2NzQ4MTE3NDMzNjY2NTcxNGE2NiIsImVtYWlsIjoic2hlaGFuQGdtYWlsLmNvbSIsImlhdCI6MTY3NTE1NjQxM30.LAGg-1LcjDE2VVOELt20nkHwLrhnyWHgFtWSn52_FgE');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({});
  });
});
