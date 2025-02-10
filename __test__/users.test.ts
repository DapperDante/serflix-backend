import request from "supertest";
import app from "../src/app";
import { userTestData } from "./testData";


describe("User's route", () => {

	describe("Create an user", () => {

		it("First time", async () => {
			const response = await request(app)
				.post("/api/user/register")
				.send(userTestData.validUser);
			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("msg");
		});

		it("Repeated create", async () => {
			const response = await request(app)
				.post("/api/user/register")
				.send(userTestData.validUser);
			expect(response.status).toBe(400);
		});

	});

	describe("Login an user", () => {

		it("access", async () => {
			const response = await request(app).post("/api/user/login").send({
				username: userTestData.validUser.username,
				password: userTestData.validUser.password,
			});
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("msg");
			expect(response.body).toHaveProperty("token");
		});

		it("deny", async () => {
			const response = await request(app)
				.post("/api/user/login")
				.send(userTestData.invalidUser);
			expect(response.status).toBe(404);
		});

	});
});
