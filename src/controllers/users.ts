import { NextFunction, Request,Response } from "express";
import UserModel from '../models/user'
import { UserDocument } from "../types/user.interface";
import { Error } from "mongoose";
import jwt from 'jsonwebtoken';
import { secret } from '../config';
import { ExpressRequestInterface } from "../types/expressRequest.interface";

const normalizeUser = (user:UserDocument) => {
    const token = jwt.sign({id: user.id, email: user.email }, secret )
    return{
        email: user.email,
        name: user.name,
        username: user.username,
        id: user._id,
        token: `Bearer ${token}`,
    };
};

// REGISTER METHODS
export const register = async(
    req:Request,
    res:Response, 
    next:NextFunction) => {
        try {
            //check if a user with the same email already exists
            const existingEmail = await UserModel.findOne({email: req.body.email});
            if(existingEmail){
                return res.status(409).json({message: "Email already in use"});
            }

            //check if a user with the same username already exists
            const existingUsername = await UserModel.findOne({username: req.body.username});
            if(existingUsername){
                return res.status(409).json({message: "Username already in use"});
            }

            // Procced to assign values 
            const newUser = new UserModel({
                email: req.body.email,
                name: req.body.name,
                username: req.body.username,
                password: req.body.password,
            });
            const savedUser = await newUser.save();
            res.send(normalizeUser(savedUser));
        } catch(err){
            if(err instanceof Error.ValidationError){
                const messages = Object.values(err.errors).map((err) => err.message);
                return res.status(422).json(messages.join(', '));               
            }
            next(err);
        }
    };

//LOGIN METHOD
export const login = async(
    req: Request,
    res: Response,
    next: NextFunction) => {
        try {
           const user = await UserModel.findOne({email: req.body.email}).select('+password'); 
           const errors = {emailOrPassword: "Incorrect Email"}; 
           const passworderrors = {password: "Incorrect Password"} 

           if(!user){
                return res.status(422).json(errors);
           }
           // CHECK PASSWORD
           const isSamePassword = await user.validatePasswords(req.body.password);

           if(!isSamePassword){
           return res.status(422).json(passworderrors);
           }

           res.send(normalizeUser(user));
        } catch(err){
            next(err)
        }
    };

export const currentUser = (req: ExpressRequestInterface, res:Response) => {
    if(!req.user){
        return res.sendStatus(401);
    }
    res.send(normalizeUser(req.user));
}