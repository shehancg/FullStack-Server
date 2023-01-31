import {describe, it} from "@jest/globals";
import request from "supertest"
import {app} from "../src/server";

describe("POST /userlogin", () => {
  it("USER LOGIN", async () => {
    await request(app)
      .post("/api/users/login")
      .send({email: "shehan@gmail.com", password: "1234"})
      .set("Accept", "application/json")
      .expect(200);
  });
});

describe("POST /userreg", () => {
  it("USER REGISTRATION", function (done) {
    request(app)
      .post("/api/users")
      .send({email:"jack3@gmail.com", name:"jack", username:"jack3", password: "1234"})
      .set("Accept", "application/json")
      .expect(200)
      .end(function (err, res) {
        if (err) {return done(err);}
        return done();
      });
  });
});