import { NextFunction, Request, Response } from "express";
import BoardModel from '../models/boards'
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { Server } from "socket.io";
import { Socket } from "../types/socket.interface";

export const getBoards = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try{
        if(!req.user){
            return res.sendStatus(401);
        }
        const boards = await BoardModel.find({ userId: req.user.id });
        res.send(boards);
    } catch (err) {
        next(err);
    }
};

export const createBoard = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try{
        if(!req.user){
            return res.sendStatus(401);
        }
        const newBoard = new BoardModel({
            title: req.body.title,
            userId: req.user.id,
        });
        const savedBoard = await newBoard.save();
        res.send(savedBoard);
    } catch (err) {
        next(err);
    }
};

export const getBoard = async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try{
        if(!req.user){
            return res.sendStatus(401);
        }
        const board = await BoardModel.findById(req.params.boardId);
        res.send(board);
    } catch (err) {
        next(err);
    }
};

export const joinBoard = (
    io: Server,
    socket: Socket,
    data: { boardId: string }
  ) => {
    console.log("server socket io Join", data.boardId);
    socket.join(data.boardId);
};

export const leaveBoard = (
    io: Server,
    socket: Socket,
    data: { boardId: string }
  ) => {
    console.log("server socket io Leave", data.boardId);
    socket.leave(data.boardId);
};