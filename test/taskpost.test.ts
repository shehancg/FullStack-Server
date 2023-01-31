import request from 'supertest';
import {app} from "../src/server";
import TaskModel from "../src/models/task";
import mongoose from 'mongoose';
import { createTask } from '../src/controllers/tasks';
import { SocketEventsEnum } from '../src/types/socketEvents.enum';

describe('Create Task', () => {

  afterAll(() => {
        mongoose.connection.close();
  })

  it('Should create a new task', async () => {
    const userId = '63d767761174336665714a71';
    const boardId = '63d767a91174336665714a7e';
    const columnId = '63d8d76f7a9e2b8f6cb61b37';
    const __v = 0;
    // const taskData = [
    //   { boardId, title: 'Task 1', userId, columnId, __v},
    // ];
    const taskData = {
        userId: '63d767481174336665714a66',  
        boardId: '63d8d75a7a9e2b8f6cb61b2f',
        title: 'Dev',
        columnId: '63d8d76f7a9e2b8f6cb61b37',
        __v:0
    };

    const response = await request(app)
      .post('/api/boards/63d8d75a7a9e2b8f6cb61b2f/tasks')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZDc2NzQ4MTE3NDMzNjY2NTcxNGE2NiIsImVtYWlsIjoic2hlaGFuQGdtYWlsLmNvbSIsImlhdCI6MTY3NTE2NzQxNH0.NV71nBUZ_lygdwcRdT8cu9fvjZzLH5KkbFC-vgeGplw')
      .send(taskData);

    expect(response.statusCode).toBe(404);
    expect(response.body.title).toBe(taskData.title);

    const task = await TaskModel.findById(response.body._id);
    expect(task).toBeDefined();
    expect(task?.title).toBe(taskData.title);
    expect(task?.boardId).toBe(taskData.boardId);
    expect(task?.columnId).toBe(taskData.columnId);
  });

  it("returns error when user is not authorized", async () => {
    const socket = {
      user: null,
      emit: jest.fn(),
    };
    const data = {
        userId: '1',  
        boardId: '63d8d75a7a9e2b8f6cb61b2f',
        title: 'Dev',
        columnId: '63d8d76f7a9e2b8f6cb61b37'
    };

    await createTask({} as any, socket as any, data);

    expect(socket.emit).toHaveBeenCalledWith(
      SocketEventsEnum.tasksCreateFailure,
      "User is not authorized"
    );
  });
});
