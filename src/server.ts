import express from "express";
//IMPORTS THE CREATESERVER FUNCTION FROM THE HTTP MODULE IN NODE.JS.
import {createServer} from "http";
//IMPORT SERVER FUNCTION FROM SOCKET.IO
import {Server} from "socket.io";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authMiddleware from './middleware/auth'
import cors from 'cors'

import * as usersController from "./controllers/users";
import * as boardsController from "./controllers/boards"

//require("dotenv").config();

// CREATE AN INSTANCE FROM EXPRESS
export const app = express();
//CREATES AN HTTP SERVER USING THE CREATESERVER FUNCTION AND THE APP OBJECT.
const httpServer = createServer(app);
//CREATES A NEW INSTANCE OF THE SOCKET.IO SERVER.
//CREATES A NEW SOCKET.IO SERVER THAT USES THE HTTPSERVER OBJECT TO LISTEN FOR INCOMING WEBSOCKET CONNECTIONS
const io = new Server(httpServer);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.set("toJSON", {
    virtuals: true,
    transform: (_, converted) => {
      delete converted._id;
    },
  });

app.get("/", (req, res) => {
    res.send("BADU WADA");
});

// USER APIS
app.post('/api/users',usersController.register);
app.post('/api/users/login',usersController.login);
app.get('/api/user',authMiddleware,usersController.currentUser);

// BOARD APIS
app.get('/api/boards',authMiddleware, boardsController.getBoards);
app.post('/api/boards',authMiddleware, boardsController.createBoard)

io.on("connection", () => {
    console.log("connect");
})

const PORT = process.env.PORT || 4000;

mongoose.set("strictQuery", false);
mongoose.connect('mongodb+srv://ShehanAdmin:shehanadmin999@fullstackapp.mmqh54c.mongodb.net/FULLSTACKAPP').then(() => {
    console.log('DATABASE WADA');
    httpServer.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}!`);
        /* process.on('warning', (warning) => {
            console.log(warning.stack);
        }); */
    });
});

//httpServer.listen("https://fullstackapp97.herokuapp.com"
