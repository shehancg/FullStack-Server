import { Document } from "mongoose";
export interface User {
    email:string;
    name: string;
    username:string;
    password:string;
    createdAt:Date;
}

//THIS IS JUST FOR MONGOOSE WE CAN USE THE ABOVE INTERFACE ANYWHERE
export interface UserDocument extends User, 
Document{
    validatePasswords(param1: string):Promise<boolean>;
}