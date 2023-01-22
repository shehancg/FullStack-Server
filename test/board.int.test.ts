import request from 'supertest';
import { app } from '../src/server';
import { ExpressRequestInterface } from "../src/types/expressRequest.interface";
import  UserModel from '../src/models/user';
import  BoardModel from '../src/models/boards';

describe("GET /boards", () => {
    let userId: string;
    beforeAll(async () => {
        const user = new UserModel({
            email: "dave@gmail.com",
            name: "Test dave",
            username: "dave",
            password: "1234"
        });
        await user.save();
        userId = user._id;
    });

    // afterAll(async () => {
    //     await UserModel.deleteMany({});
    //     await BoardModel.deleteMany({});
    // });

    it("should return 401 if user is not logged in", async () => {
        const response = await request(app).get("/api/boards");
        expect(response.status).toBe(401);
    });

    it("should return the user's boards if user is logged in", async () => {
        const board = new BoardModel({
            title: "Test Board",
            userId
        });
        await board.save();

        const authResponse = await request(app)
            .post("/api/users/login")
            .send({ email: "shehan@gmail.com", password: "1234" })
            .set("Accept", "application/json");
        const { token } = authResponse.body;

        const response = await request(app)
            .get("/api/boards")
            .set("Authorization", token);
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
            _id: expect.any(String),
            title: "Test Board",
            userId: expect.any(String)
        }]);
    });
});
