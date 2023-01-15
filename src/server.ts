import express from "express";
//IMPORTS THE CREATESERVER FUNCTION FROM THE HTTP MODULE IN NODE.JS.
import {createServer} from "http";
//IMPORT SERVER FUNCTION FROM SOCKET.IO
import {Server} from "socket.io";
import mongoose from "mongoose";
import * as usersController from "./controllers/users";
import bodyParser from "body-parser";
import authMiddleware from './middleware/auth'
import cors from 'cors'

// CREATE AN INSTANCE FROM EXPRESS
const app = express();
//CREATES AN HTTP SERVER USING THE CREATESERVER FUNCTION AND THE APP OBJECT.
const httpServer = createServer(app);
//CREATES A NEW INSTANCE OF THE SOCKET.IO SERVER.
//CREATES A NEW SOCKET.IO SERVER THAT USES THE HTTPSERVER OBJECT TO LISTEN FOR INCOMING WEBSOCKET CONNECTIONS
const io = new Server(httpServer);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.send("BADU WADA");
});

app.post('/api/users',usersController.register)

app.post('/api/users/login',usersController.login)

app.get('/api/user',authMiddleware,usersController.currentUser)

io.on("connection", () => {
    console.log("connect");
})

mongoose.set("strictQuery", false);
mongoose.connect('mongodb+srv://ShehanAdmin:shehanadmin999@fullstackapp.mmqh54c.mongodb.net/FULLSTACKAPP').then(() => {
    console.log('connected to DBbb');
    httpServer.listen(4001, () => {
        console.log('API LISTINING TO 4001');
        /* process.on('warning', (warning) => {
            console.log(warning.stack);
        }); */
    });
});

//httpServer.listen("https://fullstackapp97.herokuapp.com"
