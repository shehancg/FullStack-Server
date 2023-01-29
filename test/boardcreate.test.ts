import request from 'supertest';
import { app } from '../src/server';
import { ExpressRequestInterface } from "../src/types/expressRequest.interface";
import  UserModel from '../src/models/user';
import  BoardModel from '../src/models/boards';
import { NextFunction, Request, Response } from "express";
import { createBoard } from '../src/controllers/boards';

jest.mock('../src/models/boards', () => {
    return jest.fn().mockImplementation(() => {
        return {
            save: jest.fn().mockResolvedValue({ _id: '1', title: 'Test Board', userId: '123' })
        }
    });
});

describe('Create Board', () => {
    let req: ExpressRequestInterface;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            body: {
                title: 'Test Board'
            },
            user: {
                id: '123'
            }
        } as ExpressRequestInterface;
        res = {
            send: jest.fn().mockResolvedValue({ _id: '1', title: 'Test Board', userId: '123' })
        } as unknown as Response;
        next = jest.fn();
    });

    it('should create a new board', async () => {
        await createBoard(req, res, next);
        expect(BoardModel).toHaveBeenCalledWith({
            title: 'Test Board',
            userId: '123'
        });
        expect(res.send).toHaveBeenCalledWith({ _id: '1', title: 'Test Board', userId: '123' });
    });

    it('should return 401 if user is not logged in', async () => {
        const req = {} as ExpressRequestInterface;
        req.user = undefined;
        const res = { sendStatus: jest.fn() } as any;
        const next = jest.fn();
        await createBoard(req, res, next);
        expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

});
